<!-- Copilot / AI agent instructions for SickleConnect -->
# SickleConnect — AI Coding Agent Instructions

This file contains concise, actionable guidance for AI coding agents working in this repository. Focus on concrete, discoverable patterns and exact locations of important behavior.

1) Big picture
- **Frontend (SPA)**: React + TypeScript app built with Vite located under `src/`. App entry: [src/main.tsx](src/main.tsx). Routes and feature pages live in [src/pages](src/pages).
- **Backend (API + WebSocket)**: Express + Node in `backend/`. Main entry is [backend/server.js](backend/server.js). It exposes REST APIs under `/api/*` and a WebSocket server used for real-time events.

2) Why key structural decisions matter
- WebSockets are first-class: `server.js` creates a `WebSocketServer` and shares a `Map` of clients with route modules via `setWebSocketClients(...)`. See [backend/routes/posts.js](backend/routes/posts.js) and [backend/routes/chat.js](backend/routes/chat.js) for usage patterns.
- The backend formats JSON responses using snake_case keys for list/stream payloads (e.g., `likes_count`, `created_at`). Frontend `src/lib/api.ts` expects those shapes—preserve them when changing endpoints.
- Auth is JWT-based. The middleware `authenticateToken` is in [backend/middleware/auth.js](backend/middleware/auth.js) and attaches `req.user` for protected routes.

3) Developer workflows & exact commands
- Backend (local dev):
  - `cd backend`
  - `npm install`
  - create `.env` (see README for variables like `MONGODB_URI`, `JWT_SECRET`, `PORT`)
  - `npm start` — starts Express + WebSocket server. The server has a multi-tier MongoDB fallback: environment `MONGODB_URI` → local MongoDB → in-memory `mongodb-memory-server` (see `startServer()` in [backend/server.js](backend/server.js)).
- Frontend (local dev):
  - `cd src` (project README instructs this path)
  - `npm install`
  - `npm run dev` — starts Vite dev server. App root: [src/App.tsx](src/App.tsx).
- Health & debug endpoints: `GET /health` implemented in [backend/server.js](backend/server.js) returns environment and timestamp.

4) Integration and environment notes
- API base used by frontend: `API_BASE` in [src/lib/api.ts](src/lib/api.ts) points to `https://sickleconnect.onrender.com/api`. For local development update this value or set up a proxy.
- WebSocket URL used in production is `wss://sickleconnect.onrender.com/ws`. During local dev, clients connect with `userId` as a query param so backend maps sockets to users (see connection parsing in [backend/server.js](backend/server.js)).
- CORS: backend restricts `origin` to the production frontend host by default. Update CORS in [backend/server.js](backend/server.js) or set `FRONTEND_URL` during local testing.

5) Project-specific conventions and patterns
- Response formatting: backend often maps Mongoose objects to API shapes with snake_case fields (`created_at`, `likes_count`) — do not change casing unless updating both backend and frontend.
- WebSocket events: canonical `type` values are defined across codebase and used in broadcasts: `new_post`, `post_liked`, `new_comment`, `post_deleted`, `new_message`. Look for these in [src/lib/constants.ts](src/lib/constants.ts).
- Auth storage: frontend stores JWT in localStorage under the `token` key (see [src/lib/constants.ts](src/lib/constants.ts) and [src/lib/api.ts](src/lib/api.ts)). API client automatically adds `Authorization: Bearer <token>`.
- Uploads: `upload.image` uses FormData and must NOT set `Content-Type` header manually (see `upload.image` in [src/lib/api.ts](src/lib/api.ts)).

6) Common edit patterns an agent may be asked to perform
- Add a new WebSocket broadcast: update the appropriate route (e.g., `posts.js`) and use `broadcastToAll` or `broadcastToUsers` helpers. Ensure event `type` matches constants in [src/lib/constants.ts](src/lib/constants.ts).
- Add protected API: use `authenticateToken` middleware to get `req.user`; return sanitized user objects (models have `toJSON` that strips password).
- Change API shapes: coordinate paired changes in backend route formatting and frontend callers in `src/lib/api.ts` and UI components that destructure those fields (e.g., `PostCard.tsx`, `PostsFeed.tsx`).

7) Files to inspect first for most changes
- Backend entry: [backend/server.js](backend/server.js)
- Auth middleware: [backend/middleware/auth.js](backend/middleware/auth.js)
- Post/chat routes (WebSocket behavior): [backend/routes/posts.js](backend/routes/posts.js), [backend/routes/chat.js](backend/routes/chat.js)
- API client & endpoints: [src/lib/api.ts](src/lib/api.ts), [src/lib/constants.ts](src/lib/constants.ts)
- App wiring and providers: [src/App.tsx](src/App.tsx)
- README (project-level setup notes): [README.md](README.md)

8) Safety and testing tips for agents
- Do not hardcode production URLs; prefer editing `API_BASE` only when intentionally switching environments.
- When changing auth flows or token names, update both `authenticateToken` and the frontend `localStorage` usage.
- Run backend health check after server changes: `GET /health` and confirm WebSocket connect behavior by opening a socket to the dev server and verifying `connection_established` message.

9) What I could not infer automatically
- CI, test suites, and release processes are not present in this repo. If you need to add tests or CI, ask for preferred frameworks and run commands before creating pipeline files.

If any section is unclear or you want an expanded checklist (tests, CI, or release steps), tell me which area to expand. Ready to commit this file or iterate on wording.
