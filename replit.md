# Chord & Scale Generator

## Overview
An AI-powered chord progression and scale generator for guitarists, built with React, TypeScript, Express, and PostgreSQL. Features a beautiful glassmorphic UI with Replit Auth integration for user authentication. Uses xAI's Grok API to generate intelligent chord progressions with multiple guitar voicings and suggested scales for improvisation.

## Tech Stack
- **Frontend**: React 19.2 with TypeScript
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (Google, X/Twitter, GitHub, Apple, email/password)
- **Build Tool**: Vite 6.2
- **AI Service**: xAI Grok API (via OpenAI SDK)
- **Styling**: Tailwind CSS (via inline styles and CSS variables)
- **State Management**: TanStack React Query

## Project Structure
```
.
├── client/             # Frontend React application
│   ├── components/     # React components
│   │   ├── ChordDetailView.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── Controls.tsx
│   │   ├── CustomSelect.tsx
│   │   ├── GlassmorphicHeader.tsx  # Glassmorphic header with auth UI
│   │   ├── ScaleDiagram.tsx
│   │   ├── ThemeCycler.tsx
│   │   ├── ThemeSelector.tsx
│   │   ├── VoicingDiagram.tsx
│   │   └── VoicingsGrid.tsx
│   ├── hooks/          # React hooks
│   │   └── useAuth.ts  # Authentication hook with graceful 401 handling
│   ├── lib/            # Client libraries
│   │   └── queryClient.ts  # TanStack Query configuration
│   ├── services/       # API integration
│   │   └── xaiService.ts   # AI service with client-side enrichment
│   ├── utils/          # Utility functions and data libraries
│   │   ├── chordLibrary.ts # Comprehensive chord voicings with transposition
│   │   ├── scaleLibrary.ts # Comprehensive scale patterns with transposition
│   │   └── colorUtils.ts
│   ├── App.tsx         # Main application component
│   ├── constants.ts    # App constants (keys, modes, progressions)
│   └── types.ts        # TypeScript type definitions
├── server/             # Backend Express application
│   ├── db.ts           # Database connection (Drizzle)
│   ├── index.ts        # Express server entry point
│   ├── replitAuth.ts   # Replit Auth passport strategy setup
│   ├── routes.ts       # API routes (/api/auth/user, /api/login, etc.)
│   └── storage.ts      # Database operations (user CRUD)
├── shared/             # Shared types and schema
│   └── schema.ts       # Drizzle ORM schema (users, sessions)
└── vite.config.ts      # Vite configuration with API proxy
```

## Features
- **User Authentication**: Replit Auth with multiple login options (Google, X, GitHub, Apple, email/password)
- **AI Chord Generation**: Generate chord progressions in any key and mode using Grok API
- **Multiple Voicings**: 200+ guitar chord voicings for each chord type (client-side library)
- **Scale Suggestions**: AI-suggested scales for improvisation with multiple fingering patterns (client-side library)
- **Automatic Transposition**: Transpose voicings and fingerings to any root note
- **Theme Customization**: Beautiful glassmorphic UI with light/dark mode toggle
- **Session-Based Caching**: Performance optimization with PostgreSQL session storage

## Architecture
- **Full-Stack Application**: Express backend (port 3001) proxied through Vite dev server (port 5000)
- **Hybrid AI + Client-Side Approach**: AI generates creative chord progressions and scale suggestions (names only), while comprehensive client-side libraries provide all voicings and fingerings
- **Pre-Defined Voicings**: Direct lookup system with 200+ pre-defined chord voicings for accurate chord diagrams
- **Fallback System**: Generic E-form barre chord templates for extended/uncommon chord qualities using ROOT_TO_FRET_FROM_E offset mapping
- **Data Libraries**: 
  - `chordLibrary.ts`: 200+ chord voicings across 12 chromatic roots × 20+ chord qualities (major, minor, 7ths, extended, altered, suspended, diminished, augmented)
  - `scaleLibrary.ts`: 15+ scales with multiple fingering patterns and intelligent transposition engine (modes, pentatonic, blues, harmonic/melodic minor, exotic scales)

## Setup & Configuration
- **Frontend Port**: 5000 (Vite dev server)
- **Backend Port**: 3001 (Express API server)
- **Host**: 0.0.0.0 (allows proxy access)
- **Required Secrets**: 
  - `XAI_API_KEY`: xAI Grok API key for chord generation
  - `SESSION_SECRET`: Express session encryption key (auto-provided by Replit)
  - `DATABASE_URL`: PostgreSQL connection string (auto-provided by Replit)
  - `REPL_ID`, `REPLIT_DOMAINS`: Replit environment variables (auto-provided)
- **AI Model**: grok-4-fast-reasoning with max_tokens: 1500

## Recent Changes
- **2025-10-26**: Fixed "strange chord diagrams" bug
  - Completely redesigned chord library to use pre-defined voicings instead of algorithmic transposition
  - Added 200+ accurate voicings for 12 chromatic roots × 20+ chord qualities
  - Implemented quality-specific generic barre shapes for extended chords (maj9, min9, aug, dim7, etc.)
  - Fixed offset calculation: uses ROOT_TO_FRET_FROM_E mapping for E-form barre chord positioning
  - Special handling for E-root chords: uses 12th fret (octave up) instead of impossible fret 0
  - All enharmonic equivalents (F#=Gb, Db=C#, etc.) now produce identical diagrams
  - Architect-verified: All chord voicings are now musically accurate
- **2025-10-25**: Mobile-responsive scale diagrams
  - Added responsive fret count: 12 frets on mobile (<768px), 17 frets on desktop
  - Implemented dynamic window resize detection for seamless mobile/desktop transitions
  - Reduced minimum width from 800px to 600px on mobile for better small-screen fit
  - Responsive font sizes: 10px on mobile, 12px (text-xs) on desktop
  - Smaller note dots on mobile: 6x6px vs 7x7px on desktop
  - Responsive spacing: reduced padding and margins on mobile for better space utilization
  - Adaptive grid columns: 1.5rem string labels on mobile, 2rem on desktop
  - Filter fret inlays to only show those within visible fret range
  - Horizontal scroll support for diagrams that exceed viewport width
- **2025-10-25**: Scale diagram visual enhancements
  - Implemented theme-based fretboard gradient using CSS variables (3-5% opacity)
  - Added elegant fade effect with CSS masks to blend fretboard into card background
  - Integrated fretboard seamlessly with display card using negative margins
  - Created unified single-object appearance for fretboard and card
- **2025-10-25**: ScaleDiagram performance optimizations
  - Wrapped ScaleDiagram, FretInlay, NoteDot, and ViewToggle components in React.memo to prevent unnecessary re-renders
  - Added useMemo hooks for expensive calculations (rootNoteValue, scaleNoteValues, fingeringLookup)
  - Converted fingering arrays to Sets for O(1) lookup performance (replaced .includes() with .has())
  - Improved rendering efficiency for complex scale diagrams with many SVG elements
  - Safe handling of undefined fingering data with nullish coalescing (`frets ?? []`)
- **2025-10-25**: Chord diagram visual improvements
  - Reduced note dot size from 9px to 7px for cleaner appearance
  - Centered fret numbers between card border and fretboard for better visual balance
  - Added 18px left margin to prevent overlap between fret numbers and note positions
- **2025-10-25**: Scale diagram rendering fixes
  - Removed duplicate fret 0 column from scale diagrams
  - Correctly display frets 1-17 with open string notes in string label column
  - Simplified tooltips by removing redundant "Fret" label
- **2025-10-25**: Full-stack conversion with Replit Auth integration
  - Converted from frontend-only to full-stack architecture with Express backend (port 3001) and Vite frontend (port 5000)
  - Integrated Replit Auth for user authentication with PostgreSQL database
  - Created glassmorphic header component matching harborpoetry.com design aesthetic
  - Implemented authentication flow with `/api/login`, `/api/callback`, `/api/logout`, and `/api/auth/user` endpoints
  - Fixed critical 401 handling bug in useAuth hook to gracefully handle unauthenticated state instead of throwing errors
  - Set up database schema with users and sessions tables using Drizzle ORM
  - Configured Vite proxy to forward `/api/*` requests to Express backend
  - Updated all component imports to use `@/` alias for better code organization
  - All environment variables (SESSION_SECRET, DATABASE_URL, REPL_ID, REPLIT_DOMAINS) auto-configured by Replit
- **2025-10-25**: Fixed scale diagram transposition bug
  - Corrected `detectFingeringBaseRoot` to use low E string (fingering[0]) instead of high E string
  - Scale patterns now correctly anchor from the 6th string, aligning with standard guitar pedagogy
  - All scale fingerings now transpose to correct fret positions for any requested root note
- **2025-10-25**: Major architectural refactoring to client-side data libraries
  - Created comprehensive `chordLibrary.ts` with 200+ voicings for all chord types
  - Created comprehensive `scaleLibrary.ts` with 15+ scales and multiple fingering patterns
  - Implemented intelligent transposition engine:
    - Base root detection from voicing position strings and fret positions
    - Normalized semitone calculation using `((target - base + 12) % 12)` to avoid negative offsets
    - Proper handling of open chords (firstFret = 0) and barre chords
    - Automatic transposition of all voicings and fingerings to requested root
  - Simplified AI prompt to only request chord names, functions, and scale suggestions (reduced max_tokens from 4000 to 1000)
  - AI service enriches responses with client-side voicings and fingerings
  - Benefits: Faster responses, lower API costs, consistent quality, offline capability for guitar data
- **2025-10-24**: Migration from Google Gemini to xAI Grok
  - Replaced @google/genai with openai npm package
  - Updated service to use xAI's API endpoint (https://api.x.ai/v1)
  - Switched to grok-4-fast-reasoning model (updated from deprecated grok-beta)
  - Fixed module initialization issue with lazy API client creation
  - Removed import map from index.html (Vite handles bundling)
  - Updated environment variables to use XAI_API_KEY
  - Added server.allowedHosts: true to vite.config.ts for Replit proxy compatibility
- **2025-10-24**: Initial Replit setup
  - Changed port from 3000 to 5000
  - Added .gitignore for Node.js project
  - Set up workflow for development server

## Environment Variables
- `XAI_API_KEY`: xAI API key (required for AI features)

## User Preferences
None documented yet.
