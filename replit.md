# PROGGER

## Overview
PROGGER is an AI-powered chord progression and scale generator for guitarists. It features a glassmorphic UI, Replit Auth integration, and leverages xAI's Grok API to generate intelligent chord progressions with multiple guitar voicings and suggested scales for improvisation. The project aims to provide a comprehensive tool for guitarists to explore and create musical ideas, offering a full-stack application with a modern, responsive design and robust musical theory integration.

## User Preferences
None documented yet.

## System Architecture
The application is a full-stack project with a React frontend (Vite dev server on port 5000) and an Express.js backend (port 3001) with TypeScript. PostgreSQL is used as the database with Drizzle ORM. Authentication is handled via Replit Auth, supporting various login options.

**UI/UX Decisions:**
- A consistent glassmorphic UI design is applied across the application, with a light/dark mode and 12 color schemes.
- The primary font is Space Grotesk, with JetBrains Mono for the "PROGGER" logo.
- The UI is designed for mobile responsiveness, incorporating pixel art accents and a Progger frog mascot.
- BYO Chord Selector redesigned with a horizontal button array and animations.
- Control layout reorganized for clearer visual hierarchy.
- Portal-based dropdowns implemented to fix clipping issues.

**Technical Implementations & Feature Specifications:**
- **AI Chord Generation**: Uses xAI's Grok API (`grok-4-1-fast-non-reasoning` model) for chord progressions and scale suggestions.
- **Hybrid AI + Client-Side Approach**: AI provides creative input, complemented by extensive client-side libraries (`chordLibrary.ts`, `scaleLibrary.ts`) for detailed guitar voicings and scale fingerings.
- **Chord Voicings**: Comprehensive library of 200+ pre-defined guitar chord voicings with automatic transposition and fallback to E-form barre chord templates.
- **Scale Suggestions**: AI-suggested scales are enriched with multiple fingering patterns from the client-side library, transposed for ergonomic playability (frets 0-12).
- **Stash Feature**: Allows users to save and retrieve chord progressions, persisted in PostgreSQL.
- **Authentication**: Secure user authentication via Replit Auth, integrated with PostgreSQL for user and session storage.
- **Session-Based Caching**: PostgreSQL used for session storage to optimize performance.
- **Context-Aware Music Theory**: Enharmonic notes and chord names displayed correctly based on the selected key.
- **Interval Arrows**: Displays musical intervals between chords in a progression.
- **Strict Format Enforcement**: AI prompts specify exact format requirements for scales to ensure data consistency.

**System Design Choices:**
- Frontend and backend communicate via a Vite proxy.
- `TanStack React Query` is used for state management, and `Tailwind CSS` for styling.
- Adherence to Replit protection templates for development vs. production environments.
- Rate limiting implemented for API protection (50 requests/15 mins/IP for AI endpoints).
- Helmet.js for comprehensive HTTP security headers (CSP, HSTS, XSS protection).
- Request size limits (10MB) for JSON and URL-encoded bodies.
- CSRF protection using session-based tokens via `csrf-sync`.
- Input sanitization with HTML entity escaping for user-provided text fields.
- Robust error handling for Redis with graceful fallback to in-memory caching.
- Server startup protection with `SESSION_SECRET` validation.

## External Dependencies
- **Authentication**: Replit Auth
- **AI Service**: xAI Grok API (accessed via OpenAI SDK)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM