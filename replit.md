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