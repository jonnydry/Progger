# Chord & Scale Generator

## Overview
An AI-powered chord progression and scale generator for guitarists, built with React, TypeScript, and Vite. Uses xAI's Grok API to generate intelligent chord progressions with multiple guitar voicings and suggested scales for improvisation.

## Tech Stack
- **Frontend**: React 19.2 with TypeScript
- **Build Tool**: Vite 6.2
- **AI Service**: xAI Grok API (via OpenAI SDK)
- **Styling**: Tailwind CSS (via inline styles and CSS variables)

## Project Structure
```
.
├── components/          # React components
│   ├── ChordDetailView.tsx
│   ├── ColorPicker.tsx
│   ├── Controls.tsx
│   ├── CustomSelect.tsx
│   ├── ScaleDiagram.tsx
│   ├── ThemeCycler.tsx
│   ├── ThemeSelector.tsx
│   ├── VoicingDiagram.tsx
│   └── VoicingsGrid.tsx
├── services/           # API integration
│   └── xaiService.ts   # AI service with client-side enrichment
├── utils/              # Utility functions and data libraries
│   ├── chordLibrary.ts # Comprehensive chord voicings with transposition
│   ├── scaleLibrary.ts # Comprehensive scale patterns with transposition
│   └── colorUtils.ts
├── App.tsx             # Main application component
├── constants.ts        # App constants (keys, modes, progressions)
├── types.ts            # TypeScript type definitions
└── vite.config.ts      # Vite configuration
```

## Features
- Generate chord progressions in any key and mode
- Multiple guitar voicings for each chord (client-side library)
- AI-suggested scales for improvisation (client-side library)
- Automatic transposition to any root note
- Theme customization with light/dark mode
- Session-based caching for performance

## Architecture
- **Hybrid AI + Client-Side Approach**: AI generates creative chord progressions and scale suggestions (names only), while comprehensive client-side libraries provide all voicings and fingerings
- **Transposition Engine**: Automatic transposition of chord voicings and scale fingerings based on detected base roots using normalized semitone calculation
- **Data Libraries**: 
  - `chordLibrary.ts`: 200+ chord voicings across all types (major, minor, 7ths, extended, altered, suspended, diminished, augmented)
  - `scaleLibrary.ts`: 15+ scales with multiple fingering patterns (modes, pentatonic, blues, harmonic/melodic minor, exotic scales)

## Setup & Configuration
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows proxy access)
- **Required Secret**: XAI_API_KEY
- **AI Model**: grok-4-fast-reasoning

## Recent Changes
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
