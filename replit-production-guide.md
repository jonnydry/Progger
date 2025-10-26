# Replit Production Guide

## Critical Fix: Vite Proxy + Replit Auth Configuration

### Problem Overview

When using **Replit Auth** with a **Vite + Express** stack, the default Vite proxy configuration breaks authentication when users open the app in a new tab. This manifests as:

- ✅ Authentication works in Replit webview
- ❌ Authentication fails when opening in a new browser tab
- ❌ Error: "Unknown authentication strategy" or "Authentication Error: hostname not in registered domains"

### Root Cause

**The Issue:**
Vite's default proxy configuration uses `changeOrigin: true`, which replaces the incoming `Host` header with the target's hostname (`localhost:3001`). This breaks OAuth callback URL validation.

**What Happens:**
1. User clicks "Sign in" from `https://your-repl.worf.replit.dev`
2. Browser sends request with `Host: your-repl.worf.replit.dev`
3. **Vite proxy changes hostname to `localhost`** when forwarding to Express
4. Express sees `req.hostname = "localhost"`
5. Passport.js tries to authenticate with strategy `replitauth:localhost`
6. ❌ **No such strategy exists** (only `replitauth:your-repl.worf.replit.dev` is registered)
7. Authentication fails

### The Solution

#### 1. Fix Vite Proxy Configuration

**File: `vite.config.ts`**

❌ **BEFORE (Broken):**
```typescript
export default defineConfig({
  server: {
    port: 5000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,  // ← This breaks authentication!
      },
    },
  },
});
```

✅ **AFTER (Fixed):**
```typescript
export default defineConfig({
  server: {
    port: 5000,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: false,  // ← Preserve original hostname
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Pass through the original Host header
            if (req.headers.host) {
              proxyReq.setHeader('host', req.headers.host);
            }
          });
        },
      },
    },
  },
});
```

**Key Changes:**
- `changeOrigin: false` - Prevents hostname replacement
- `configure` callback - Explicitly preserves the `Host` header
- `allowedHosts: true` - Allows all Replit domains

#### 2. Normalize Hostnames in Auth Setup

**File: `server/replitAuth.ts`**

Add hostname normalization to handle case-insensitive matching:

```typescript
const registeredDomains = new Set<string>();

export async function setupAuth(app: Express) {
  // ... existing setup ...
  
  // Normalize domains during registration
  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const normalizedDomain = domain.trim().toLowerCase();
    if (!normalizedDomain) {
      console.warn('Warning: Empty domain found in REPLIT_DOMAINS');
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
  
  console.log('Registered auth domains:', Array.from(registeredDomains));
  
  // Normalize hostnames in login route
  app.get("/api/login", (req, res, next) => {
    const normalizedHostname = req.hostname.toLowerCase();
    
    if (!registeredDomains.has(normalizedHostname)) {
      console.error(`Authentication error: hostname "${req.hostname}" not in registered domains:`, Array.from(registeredDomains));
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
  
  // Same normalization for callback route
  app.get("/api/callback", (req, res, next) => {
    const normalizedHostname = req.hostname.toLowerCase();
    
    if (!registeredDomains.has(normalizedHostname)) {
      console.error(`Callback error: hostname "${req.hostname}" not in registered domains`);
      return res.redirect('/api/login');
    }
    
    passport.authenticate(`replitauth:${normalizedHostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });
}
```

### Testing the Fix

#### 1. Test via Webview
1. Use the Replit webview (built-in preview)
2. Click "Sign in"
3. Authenticate
4. ✅ Should redirect back and show authenticated state

#### 2. Test via New Tab
1. Click "Open in new tab" button in Replit
2. In the new browser tab, click "Sign in"
3. Authenticate
4. ✅ Should redirect back and show authenticated state

#### 3. Verify Hostname Preservation

Create a temporary debug endpoint to verify the hostname is being passed through correctly:

```typescript
// Add to server/routes.ts temporarily
app.get('/api/debug/hostname', (req, res) => {
  res.json({
    hostname: req.hostname,
    host: req.headers.host,
    'x-forwarded-host': req.headers['x-forwarded-host'],
    protocol: req.protocol,
  });
});
```

Test with:
```bash
curl https://your-repl.worf.replit.dev/api/debug/hostname
```

Expected output:
```json
{
  "hostname": "your-repl.worf.replit.dev",
  "host": "your-repl.worf.replit.dev",
  "protocol": "https"
}
```

❌ If you see `"hostname": "localhost"`, the proxy is still changing the hostname.

#### 4. Check Server Logs

Look for this line in server startup logs:
```
Registered auth domains: [ 'your-repl.worf.replit.dev' ]
```

If authentication fails, check for:
```
Authentication error: hostname "localhost" not in registered domains
```

This indicates the proxy fix didn't apply correctly.

### Best Practices

#### 1. Always Use Full-Stack Mode
When using Replit Auth, run both frontend and backend:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "tsx watch server/index.ts",
    "client": "vite"
  }
}
```

#### 2. Environment Variables
Replit provides these automatically:
- `REPLIT_DOMAINS` - Comma-separated list of allowed domains
- `REPL_ID` - Your Repl's unique identifier
- `SESSION_SECRET` - For session encryption
- `DATABASE_URL` - PostgreSQL connection string

**Never hardcode these values.**

#### 3. Error Handling
Always provide helpful error messages when hostname validation fails:
```typescript
if (!registeredDomains.has(normalizedHostname)) {
  return res.status(400).send(`
    <h1>Authentication Error</h1>
    <p>Current hostname: <strong>${req.hostname}</strong></p>
    <p>Expected: <strong>${Array.from(registeredDomains).join(', ')}</strong></p>
  `);
}
```

#### 4. Session Storage
Use PostgreSQL for session storage (not memory store):
```typescript
const pgStore = connectPg(session);
const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: false,
  ttl: 7 * 24 * 60 * 60 * 1000, // 1 week
  tableName: "sessions",
});
```

### Common Pitfalls

#### ❌ DON'T: Use `changeOrigin: true` with Replit Auth
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,  // Breaks OAuth callbacks
  },
}
```

#### ❌ DON'T: Hardcode domains
```typescript
const strategy = new Strategy({
  name: 'replitauth:hardcoded-domain.replit.dev',  // Wrong!
  // ...
});
```

#### ❌ DON'T: Skip hostname normalization
```typescript
// Case-sensitive matching will fail
if (req.hostname === domain) {  // Wrong!
  // This fails if hostname has different case
}
```

#### ✅ DO: Normalize and validate hostnames
```typescript
const normalizedHostname = req.hostname.toLowerCase();
if (registeredDomains.has(normalizedHostname)) {
  // Correct!
}
```

### Framework Compatibility

This fix applies to any **Vite + Express + Replit Auth** setup, including:

- ✅ Vite + Express + TypeScript
- ✅ Vite + Express + React
- ✅ Vite + Express + Vue
- ✅ Vite + Express + Svelte

For other frameworks:
- **Next.js**: Uses its own proxy, configure `rewrites` instead
- **Remix**: Built-in proxy handles this correctly
- **SvelteKit**: Similar to Vite, may need adapter configuration

### Debugging Checklist

When authentication fails:

1. ✅ Check Vite config has `changeOrigin: false`
2. ✅ Check proxy `configure` function passes through Host header
3. ✅ Verify `REPLIT_DOMAINS` environment variable is set
4. ✅ Check server logs show correct registered domains
5. ✅ Test the debug hostname endpoint
6. ✅ Verify hostname normalization (toLowerCase) is applied
7. ✅ Check browser is accessing via Replit domain (not localhost)

### Additional Resources

- [Replit Auth Documentation](https://docs.replit.com/cloud-services/authentication)
- [Vite Proxy Configuration](https://vite.dev/config/server-options.html#server-proxy)
- [Passport.js Strategy Documentation](http://www.passportjs.org/docs/configure/)

### Quick Reference

**Files to Update:**
1. `vite.config.ts` - Proxy configuration
2. `server/replitAuth.ts` - Hostname normalization
3. `.gitignore` - Ensure Replit config files are tracked

**Key Environment Variables:**
- `REPLIT_DOMAINS` - Auto-provided by Replit
- `REPL_ID` - Auto-provided by Replit
- `SESSION_SECRET` - Auto-provided by Replit
- `DATABASE_URL` - Auto-provided by Replit

**Test Commands:**
```bash
# Test hostname preservation
curl https://your-repl.worf.replit.dev/api/debug/hostname

# Test login redirect
curl -I https://your-repl.worf.replit.dev/api/login

# Check environment variables
env | grep REPL
```

---

**Last Updated:** October 26, 2025  
**Verified Working:** Vite 6.4.1, Express 4.x, Passport 0.7.x
