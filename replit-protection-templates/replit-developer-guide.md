# 🛡️ Replit Developer Guide for PROGGER

## Purpose

This guide helps you safely develop and deploy **PROGGER** (AI-Powered Chord Progression Generator for Guitarists) on Replit by protecting critical infrastructure files and configurations.

**About PROGGER:** An AI-powered chord progression and scale generator for guitarists, featuring 200+ chord voicings, 3-note-per-string scale patterns, and AI-generated progressions using xAI's Grok API.

**Why This Matters:** Replit uses specific configuration files and workflows to manage your application. Modifying these files in external editors (Cursor, VSCode, etc.) can cause deployment failures, broken builds, and runtime errors that are difficult to debug.

---

## Table of Contents

1. [Critical Files: Never Modify](#critical-files-never-modify)
2. [High-Risk Files: Modify with Care](#high-risk-files-modify-with-care)
3. [Safe to Modify](#safe-to-modify)
4. [Database Best Practices](#database-best-practices)
5. [Authentication Troubleshooting](#authentication-troubleshooting)
6. [Port Configuration](#port-configuration)
7. [Environment Variables](#environment-variables)
8. [Package Management](#package-management)
9. [Deployment](#deployment)
10. [Recovery Procedures](#recovery-procedures)
11. [Project-Specific Details](#project-specific-details)

---

## Critical Files: Never Modify

These files are **sacred** to Replit's operation. Any modifications will break your deployment:

### `.replit`
- **What it does:** Controls run commands, build commands, deployment settings
- **Why it's critical:** Replit uses this to start your application and configure workflows
- **Never change:** Run commands, deployment targets, environment variables managed by Replit
- **Located at:** Project root

### `replit.nix` (or `.config/nix/replit.nix`)
- **What it does:** Manages system-level dependencies (language runtime, system packages, etc.)
- **Why it's critical:** Provides reproducible environment for your app
- **Never change:** Package versions, Nix configuration syntax
- **Located at:** Project root or `.config/nix/`

### Workflow Configurations
- **What they do:** Define automated task sequences ("Server" workflow)
- **Why they're critical:** Control how Replit runs your development server
- **Never change:** Workflow commands, execution order
- **Managed through:** Replit's Workflow pane (not file-based)

---

## High-Risk Files: Modify with Care

### Package Management

#### `package.json`
- **Safe to modify:** Adding new dependencies via commands
- **NEVER manually edit:** Dependency versions, scripts that Replit manages
- **Correct approach:** Use `npm install <package>` commands only
- **Why:** Replit's dependency tool syncs with package.json automatically

#### `package-lock.json`
- **NEVER manually edit this file**
- **Why:** Auto-generated lockfile that ensures consistent installs
- **Correct approach:** Let package manager regenerate via install commands
- **If corrupted:** Delete and run `npm install` in Replit

### Build Configuration

#### `vite.config.ts` (Frontend)
- **Critical:** Path aliases (@, @shared, @assets), build output, server configuration, API proxy
- **Safe changes:** Adding new aliases (carefully)
- **Dangerous changes:** Changing ports, server host, proxy config, removing `server.allowedHosts: true`
- **Required settings:** 
  - `server.allowedHosts: true` (for Replit proxy compatibility)
  - `proxy.'/api'.changeOrigin: false` (for Replit Auth in new tabs)

#### `tsconfig.json` (TypeScript)
- **Critical sections:**
  - Path mappings: `@` → `./client`, `@shared` → `./shared`
  - Module resolution strategy
  - Base URL configuration
- **Why it's critical:** Enables imports to work in Replit environment
- **Safe changes:** Adding new paths (if also added to build config)
- **Dangerous changes:** Changing module resolution, base URL, target

#### `drizzle.config.ts` (Database)
- **Critical sections:**
  - Database URL (uses Replit's DATABASE_URL env var)
  - Schema file location (`./shared/schema.ts`)
  - Migration configuration (`./migrations`)
- **Why it's critical:** Must match Replit's database connection
- **NEVER change:** Connection string format, environment variables
- **Safe changes:** None recommended without testing in Replit first

### Backend Configuration

#### `server/index.ts` (Express Server)
- **Critical:** Port binding (backend on port 3001), middleware setup, Replit Auth configuration
- **Safe changes:** Adding new routes, services
- **Dangerous changes:** Changing port from 3001, modifying host binding

---

## Safe to Modify

### Application Code (Full Freedom)

**PROGGER Source Directories:**
- `client/` - React frontend components, hooks, services, utilities
  - `client/components/` - UI components (ChordDetailView, ScaleDiagram, VoicingDiagram, etc.)
  - `client/hooks/` - React hooks (useAuth.ts, useStash.ts)
  - `client/services/` - API integration (xaiService.ts)
  - `client/utils/` - Data libraries (chordLibrary.ts, scaleLibrary.ts, colorUtils.ts)
- `server/` - Express backend routes and services
  - `server/routes.ts` - API endpoints
  - `server/xaiService.ts` - xAI Grok API integration
  - `server/replitAuth.ts` - Replit Auth configuration
  - `server/storage.ts` - Database operations
- `shared/` - Shared types and database schema
  - `shared/schema.ts` - Drizzle ORM schema
- All application logic files
- All route handlers
- All component files

### Documentation & Styling
- `README.md` - Project readme
- `replit.md` - Project documentation and preferences
- Any `.md` files (except those in `.replit` configs)
- `.css` files - Global stylesheets (project uses Tailwind via inline styles)

---

## Database Best Practices

### Primary Key Rules (CRITICAL)

**⚠️ NEVER CHANGE PRIMARY KEY ID COLUMN TYPES ⚠️**

This is the #1 cause of catastrophic database failures.

#### What NOT to Do

❌ **DON'T DO THIS (SQL):**
```sql
-- Changing from integer to UUID (or vice versa)
ALTER TABLE users ALTER COLUMN id TYPE VARCHAR; -- BREAKS EVERYTHING
```

❌ **DON'T DO THIS (Drizzle):**
```typescript
// Before: id: serial("id").primaryKey()
// After:
id: varchar("id").primaryKey()  // WRONG - breaks all existing data
```

#### What to Do Instead

✅ **DO THIS:**
- Check existing schema BEFORE making changes
- Keep ID types exactly as they are
- If you need UUIDs in new tables, that's fine
- Never migrate existing tables from serial → varchar or vice versa

### Database Schema Changes (Safe Workflow)

**For Drizzle (PROGGER):**

1. Modify schema file (`shared/schema.ts`)
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // NEVER change existing ID type
  name: text("name"),
  email: text("email").unique(),
  // Add new columns here safely
});
```

2. Run migration command
```bash
npm run db:push --force
```

**CRITICAL DATABASE RULES:**
- **NEVER change primary key ID types** (integer ↔ UUID breaks everything)
- Always use framework's migration tools
- Check existing schema before making changes
- No manual SQL migrations

---

## Authentication Troubleshooting

### Common Issue: Auth Works in Webview but Fails in New Tab

**Symptoms:**
- ✅ Authentication works in Replit webview
- ❌ Authentication fails when opening in a new browser tab
- ❌ Error: "Unknown authentication strategy" or "Authentication Error: hostname not in registered domains"

### Root Cause

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

#### Fix 1: Vite Proxy Configuration

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

#### Fix 2: Hostname Normalization in Auth Setup

**File: `server/replitAuth.ts`**

Add hostname normalization to handle case-insensitive matching:

```typescript
const registeredDomains = new Set<string>();

export async function setupAuth(app: Express) {
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
}
```

### Testing the Fix

1. **Test via Webview**
   - Use the Replit webview (built-in preview)
   - Click "Sign in"
   - Authenticate
   - ✅ Should redirect back and show authenticated state

2. **Test via New Tab**
   - Click "Open in new tab" button in Replit
   - In the new browser tab, click "Sign in"
   - Authenticate
   - ✅ Should redirect back and show authenticated state

3. **Verify Hostname Preservation**
   - Create a temporary debug endpoint:
   ```typescript
   app.get('/api/debug/hostname', (req, res) => {
     res.json({
       hostname: req.hostname,
       host: req.headers.host,
       protocol: req.protocol,
     });
   });
   ```
   - Test with: `curl https://your-repl.worf.replit.dev/api/debug/hostname`
   - Expected: `"hostname": "your-repl.worf.replit.dev"`
   - ❌ If you see `"hostname": "localhost"`, the proxy is still changing the hostname

---

## Port Configuration

Replit requires binding to `0.0.0.0` with specific ports.

### PROGGER Port Setup

**Frontend: Vite dev server on port 5000**
```javascript
// vite.config.ts:
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true, // CRITICAL for Replit
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

**Backend: Express API server on port 3001**
```javascript
const port = 3001;
app.listen(port, '0.0.0.0');
```

❌ **DON'T DO THIS:**
```javascript
// Hardcoding localhost or wrong port
app.listen(3000, 'localhost')  // WRONG
```

---

## Environment Variables

### PROGGER Required Secrets

- `XAI_API_KEY` - xAI Grok API key for chord generation (REQUIRED)
- `SESSION_SECRET` - Auto-provided by Replit
- `DATABASE_URL` - Auto-provided by Replit
- `REPL_ID`, `REPLIT_DOMAINS` - Auto-provided by Replit

### How to Add Secrets

1. Go to Tools → Secrets in Replit
2. Add: `XAI_API_KEY = your-xai-api-key-here`
3. Access via: `process.env.XAI_API_KEY`

❌ **DON'T DO THIS:**
```javascript
const XAI_API_KEY = "sk-1234567890abcdef"; // WRONG - hardcoded
```

✅ **DO THIS:**
```javascript
const apiKey = process.env.XAI_API_KEY;
if (!apiKey) {
  throw new Error('XAI_API_KEY not found in environment variables');
}
```

---

## Package Management

### Node.js (PROGGER uses npm)

✅ **DO THIS:**
```bash
npm install <package>
```

❌ **DON'T DO THIS:**
```json
// Manually editing package.json
"dependencies": {
  "express": "^5.0.0"  // WRONG
}
```

### If Dependencies Break

**Node.js:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Deployment

**NEVER create custom deployment configs**

❌ **DON'T DO THIS:**
- Create GitHub Actions workflows
- Write custom build scripts in `.replit`
- Configure Docker containers
- Set up CI/CD pipelines

✅ **DO THIS:**
Use Replit's built-in Publish feature to deploy your application. Click the Publish/Deploy button in Replit when ready.

---

## Recovery Procedures

### If Something Breaks in Replit

#### Step 1: Check Protected Files
```bash
git status
```
Look for changes to:
- `.replit`
- `replit.nix`
- `package.json` / `package-lock.json`
- `vite.config.ts`
- `drizzle.config.ts`
- `tsconfig.json`

#### Step 2: Restore Critical Files
```bash
# Restore individual files
git checkout HEAD -- .replit
git checkout HEAD -- replit.nix
git checkout HEAD -- vite.config.ts

# Or restore all config files at once
git checkout HEAD -- .replit replit.nix package.json package-lock.json vite.config.ts drizzle.config.ts tsconfig.json
```

#### Step 3: Verify Package Installation

**Node.js (PROGGER):**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Step 4: Test Workflow
- Click "Run" button in Replit
- Verify workflow executes correctly
- Check for console errors
- Confirm app loads at your Replit URL

#### Step 5: Database Sync (if schema changed)

**Drizzle (PROGGER):**
```bash
npm run db:push --force
```

---

## Project-Specific Details

### PROGGER Tech Stack
- **Language:** Node.js / TypeScript
- **Frontend:** React 19.2 with Vite 6.2
- **Backend:** Express.js with TypeScript
- **Database:** PostgreSQL (Replit-hosted)
- **ORM/Database Tool:** Drizzle
- **Package Manager:** npm
- **AI Service:** xAI Grok API (grok-4-fast-reasoning model)
- **Authentication:** Replit Auth (Google, X/Twitter, GitHub, Apple, email/password)
- **State Management:** TanStack React Query
- **Other Tools:** OpenAI SDK (for xAI), Passport, connect-pg-simple

### Critical Path Aliases (PROGGER)
```
# In tsconfig.json:
'@': './client'
'@shared': './shared'

# In vite.config.ts (additional):
'@assets': './attached_assets'
```

### Database Migration Pattern (PROGGER)
```bash
# Drizzle
npm run db:push --force
```

### Workflow Commands

**PROGGER Development:**
```bash
npm run dev
```
This starts both the Vite dev server (port 5000) and Express backend (port 3001) concurrently.

### Architecture Highlights
- **Hybrid AI + Client-Side Approach:** AI generates creative chord progressions and scale suggestions (names only), while comprehensive client-side libraries provide all voicings and fingerings
- **Transposition Engine:** Automatic transposition of chord voicings and scale fingerings based on detected base roots
- **Data Libraries:**
  - `chordLibrary.ts`: 200+ chord voicings across all types
  - `scaleLibrary.ts`: 15+ scales with multiple fingering patterns
- **API Endpoints:**
  - `/api/auth/user` - Get current user
  - `/api/login` - Initiate Replit Auth login
  - `/api/callback` - OAuth callback
  - `/api/logout` - Logout user
  - `/api/generate` - Generate chord progression with AI

---

## Quick Reference Card

### Before Committing Changes from External Editor

**✅ SAFE:**
- Application code in `client/`, `server/`, `shared/`
- New components/routes/modules
- Chord voicings and scale fingerings in utilities
- Styles and assets
- Documentation files
- Database schema files in `shared/schema.ts` (then run migration)

**⚠️ VERIFY IN REPLIT:**
- Any config file changes
- New path aliases
- Build configuration
- Port/host settings

**🚫 NEVER COMMIT:**
- Modified `.replit` or `replit.nix`
- Manually edited package files
- Changed port bindings
- Custom deployment scripts
- Database connection string changes
- **NEVER changed database ID column types**
- Removed `server.allowedHosts: true` from vite.config.ts
- Set `changeOrigin: true` in Vite proxy config

### Emergency Rollback (PROGGER)
```bash
# Restore all critical files
git checkout HEAD -- .replit replit.nix package.json package-lock.json vite.config.ts drizzle.config.ts tsconfig.json

# Reinstall dependencies
npm install

# Sync database
npm run db:push --force
```

---

## Additional Resources

- **Replit Docs:** https://docs.replit.com
- **xAI Docs:** https://docs.x.ai
- **Drizzle ORM Docs:** https://orm.drizzle.team
- **Vite Docs:** https://vitejs.dev
- **React Query Docs:** https://tanstack.com/query

---

**Last Updated:** October 30, 2025  
**Project:** PROGGER - AI-Powered Chord Progression Generator for Guitarists  
**For Quick Reference:** See `replit-ai-rules.md` for AI assistant guidelines
