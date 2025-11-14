# Timely

Timely is a minimalist time-tracking application built with a **React + Vite** frontend and a **Go (Gin) + PostgreSQL** backend. It allows authenticated users to clock in, clock out, and view their recent sessions with accurate durations.

## Features
- **Authentication** with JWT (login + signup)
- **Clock In / Clock Out** workflow backed by a Postgres database
- **Session table** that shows start time, end time, and total duration
- **Responsive UI** using Tailwind-inspired styling

## Tech Stack
| Layer      | Tools |
| ---------- | ----- |
| Frontend   | React 19, Vite, React Router, Axios, Tailwind styles |
| Backend    | Go 1.25, Gin, PostgreSQL, pgx pool |
| Auth       | JWT (HS256), custom middleware |

## Project structure
```
Timely/
├── client/                 # React app
│   └── src/
│       ├── routes/         # landing, auth, home
│       ├── components/     # signin, signup, clock component
│       └── contexts/       # user context
├── timely-backend/         # Go server
│   ├── cmd/api/main.go     # server bootstrap
│   ├── internal/
│   │   ├── db/             # connection + migrations
│   │   ├── handlers/       # login, signup, clock endpoints
│   │   ├── middleware/     # CORS + auth
│   │   ├── models/         # user + clock session models
│   │   └── utils/          # hashing + JWT helpers
└── api_test/               # HTTP request samples for testing
```

## Getting started

### Prerequisites
- Go 1.25+
- Node.js 20+ and npm
- PostgreSQL 14+ (with the `pgcrypto` extension for `gen_random_uuid`)
- `.env` file at project root with:
  ```
  DATABASE_URL=postgres://user:password@localhost:5432/timely?sslmode=disable
  SECRET_KEY=your_jwt_secret
  ```

### Backend
```bash
cd timely-backend
go mod download
go run ./cmd/api
```
The server listens on `http://localhost:8080`. On first run it creates the `users` and `clock_sessions` tables if they do not exist.

### Frontend
```bash
cd client
npm install
npm run dev
```
The Vite dev server defaults to `http://localhost:5173`.

## Key API endpoints
| Method | Endpoint                    | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| POST   | `/signup`                   | Create a new account, returns JWT  |
| POST   | `/login`                    | Authenticate, returns JWT          |
| POST   | `/api/v1/clock/in`          | Start a clock session              |
| POST   | `/api/v1/clock/out/:id`     | Close a clock session              |

Headers for protected routes:
```
Authorization: Bearer <token>
```

## Frontend integration notes
- On login/signup, store `authToken` (JWT) in `localStorage`.
- `home.jsx` uses `/api/v1/clock/in` and `/api/v1/clock/out/:id` to toggle active sessions.
- Session list displays start/end timestamps and total duration; it does not rely on any unimplemented endpoints.

## Testing APIs quickly
Use the `api_test/*.http` files with VS Code REST client or IntelliJ HTTP client:
- `create-user.http` – register a user
- `login-user.http` – fetch a token
- `clockin.http` – start a session
- `clockout.http` – end a session

## Future enhancements
- Session history endpoint (GET)
- Pay calculations based on hourly rate
- Multi-tenant/team support
- Better error reporting and toast notifications in the UI

---
Feel free to fork and customize Timely for your own time-tracking needs!

