# PROGGER

## Overview
PROGGER is an AI-powered chord progression and scale generator for guitarists. It features a glassmorphic UI, Replit Auth integration, and leverages xAI's Grok API to generate intelligent chord progressions with multiple guitar voicings and suggested scales for improvisation. The project aims to provide a comprehensive tool for guitarists to explore and create musical ideas.

## User Preferences
None documented yet.

## System Architecture
The application is a full-stack project with a React frontend (Vite dev server on port 5000) and an Express.js backend (port 3001) with TypeScript. PostgreSQL is used as the database with Drizzle ORM. Authentication is handled via Replit Auth, supporting various login options.

**UI/UX Decisions:**
- A glassmorphic UI design is consistently applied, including a glassmorphic header with authentication elements.
- Theme customization features light/dark mode toggle and allows color scheme adjustments.
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