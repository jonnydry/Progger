# PROGGER

## Overview
PROGGER is an AI-powered chord progression and scale generator for guitarists. It features a glassmorphic UI, Replit Auth integration, and leverages xAI's Grok API to generate intelligent chord progressions with multiple guitar voicings and suggested scales for improvisation. The project aims to provide a comprehensive tool for guitarists to explore and create musical ideas.

## User Preferences
None documented yet.

## System Architecture
The application is a full-stack project with a React frontend (Vite dev server on port 5000) and an Express.js backend (port 3001) with TypeScript. PostgreSQL is used as the database with Drizzle ORM. Authentication is handled via Replit Auth, supporting various login options.

**UI/UX Decisions:**
- A glassmorphic UI design is consistently applied, including a glassmorphic header with authentication elements.
- Theme customization features light/dark mode toggle and 12 color schemes (one for each musical note).
- The default font is Space Grotesk for a clean, modern aesthetic, with JetBrains Mono used exclusively for the "PROGGER" logo.
- Mobile responsiveness is a key design consideration, with adaptive layouts for scale diagrams and reduced element sizes on smaller screens.

**Technical Implementations & Feature Specifications:**
- **AI Chord Generation**: Utilizes xAI's Grok API (`grok-4-fast-reasoning` model) to generate chord progressions and scale suggestions (names only).
- **Hybrid AI + Client-Side Approach**: AI provides creative suggestions, while extensive client-side libraries (`chordLibrary.ts`, `scaleLibrary.ts`) provide detailed guitar voicings and scale fingerings.
- **Chord Voicings**: A comprehensive library of 200+ pre-defined guitar chord voicings across various chord types and roots, with automatic transposition capabilities. It includes a fallback system using generic E-form barre chord templates.
- **Scale Suggestions**: AI-suggested scales are enriched with multiple fingering patterns from the client-side library, featuring intelligent transposition.
- **Stash Feature**: Users can save and retrieve chord progressions, persisting them in a PostgreSQL database.
- **Authentication**: Secure user authentication is managed through Replit Auth, integrated with a PostgreSQL database for user and session storage.
- **Session-Based Caching**: Performance is optimized using PostgreSQL for session storage.
- **Context-Aware Music Theory**: Enharmonic notes and chord names are displayed correctly based on the selected key signature (e.g., F# in D major, Gb in Db major).

**System Design Choices:**
- The frontend and backend communicate via a Vite proxy that forwards `/api/*` requests to the Express backend.
- The `chordLibrary.ts` and `scaleLibrary.ts` are central to providing accurate guitar-specific data, reducing reliance on AI for granular musical details and improving performance.
- The application uses `TanStack React Query` for state management and `Tailwind CSS` for styling.

## External Dependencies
- **Authentication**: Replit Auth
- **AI Service**: xAI Grok API (accessed via OpenAI SDK)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM

## Recent Changes

### 2025-11-01: Enhanced Replit Protection Templates
- 📝 **Added Development vs Production Mode Guidelines**: Comprehensive documentation to prevent AI assistants from interfering with production environments
  - **New Section Added**: "DEVELOPMENT vs PRODUCTION MODE" in both protection template files
  - **Environment Detection**: Clear indicators for dev mode (`REPLIT_DEV_DOMAIN`) vs production (`REPLIT_DEPLOYMENT=1`)
  - **Capability Matrix**: Explicit list of what can/cannot be done in each environment
  - **Critical Rules**: Never modify production database, never write environment-specific code paths, never bypass Replit's publish flow
  - **User Guidance Templates**: What to tell users when they ask about production changes
  - **Safety Warnings**: Destructive scripts require user review before publishing
- 🛡️ **Production Protection**: AI assistants work in development mode only, users manage production via Replit's Database pane and Publish button
- 📊 **Code Examples**: Clear DO/DON'T examples for environment detection and data manipulation
- ✅ **Architect Review**: Guidelines are clear, comprehensive, and adequately protect production environments

### 2025-10-31: Chord Data Normalization & Validation
- 🎸 **Fixed Data Consistency Issue**: Normalized 93 chord voicings from absolute to relative format
  - **Problem**: Barre chords were inconsistently stored - some used absolute fret positions, others used relative offsets
  - **Impact**: System worked by coincidence but was fragile and semantically incorrect
  - **Solution**: Converted all barre chords (firstFret > 1) to use relative format where 1 = barre position
  - **Formula**: `relative_fret = absolute_fret - firstFret + 1`
  - **Example**: C major barre 3rd changed from `[x, 3, 5, 5, 5, 3]` → `[x, 1, 3, 3, 3, 1]`
- 🔍 **Added Validation System**: Created runtime checks to prevent future format regressions
  - `validateVoicingFormat()`: Detects absolute format in barre chords and logs detailed errors
  - `validateChordLibrary()`: Scans entire library on app startup (development only)
  - **Result**: Console shows "✅ All chord voicings use correct format!" on startup
- 📊 **Created Analysis Tools**: Built automated scripts for systematic data conversion
  - `convert-chord-formats.mjs`: Analyzes library and identifies format inconsistencies
  - `apply-chord-conversions.mjs`: Applies all 93 conversions programmatically
  - `chord-format-conversions.json`: Documents all conversion mappings
- ✅ **Architect Review**: All conversions mathematically correct, validation logic sound, edge cases handled
- 📝 **Documentation**: Updated `chord-transposition-analysis.md` with full technical analysis and resolution

### 2025-10-30: Simplified Replit Protection Templates
- 📁 **Restructured Documentation**: Consolidated 4 redundant files into 2 focused guides
  - `replit-ai-rules.md`: Concise DO/DON'T format for AI assistants (Cursor, etc.)
  - `replit-developer-guide.md`: Comprehensive guide for human developers
  - Removed redundancy while preserving all critical information
  - Integrated Vite proxy + Replit Auth troubleshooting into main guides
  - ~60% reduction in content with no information loss

### 2025-10-30: Fixed Cache Key Mismatch Bug
- 🐛 **Bug Fix**: Resolved chord generation displaying only 1 chord instead of all 4
  - Root cause: Client and server cache key formats were mismatched
  - Client used: `progression-d-phrygian-true-4-auto` (dashes, boolean string)
  - Server used: `progression:d:phrygian:tensions:4:auto` (colons, 'tensions' keyword)
  - **Solution**: Updated client `getCacheKey()` to match server format exactly
  - Added `clearAllProgressionCache()` debugging utility (accessible via `window.clearProgCache()`)
  - Improved cache cleanup to handle both old and new format entries
- ✅ **Result**: Chord progressions now properly display all generated chords

### 2025-10-30: Finalized 12-Theme Collection
- 🎨 **Sapphire Reverb**: Deep blues with electric cyan accents
  - Light mode: Icy white background with deep sapphire blue and electric cyan
  - Dark mode: Deep navy background with bright sapphire and vibrant cyan accents
  - Distinct from Oceanic Slate with more saturated, energetic blues
- 💕 **Cotton Candy**: Sweet baby pink palette (replaced Amber Resonance)
  - Light mode: Baby pink accents on nearly white background with light gray surfaces
  - Dark mode: Baby pink on black - vibrant baby pink text and accents on near-black background
  - Unique pink theme offering playful, fun aesthetic with cohesive baby pink tones
- 🎵 **12 Themes Total**: Now matching the 12 notes in music (C through B)
  - Rosewood & Ivory, Oceanic Slate, Forest Whisper, Midnight Indigo, Golden Hour
  - Crimson Noir (default), Mojave Dusk, Lavender Mist, Copper Bloom, Terminal Matrix
  - Sapphire Reverb, Cotton Candy

### 2025-10-29: UI Refinements
- 🖼️ **Pixel Art Accents**: Added subtle retro styling without overwhelming the design
  - Dotted border utilities (`.pixel-border`) for pixel grid aesthetics
  - Pixel corner decorations (`.pixel-corners`) for retro UI feel
  - Minimal flat button hover effects with subtle transforms
- ✨ **Refined Glassmorphic Header**: Cleaner, flatter design
  - Reduced blur from 12px to 6px for improved clarity
  - Increased background opacity (0.6 → 0.75) for better contrast
  - Simplified shadows (flat 1px shadow instead of layered)
- 🎯 **Default Theme**: Crimson Noir (index 5)
- 📏 **Minimalist Spacing**: Increased whitespace for cleaner layout
  - Hero section: `mb-12` → `mb-16` (more breathing room)
  - Main padding: `pt-4 pb-8` → `pt-6 pb-10` (desktop: `pt-6 pb-12` → `pt-8 pb-16`)
  - Controls section: `shadow-lg` → `shadow-sm` with `border-2` for cleaner definition
- 🔧 **Fixed Background**: Added `bg-background` class to main container to prevent transparency issues

### 2025-10-27: Optimized Scale Transposition Logic
- Fixed scale fingering transposition to choose the shortest path (e.g., B major now at fret 7 instead of fret 19)
- Algorithm now transposes down if upward transposition exceeds 6 semitones
- All scale patterns now appear in playable, ergonomic positions (typically frets 0-12)
- Example: C (fret 8) → B transposes by -1 semitone (down) instead of +11 semitones (up)

### 2025-10-27: New Progger Mascot! 🐸
- Replaced music note icon with Progger frog mascot in header (32x32 monochrome version)
- Added large Progger mascot to main hero section: guitar-playing frog sitting on a lily pad
- Reduced main title size from text-8xl to text-6xl for better visual hierarchy
- Responsive mascot sizing: 128px (mobile) → 160px (tablet) → 208px (desktop)
- Pixel art style with lily pad detail perfectly matches PROGGER's modern, tech-forward aesthetic
- Final design: Progger sitting on lily pad, holding guitar with sparkles - complete brand identity!

### 2025-10-27: Codebase Cleanup & Verification
- ✅ **Verified Advanced Music Theory**: Confirmed all functions actively used
  - `displayNote()`, `displayChordName()`, `getKeyAccidentalType()` used in VoicingsGrid, ScaleDiagram, ChordDetailView
  - Context-aware enharmonic display working correctly (F# in D major, Gb in Db major)
- ✅ **Verified Database Features**: All tables and CRUD operations working
  - `users`, `sessions`, `stash` tables properly implemented in shared/schema.ts
  - Full CRUD operations in server/storage.ts with Drizzle ORM
- 🗑️ **Removed Bloat**:
  - Deleted attached_assets/ folder (12 screenshot images)
  - Removed replit-protection-templates/ (documentation templates)
- 📝 **Updated Documentation**:
  - Replaced outdated README.md (removed AI Studio references)
  - Added comprehensive PROGGER-specific documentation
  - Updated metadata.json with PROGGER branding
- 🔧 **Preserved Utilities**: Kept all music theory functions for future features
  - `transposeNote()`, `getNoteAtFret()`, `areNotesEnharmonic()` retained for extensibility

### 2025-10-27: Chord Diagram Rendering Fix
- Fixed critical bug in VoicingDiagram component for barre chord rendering
- Root cause: Mixed data formats in chord library (relative finger positions vs absolute fret numbers)
- Detection logic: `minFret < firstFret` identifies relative format voicings
- Conversion formula: `absoluteFret = relativeFret + firstFret - 1`
- All chord types now render correctly (open, barre, maj7, 7ths, extended chords)

### 2025-10-26: Typography Update
- Changed application font from monospace to Space Grotesk (geometric sans-serif)
- Applied to all UI elements: header, titles, body text, controls
- Maintains JetBrains Mono for "PROGGER" logo only