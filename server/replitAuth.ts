import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { logger } from "./utils/logger";

// Type definition for authenticated user in Express session
export interface AuthenticatedUser {
  claims: {
    sub: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    profile_image_url?: string;
    exp?: number;
    [key: string]: unknown;
  };
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

// Timeout helper for network calls
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

const getOidcConfig = memoize(
  async () => {
    logger.info('Fetching OIDC configuration from Replit');
    try {
      const config = await withTimeout(
        client.discovery(
          new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
          process.env.REPL_ID!
        ),
        10000, // 10 second timeout
        'OIDC discovery timed out after 10 seconds'
      );
      logger.info('OIDC configuration fetched successfully');
      return config;
    } catch (error) {
      logger.error('Failed to fetch OIDC configuration', { error });
      throw error;
    }
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set. Please set a secure random string for session encryption.');
  }
  
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: AuthenticatedUser,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

const registeredDomains = new Set<string>();

let authEnabled = false;

export async function setupAuth(app: Express) {
  const domainsEnv = process.env.REPLIT_DOMAINS;
  const replitId = process.env.REPL_ID;

  if (!domainsEnv || !replitId || !process.env.SESSION_SECRET || !process.env.DATABASE_URL) {
    authEnabled = false;
    logger.warn('Auth prerequisites missing; authentication disabled for this runtime', {
      hasReplitDomains: !!domainsEnv,
      hasReplitId: !!replitId,
      hasSessionSecret: !!process.env.SESSION_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    });
    return;
  }

  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  let config;
  try {
    config = await getOidcConfig();
    authEnabled = true;
  } catch (error) {
    logger.error('Auth setup failed - authentication will be disabled', { error });
    authEnabled = false;
    // Continue server startup without auth - allows basic functionality
    return;
  }

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const claims = tokens.claims();
    const user: AuthenticatedUser = {
      claims: {
        sub: claims.sub as string,
        email: claims.email as string | undefined,
        first_name: claims.first_name as string | undefined,
        last_name: claims.last_name as string | undefined,
        profile_image_url: claims.profile_image_url as string | undefined,
        exp: claims.exp as number | undefined,
      },
    };
    updateUserSession(user, tokens);
    await upsertUser(claims);
    verified(null, user);
  };

  for (const domain of domainsEnv.split(",")) {
    const normalizedDomain = domain.trim().toLowerCase();
    if (!normalizedDomain) {
      logger.warn('Empty domain found in REPLIT_DOMAINS');
      continue;
    }
    registeredDomains.add(normalizedDomain);
    const strategy = new Strategy(
      {
        name: `replitauth:${normalizedDomain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${normalizedDomain}/api/callback`,
      },
      verify
    );
    passport.use(strategy);
  }

  logger.info('Registered auth domains', { domains: Array.from(registeredDomains) });

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    const normalizedHostname = req.hostname.toLowerCase();
    if (!registeredDomains.has(normalizedHostname)) {
      logger.warn('Authentication error: hostname not in registered domains', {
        hostname: req.hostname,
        registeredDomains: Array.from(registeredDomains),
      });
      return res.status(400).send(`
        <h1>Authentication Error</h1>
        <p>You must access this application via the Replit preview URL, not localhost or other domains.</p>
        <p>Current hostname: <strong>${req.hostname}</strong></p>
        <p>Expected domains: <strong>${Array.from(registeredDomains).join(', ')}</strong></p>
        <p>Please close this tab and use the Replit webview to access the application.</p>
      `);
    }
    
    passport.authenticate(`replitauth:${normalizedHostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    const normalizedHostname = req.hostname.toLowerCase();
    if (!registeredDomains.has(normalizedHostname)) {
      logger.warn('Callback error: hostname not in registered domains', {
        hostname: req.hostname,
        registeredDomains: Array.from(registeredDomains),
      });
      return res.redirect('/api/login');
    }
    
    passport.authenticate(`replitauth:${normalizedHostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: replitId,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!authEnabled) {
    return res.status(503).json({ 
      message: "Authentication is temporarily unavailable. Please try again later." 
    });
  }
  
  const user = req.user as AuthenticatedUser | undefined;

  if (!req.isAuthenticated() || !user || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now < user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
