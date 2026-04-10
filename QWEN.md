# AssignBridge - Project Context

## Project Overview

**AssignBridge** is a smart assignment management platform built with Next.js 16, React 19, and TypeScript. It provides role-based dashboards for admins, teachers, and students to manage assignments, classes, and submissions.

### Tech Stack

- **Framework:** Next.js 16.2.2 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS 4
- **Component Library:** shadcn/ui (radix-nova style)
- **Icons:** Lucide React, Tabler Icons, React Icons
- **State Management:** TanStack React Query 5
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Charts:** Recharts 3
- **Drag & Drop:** dnd-kit
- **Theme:** next-themes (dark/light mode)
- **Notifications:** Sonner

## Project Structure

```
pro2/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes (login, signup, etc.)
│   ├── (dashboard)/         # Dashboard layout and role-specific pages
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── teacher/         # Teacher dashboard pages
│   │   ├── student/         # Student dashboard pages
│   │   ├── settings/        # Settings pages
│   │   ├── profile/         # Profile pages
│   │   ├── notifications/   # Notifications page
│   │   └── help/            # Help page
│   ├── (marketing)/         # Marketing/landing pages
│   ├── layout.tsx           # Root layout with providers
│   ├── globals.css          # Global styles
│   ├── error.tsx            # Global error boundary
│   └── not-found.tsx        # 404 page
├── components/              # Reusable React components
│   ├── ui/                  # shadcn/ui primitive components
│   ├── layout/              # Layout components (Sidebar, Topbar)
│   ├── navbar/              # Navbar components
│   ├── providers/           # Context providers (Theme, Client)
│   ├── assignments/         # Assignment-specific components
│   └── shared/              # Shared utility components
├── features/                # Feature-based modules
│   ├── auth/                # Authentication feature
│   ├── assignments/         # Assignments feature
│   ├── classes/             # Classes feature
│   └── submissions/         # Submissions feature
├── lib/                     # Shared libraries and utilities
│   ├── api-client.ts        # API client configuration
│   ├── constants.ts         # Application constants
│   ├── react-query.ts       # React Query configuration
│   ├── utils.ts             # Utility functions (cn, etc.)
│   ├── data/                # Static data or mock data
│   ├── hooks/               # Shared custom hooks
│   └── types/               # Shared TypeScript types
├── hooks/                   # Top-level custom hooks
├── middleware.ts            # Next.js middleware (auth, routing)
└── config files             # ESLint, Tailwind, tsconfig, etc.
```

## Building and Running

### Development

```bash
npm run dev
# or
npx next dev
```

Starts the development server.

### Production Build

```bash
npm run build
# or
npx next build
```

Builds the application for production.

### Start Production Server

```bash
npm start
# or
npx next start
```

Starts the production server after a build.

### Linting

```bash
npm run lint
# or
npx eslint
```

Runs ESLint to check for code quality issues.

## Key Features

### Authentication & Authorization

- Middleware (`middleware.ts`) handles route protection
- Cookie-based authentication with `auth_token`
- Role-based access control (admin, teacher, student)
- Public routes: `/`, `/login`, `/signup`, `/forgot-password`

### Role-Based Dashboards

The dashboard layout adapts based on the user's role:

- **Admin:** Full system access and management
- **Teacher:** Assignment creation and grading
- **Student:** Assignment submission and viewing

### Component Architecture

- **shadcn/ui** components in `components/ui/` (managed via `components.json`)
- Feature components organized in `features/`
- Shared components in `components/`
- Path aliases: `@/*` maps to project root

## Development Conventions

### TypeScript

- Strict mode enabled
- Path alias `@/*` for absolute imports (e.g., `@/components/ui/button`)
- No emit (Next.js handles compilation)

### Styling

- Tailwind CSS 4 with PostCSS
- CSS variables for theming
- `cn()` utility from `@/lib/utils` for conditional class merging (uses `tailwind-merge` and `clsx`)
- Base color: neutral
- CSS variables support for dark mode

### Component Patterns

- Components use shadcn/ui primitives with Radix UI
- Client components marked with `"use client"` directive
- Server components by default (App Router)
- Form validation with Zod schemas
- Drag-and-drop with dnd-kit for sortable interfaces

### State Management

- Server state: TanStack React Query
- Client state: React context and local state
- Forms: React Hook Form with Zod resolver

## Important Notes

- **Next.js 16** has breaking changes from earlier versions. Refer to `node_modules/next/dist/docs/` for updated APIs and conventions.
- The project uses the **App Router** (not Pages Router)
- Middleware handles authentication and role-based routing
- Theme provider supports dark/light mode via `next-themes`

## Configuration Files

| File                 | Purpose                             |
| -------------------- | ----------------------------------- |
| `next.config.ts`     | Next.js configuration               |
| `tsconfig.json`      | TypeScript configuration            |
| `eslint.config.mjs`  | ESLint configuration                |
| `postcss.config.mjs` | PostCSS configuration               |
| `components.json`    | shadcn/ui configuration             |
| `middleware.ts`      | Next.js middleware for auth/routing |
