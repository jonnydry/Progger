# PROGGER

## Overview
PROGGER is an AI-powered chord progression and scale generator for guitarists. It features a glassmorphic UI, Replit Auth integration, and leverages xAI's Grok API to generate intelligent chord progressions with multiple guitar voicings and suggested scales for improvisation. The project aims to provide a comprehensive tool for guitarists to explore and create musical ideas, offering a full-stack application with a modern, responsive design and robust musical theory integration.

## User Preferences
None documented yet.

## System Architecture
The application is a full-stack project with a React frontend (Vite dev server on port 5000) and an Express.js backend (port 3001) with TypeScript. PostgreSQL is used as the database with Drizzle ORM. Authentication is handled via Replit Auth, supporting various login options.

**UI/UX Decisions:**
- A consistent glassmorphic UI design is applied across the application, including the header.
- Theme customization includes a light/dark mode toggle and 12 color schemes, each corresponding to a musical note.
- The primary font is Space Grotesk, with JetBrains Mono used exclusively for the "PROGGER" logo.
- The UI is designed for mobile responsiveness, adapting layouts and element sizes for smaller screens.
- Pixel art accents and subtle retro styling are incorporated, including dotted borders and pixel corner decorations.
- A Progger frog mascot is integrated into the header and hero section.

**Technical Implementations & Feature Specifications:**
- **AI Chord Generation**: Utilizes xAI's Grok API (`grok-4-fast-reasoning` model) to generate chord progressions and scale name suggestions.
- **Hybrid AI + Client-Side Approach**: AI provides creative input, while extensive client-side libraries (`chordLibrary.ts`, `scaleLibrary.ts`) provide detailed guitar voicings and scale fingerings, reducing reliance on AI for granular musical details.
- **Chord Voicings**: A comprehensive library of 200+ pre-defined guitar chord voicings with automatic transposition and a fallback system using generic E-form barre chord templates. Chord data is normalized to a relative format for consistency and validated at runtime.
- **Scale Suggestions**: AI-suggested scales are enriched with multiple fingering patterns from the client-side library, featuring intelligent transposition that prioritizes ergonomic, playable positions (typically frets 0-12).
- **Stash Feature**: Allows users to save and retrieve chord progressions, persisting them in a PostgreSQL database.
- **Authentication**: Secure user authentication is managed through Replit Auth, integrated with a PostgreSQL database for user and session storage.
- **Session-Based Caching**: Performance is optimized using PostgreSQL for session storage.
- **Context-Aware Music Theory**: Enharmonic notes and chord names are displayed correctly based on the selected key signature.

**System Design Choices:**
- The frontend and backend communicate via a Vite proxy that forwards `/api/*` requests to the Express backend.
- `TanStack React Query` is used for state management, and `Tailwind CSS` for styling.
- The project adheres to Replit protection templates with guidelines for development vs. production mode to prevent unauthorized changes to production environments.

## External Dependencies
- **Authentication**: Replit Auth
- **AI Service**: xAI Grok API (accessed via OpenAI SDK)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM

## Recent Changes

### 2025-11-11: Authentication System Fixes & Server Startup Resilience
- 🔧 **Fixed Server Hanging on Startup**: Resolved critical issue where backend server failed to start
  - **Root Cause**: OIDC discovery call to Replit Auth was hanging indefinitely without timeout
  - **Solution**: Added 10-second timeout wrapper using `Promise.race` pattern
  - **Impact**: Server now starts reliably even when external services are slow or unreachable
  - **Graceful Degradation**: Auth setup fails non-fatally; server continues in degraded mode returning 503 for protected endpoints
- ⏱️ **Network Call Timeouts**: Added timeout protection for all external network operations
  - **OIDC Discovery**: 10-second timeout prevents indefinite hanging during auth setup
  - **Redis Connections**: 5-second timeout with `connectTimeout` socket option for both cache and rate limiting
  - **Fallback Behavior**: Redis failures fall back to in-memory storage automatically
  - **Files Modified**: `server/replitAuth.ts`, `server/cache.ts`, `server/rateLimit.ts`
- 🐛 **TypeScript Error Fixes**: Resolved type errors preventing compilation
  - **cache.ts**: Added `typeof value !== 'string'` type guard for Redis responses
  - **routes.ts**: Fixed type assertion for health check response
  - **replitAuth.ts**: Properly initialized AuthenticatedUser claims object with required fields
- 🎨 **Theme Selector Enhancement**: Perfected bidirectional animation system
  - **Opening Animation**: Dots cascade right-to-left with staggered delays
  - **Closing Animation**: Dots cascade left-to-right (mirror effect) with reversed delay calculation
  - **Implementation**: `delay = isClosing ? (themes.length - 1 - index) * 0.02 : index * 0.02`
  - **Result**: Smooth symmetrical wave effect in both directions
- 📱 **Mobile Formatting Improvements**: Optimized theme selector for all devices
  - **Horizontal Scroll Layout**: Single-row horizontal scrollable layout (max-width 280px)
  - **Uniform Size**: 24px buttons across all screen sizes to fit in header toolbar without expanding height
  - **Hidden Scrollbar**: Clean appearance with hidden scrollbar while maintaining scroll functionality
  - **Consistent Spacing**: `gap-1.5` across all screens for balanced layout
  - **Standard Icon**: 24px icon for proportional sizing
  - **Reduced Ring Offsets**: Thinner focus rings (1px offset) to prevent height expansion
  - **Tooltip Positioning**: Tooltips appear above dots on mobile to avoid overflow, below on desktop
  - **Files Modified**: `client/components/ThemeSelector.tsx`

### 2025-11-02: Critical Validation Bug Fixes & Internal Format Enforcement
- 🐛 **Fixed Chord Generation Failures**: Resolved four critical validation bugs preventing chord progressions from generating
  - **Roman Numeral Validation**: Updated regex pattern to accept quality indicators (Imaj7, iim7, V7, V7b9, V7alt, etc.)
  - **Chord Name Validation**: Updated regex to accept shorthand notation ("m" for minor, "M" for major, "alt" for altered)
  - **Scale Name Validation**: Enforced strict internal format - AI now instructed to use "E Minor" not "E Natural Minor"
  - **Pending Requests Cleanup**: Removed invalid manual delete call; PendingRequestManager auto-cleans via promise.finally()
  - **Impact**: All chord progressions now generate correctly with full requested number of chords and proper scales
  - **Files Modified**: `server/utils/apiValidation.ts`, `server/xaiService.ts`, `server/promptOptimization.ts`
- 🎯 **Strict Format Enforcement**: Validation matches internal system syntax to prevent data loss
  - **Approach**: AI prompts explicitly specify exact format requirements with CORRECT/WRONG examples
  - **Scale Format**: Root + mode name ONLY (e.g., "E Minor", "G Major Pentatonic", "A Dorian")
  - **Forbidden**: Qualifiers like "Natural", "Harmonic", "Melodic", or trailing "Scale"
  - **Benefit**: Ensures AI returns data in exact internal format; validation stays strict for quality assurance

### 2025-11-02: Security Hardening
- 🔒 **Rate Limiting**: Added protection against API abuse and DoS attacks
  - **Configuration**: 50 requests per 15 minutes per IP for AI generation endpoints
  - **Endpoints Protected**: `/api/generate-progression`, `/api/analyze-custom-progression`
  - **Logging**: Rate limit violations are logged with IP, path, and user agent
- 🛡️ **Helmet.js Security Headers**: Comprehensive HTTP security headers
  - **CSP**: Content Security Policy with strict directives
  - **HSTS**: HTTP Strict Transport Security with 1-year max-age
  - **XSS Protection**: XSS filter enabled, frame protection, MIME type sniffing prevention
- 📏 **Request Size Limits**: Protection against memory exhaustion attacks
  - **Limit**: 10MB for JSON and URL-encoded request bodies
  - **Prevents**: Large payload attacks that could crash the server
- 🎫 **CSRF Protection**: Session-based CSRF tokens using `csrf-sync`
  - **Architecture**: Synchronizer Token Pattern with session storage
  - **Endpoints Protected**: All POST and DELETE endpoints (progression generation, stash operations)
  - **Frontend Integration**: Automatic token fetching, caching, and injection via `client/utils/csrf.ts`
  - **Error Handling**: Automatic token refresh on 403 CSRF errors
- 🧹 **Input Sanitization**: XSS protection on user-provided inputs
  - **Method**: HTML entity escaping for dangerous characters (`<`, `>`, `"`, `'`, `/`, `&`)
  - **Scope**: Stash item names and all user-provided text fields
  - **Implementation**: Custom `sanitizeString()` function in validation middleware
- 🔑 **SESSION_SECRET Validation**: Server startup protection
  - **Check**: Validates SESSION_SECRET environment variable exists before starting
  - **Error**: Throws clear error message if not set, preventing insecure defaults
- 🔄 **Redis Error Handling**: Robust caching with graceful fallback
  - **Logging**: Connection errors logged as warnings, not errors
  - **Fallback**: Automatically falls back to in-memory caching when Redis unavailable
  - **Non-Blocking**: Redis connection failures don't prevent server startup
- 📝 **Security Documentation**: Environment variables and CSRF workflow documented

### 2025-11-01: BYO UI Enhancements & Control Reorganization
- 🎸 **BYO Chord Selector Redesign**: Replaced vertical wheel picker with horizontal button array
  - **New Design**: Clean left-to-right array of numbered buttons (2-8 chords)
  - **Animations**: Selected button scales to 110% with glowing shadow, hover effects scale to 105%
  - **Theme Integration**: Active state uses primary color with enhanced shadows, inactive has subtle glassmorphic style
  - **Persistent Data**: Existing chord selections preserved when increasing count, removed from end when decreasing
  - **UX**: More intuitive and faster to use than wheel picker for this use case
- 📐 **Control Layout Reorganization**: Aligned toggles with their related controls
  - **New Structure**: 2-column grid for toggles matching dropdown positions above
  - "Tension Chords" toggle centered under "Progression" dropdown
  - "BYO" toggle centered under "Chords" dropdown
  - Creates clearer visual hierarchy and logical grouping
- 🎭 **Swipe Animation**: Changed BYO toggle from fade to horizontal swipe
  - Standard panel slides left, BYO panel slides in from right (500ms ease-in-out)
  - Maintains absolute positioning to prevent layout shifts
- 🖱️ **MacBook Trackpad Fix**: Multi-layered scroll prevention for wheel pickers
  - Non-passive wheel listener with hover-based activation
  - CSS isolation: `touchAction: 'none'`, `overscrollBehavior: 'contain'`
  - Throttled to 100ms for controlled scrolling
  - Page completely locked when hovering over wheel pickers
- 🎯 **Portal-Based Dropdowns**: Fixed dropdown clipping and blank scroll space issues
  - **Problem**: `overflow-hidden` for swipe animation was clipping dropdown menus vertically
  - **Issue**: Allowing vertical overflow created blank scrollable space from absolutely positioned panels
  - **Solution**: Implemented React portals rendering dropdowns to `document.body`
  - **Architecture**: Dropdowns now render outside Controls container with computed positioning
  - **Benefits**: Full dropdown visibility + no layout conflicts + no blank scroll space
  - **Implementation**: Both `CustomSelect` and `ModeSelect` use `createPortal` with dynamic positioning via `getBoundingClientRect()`