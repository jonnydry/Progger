# REPLIT PROJECT PROTECTION RULES

## 📝 CUSTOMIZATION INSTRUCTIONS
**This template has been customized for the PROGGER project.**
- Copy the entire content and paste into Cursor → Settings → "Rules for AI"
- Keep this updated when your project structure changes

---

## CRITICAL: YOU ARE EDITING THE PROGGER REPLIT-HOSTED PROJECT

This project (**PROGGER** - AI-Powered Chord Progression Generator for Guitarists) is hosted on **Replit** and has specific infrastructure requirements. Violating these rules will **break deployment**.

**PROGGER Features:**
- 200+ guitar chord voicings with automatic transposition
- 3-note-per-string scale patterns across 20+ scales
- AI-generated chord progressions using xAI Grok API
- Interactive fretboard diagrams with Pattern/Map modes
- User authentication and progression stashing

### 🚨 SACRED FILES - NEVER MODIFY UNDER ANY CIRCUMSTANCES

**NEVER touch these files:**
- `.replit` - Controls Replit run commands, workflows, deployment, port mappings
- `replit.nix` (or `.config/nix/replit.nix`) - System dependencies and environment
- Any workflow configurations managed by Replit

**Consequence of editing:** Deployment failure, broken builds, runtime errors

**PROGGER .replit file contains:**
- Run command: `npm run dev`
- Port mappings (5000 for frontend, 3001 for backend)
- Workflow definitions ("Server" workflow)
- Deployment configuration

---

## ⚠️ DANGEROUS ZONE: HIGH-RISK FILES

### Package Management Files

**PROGGER uses npm:**
- `package.json` - NEVER manually edit
- `package-lock.json` - NEVER manually edit
- ✅ DO THIS: `npm install <package>`

### Build Configuration Files

**PROGGER Critical Config Files:**

**React/Vite (Frontend):**
- `vite.config.ts` - Path aliases (@, @shared, @assets), build config, proxy settings
- `tsconfig.json` - TypeScript paths (must match build config)
- **CRITICAL:** `server.allowedHosts: true` must be set for Replit proxy compatibility

**Express (Backend):**
- `server/index.ts` - Port binding files (backend on port 3001)

**Database/ORM (Drizzle):**
- `drizzle.config.ts` - Database connection and migration settings
- `shared/schema.ts` - Database schema definitions (sessions, users)
- NEVER change: Database URL format, connection strings, migration paths
- **Current schema includes:** sessions, users tables with proper indexes

---

## 🚫 ABSOLUTE PROHIBITIONS

### 1. NEVER CHANGE DATABASE ID COLUMN TYPES
**This is the #1 cause of catastrophic failures**

❌ **DON'T:**
```typescript
// Changing from serial to varchar (or vice versa)
id: varchar("id").primaryKey()  // If it was serial("id") - BREAKS EVERYTHING
```

❌ **DON'T:**
```sql
ALTER TABLE users ALTER COLUMN id TYPE VARCHAR; -- CATASTROPHIC
```

✅ **DO:**
- Check existing schema before ANY database changes
- Keep ID types exactly as they are
- Never migrate existing tables between integer ↔ UUID/varchar

### 2. NEVER MANUALLY EDIT PACKAGE FILES
❌ **DON'T:**
```json
// Manually editing package.json
"dependencies": {
  "express": "^5.0.0"  // WRONG - use install command
}
```

✅ **DO:**
```bash
npm install express@5.0.0
```

### 3. NEVER CHANGE PORT CONFIGURATION
❌ **DON'T:**
```javascript
app.listen(3000, 'localhost')  // WRONG
```

✅ **DO (PROGGER uses port 5000 for frontend, 3001 for backend):**
```javascript
// Frontend: Vite dev server on port 5000
// vite.config.ts already configured

// Backend: Express API server on port 3001
const port = 3001;
app.listen(port, '0.0.0.0');
```

### 4. NEVER HARDCODE SECRETS
❌ **DON'T:**
```javascript
const XAI_API_KEY = "sk-1234567890";  // WRONG
```

✅ **DO:**
```
Tell user: "Add to Replit Secrets:
1. Tools → Secrets in Replit
2. Add: XAI_API_KEY = your-xai-api-key
3. Access: process.env.XAI_API_KEY"
```

**PROGGER Required Secrets:**
- `XAI_API_KEY` - xAI Grok API key for chord progression generation (REQUIRED)
- `SESSION_SECRET` - Auto-provided by Replit
- `DATABASE_URL` - Auto-provided by Replit (PostgreSQL)
- `REPL_ID`, `REPLIT_DOMAINS` - Auto-provided by Replit

### 5. NEVER CREATE DEPLOYMENT CONFIGS
❌ **DON'T:**
- Create GitHub Actions workflows
- Write custom deployment scripts
- Configure Docker/containers
- Set up CI/CD pipelines

✅ **DO:**
```
Tell user: "Use Replit's Publish button to deploy"
```

---

## ✅ SAFE OPERATIONS

### You CAN freely modify:
- **Application code:** `client/`, `server/`, `shared/` (source directories)
- **Components:** All business logic files in `client/components/`, `client/hooks/`
- **Routes/Services:** `server/routes.ts`, `server/xaiService.ts`, `client/services/`
- **Utilities:** `client/utils/chordLibrary.ts`, `client/utils/scaleLibrary.ts`
- **Styles:** CSS files, inline styles (project uses Tailwind via inline styles)
- **Documentation:** README.md, replit.md, docs folders

### Database Schema Changes (SAFE if done correctly):

**Step 1:** Modify schema file (`shared/schema.ts`)

**Step 2:** Run migration command:
```bash
npm run db:push --force
```

**CRITICAL:** Never change existing ID types in Step 1

---

## 📋 MANDATORY WORKFLOWS

### For Package Installation:
```bash
npm install <package>
```

### For Database Migrations:
```bash
# 1. Modify shared/schema.ts
# 2. Run migration command
npm run db:push --force
```

### For Environment Variables:
```
1. Never hardcode values
2. Tell user to add to Replit Secrets (especially XAI_API_KEY)
3. Access via process.env.VAR_NAME
```

### For Deployment:
```
Tell user: "Use Replit's Publish/Deploy button"
```

---

## 🏥 EMERGENCY RECOVERY

### If Replit Breaks:

**Step 1: Restore critical files**
```bash
git checkout HEAD -- .replit package.json package-lock.json vite.config.ts drizzle.config.ts tsconfig.json
```

**Step 2: Reinstall dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Step 3: Sync database**
```bash
npm run db:push --force
```

**Step 4: Test in Replit**
- Click Run button
- Verify workflow executes
- Check console for errors

---

## 🎯 DO/DON'T QUICK REFERENCE

### ✅ DO:
- Write application code in `client/`, `server/`, `shared/`
- Create new components/routes/modules
- Add styles and assets
- Modify database schemas in `shared/schema.ts` (then run migration)
- Use `npm install` for packages
- Bind backend to port 3001 on `0.0.0.0`
- Use Replit Secrets for sensitive data (XAI_API_KEY)
- Test changes in Replit before committing

### 🚫 DON'T:
- Touch `.replit` or `replit.nix`
- Manually edit package files
- Change database ID column types
- Hardcode ports or secrets (especially XAI_API_KEY)
- Create custom deployment scripts
- Manually write SQL migrations
- Change TypeScript paths without matching build config
- Commit infrastructure changes from external editors

---

## 📊 PROGGER PROJECT SPECIFICS

### Tech Stack:
- **Language:** Node.js / TypeScript
- **Frontend:** React 19.2 with Vite 6.2
- **Backend:** Express.js with TypeScript
- **Database:** PostgreSQL (Replit-hosted)
- **ORM:** Drizzle ORM
- **Package Manager:** npm
- **AI Service:** xAI Grok API (grok-4-fast-reasoning model)
- **Authentication:** Replit Auth (Google, X, GitHub, Apple, email/password)
- **Key Dependencies:** TanStack React Query, OpenAI SDK (for xAI), Passport, Drizzle ORM
- **Styling:** Tailwind CSS (inline styles with CSS variables)

### Critical Files:
```
- .replit - Replit configuration (NEVER MODIFY)
- vite.config.ts - Vite build configuration with path aliases and proxy
- drizzle.config.ts - Database connection and migration settings
- tsconfig.json - TypeScript configuration
- server/index.ts - Express server with port binding (port 3001)
- shared/schema.ts - Database schema definitions
- package.json - Dependencies and scripts (use npm install only)
```

### Port Configuration:
```javascript
// Frontend: Vite dev server on port 5000 (proxies /api/* to backend)
// vite.config.ts has server.allowedHosts: true for Replit compatibility

// Backend: Express API server on port 3001
const port = 3001;
app.listen(port, '0.0.0.0');
```

### Available Scripts:
```bash
npm run dev      # Start development server (concurrently runs frontend + backend)
npm run build    # Build for production
npm run db:push  # Database migration
```

### Migration Command:
```bash
npm run db:push --force
```

### Path Aliases:
```
# In tsconfig.json and vite.config.ts:
'@': './client'
'@shared': './shared'
'@assets': './attached_assets'
```

### Important Architecture Details:
- **Hybrid AI + Client-Side:** AI generates creative chord progressions and scale suggestions (names only), comprehensive client-side libraries provide all voicings and fingerings
- **Transposition Engine:** Smart shortest-path transposition for chord voicings and scale fingerings (optimized for playability)
- **Client-Side Libraries:** 
  - `chordLibrary.ts` - 200+ chord voicings across all types (major, minor, 7ths, extensions, jazz chords)
  - `scaleLibrary.ts` - 20+ scales with 3-note-per-string fingering patterns
  - `musicTheory.ts` - Core music theory utilities (enharmonic display, interval calculation)
- **Database Tables:** `users`, `sessions`, `stash` (for saving favorite progressions)
- **API Routes:** `/api/auth/user`, `/api/login`, `/api/callback`, `/api/logout`, `/api/generate`, `/api/stash/*`

---

## 🔄 VERIFICATION CHECKLIST

Before suggesting ANY change involving:

### Configuration Files:
- [ ] Am I modifying `.replit` or `replit.nix`? → STOP, DON'T DO IT
- [ ] Am I manually editing package files? → STOP, use install command
- [ ] Will this change ports/hosts? → STOP, verify Replit requirements first

### Database:
- [ ] Am I changing ID column types? → STOP, CATASTROPHIC ERROR
- [ ] Have I checked existing schema? → Verify before proceeding
- [ ] Am I using migration command? → Required for schema changes

### Packages:
- [ ] Am I using install command? → Required (npm install)
- [ ] Manually editing package.json? → STOP, use command instead

### Secrets:
- [ ] Am I hardcoding API keys (XAI_API_KEY)? → STOP, use Replit Secrets
- [ ] Suggesting environment variables? → Tell user to add via Replit Secrets

---

## ⚡ REMEMBER

**Three Golden Rules:**
1. **Infrastructure is sacred** - Never modify `.replit`, `replit.nix`, workflows
2. **Use tools, not manual edits** - Package managers, migration commands, Replit Secrets
3. **IDs are permanent** - Never change database primary key types

**When in doubt:**
- Suggest user test in Replit first
- Prefer application code changes over config changes
- Always use proper commands (install, migrate, etc.)

---

**Last Updated:** October 27, 2025  
**Project:** PROGGER - AI-Powered Chord Progression Generator for Guitarists  
**For Full Guide:** See `replit-production-guide.md` in `replit-protection-templates/`
