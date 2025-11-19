# Timely

A time-tracking and expense management app with **React + Vite** frontend and **Go (Gin) + PostgreSQL** backend. Features JWT authentication, clock in/out sessions, expense tracking with categories, and Plaid bank integration.

## Features

- **Time Tracking**: Clock in/out with session history and duration calculations
- **Expense Management**: Add, view, delete expenses with categories (Grocery, Food, Shopping, Education, Health, Entertainment, Transportation, Other)
- **Expense Dashboard**: Pie charts (by category) and bar charts (monthly spending)
- **Bank Integration**: Secure bank account linking via Plaid Link
- **Authentication**: JWT-based login/signup with protected routes

## Tech Stack

**Frontend**: React 19, Vite, React Router, Axios, Tailwind CSS, Recharts, React Plaid Link  
**Backend**: Go 1.25, Gin, PostgreSQL, pgx pool  
**Auth**: JWT (HS256), custom middleware  
**Integrations**: Plaid API (sandbox)

## Getting Started

### Prerequisites
- Go 1.25+, Node.js 20+, PostgreSQL 14+ (with `pgcrypto`), Plaid account

### Environment Variables (`.env` at root)
```env
DATABASE_URL=postgres://user:password@localhost:5432/timely?sslmode=disable
SECRET_KEY=your_jwt_secret
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_REDIRECT_URI=http://localhost:5173/finances/callback
```

### Backend
```bash
cd timely-backend && go mod download && go run ./cmd/api
```
Server: `http://localhost:8080` (creates tables on first run)

### Frontend
```bash
cd client && npm install && npm run dev
```
Dev server: `http://localhost:5173`

## API Endpoints

**Auth**: `POST /signup`, `POST /login`  
**Time**: `POST /api/v1/clock/in`, `POST /api/v1/clock/out/:id`, `GET /api/v1/clock/sessions`  
**Expenses**: `POST /expense/categories`, `POST /api/v1/expense/add`, `GET /api/v1/expense/list`, `DELETE /api/v1/expense/:id`  
**Plaid**: `POST /api/v1/plaid/link-token`, `POST /api/v1/plaid/exchange-token`

**Protected routes header**: `Authorization: <token>` (no "Bearer " prefix)

## Project Structure

```
Timely/
├── client/src/routes/finances/     # Dashboard, Recent Activity, Banks, Add Expense
├── timely-backend/internal/
│   ├── handlers/                   # API handlers
│   ├── models/                     # User, ClockSession, Expense, PlaidItem
│   ├── routes/                     # Route definitions
│   └── middleware/                 # Auth + CORS
└── api_test/                       # HTTP test files
```

## Database Tables

- `users`: id, email, name, password_hash, hourly_rate
- `clock_sessions`: id, user_id, start_time, end_time
- `expense_categories`: id, name, color
- `expenses`: id, user_id, category_id, amount, description, date
- `plaid_items`: id, user_id, access_token, item_id, institution_name, institution_id

## Frontend Features

**Finances Section**:
- Dashboard with expense charts
- Recent Activity with category colors and delete
- Banks: Plaid Link integration
- Add Expense modal with category, amount, description, date, receipt upload

**State Management**: UserContext, ExpenseContext, TimeContext

## Testing

Use `api_test/*.http` files with VS Code REST client or IntelliJ HTTP client.

## Future Enhancements

Bank transaction fetching, auto-categorization, periodic sync, account management, export reports, pay calculations.
