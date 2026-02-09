# PROGGER

**AI-Powered Chord Progression & Scale Generator for Guitarists**

PROGGER uses xAI's Grok to generate intelligent chord progressions with multiple guitar voicings, scale suggestions for improvisation, and context-aware music theory (enharmonic note display based on key signatures).

## Features

- 🎸 **AI Chord Generation**: Powered by Grok-4-fast-reasoning
- 🎵 **Guitar-Specific Voicings**: 200+ pre-defined chord shapes with automatic transposition
- 🎼 **Scale Suggestions**: Multiple fingering patterns for improvisation
- 💾 **Stash Feature**: Save and retrieve your favorite progressions
- 🔐 **Replit Auth**: Secure user authentication
- 🎨 **Glassmorphic UI**: Modern, clean design with Space Grotesk font
- 🎯 **Context-Aware Music Theory**: Displays F# in D major, Gb in Db major, etc.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + TanStack Query + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Replit-hosted) + Drizzle ORM
- **AI**: xAI Grok API (via OpenAI SDK)
- **Auth**: Replit Auth

## Run Locally

**Prerequisites:** Node.js 20+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file or use Replit Secrets:
   ```
   XAI_API_KEY=your_xai_api_key_here
   DATABASE_URL=your_postgres_connection_string
   SESSION_SECRET=your_session_secret_here
   REPLIT_DOMAINS=your-replit-domain.replit.dev
   REPL_ID=your_replit_app_id
   ```
   Notes:
   - `XAI_API_KEY` is expected to come from Replit Secrets/integration in production.
   - If Replit auth variables are missing, the server starts with authentication disabled and auth-protected routes return `503`.

3. **Push database schema:**
   ```bash
   npm run db:push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the app:**
   Open `http://localhost:5000` (or your Replit webview)

## Project Structure

```
├── client/              # React frontend
│   ├── components/      # UI components (VoicingsGrid, ScaleDiagram, etc.)
│   ├── utils/           # Music theory logic (chordLibrary, scaleLibrary, musicTheory)
│   └── App.tsx          # Main app component
├── server/              # Express backend
│   ├── routes.ts        # API routes
│   ├── xaiService.ts    # Grok API integration
│   ├── storage.ts       # Database operations
│   ├── replitAuth.ts    # Authentication setup
│   └── db.ts            # Database connection
├── shared/              # Shared types and schema
│   └── schema.ts        # Drizzle database schema
└── vite.config.ts       # Vite configuration with proxy
```

## Key Features Explained

### Advanced Music Theory
- **Enharmonic note handling**: Correctly displays notes based on key signature
- **Context-aware chord names**: Shows F# in D major, Gb in Db major
- **Key signature detection**: Automatically determines sharp/flat preference

### Hybrid AI + Client-Side Approach
- AI provides creative chord progression suggestions
- Client-side libraries (`chordLibrary.ts`, `scaleLibrary.ts`) provide detailed guitar voicings
- Reduces API costs while maintaining high-quality musical data

### Database Schema
- **users**: User profiles and authentication
- **sessions**: Session management (PostgreSQL-backed)
- **stash**: Saved chord progressions with full progression data

## Scripts

- `npm run dev` - Run development server (frontend on :5000, backend on :3001)
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Environment Variables

- `XAI_API_KEY` - Your xAI Grok API key
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)
- `SESSION_SECRET` - Session encryption key for auth sessions
- `REPL_ID`, `REPLIT_DOMAINS` - Replit Auth identifiers/domains (auto-provided in Replit)

## Production Deployment

See `replit-production-guide.md` for deployment instructions, including critical Vite proxy configuration for Replit Auth.

---

Built with ❤️ using Replit, xAI Grok, and modern web technologies.
