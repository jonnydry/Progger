# 🛡️ Replit Protection Guide for Chord & Scale Generator

## Purpose
This guide prevents external development environments (Cursor, VSCode, etc.) from breaking your **Chord & Scale Generator** Replit deployment by protecting critical infrastructure files and configurations.

**Why This Matters:** Replit uses specific configuration files and workflows to manage your application. Modifying these files in external editors can cause deployment failures, broken builds, and runtime errors that are difficult to debug.

---

## 🚨 CRITICAL: NEVER MODIFY THESE FILES

### Replit Infrastructure Files
These files are **sacred** to Replit's operation. Any modifications will break your deployment:

#### `.replit`
- **What it does:** Controls run commands, build commands, deployment settings
- **Why it's critical:** Replit uses this to start your application and configure workflows
- **Never change:** Run commands, deployment targets, environment variables managed by Replit
- **Located at:** Project root

#### `replit.nix` (or `.config/nix/replit.nix`)
- **What it does:** Manages system-level dependencies (language runtime, system packages, etc.)
- **Why it's critical:** Provides reproducible environment for your app
- **Never change:** Package versions, Nix configuration syntax
- **Located at:** Project root or `.config/nix/`

#### Workflow Configurations
- **What they do:** Define automated task sequences ("Server" workflow)
- **Why they're critical:** Control how Replit runs your development server
- **Never change:** Workflow commands, execution order
- **Managed through:** Replit's Workflow pane (not file-based)

---

## ⚠️ DANGEROUS ZONE: High-Risk Files

### Package Management (Modify with EXTREME Care)

#### For Node.js Projects (npm):

**`package.json`**
- **Safe to modify:** Adding new dependencies via commands
- **NEVER manually edit:** Dependency versions, scripts that Replit manages
- **Correct approach:** Use `npm install <package>` commands only
- **Why:** Replit's dependency tool syncs with package.json automatically

**`package-lock.json`**
- **NEVER manually edit this file**
- **Why:** Auto-generated lockfile that ensures consistent installs
- **Correct approach:** Let package manager regenerate via install commands
- **If corrupted:** Delete and run `npm install` in Replit

---

## 🔧 Build & Configuration Files

### Framework-Specific Configuration

**Chord & Scale Generator Critical Config Files:**

#### React/Vite (Frontend):
- `vite.config.ts`
  - **Critical:** Path aliases (@, @shared, @assets), build output, server configuration, API proxy
  - **Safe changes:** Adding new aliases (carefully)
  - **Dangerous changes:** Changing ports, server host, proxy config, removing `server.allowedHosts: true`
  - **Required setting:** `server.allowedHosts: true` (for Replit proxy compatibility)

#### Express (Backend):
- `server/index.ts`
  - **Critical:** Port binding (backend on port 3001), middleware setup, Replit Auth configuration
  - **Safe changes:** Adding new routes, services
  - **Dangerous changes:** Changing port from 3001, modifying host binding

### TypeScript Configuration:

**`tsconfig.json`**
- **What it controls:** TypeScript compilation settings
- **Critical sections:**
  - Path mappings: `@` -> `./client`, `@shared` -> `./shared`
  - Module resolution strategy
  - Base URL configuration
- **Why it's critical:** Enables imports to work in Replit environment
- **Safe changes:** Adding new paths (if also added to build config)
- **Dangerous changes:** Changing module resolution, base URL, target

---

## 💾 Database Configuration

### Drizzle Configuration (Chord & Scale Generator)

**`drizzle.config.ts`**

- **What it controls:** Database connection and migration settings
- **Critical sections:**
  - Database URL (uses Replit's DATABASE_URL env var)
  - Schema file location (`./shared/schema.ts`)
  - Migration configuration (`./migrations`)
- **Why it's critical:** Must match Replit's database connection
- **NEVER change:** Connection string format, environment variables
- **Safe changes:** None recommended without testing in Replit first

### CRITICAL: Primary Key Rules

**⚠️ NEVER CHANGE PRIMARY KEY ID COLUMN TYPES ⚠️**

This is the #1 cause of catastrophic database failures:

❌ **DON'T DO THIS:**
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

✅ **DO THIS:**
- Check existing schema BEFORE making changes
- Keep ID types exactly as they are
- If you need UUIDs in new tables, that's fine
- Never migrate existing tables from serial → varchar or vice versa

---

## ✅ SAFE TO MODIFY

### Application Code (Full Freedom)
- **Chord & Scale Generator Source Directories:**
  - `client/` - React frontend components, hooks, services, utilities
    - `client/components/` - UI components (ChordDetailView, ScaleDiagram, VoicingDiagram, etc.)
    - `client/hooks/` - React hooks (useAuth.ts)
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

### Documentation & Guidelines
- `README.md` - Project readme
- `replit.md` - Project documentation and preferences
- Any `.md` files (except those in `.replit` configs)

### Styling Configuration (Generally Safe)
- Inline styles - Project uses Tailwind CSS via inline styles and CSS variables
- `.css` files - Global stylesheets
- These are safe because they only affect styling, not infrastructure

---

## 📋 STRICT RULES FOR LLMS IN EXTERNAL EDITORS

### Rule 1: Package Installation
**NEVER manually edit dependency files**

**Node.js (Chord & Scale Generator uses npm):**
```bash
# ✅ DO THIS
npm install <package>

# ❌ DON'T manually edit package.json
```

### Rule 2: Database Schema Changes
**Use ORM/migration tools, never manual SQL**

**For Drizzle (Chord & Scale Generator):**
```typescript
// 1. Modify schema file (shared/schema.ts)
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // NEVER change existing ID type
  name: text("name"),
  email: text("email").unique()
});

// 2. Run migration command
npm run db:push --force
```

**CRITICAL DATABASE RULES:**
- **NEVER change primary key ID types** (integer ↔ UUID breaks everything)
- Always use framework's migration tools
- Check existing schema before making changes
- No manual SQL migrations

### Rule 3: Port Configuration
**Respect Replit's port requirements**

Replit requires binding to `0.0.0.0` with specific ports.

❌ **DON'T DO THIS:**
```javascript
// Hardcoding localhost or wrong port
app.listen(3000, 'localhost')  // WRONG
```

✅ **DO THIS (Chord & Scale Generator):**
```javascript
// Frontend: Vite dev server on port 5000 (configured in vite.config.ts)
// vite.config.ts has server.allowedHosts: true for Replit compatibility

// Backend: Express API server on port 3001
const port = 3001;
app.listen(port, '0.0.0.0');
```

### Rule 4: Environment Variables
**Only suggest adding to Replit's Secrets, never hardcode**

❌ **DON'T DO THIS:**
```javascript
const XAI_API_KEY = "sk-1234567890abcdef"; // WRONG - hardcoded
```

✅ **DO THIS:**
```
"Add your API key to Replit Secrets:
1. Go to Tools > Secrets in Replit
2. Add: XAI_API_KEY = your-xai-api-key-here
3. Access via: process.env.XAI_API_KEY"
```

**Chord & Scale Generator Required Secrets:**
- `XAI_API_KEY` - xAI Grok API key for chord generation (REQUIRED)
- `SESSION_SECRET` - Auto-provided by Replit
- `DATABASE_URL` - Auto-provided by Replit
- `REPL_ID`, `REPLIT_DOMAINS` - Auto-provided by Replit

### Rule 5: Deployment
**NEVER create custom deployment configs**

❌ **DON'T DO THIS:**
- Create GitHub Actions workflows
- Write custom build scripts in `.replit`
- Configure Docker containers
- Set up CI/CD pipelines

✅ **DO THIS:**
```
"Use Replit's built-in Publish feature to deploy your application.
Click the Publish/Deploy button in Replit when ready."
```

---

## 🔄 SAFE WORKFLOWS FOR EXTERNAL DEVELOPMENT

### What You CAN Do in Cursor/VSCode:

#### ✅ Write Application Code
- Create new components/modules
- Write API routes/endpoints
- Add utility functions
- Implement business logic
- Add chord voicings and scale fingerings to libraries
- Style with inline styles and CSS variables

#### ✅ Modify Safe Schemas
- Update ORM models/schemas in `shared/schema.ts`
- Modify type definitions in `client/types.ts`
- Create new database models (after running `npm run db:push --force`)

#### ✅ Test Locally
- Run tests in external environment
- Debug with breakpoints
- Use local dev servers for testing
- Install packages with `npm install` commands

### What You CANNOT Do:

#### ❌ Infrastructure Changes
- Modify `.replit` or `replit.nix`
- Change build configuration files
- Edit package files directly
- Create deployment configs

#### ❌ System Configuration
- Change port bindings (frontend must be 5000, backend must be 3001)
- Modify database connection strings
- Alter build commands
- Configure system packages
- Remove `server.allowedHosts: true` from vite.config.ts

---

## 🏥 RECOVERY CHECKLIST

### If Something Breaks in Replit:

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

**Node.js (Chord & Scale Generator):**
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

**Drizzle (Chord & Scale Generator):**
```bash
npm run db:push --force
```

---

## 📊 PROJECT-SPECIFIC DETAILS

### Chord & Scale Generator Tech Stack:
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

### Critical Port Configuration:
**Chord & Scale Generator Port Setup:**
```javascript
// Frontend: Vite dev server on port 5000
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

// Backend: Express API server on port 3001
const port = 3001;
app.listen(port, '0.0.0.0');
```

### Critical Path Aliases (Chord & Scale Generator):
```
# In tsconfig.json:
'@': './client'
'@shared': './shared'

# In vite.config.ts (additional):
'@assets': './attached_assets'
```

### Database Migration Pattern (Chord & Scale Generator):
```bash
# Drizzle (Chord & Scale Generator)
npm run db:push --force
```

### Workflow Commands:
**Chord & Scale Generator Development runs:**
```bash
npm run dev
```

This starts both the Vite dev server (port 5000) and Express backend (port 3001) concurrently.

### Architecture Highlights:
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

## 🎯 QUICK REFERENCE CARD

### Before Committing Changes from External Editor:

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

### Emergency Rollback (Chord & Scale Generator):
```bash
# Restore all critical files
git checkout HEAD -- .replit replit.nix package.json package-lock.json vite.config.ts drizzle.config.ts tsconfig.json

# Reinstall dependencies
npm install

# Sync database
npm run db:push --force
```

---

## 📚 Additional Resources

- **Replit Docs:** https://docs.replit.com
- **xAI Docs:** https://docs.x.ai
- **Drizzle ORM Docs:** https://orm.drizzle.team
- **Vite Docs:** https://vitejs.dev
- **React Query Docs:** https://tanstack.com/query

---

## ✏️ Template Notes

This guide has been customized for the **Chord & Scale Generator** project with the following specifications:

- Project name: Chord & Scale Generator
- Frontend framework: React 19.2 with Vite 6.2
- Backend framework: Express.js
- Database: PostgreSQL with Drizzle ORM
- AI service: xAI Grok API (grok-4-fast-reasoning)
- Authentication: Replit Auth
- Package manager: npm
- Frontend port: 5000
- Backend port: 3001
- Database migration: `npm run db:push --force`
- Path aliases: `@` (client), `@shared` (shared), `@assets` (attached_assets)
- Required secrets: XAI_API_KEY, SESSION_SECRET, DATABASE_URL

---

**Last Updated:** October 25, 2025  
**For Questions:** Refer to this guide before making infrastructure changes
