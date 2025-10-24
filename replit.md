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
- **Required Secret**: XAI_API_KEY
- **AI Model**: grok-beta (131K token context window)

## Recent Changes
- **2025-10-24**: Migration from Google Gemini to xAI Grok
  - Replaced @google/genai with openai npm package
  - Updated service to use xAI's API endpoint (https://api.x.ai/v1)
  - Switched to grok-beta model for chord generation
  - Fixed module initialization issue with lazy API client creation
  - Removed import map from index.html (Vite handles bundling)
  - Updated environment variables to use XAI_API_KEY
- **2025-10-24**: Initial Replit setup
  - Changed port from 3000 to 5000
  - Added .gitignore for Node.js project
  - Set up workflow for development server

## Environment Variables
- `XAI_API_KEY`: xAI API key (required for AI features)

## User Preferences
None documented yet.
