# Chord & Scale Generator

## Overview
An AI-powered chord progression and scale generator for guitarists, built with React, TypeScript, and Vite. Uses Google's Gemini API to generate intelligent chord progressions with multiple guitar voicings and suggested scales for improvisation.

## Tech Stack
- **Frontend**: React 19.2 with TypeScript
- **Build Tool**: Vite 6.2
- **AI Service**: Google Gemini API (@google/genai)
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
│   └── geminiService.ts
├── utils/              # Utility functions
│   └── colorUtils.ts
├── App.tsx             # Main application component
├── constants.ts        # App constants (keys, modes, progressions)
├── types.ts            # TypeScript type definitions
└── vite.config.ts      # Vite configuration
```

## Features
- Generate chord progressions in any key and mode
- Multiple guitar voicings for each chord
- AI-suggested scales for improvisation
- Theme customization with light/dark mode
- Session-based caching for performance

## Setup & Configuration
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows proxy access)
- **Required Secret**: GEMINI_API_KEY

## Recent Changes
- **2025-10-24**: Initial Replit setup
  - Changed port from 3000 to 5000
  - Configured HMR for Replit's proxy environment
  - Added .gitignore for Node.js project
  - Set up workflow for development server

## Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (required for AI features)

## User Preferences
None documented yet.
