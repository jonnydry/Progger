# PROGGER - Comprehensive Codebase Guide for AI Assistants

## Overview

PROGGER is a full-stack, AI-powered chord progression and scale generator for guitarists. It uses xAI's Grok API for intelligent music theory suggestions paired with a comprehensive client-side chord voicing library containing 200+ guitar-specific voicings.

**Project Type**: Full-Stack Web Application (Hybrid AI + Client-Side)  
**Deployment Target**: Replit (with PostgreSQL, optional Redis)  
**Domain**: Music Education / Guitar Learning Tools

---

## 1. Project Architecture & Tech Stack

### Frontend Stack
- **Framework**: React 19.2 + TypeScript 5.8
- **Build Tool**: Vite 6.2 (port 5000)
- **State Management**: TanStack Query (React Query) 5.90.5
- **Styling**: Tailwind CSS (CDN) + Custom CSS variables for theming
- **UI Patterns**: Components + Hooks + Context (for auth)
- **Key Libraries**:
  - `@tanstack/react-query` - Server state management
  - `react-dom` - DOM rendering
  - Custom hook patterns for data fetching

### Backend Stack
- **Runtime**: Node.js 20+ (via tsx for TypeScript execution)
- **Framework**: Express.js 5.1 + TypeScript
- **Database**: PostgreSQL + Drizzle ORM 0.44.7
- **Session Storage**: PostgreSQL (via connect-pg-simple)
- **Authentication**: Replit Auth (OpenID Connect)
- **Caching**: Redis (optional, with graceful in-memory fallback)
- **API**: Express-based REST API
- **Security**: Helmet.js + CSRF tokens (csrf-sync) + Express Rate Limit

### DevOps & Build
- **Development**: concurrently (parallel server + client)
- **Database Migrations**: Drizzle Kit
- **Testing**: Vitest + Playwright (E2E)
- **Monitoring**: Custom logger utility

### Key Versions
- Node 20+, React 19.2, Express 5.1, TypeScript ~5.8, Drizzle ORM 0.44.7

---

## 2. Directory Structure & Organization

```
/home/user/Progger/
├── client/                          # React Frontend (Vite root)
│   ├── App.tsx                      # Main app entry & orchestration
│   ├── index.tsx                    # React DOM mount point
│   ├── constants.ts                 # UI constants (themes, keys, modes, progressions)
│   ├── types.ts                     # Shared TypeScript interfaces
│   │
│   ├── components/                  # React UI Components (20 .tsx files)
│   │   ├── GlassmorphicHeader.tsx    # App header with theme selector
│   │   ├── Controls.tsx             # Progression generation controls
│   │   ├── VoicingsGrid.tsx         # Chord voicing display (main output)
│   │   ├── ScaleDiagram.tsx         # Guitar scale visualization
│   │   ├── StashSidebar.tsx         # Saved progression sidebar
│   │   ├── CustomProgressionInput.tsx # Custom chord input
│   │   ├── ChordDetailView.tsx       # Detailed chord info
│   │   ├── ThemeSelector.tsx         # Theme picker modal
│   │   ├── ErrorBoundary.tsx         # React error boundary
│   │   └── ... (more UI components)
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useAuth.ts               # Auth status + user data (TanStack Query)
│   │   ├── useStash.ts              # Stash CRUD operations (mutations)
│   │   └── useChordVoicingPreview.ts # Chord preview logic
│   │
│   ├── services/                    # API Communication
│   │   └── xaiService.ts            # Progression generation (fetch API)
│   │
│   ├── lib/                         # Utilities & Configuration
│   │   ├── queryClient.ts           # TanStack Query setup (axios-style defaults)
│   │   └── authUtils.ts             # Auth helper functions
│   │
│   ├── utils/                       # Music Theory & Helper Functions
│   │   ├── musicTheory.ts           # Note/chromatic scale utilities
│   │   ├── chordLibrary.ts          # Async chord voicing data (200+ chords)
│   │   ├── chordLibrary.ts          # DEPRECATED - Use chords/index.ts instead
│   │   ├── scaleLibrary.ts          # Scale fingering patterns
│   │   ├── chordFormatting.ts       # Display name formatting (F# vs Gb)
│   │   ├── smartChordSuggestions.ts # Key detection for custom progressions
│   │   ├── chordAnalysis.ts         # Harmonic analysis utilities
│   │   ├── colorUtils.ts            # UI color manipulation
│   │   ├── csrf.ts                  # CSRF token management (client-side)
│   │   ├── errors.ts                # Error classification utilities
│   │   ├── processingConfig.ts      # Configuration constants
│   │   └── chords/                  # NEW Async Chord API (code-split)
│   │       ├── index.ts             # Export getChordVoicingsAsync()
│   │       ├── loader.ts            # Dynamic import logic
│   │       ├── types.ts             # ChordVoicing interface
│   │       └── data/                # Per-note chord data files
│   │           ├── C.ts, C_sharp.ts, D.ts ... B.ts (12 files, ~8KB each)
│   │
│   └── __tests__/                   # Vitest Unit Tests
│       ├── setup.ts                 # Test environment setup
│       ├── components/              # Component tests
│       ├── utils/                   # Utility tests
│       └── shared/                  # Shared library tests

├── server/                          # Express Backend
│   ├── index.ts                     # Server startup, middleware setup
│   ├── routes.ts                    # API route definitions & handlers
│   ├── db.ts                        # Drizzle ORM initialization
│   ├── storage.ts                   # Database layer (users, stash, sessions)
│   ├── replitAuth.ts                # Replit OIDC authentication setup
│   ├── xaiService.ts                # Grok API integration & prompting
│   ├── cache.ts                     # Redis cache wrapper (with fallback)
│   ├── rateLimit.ts                 # Rate limiting (Redis-backed)
│   ├── retryLogic.ts                # Exponential backoff + circuit breaker
│   ├── pendingRequests.ts           # Request deduplication manager
│   ├── promptOptimization.ts        # Prompt building & token estimation
│   │
│   ├── middleware/                  # Express Middleware
│   │   ├── validation.ts            # Input validation + sanitization
│   │   ├── csrf.ts                  # CSRF protection middleware
│   │   ├── rateLimit.ts             # Rate limiter instances
│   │   └── requestId.ts             # Request ID injection (tracing)
│   │
│   ├── utils/                       # Backend Utilities
│   │   ├── logger.ts                # Structured logging
│   │   ├── validation.ts            # Request validation schemas
│   │   └── apiValidation.ts         # API response validation
│   │
│   └── __tests__/                   # Vitest Server Tests
│       ├── routes.test.ts           # API route testing
│       ├── xaiService.test.ts       # Grok API mock tests
│       └── apiValidation.test.ts    # Validation logic tests

├── shared/                          # Shared Code (Both Client & Server)
│   ├── schema.ts                    # Drizzle ORM schema (users, stash, sessions)
│   ├── cacheUtils.ts                # Cache key generation (consistent across layers)
│   └── music/
│       ├── chordQualities.ts        # Chord quality normalization
│       └── scaleModes.ts            # Scale mode definitions

├── e2e/                             # End-to-End Tests (Playwright)
│   └── tests/                       # E2E test files
│
├── docs/                            # Documentation
│   ├── custom-progression-stash-integration.md
│   └── custom-progression-stash-flow-diagram.md
│
├── replit-protection-templates/     # Replit-specific configs
│   ├── replit-ai-rules.md
│   ├── replit-developer-guide.md
│   └── README.md
│
├── attached_assets/                 # Static assets (mascot, images)
│
├── Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json                # TypeScript compiler options
│   ├── vite.config.ts               # Vite build config
│   ├── vitest.config.ts             # Vitest configuration
│   ├── playwright.config.ts         # Playwright E2E config
│   ├── drizzle.config.ts            # Drizzle migrations config
│   ├── .replit                      # Replit environment (Node 20 + PostgreSQL)
│   ├── .env.example                 # Environment variables template
│   └── .gitignore                   # Git ignore rules
```

---

## 3. Key Files & Their Purposes

### Entry Points

| File | Purpose | When to Modify |
|------|---------|---|
| `server/index.ts` | Express app initialization, Helmet security, error handling | Adding middleware, security headers |
| `client/App.tsx` | Main React component, state orchestration, hooks | UI flow, new pages, theming |
| `client/index.tsx` | React DOM mount point | Rarely (only for React setup) |

### Configuration Files

| File | Purpose | Importance |
|------|---------|-----------|
| `vite.config.ts` | Frontend build, dev server (port 5000), API proxy to :3001 | HIGH - Must route `/api` to backend |
| `tsconfig.json` | TypeScript configuration, path aliases (@/, @shared/) | MEDIUM - Rarely changes |
| `vitest.config.ts` | Unit test environment (jsdom), coverage settings | MEDIUM - Test infrastructure |
| `drizzle.config.ts` | Database schema + migrations location | MEDIUM - When schema changes |
| `playwright.config.ts` | E2E test configuration, baseURL (localhost:5000) | LOW - Test infrastructure |

### Critical System Files

| File | Purpose | Key Patterns |
|------|---------|---|
| `shared/schema.ts` | Drizzle ORM table definitions (users, stash, sessions) | 3 tables: users, stash, sessions |
| `server/routes.ts` | All API endpoints, middleware stack | CSRF on POST/DELETE, rate limiting on generation endpoints |
| `server/storage.ts` | Database query layer (IStorage interface) | CRUD operations with error handling |
| `server/replitAuth.ts` | OpenID Connect with Replit, session management | Passport.js, PostgreSQL session store |
| `client/lib/queryClient.ts` | TanStack Query client defaults | Global error handling for API responses |

---

## 4. Development & Build Processes

### Scripts

```bash
# Development
npm run dev              # Run server + client concurrently (backend :3001, frontend :5000)
npm run server          # Start Express backend only (tsx watch)
npm run client          # Start Vite dev server only

# Building
npm run build           # Build frontend (vite build) → dist/
npm run preview         # Preview production build locally

# Database
npm run db:push         # Push schema changes to PostgreSQL (Drizzle)
npm run db:studio       # Open Drizzle Studio GUI for DB inspection

# Testing
npm run test            # Run unit tests (Vitest)
npm run test:ui         # Run tests with UI dashboard
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run Playwright E2E tests
```

### Build Tools

- **Vite**: Frontend bundler with HMR
  - Config: `vite.config.ts`
  - Root: `client/`
  - Output: `dist/`
  - Proxy: `/api` → `http://localhost:3001`

- **TypeScript**: Compilation (via tsx for Node, Vite for frontend)
  - Config: `tsconfig.json`
  - Target: ES2022
  - Path aliases: `@/` → `client/`, `@shared/` → `shared/`

- **Drizzle ORM**: Database schema management
  - CLI: `drizzle-kit push`
  - Schema: `shared/schema.ts`
  - Dialect: PostgreSQL

---

## 5. Testing Setup

### Unit Testing (Vitest)

**Framework**: Vitest 4.0.6 + React Testing Library + JSDOM  
**Config**: `vitest.config.ts`  
**Test Files**: `**/__tests__/**/*.{test,spec}.{ts,tsx}`

Key test directories:
- `client/__tests__/` - React component & utility tests
- `server/__tests__/` - API route & service tests

Example test pattern:
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Feature', () => {
  it('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

Setup file: `client/__tests__/setup.ts` (React Testing Library cleanup)

### E2E Testing (Playwright)

**Framework**: Playwright 1.56.1  
**Config**: `playwright.config.ts`  
**Tests**: `e2e/tests/`  
**Base URL**: `http://localhost:5000`

Playwright auto-starts dev server via `npm run dev` before tests.

### Testing Best Practices

1. **Mocking**: Use `vi.mock()` for services (xaiService, storage, replitAuth)
2. **Async**: Use `async/await`, not `.then()`
3. **Cleanup**: React Testing Library auto-cleanup via setup.ts
4. **Integration**: E2E tests run against live dev server

---

## 6. API Structure & Routing Patterns

### Base URL
- **Development**: `http://localhost:5001` (backend), `http://localhost:5000` (frontend with proxy)
- **Production**: HTTPS on Replit domain

### API Routes

All routes prefixed with `/api/`

#### Authentication Routes
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/api/auth/user` | Required | Get current user profile |
| N/A | `/api/login` | - | Replit login redirect |
| N/A | `/api/logout` | - | Replit logout redirect |

#### Health & Utility Routes
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/api/health` | - | System health check (DB, Redis, rate limits) |
| GET | `/api/csrf-token` | - | Fetch CSRF token for POST requests |

#### Chord Generation Routes
| Method | Route | Auth | CSRF | Rate Limit | Purpose |
|--------|-------|------|------|-----------|---------|
| POST | `/api/generate-progression` | - | Required | 50/15min | AI-generated progressions |
| POST | `/api/analyze-custom-progression` | - | Required | 50/15min | Analyze user-provided chords |

#### Stash Routes (User Saved Progressions)
| Method | Route | Auth | CSRF | Purpose |
|--------|-------|------|------|---------|
| GET | `/api/stash` | Required | - | Fetch all user stash items (paginated) |
| POST | `/api/stash` | Required | Required | Create new stash item |
| DELETE | `/api/stash/:id` | Required | Required | Delete specific stash item |

### Request/Response Format

**Generation Request**:
```typescript
POST /api/generate-progression
{
  "key": "C",                    // Key (C, F#, Bb, etc.)
  "mode": "major",               // Mode (major, minor, dorian, etc.)
  "includeTensions": false,      // Boolean
  "numChords": 4,                // Number 1-12
  "selectedProgression": "auto"  // Progression pattern or "auto"
}
```

**Generation Response**:
```typescript
{
  "progression": [
    {
      "chordName": "Cmaj7",
      "musicalFunction": "Tonic Major 7th",
      "relationToKey": "Imaj7"
    },
    ...
  ],
  "scales": [
    {
      "name": "C Major",
      "rootNote": "C"
    },
    ...
  ],
  "detectedKey": "C",    // Optional (from custom analysis)
  "detectedMode": "Major" // Optional (from custom analysis)
}
```

### Middleware Stack

**Order** (as applied in `routes.ts`):
1. `requestIdMiddleware` - Injects `req.id` for tracing
2. `setupAuth()` - Passport.js + sessions
3. Route handlers
4. CSRF error handler (catches EBADCSRFTOKEN)

**Notable Middleware**:
- `csrfSynchronisedProtection` - CSRF validation (GET token, validate on POST/DELETE)
- `aiGenerationLimiter` - Rate limiting (Redis-backed if available)
- `validateProgressionRequestMiddleware` - Input validation + sanitization
- `validateStashRequestMiddleware` - Stash data validation

---

## 7. State Management Approach

### Client-Side State Management

#### TanStack Query (Server State)
- **Purpose**: Manage server-side data (user, stash items)
- **Setup**: `client/lib/queryClient.ts`
- **Default Behavior**:
  - `staleTime`: 5 minutes
  - `retry`: false (no auto-retry)
  - Credentials always included (for cookies)

```typescript
// Hook pattern
const { data: user, isLoading, isAuthenticated } = useAuth();
const { data: stashItems } = useStash();
```

#### React Local State (UI State)
- **Approach**: `useState()` hooks in components
- **State in App.tsx**:
  ```typescript
  const [key, setKey] = useState<string>(KEYS[0]);
  const [mode, setMode] = useState<string>(MODES[0].value);
  const [progressionResult, setProgressionResult] = useState<ProgressionResult | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [themeIndex, setThemeIndex] = useState<number>(getInitialThemeIndex());
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customProgression, setCustomProgression] = useState<Array<{ root: string; quality: string }>>([...]);
  ```

#### LocalStorage (Persistence)
- `theme` - Dark/light mode preference
- `themeColorIndex` - Selected color theme index

### Mutations (TanStack Query)

```typescript
// Save progression to stash
const { mutate: saveToStash } = useSaveToStash();

// Delete from stash
const { mutate: deleteFromStash } = useDeleteFromStash();

// Automatic cache invalidation on success
// Re-fetches /api/stash after mutations
```

### Server-Side State

- **Express Session**: Session data stored in PostgreSQL (via `connect-pg-simple`)
- **User Identity**: Stored in session + Replit OIDC claims
- **Stash Data**: PostgreSQL (via Drizzle ORM)

---

## 8. Authentication & Security Patterns

### Authentication Flow

**Provider**: Replit Auth (OpenID Connect)

```
1. User clicks "Login" → /api/login
2. Replit OIDC redirect → consent screen
3. Code exchange → access token
4. Claims extracted → stored in session
5. User profile cached in users table
6. Session cookie set (httpOnly, secure)
```

### User Model

```typescript
// Replit OIDC Claims
interface AuthenticatedUser {
  claims: {
    sub: string;                    // User ID
    email?: string;
    first_name?: string;
    last_name?: string;
    profile_image_url?: string;
    exp?: number;                   // Token expiration
  };
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

// Database
interface User {
  id: string;                       // Primary key (UUID)
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Security Measures

#### 1. CSRF Protection
- **Library**: `csrf-sync`
- **Pattern**: Synchronizer token pattern
- **Flow**:
  1. Client fetches token: `GET /api/csrf-token`
  2. Token included in header: `X-CSRF-Token`
  3. Server validates before state-changing operations
  4. Custom error handler catches `EBADCSRFTOKEN`

```typescript
// Client-side CSRF handling
const headers = await addCsrfHeaders({
  'Content-Type': 'application/json',
});
```

#### 2. Rate Limiting
- **Library**: `express-rate-limit` + `rate-limit-redis`
- **Strategy**: Redis-backed with in-memory fallback
- **AI Generation Endpoints**:
  - Limit: 50 requests per 15 minutes per IP
  - Graceful fallback to in-memory if Redis unavailable

#### 3. Security Headers (Helmet.js)
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      ...
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));
```

#### 4. Session Security
- **Storage**: PostgreSQL (connect-pg-simple)
- **Secret**: `SESSION_SECRET` environment variable (auto-generated by Replit)
- **Cookies**: `httpOnly`, `secure` (HTTPS only), max age 7 days
- **TTL**: 7 days, cleaned up automatically

#### 5. Input Validation & Sanitization
```typescript
// Validation
validateProgressionRequest(req.body);  // Type + range checks
validateCustomProgressionRequest(req.body);

// Sanitization
function sanitizeString(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').trim();
}
```

#### 6. XSS Prevention
- Tailwind CSS (no raw HTML injection)
- React auto-escaping
- Sanitization middleware for user input

### Protected Routes Pattern

```typescript
// Middleware chain
app.get('/api/stash', 
  isAuthenticated,              // Check session + Replit claims
  async (req, res) => {
    const user = req.user as AuthenticatedUser;
    const userId = user.claims.sub;
    // Fetch user's data
  }
);

// Function definition
const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};
```

---

## 9. Database & Data Storage Approach

### Database: PostgreSQL (Replit-Hosted)

**ORM**: Drizzle ORM 0.44.7  
**Client**: postgres.js 3.4.7  
**Connection**: Via `DATABASE_URL` env variable

### Schema Overview

#### Table 1: `users`
```typescript
pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
```

**Queries**: 
- `getUser(id)` - Fetch by ID
- `upsertUser(data)` - Create or update (ON CONFLICT)

#### Table 2: `stash`
```typescript
pgTable("stash", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar("name").notNull(),
  key: varchar("key").notNull(),
  mode: varchar("mode").notNull(),
  progressionData: jsonb("progression_data").notNull(),  // Full ProgressionResult
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("stash_user_id_idx").on(table.userId),
])
```

**Queries**:
- `getUserStashItems(userId, limit?, offset?)` - Fetch with pagination
- `createStashItem(data)` - Insert new progression
- `deleteStashItem(id, userId)` - Delete (verifies ownership)

**Key Feature**: `progressionData` is JSONB, storing full API response (progression + scales).

#### Table 3: `sessions`
```typescript
pgTable("sessions", {
  sid: varchar("sid").primaryKey(),                      // Session ID
  sess: jsonb("sess").notNull(),                         // Session data
  expire: timestamp("expire").notNull(),                 // Expiration time
}, (table) => [
  index("IDX_session_expire").on(table.expire),
])
```

**Managed by**: `connect-pg-simple` Express middleware (automatic)

### Data Storage Layer

**File**: `server/storage.ts`

**Interface**:
```typescript
interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserStashItems(userId: string, limit?: number, offset?: number): Promise<StashItem[]>;
  createStashItem(item: InsertStashItem): Promise<StashItem>;
  deleteStashItem(id: string, userId: string): Promise<void>;
}
```

**Implementation**: `DatabaseStorage` class using Drizzle ORM

### Caching Layer

**Purpose**: Reduce API calls to Grok, improve performance

#### Redis Cache (Optional)
- **Library**: redis 5.9.0
- **Config**: `server/cache.ts`
- **Fallback**: In-memory if Redis unavailable
- **TTL**: Configurable per request

**Cache Keys**:
```typescript
// Format: progression:{key}:{mode}:{tensions}:{numChords}:{selectedProgression}
progression:c:major:no-tensions:4:i-iv-v
```

Generated by: `shared/cacheUtils.ts` (consistent client/server)

#### Cache Operations
- `get<T>(key)` - Fetch from cache
- `set<T>(key, value, ttlSeconds)` - Store with TTL
- `delete(key)` - Remove entry
- `exists(key)` - Check existence

#### Request Deduplication
**File**: `server/pendingRequests.ts`

Prevents duplicate API calls for identical in-flight requests:
```typescript
// If 2 clients request same progression, only 1 API call made
const pending = pendingRequests.get(cacheKey);
if (pending) return pending;  // Reuse existing promise
```

### Database Migrations

**Tool**: Drizzle Kit

```bash
npm run db:push                # Apply schema changes
npm run db:studio              # GUI for inspection
```

**Workflow**:
1. Edit `shared/schema.ts`
2. Run `npm run db:push`
3. Schema synced to PostgreSQL

---

## 10. Key Conventions & Code Patterns

### Naming Conventions

#### TypeScript/JavaScript
- **Variables & Functions**: `camelCase` (e.g., `generateChordProgression`, `setKey`)
- **Classes**: `PascalCase` (e.g., `DatabaseStorage`, `RedisCache`)
- **Interfaces**: `PascalCase` with prefix (e.g., `User`, `IStorage`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `KEYS`, `THEMES`, `MODES`)
- **Files**: 
  - Components: `PascalCase.tsx` (e.g., `VoicingsGrid.tsx`)
  - Utilities: `camelCase.ts` (e.g., `musicTheory.ts`)
  - Config: `kebab-case.ts` (e.g., `vite.config.ts`)

#### CSS/Tailwind
- Classes: `kebab-case` (e.g., `bg-surface`, `text-text/60`)
- CSS Variables: `--color-{property}` (e.g., `--color-primary`, `--color-accent`)

### Guitar & Music Theory Conventions

#### String Ordering
**CRITICAL**: All fret arrays follow guitar string order from LOW E to HIGH E:

```
Array Index:  [0,       1,    2,    3,    4,      5]
String Name:  [Low E,   A,    D,    G,    B,   High E]
String No.:   [6th,     5th,  4th,  3rd,  2nd,  1st]
```

**Example - E Major**: `[0, 2, 2, 1, 0, 0]`
- Low E (6th string): open (0)
- A (5th string): 2nd fret
- D (4th string): 2nd fret
- G (3rd string): 1st fret
- B (2nd string): open
- High E (1st string): open

#### Chromatic Scale
- **Sharp Notation**: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
- **Flat Notation**: C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
- **Values**: 0-11 (C=0, C#/Db=1, etc.)

#### Enharmonic Preference
- **Sharp Keys**: C, D, E, F#, G, A, B (use sharp notation)
- **Flat Keys**: F, Bb, Eb, Ab, Db, Gb, Cb (use flat notation)
- **Client-Side**: `chordFormatting.ts` handles display conversion
- **Server-Side**: `promptOptimization.ts` builds prompts with correct notation

### File Organization Patterns

#### Component Structure
```typescript
// React Components follow pattern:
import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

export interface ComponentProps {
  // Props definition
}

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks (useState, useEffect, useQuery, etc.)
  // Event handlers
  // Memoized values
  // JSX return
};

export default ComponentName;
```

#### Utility Function Pattern
```typescript
// Utilities have docstrings + type safety
/**
 * Convert note name to chromatic value (0-11)
 * @param note - Note name (e.g., 'C', 'F#', 'Bb')
 * @returns Chromatic value 0-11
 */
export function noteToValue(note: string, defaultValue: number = 0): number {
  // Implementation
}
```

#### Server Middleware Pattern
```typescript
// Middleware is type-safe and composable
import type { Request, Response, NextFunction } from 'express';

export function middlewareName(req: Request, res: Response, next: NextFunction): void {
  try {
    // Logic
    next();
  } catch (error) {
    // Error handling
    res.status(400).json({ error: message });
  }
}
```

#### Error Handling Pattern
```typescript
// Custom error classes
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Try-catch with logging
try {
  const result = await operation();
} catch (error) {
  logger.error("Operation failed", error, { context: value });
  throw error;
}
```

### Data Flow Patterns

#### AI Generation Flow
```
Client Component
  → generateChordProgression(key, mode, ...)
    → fetch('/api/generate-progression', { method: 'POST', body, headers })
      → Server: validateProgressionRequestMiddleware
      → Server: aiGenerationLimiter (rate limit check)
      → Server: csrfSynchronisedProtection (CSRF validation)
      → Server: generateChordProgression()
        → Check cache (pendingRequests + Redis)
        → Call Grok API (with retry logic + circuit breaker)
        → Cache result
        → Return ProgressionResult
      → Client: setProgressionResult()
      → Client: Render VoicingsGrid + ScaleDiagram
```

#### User Stash Flow
```
StashSidebar Component
  → useStash() (TanStack Query)
    → fetch('/api/stash', credentials: 'include')
      → Server: isAuthenticated (session check)
      → Server: getUserStashItems(userId)
        → Database query (with pagination)
        → Return StashItem[]
  → Display items in list
  → User clicks item
    → onLoadProgression()
      → Update App state: setProgressionResult()
      → Scroll to results
```

### Async Operations Pattern

#### Progression Generation (Client)
```typescript
const handleGenerate = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  setProgressionResult(null);

  try {
    const result = await generateChordProgression(key, mode, ...);
    setProgressionResult(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}, [key, mode, ...]);
```

#### Database Operations (Server)
```typescript
async getUserStashItems(userId: string, limit?: number): Promise<StashItem[]> {
  try {
    let query = db.select().from(stash).where(eq(stash.userId, userId));
    if (limit) query = query.limit(limit);
    const items = await query;
    return items;
  } catch (error) {
    logger.error("Database error", error, { userId });
    throw error;
  }
}
```

### Testing Patterns

#### Unit Test Pattern (Vitest)
```typescript
import { describe, it, expect, vi } from 'vitest';
import { functionToTest } from './module';

describe('Module', () => {
  it('should handle case', () => {
    const result = functionToTest(input);
    expect(result).toBe(expected);
  });

  it('should throw on invalid input', () => {
    expect(() => functionToTest(invalid)).toThrow();
  });
});
```

#### Component Test Pattern
```typescript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './Component';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName prop="value" />);
    expect(screen.getByText(/text/)).toBeInTheDocument();
  });
});
```

#### Mock Pattern (Server Routes)
```typescript
import { vi } from 'vitest';
import * as xaiService from '../xaiService';

vi.mock('../xaiService');

it('should call xaiService', async () => {
  vi.mocked(xaiService.generateChordProgression).mockResolvedValue({ ... });
  // Test code
  expect(vi.mocked(xaiService.generateChordProgression)).toHaveBeenCalled();
});
```

---

## 11. Special Tooling & Custom Scripts

### Logging System

**File**: `server/utils/logger.ts`

**API**:
```typescript
logger.info(message, { contextKey: value });     // Info level
logger.warn(message, { contextKey: value });     // Warning level
logger.error(message, error, { contextKey: value }); // Error level
logger.debug(message, { contextKey: value });    // Debug (development)
```

**Context**: All logs include `requestId` for request tracing

### Request ID Middleware

**File**: `server/middleware/requestId.ts`

- Auto-generates UUID for each request
- Injected into `req.id`
- Passed through all logs for correlation

### Chord Voicing System

#### Old System (Deprecated)
- **File**: `client/utils/chordLibrary.ts`
- **Method**: Synchronous, large bundle impact (220KB)

#### New System (Current)
- **Files**: `client/utils/chords/*`
- **Method**: Async code-splitting
- **Bundle**: Reduced to 22KB initial + 8KB per chord chunk
- **API**:
  ```typescript
  const voicings = await getChordVoicingsAsync('Cmaj7');
  ```

#### Chord Quality Normalization
**File**: `shared/music/chordQualities.ts`

Normalizes chord names:
- `Cmajor` → `Cmaj`
- `Cm7` → stays `Cm7`
- `C-7` → `Cm7` (handle various formats)

### Prompt Optimization

**File**: `server/promptOptimization.ts`

**Features**:
- Builds optimized prompts for Grok API
- Estimates token usage (cost optimization)
- Generates fingerprints for caching
- Includes mode-specific music theory context

**Usage**:
```typescript
const promptComponents = buildOptimizedPrompt(request);
logger.debug("Estimated tokens:", estimateTokenUsage(promptComponents));
```

### Retry & Circuit Breaker Logic

**File**: `server/retryLogic.ts`

**Features**:
- Exponential backoff with jitter
- Configurable max retries (default: 3)
- Circuit breaker pattern for Grok API
- Prevents thundering herd (jitter)

**Configuration**:
```typescript
{
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1
}
```

### Rate Limiting Strategy

**File**: `server/rateLimit.ts`

**Implementation**:
1. Try Redis connection (5 second timeout)
2. If available: Use Redis store (persistent, distributed)
3. If unavailable: Fall back to in-memory
4. Health endpoint reports which store is active

### CSRF Token Management

**Client**: `client/utils/csrf.ts`
**Server**: `server/middleware/csrf.ts`

**Pattern**:
1. Fetch token on app load
2. Cache token in memory
3. Include in headers for POST/DELETE: `X-CSRF-Token`
4. Clear token on 403 to force refresh

---

## 12. Environment Variables

### Required Variables

```bash
# Core API Key (MUST SET)
XAI_API_KEY=your_xai_grok_api_key

# Auto-provided by Replit
SESSION_SECRET=auto-generated       # Session encryption
DATABASE_URL=postgres://...         # PostgreSQL connection
REPL_ID=your-replit-id
REPLIT_DOMAINS=app.replit.dev,...
```

### Optional Variables

```bash
# Caching (improves performance)
REDIS_URL=redis://localhost:6379

# Optional OIDC override
ISSUER_URL=https://replit.com/oidc  # Default

# Deployment indicator
REPLIT_DEPLOYMENT=1                 # Set in production
```

See `.env.example` for full documentation.

---

## 13. Important Notes for AI Development

### Critical Constraints

1. **Replit Auth Vite Proxy**: Frontend MUST proxy `/api` to backend on :3001
   - If deployment fails, check Vite config proxy settings
   - `changeOrigin: false` is intentional (preserves host header for Replit Auth)

2. **String Order Convention**: Guitar fret arrays are LOW E to HIGH E
   - Violating this breaks chord diagrams
   - Always document with diagram comments

3. **Enharmonic Handling**: Different keys use different note notation
   - D Major uses F# (not Gb)
   - Db Major uses Gb (not F#)
   - The system handles this automatically, but be aware

4. **Cache Keys Must Be Consistent**: Client and server use same function
   - `getProgressionCacheKey()` is shared in `shared/cacheUtils.ts`
   - Don't create separate cache key logic

5. **CSRF is Required**: All POST/DELETE to protected routes need tokens
   - Stateless API calls must include X-CSRF-Token header
   - Auth-required routes still need CSRF

### Debugging Tips

1. **Request Tracing**: All logs include `requestId`
   - Search logs by `requestId` to follow a request through system
   - Set in middleware, passed to all handlers

2. **Cache Debugging**: Call from browser console
   ```javascript
   window.clearProgCache()  // Clears client-side progression cache
   ```

3. **Health Endpoint**: Check system state
   ```bash
   curl http://localhost:3001/api/health
   ```
   Returns: DB status, Redis status, rate limit config, uptime

4. **Rate Limit Testing**:
   - Default: 50 requests per 15 minutes
   - In-memory store resets on server restart
   - Redis store persists across restarts

### Common Tasks

**Adding a new API endpoint**:
1. Create validation schema in `server/utils/validation.ts`
2. Add middleware validation to `server/middleware/validation.ts` if needed
3. Create route handler in `server/routes.ts`
4. Add CSRF protection if state-changing
5. Document in this guide

**Adding a new component**:
1. Create in `client/components/`
2. Import hooks as needed (`useAuth`, `useStash`, `useQuery`)
3. Use Tailwind CSS for styling with CSS variables
4. Add types in `client/types.ts` if needed

**Adding a database operation**:
1. Add query to `server/storage.ts` (DatabaseStorage class)
2. Update interface if adding new operation
3. Test with Drizzle Studio: `npm run db:studio`
4. Add unit test to `server/__tests__/`

**Deploying to Replit**:
1. Set environment variables via Secrets tool
2. Push database schema: `npm run db:push`
3. Commit and push to GitHub
4. Replit auto-deploys on push
5. Check health endpoint to verify deployment

---

## 14. Recent Changes & Active Work

**As of Nov 14, 2025**:
- Authentication system improvements (recent commits)
- Server startup reliability enhancements
- Chord display and progression generation fixes
- Theme selector animation improvements

Check recent commits for context:
```bash
git log --oneline | head -10
```

---

## Appendix: Quick Reference

### Port Mapping
- Frontend dev: `http://localhost:5000`
- Backend: `http://localhost:3001`
- Vite proxy: `/api` → :3001

### Key Files by Purpose

| Goal | File |
|------|------|
| Add component | `client/components/*.tsx` |
| Add API route | `server/routes.ts` |
| Add database table | `shared/schema.ts` + `npm run db:push` |
| Add test | `*/__tests__/*.test.ts` |
| Fix styling | Use Tailwind + CSS variables |
| Add constant | `client/constants.ts` |
| Add utility | `client/utils/*.ts` or `server/utils/*.ts` |

### TypeScript Path Aliases
- `@/*` → `client/*`
- `@shared/*` → `shared/*`

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025  
**Project**: PROGGER - AI Chord Progression Generator
