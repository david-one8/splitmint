<div align="center">

# ✨ SplitMint

### Smart Expense Splitting — Powered by AI

Split expenses with friends effortlessly. Track shared costs, settle balances, and let AI do the heavy lifting.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?logo=google)](https://ai.google.dev/)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## 🚀 Features

- **Group Management** — Create expense groups and add up to 4 participants per group.
- **Expense Tracking** — Log expenses with equal, custom, or percentage-based splits.
- **Smart Settlements** — Minimal settlement calculations using a greedy debtor-creditor algorithm.
- **AI-Powered Parsing** — Describe expenses in natural language (e.g., _"John paid ₹500 for dinner"_) and let Gemini AI structure them automatically.
- **Search & Filters** — Filter expenses by keyword, participant, or date range.
- **Authentication** — Secure email/password auth with Supabase, including session management via middleware.
- **Dark Mode** — System-aware theme toggle with localStorage persistence.
- **Responsive UI** — Mobile-first design built with Tailwind CSS.

---

## 🛠 Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org/) (App Router)             |
| UI           | [React 19](https://react.dev/), [Tailwind CSS 3](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/) |
| Auth & DB    | [Supabase](https://supabase.com/) (PostgreSQL + Auth + SSR) |
| AI           | [Google Gemini 2.0 Flash](https://ai.google.dev/)          |
| Utilities    | `class-variance-authority`, `clsx`, `tailwind-merge`, `date-fns`, `zod` |

---

## 📁 Project Structure

```
splitmint/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Registration page
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard shell (nav, auth guard)
│   │   ├── dashboard/page.tsx      # Main dashboard — group overview
│   │   └── groups/
│   │       ├── page.tsx            # Groups listing
│   │       ├── new/page.tsx        # Create new group + participants
│   │       └── [id]/page.tsx       # Group detail — expenses, balances, AI
│   ├── api/
│   │   ├── ai/route.ts            # AI expense parsing endpoint
│   │   ├── auth/
│   │   │   ├── callback/route.ts   # OAuth callback handler
│   │   │   └── signout/route.ts    # Sign-out endpoint
│   │   ├── expenses/route.ts       # Expense CRUD (POST, PUT, DELETE)
│   │   └── groups/route.ts         # Group CRUD (POST, PUT, DELETE)
│   ├── globals.css                 # Global styles + Tailwind directives
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/
│   ├── AIAssistant.tsx             # Natural language expense input
│   ├── auth/
│   │   ├── LoginForm.tsx           # Email/password login form
│   │   └── RegisterForm.tsx        # Registration form
│   ├── dashboard/
│   │   ├── BalanceTable.tsx        # Per-participant balance breakdown
│   │   ├── ExpenseForm.tsx         # Add/edit expense with split modes
│   │   ├── ExpenseList.tsx         # Expense listing with edit/delete
│   │   ├── SearchFilters.tsx       # Search & filter controls
│   │   └── SummaryCards.tsx        # Total spent / owed / owed-to-you
│   ├── groups/
│   │   ├── GroupCard.tsx           # Group preview card
│   │   ├── GroupForm.tsx           # Group name input form
│   │   └── ParticipantManager.tsx  # Add/remove participants
│   └── ui/                        # Reusable UI primitives
│       ├── BackButton.tsx
│       ├── Button.tsx              # CVA-based button (7 variants)
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       └── ThemeToggle.tsx
├── hooks/
│   ├── useExpenses.ts              # Fetch expenses for a group
│   ├── useGroups.ts                # Fetch user's groups
│   └── useTheme.ts                 # Dark/light theme management
├── lib/
│   ├── ai/gemini.ts                # Gemini AI client + prompt logic
│   ├── balance-engine.ts           # Balance & settlement calculations
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── middleware.ts           # Session refresh middleware
│   │   └── server.ts               # Server-side Supabase client
│   ├── types.ts                    # TypeScript interfaces
│   └── utils.ts                    # Helpers (cn, formatCurrency, etc.)
├── middleware.ts                    # Next.js middleware (auth routing)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** (or yarn/pnpm)
- A [Supabase](https://supabase.com/) project (free tier works)
- A [Google AI Studio](https://ai.google.dev/) API key for Gemini

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/splitmint.git
cd splitmint

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start dev server           |
| `npm run build` | Production build           |
| `npm run start` | Start production server    |
| `npm run lint`  | Lint with ESLint           |

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

| Variable                         | Description                          | Required |
| -------------------------------- | ------------------------------------ | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase project URL                 | ✅        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase anonymous/public key        | ✅        |
| `GEMINI_API_KEY`                 | Google Gemini API key (server-side)  | ✅        |

---

## 🗄 Database Schema

Set up the following tables in your Supabase project:

### `profiles`
| Column       | Type        | Notes                    |
| ------------ | ----------- | ------------------------ |
| `id`         | `uuid` (PK) | References `auth.users` |
| `email`      | `text`       |                          |
| `full_name`  | `text`       | Nullable                 |
| `avatar_url` | `text`       | Nullable                 |
| `created_at` | `timestamptz`| Default `now()`          |
| `updated_at` | `timestamptz`| Default `now()`          |

### `groups`
| Column       | Type        | Notes                    |
| ------------ | ----------- | ------------------------ |
| `id`         | `uuid` (PK) | Default `gen_random_uuid()` |
| `name`       | `text`       |                          |
| `owner_id`   | `uuid` (FK)  | References `auth.users` |
| `created_at` | `timestamptz`| Default `now()`          |
| `updated_at` | `timestamptz`| Default `now()`          |

### `participants`
| Column       | Type        | Notes                    |
| ------------ | ----------- | ------------------------ |
| `id`         | `uuid` (PK) | Default `gen_random_uuid()` |
| `group_id`   | `uuid` (FK)  | References `groups`     |
| `name`       | `text`       |                          |
| `color`      | `text`       | Hex color code           |
| `avatar`     | `text`       | Nullable                 |
| `created_at` | `timestamptz`| Default `now()`          |

### `expenses`
| Column       | Type        | Notes                            |
| ------------ | ----------- | -------------------------------- |
| `id`         | `uuid` (PK) | Default `gen_random_uuid()`     |
| `group_id`   | `uuid` (FK)  | References `groups`             |
| `description`| `text`       |                                  |
| `amount`     | `numeric`    |                                  |
| `payer_id`   | `uuid` (FK)  | References `participants`       |
| `date`       | `date`       |                                  |
| `split_mode` | `text`       | `equal`, `custom`, `percentage` |
| `created_by` | `uuid` (FK)  | References `auth.users`         |
| `created_at` | `timestamptz`| Default `now()`                  |
| `updated_at` | `timestamptz`| Default `now()`                  |

### `expense_splits`
| Column           | Type        | Notes                        |
| ---------------- | ----------- | ---------------------------- |
| `id`             | `uuid` (PK) | Default `gen_random_uuid()` |
| `expense_id`     | `uuid` (FK)  | References `expenses`       |
| `participant_id` | `uuid` (FK)  | References `participants`   |
| `amount`         | `numeric`    | Split amount                 |
| `percentage`     | `numeric`    | Nullable                     |

> **Tip:** Create a database trigger on `auth.users` insert to automatically create a row in `profiles`.

---

## 📡 API Reference

### Authentication

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/auth/callback`   | OAuth code exchange      |
| POST   | `/api/auth/signout`    | Sign out and redirect    |

### Groups

| Method | Endpoint       | Body / Params                | Description         |
| ------ | -------------- | ---------------------------- | ------------------- |
| POST   | `/api/groups`  | `{ name }`                   | Create a group      |
| PUT    | `/api/groups`  | `{ id, name }`               | Update group name   |
| DELETE | `/api/groups`  | `?id=<group_id>`             | Delete a group      |

### Expenses

| Method | Endpoint         | Body / Params                                                                 | Description         |
| ------ | ---------------- | ----------------------------------------------------------------------------- | ------------------- |
| POST   | `/api/expenses`  | `{ group_id, description, amount, payer_id, date, split_mode, splits }`       | Create an expense   |
| PUT    | `/api/expenses`  | `{ id, description, amount, payer_id, date, split_mode, splits }`             | Update an expense   |
| DELETE | `/api/expenses`  | `?id=<expense_id>`                                                            | Delete an expense   |

### AI

| Method | Endpoint    | Body                                     | Description                         |
| ------ | ----------- | ---------------------------------------- | ----------------------------------- |
| POST   | `/api/ai`   | `{ action: "parseExpense", text, groupId }` | Parse natural language into expense |

---

## 📸 Screenshots

> _Add screenshots of your landing page, dashboard, group detail, and AI assistant here._

---

## 📄 License

This project is for personal/educational use. See the [LICENSE](LICENSE) file for details.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
