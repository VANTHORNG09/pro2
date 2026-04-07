# AssignBridge – Project Context

## Overview

**AssignBridge** is a **smart assignment management platform** built as a full-stack-capable web application. It provides role-based dashboards for **Admin**, **Teacher**, and **Student** users, with features for managing assignments, authentication, and analytics.

The frontend is a **Next.js 16** (App Router) application using **React 19**, **TypeScript**, and **Tailwind CSS 4**, with a polished glassmorphic dark UI.

---

## Tech Stack

| Layer                     | Technology                                                |
| ------------------------- | --------------------------------------------------------- |
| **Framework**             | Next.js 16 (App Router)                                   |
| **Language**              | TypeScript 5                                              |
| **UI Library**            | React 19 + React DOM 19                                   |
| **Styling**               | Tailwind CSS 4 + custom CSS variables (OKLCH color space) |
| **Component Library**     | shadcn/ui (Radix UI primitives)                           |
| **Icons**                 | Lucide React + React Icons                                |
| **Animations**            | Framer Motion                                             |
| **Charts**                | Recharts                                                  |
| **Form Handling**         | React Hook Form + Zod validation                          |
| **State / Data Fetching** | TanStack React Query                                      |
| **Theming**               | next-themes (dark/light mode)                             |
| **Linting**               | ESLint 9 + eslint-config-next                             |

---

## Project Structure

```
pro2/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Authentication route group (login, signup, etc.)
│   ├── (dashboard)/            # Dashboard route group (role-based views)
│   ├── (marketing)/            # Marketing / landing page route group
│   ├── layout.tsx              # Root layout with ThemeProvider + ClientProviders
│   ├── globals.css             # Global styles, Tailwind, glassmorphism utilities
│   ├── error.tsx               # Global error boundary
│   └── not-found.tsx           # 404 page
├── components/                 # React components
│   ├── app-shell/              # Application shell (sidebar, layout wrappers)
│   ├── assignments/            # Assignment-related UI components
│   ├── auth/                   # Authentication form components
│   ├── landing-page-features/  # Marketing page feature sections
│   ├── layout/                 # Layout components
│   ├── navbar/                 # Navigation bar components
│   ├── providers/              # Context providers (theme, query, etc.)
│   ├── shared/                 # Shared / reusable components
│   └── ui/                     # shadcn/ui generated components
├── hooks/                      # Custom React hooks
│   ├── use-toast.tsx           # Toast notification hook
│   └── useAuth.tsx             # Authentication state hook
├── lib/                        # Utility libraries
│   ├── api/                    # API client / request helpers
│   ├── data/                   # Static / seed data
│   ├── hooks/                  # Library-level hooks
│   ├── types/                  # TypeScript type definitions
│   ├── validations/            # Zod validation schemas
│   └── utils.ts                # General utilities (e.g. cn helper)
├── proxy.ts                    # Auth middleware / route guard logic
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── components.json             # shadcn/ui configuration
├── postcss.config.mjs          # PostCSS configuration
├── eslint.config.mjs           # ESLint configuration
└── package.json                # Project dependencies and scripts
```

---

## Key Architecture Details

### Route Groups

The app uses Next.js **route groups** to organize pages:

- **`(auth)`** – Login, signup, password reset flows
- **`(dashboard)`** – Role-specific dashboard views (admin, teacher, student)
- **`(marketing)`** – Public-facing landing pages

### Authentication & Routing

- `proxy.ts` contains middleware that intercepts requests to protect routes.
- It checks for an `auth_token` cookie or `Authorization` header.
- Public routes: `/`, `/login`, `/signup`, `/forgot-password`
- Protected routes redirect unauthenticated users to `/login`.
- Role-based access control is planned (roles: `admin`, `teacher`, `student`) but currently allows all authenticated users.

### UI / Styling

- **Dark-first design** with a radial gradient background and glassmorphic card/button styles.
- Uses **OKLCH color space** for CSS custom properties (shadcn theming).
- Fonts: **Poppins** (headings), **Inter** (body), **Geist** (mono).
- Components built with **Radix UI** primitives via **shadcn/ui**.

### Path Alias

TypeScript is configured with the `@/*` alias mapping to the project root, so imports look like:

```ts
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
```

---

## Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

---

## Development Conventions

- **TypeScript strict mode** is enabled.
- **ESLint** is configured via `eslint.config.mjs` with `eslint-config-next`.
- Components follow the **shadcn/ui** pattern – generated into `components/ui/` and customizable.
- Use the `cn()` utility from `@/lib/utils` for conditional Tailwind class merging.
- Forms use **React Hook Form** with **Zod** schema validation (via `@hookform/resolvers`).
- Data fetching should leverage **TanStack React Query** for caching and server state management.

---

## Important Notes

1. **Next.js 16** has breaking changes compared to earlier versions. Always consult `node_modules/next/dist/docs/` or the official Next.js docs before writing code.
2. The `tsconfig.json` contains some non-standard JSON entries (duplicate keys like `token`, `user`) that appear to be accidental mock data – these should be cleaned up in the actual file.
3. The `proxy.ts` middleware currently has placeholder auth logic (no actual JWT decoding). Production use requires proper token verification.
4. Tailwind CSS 4 uses a new configuration approach (no `tailwind.config.js`); config is defined via CSS `@theme` directives in `globals.css`.
