# SickleConnect Community Platform

A community platform for individuals living with sickle cell disease, their families, and healthcare providers. Built with React, Node.js, MongoDB, and real-time WebSocket communication.

**Live:** [sickle-connect.vercel.app](https://sickle-connect.vercel.app) | **API:** [sickleconnect.onrender.com](https://sickleconnect.onrender.com)

---

## Pages Built — 9 Total

This application consists of **9 fully built pages**, each with responsive design, dark/light theme support, and Framer Motion animations.

### 1. Home Page (`/`)
**File:** `src/pages/Home.tsx`
The public landing page and first thing visitors see. Features an animated hero section with gradient text ("Connect. Share. Support."), a floating pill badge, and blurred background orbs. Below the fold: a stats counter bar (community members, posts shared, medical experts, countries), three hover-lifting feature cards (Community Support, Medical Expertise, Safe Space) with staggered entrance animations, and a call-to-action section. Uses the shared Navbar and Footer.

### 2. Auth Page (`/auth`)
**File:** `src/pages/Auth.tsx` + `src/features/auth/components/AuthForm.tsx`
Handles both login and registration in a single animated card that toggles between forms. Registration collects full name, email, password, role (Patient or Doctor), genotype (for patients — SS, SC, SE, CC, AS, AC), and optional bio. Uses React Hook Form with Zod schema validation, password visibility toggle, and role-conditional genotype selector. Redirects to `/community` on success. Has a back-to-home link and animated branding.

### 3. Community Feed Page (`/community`)
**File:** `src/pages/Index.tsx`
The main authenticated feed. Protected — redirects to `/auth` if not logged in. Renders the `CreatePost` form (with user avatar, character counter, and post button) and `PostsFeed` below it. Posts load paginated from the API with a "Load More" button. Each `PostCard` shows the author's name, role badge, genotype, timestamp, content, and action buttons (like with heart animation, comment, share, delete for own posts). The comment modal slides in with a scale animation. Real-time updates via WebSocket: new posts appear at the top, like counts update live, deleted posts fade out.

### 4. Profile Page (`/profile`)
**File:** `src/pages/Profile.tsx`
Authenticated user's personal profile. Shows a gradient header banner, large avatar with initial, name, role badge, genotype badge, and bio. An "Edit" button toggles inline editing for name, bio, and genotype (for patients). Displays three engagement stats: total posts, total likes received, and total comments received. Below the header, lists all of the user's posts using the same `PostCard` component. Empty state shows a prompt to start posting.

### 5. Chat Page (`/chat`)
**File:** `src/pages/Chat.tsx`
Real-time one-on-one messaging. Protected — redirects to `/auth` if not logged in. Three-column layout on desktop: conversation list (left), message thread (center+right). Conversations show the other user's avatar, name, last message preview, timestamp, and unread badge. Messages render as chat bubbles (primary color for own, muted for others) with rounded corners and timestamps. Input field with Enter-to-send. Below the chat grid, a "Community Members" section shows all users with online/offline status indicators — clicking a user starts a new conversation. WebSocket delivers incoming messages in real-time with toast notifications.

### 6. Search Page (`/search`)
**File:** `src/pages/Search.tsx`
Authenticated search across the community. Protected — redirects to `/auth` if not logged in. Search bar with icon and submit button. Results display in a tabbed view (All, Posts, Users) with live count badges on each tab. Post results show content, likes, and comment counts. User results show avatar initial, name, role badge, genotype, and bio excerpt. Empty states show contextual icons and messages. Animated result cards with staggered entrance. Connects to the `/api/search` backend endpoint.

### 7. About Page (`/about`)
**File:** `src/pages/About.tsx`
Public informational page about the platform's mission. Opens with a hero section, then a two-column mission layout: left side has the mission statement and three value items (Community First, Evidence-Based Support, Privacy & Safety) with staggered icon animations; right side has two hover-lifting cards for Vision and Community Impact. Below that, a "What We Offer" section with three gradient cards (Peer Support, Professional Guidance, Resource Sharing) in a staggered grid. Ends with a CTA to join. Uses shared Navbar and Footer.

### 8. Donate Page (`/donate`)
**File:** `src/pages/Donate.tsx`
Public donation page. Clean, focused design — no misleading form. Hero section with a rose-themed gradient, animated heart icon, headline, description, and a single prominent "Donate on GoFundMe" button that opens the GoFundMe page in a new tab. Below, four impact cards show what different donation amounts support ($10 hosting, $25 outreach, $50 medical resources, $100 new features), each with its own icon and color. A "Why Your Support Matters" section at the bottom provides context. Uses shared Navbar and Footer.

### 9. 404 Not Found Page (`*`)
**File:** `src/pages/NotFound.tsx`
Catch-all for invalid routes. Centered layout with a spring-animated "404" in large faded text, a "Page Not Found" heading, a descriptive message, and a "Back to Home" button. Minimal and clean, using the app's theme colors.

---

## Shared Components Used Across Pages

| Component | File | Used On |
|---|---|---|
| Navbar | `src/shared/components/Navbar.tsx` | All 9 pages (sticky, backdrop-blur, active route indicator, mobile drawer) |
| Footer | `src/shared/components/Footer.tsx` | Home, About, Donate |
| PageWrapper | `src/shared/components/PageWrapper.tsx` | All 9 pages (animated entrance/exit transitions) |
| ThemeToggle | `src/shared/components/ThemeToggle.tsx` | Via Navbar on all pages |
| NotificationCenter | `src/shared/components/NotificationCenter.tsx` | Via Navbar (authenticated pages) |
| ErrorBoundary | `src/shared/components/ErrorBoundary.tsx` | Wraps entire app in App.tsx |
| PostCard | `src/components/PostCard.tsx` | Community, Profile |
| PostsFeed | `src/components/PostsFeed.tsx` | Community |
| CreatePost | `src/components/CreatePost.tsx` | Community |
| CommentSection | `src/components/CommentSection.tsx` | Community, Profile (via PostCard) |
| UserBadge | `src/components/UserBadge.tsx` | Community, Search, Profile (via PostCard) |

---

## Features

### Authentication & Profiles
- Email/password registration and login with JWT sessions (7-day expiry)
- Role-based system: **Patient** (with sickle cell genotype tracking) and **Doctor**
- Editable user profiles with bio, genotype, and avatar initials
- Profile page showing post history and engagement stats (posts, likes, comments)
- Rate-limited auth endpoints (10 attempts per 15 minutes) to prevent brute-force

### Community Feed
- Create, like, comment on, share, and delete posts
- Real-time updates via WebSocket — new posts, likes, comments, and deletions broadcast instantly
- Paginated post loading with "Load More" support
- Animated post cards with staggered entrance transitions
- 1000-character post limit and 500-character comment limit with live counters

### Real-time Chat
- One-on-one direct messaging between community members
- Chat history with message timestamps
- Online/offline status indicators via WebSocket presence
- Unread message badges and toast notifications for incoming messages
- Automatic message cleanup (messages older than 24 hours are pruned hourly)

### Search
- Full-text search across posts (by content) and users (by name)
- Tabbed results view: All, Posts, Users — with live result counts
- Authenticated endpoint to prevent unauthenticated scraping

### Donations
- Clean donation CTA directing to GoFundMe
- Impact breakdown showing what each donation amount supports

### UI/UX
- Fully responsive design with mobile slide-out navigation drawer
- Dark/light theme toggle with system preference detection
- Animated page transitions using Framer Motion (`AnimatePresence`)
- Shared sticky Navbar with active route indicator and backdrop blur
- Hover-lift cards, staggered list animations, spring-based interactions
- Animated comment modal with click-outside-to-close
- Error boundary with recovery UI
- Real-time notification center with badge counts

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework with hooks and context |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible component library (Radix primitives) |
| Framer Motion | Page transitions, stagger animations, gesture interactions |
| React Query | Server state management and caching |
| React Router v6 | Client-side routing with animated transitions |
| React Hook Form + Zod | Form handling with schema validation |
| date-fns | Date formatting |
| DOMPurify | HTML sanitization |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | API server (ESM modules) |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing (salt rounds: 10) |
| ws | WebSocket server for real-time features |
| express-rate-limit | Brute-force protection on auth routes |
| cors | Cross-origin request handling |

---

## Project Structure

```
SickleConnect/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema (email, password, role, genotype)
│   │   ├── Post.js              # Post schema with embedded comments
│   │   └── Chat.js              # Chat schema with messages array
│   ├── routes/
│   │   ├── auth.js              # Register, login, profile (rate-limited)
│   │   ├── posts.js             # CRUD posts, likes, comments (paginated)
│   │   ├── chat.js              # Chat conversations, messages, online users
│   │   └── search.js            # Full-text search for posts and users
│   ├── server.js                # Express + WebSocket server entry point
│   └── .env                     # Environment variables (gitignored)
├── src/
│   ├── components/
│   │   ├── PostsFeed.tsx         # Animated post feed with load-more
│   │   ├── PostCard.tsx          # Individual post with like/comment/share
│   │   ├── CreatePost.tsx        # Post creation form
│   │   ├── CommentSection.tsx    # Animated comment modal
│   │   ├── UserBadge.tsx         # Role/genotype badge display
│   │   └── ui/                   # shadcn/ui primitives
│   ├── features/
│   │   └── auth/components/
│   │       └── AuthForm.tsx      # Login/register form with validation
│   ├── hooks/
│   │   ├── useAuth.tsx           # Auth context provider (login, register, profile)
│   │   └── usePosts.tsx          # Posts state with pagination and WebSocket sync
│   ├── lib/
│   │   ├── api.ts                # API client (typed fetch wrapper)
│   │   ├── config.ts             # Centralized API/WS base URLs from env vars
│   │   ├── constants.ts          # Routes, endpoints, genotypes, WS events
│   │   ├── animations.ts         # Framer Motion animation presets
│   │   ├── validations.ts        # Zod schemas for forms
│   │   └── utils.ts              # Helpers (debounce, sanitize, format dates)
│   ├── pages/                    # ← 9 pages total
│   │   ├── Home.tsx              # Landing page with hero and feature cards
│   │   ├── Index.tsx             # Community feed (auth-protected)
│   │   ├── Auth.tsx              # Login/register page
│   │   ├── Profile.tsx           # User profile with stats and post history
│   │   ├── Chat.tsx              # Real-time chat (auth-protected)
│   │   ├── Search.tsx            # Search posts and users (auth-protected)
│   │   ├── About.tsx             # Mission, vision, offerings
│   │   ├── Donate.tsx            # GoFundMe donation CTA
│   │   └── NotFound.tsx          # Animated 404 page
│   └── shared/
│       ├── components/
│       │   ├── Navbar.tsx         # Shared sticky navbar with mobile drawer
│       │   ├── Footer.tsx         # Shared footer
│       │   ├── PageWrapper.tsx    # Animated page entrance/exit wrapper
│       │   ├── ThemeToggle.tsx    # Dark/light mode toggle
│       │   ├── HamburgerMenu.tsx  # Legacy mobile menu (replaced by Navbar)
│       │   ├── NotificationCenter.tsx  # WebSocket notification bell
│       │   ├── ErrorBoundary.tsx  # React error boundary with recovery
│       │   └── LoadingSpinner.tsx # Reusable spinner
│       └── hooks/
│           ├── useWebSocket.tsx   # WebSocket connection management
│           └── useTheme.tsx       # Theme state management
├── .env.example                  # Frontend env var template
├── .gitignore                    # Includes backend/.env
└── package.json
```

---

## Route Map

| # | Route | Page | Auth Required | File |
|---|---|---|---|---|
| 1 | `/` | Home | No | `src/pages/Home.tsx` |
| 2 | `/auth` | Login / Register | No | `src/pages/Auth.tsx` |
| 3 | `/community` | Community Feed | Yes | `src/pages/Index.tsx` |
| 4 | `/profile` | User Profile | Yes | `src/pages/Profile.tsx` |
| 5 | `/chat` | Real-time Chat | Yes | `src/pages/Chat.tsx` |
| 6 | `/search` | Search | Yes | `src/pages/Search.tsx` |
| 7 | `/about` | About | No | `src/pages/About.tsx` |
| 8 | `/donate` | Donate | No | `src/pages/Donate.tsx` |
| 9 | `*` | 404 Not Found | No | `src/pages/NotFound.tsx` |

---

## API Endpoints

### Authentication (`/api/auth`) — rate-limited: 10 req / 15 min
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Create account (email, password, fullName, role, genotype) |
| POST | `/login` | No | Login and receive JWT token |
| GET | `/me` | Yes | Get current user profile |
| PUT | `/profile` | Yes | Update profile (fullName, bio, genotype — role changes blocked) |
| POST | `/logout` | No | Client-side logout acknowledgment |

### Posts (`/api/posts`) — all authenticated
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get paginated posts (`?page=1&limit=10`), returns `{ posts, pagination }` |
| POST | `/` | Create a post (max 1000 chars) |
| POST | `/:id/like` | Toggle like/unlike |
| GET | `/:id/comments` | Get comments for a post |
| POST | `/:id/comments` | Add comment (max 500 chars) |
| DELETE | `/:id` | Delete own post |

### Chat (`/api/chat`) — all authenticated
| Method | Endpoint | Description |
|---|---|---|
| GET | `/chats` | Get all conversations for current user |
| GET | `/chat/:userId` | Get or create chat with another user |
| POST | `/chat/:chatId/message` | Send a message (max 1000 chars) |
| PUT | `/chat/:chatId/read` | Mark messages as read |
| GET | `/users/online` | List all users with online status |

### Search (`/api/search`) — authenticated
| Method | Endpoint | Description |
|---|---|---|
| GET | `/?q=term&type=all` | Search posts and users (`type`: all, posts, users) |

### WebSocket Events
| Event | Direction | Description |
|---|---|---|
| `connection_established` | Server -> Client | Sent on successful WS connection |
| `new_post` | Server -> All | New post created |
| `post_liked` | Server -> All | Post liked/unliked with updated count |
| `new_comment` | Server -> All | Comment added to a post |
| `post_deleted` | Server -> All | Post removed |
| `new_message` | Server -> Participants | Chat message sent to chat participants |

---

## Setup

### Prerequisites
- Node.js v16+
- MongoDB Atlas account or local MongoDB installation
- Git

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see `backend/env_template.txt` for reference):
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/sickleconnect?retryWrites=true&w=majority
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
PORT=5000
CLIENT_URL=http://localhost:8080
NODE_ENV=development
```

```bash
npm run dev    # development with nodemon
npm start      # production
```

The server falls back to local MongoDB if Atlas DNS fails, and to an in-memory MongoDB (dev only) as a last resort.

### Frontend

```bash
# from project root
npm install
```

Optionally create `.env.local` (defaults to production API if not set):
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
```

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
```

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens validated on every authenticated request; server refuses to start without `JWT_SECRET`
- Rate limiting on authentication endpoints prevents brute-force attacks
- Role escalation blocked — users cannot change their own role via the profile update endpoint
- Input sanitized with DOMPurify on the frontend
- Form validation with Zod schemas on the frontend and manual validation on the backend
- CORS restricted to the production frontend domain and configurable `CLIENT_URL`
- `.env` files gitignored to prevent credential leaks

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [sickle-connect.vercel.app](https://sickle-connect.vercel.app) |
| Backend | Render | [sickleconnect.onrender.com](https://sickleconnect.onrender.com) |
| Database | MongoDB Atlas | Cloud-hosted cluster |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

**Made with care for the Sickle Cell Community**
