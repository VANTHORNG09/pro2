# AssignBridge - Project Context

## Project Overview

**AssignBridge** is a smart assignment management platform built with Next.js 16, React 19, and TypeScript. It provides a role-based system for admins, teachers, and students to manage academic assignments efficiently.

The application features:

- **Authentication system** with login, signup, and logout flows
- **Role-based dashboards** for admin, teacher, and student views
- **Modern glassmorphic UI** with dark theme and gradient backgrounds
- **Responsive design** using Tailwind CSS v4 and shadcn/ui components
- **State management** via TanStack React Query
- **Form handling** with React Hook Form and Zod validation
- **Data visualization** using Recharts
- **Animations** powered by Framer Motion

## Tech Stack

### Core

- **Next.js 16** - App Router with Route Groups
- **React 19** - UI library
- **TypeScript 5** - Type safety

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Radix UI-based component library (radix-nova style)
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Custom glassmorphic design** - Glass cards, buttons, and inputs

### State & Forms

- **TanStack React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **next-themes** - Theme management (dark/light mode)

### Data Visualization

- **Recharts** - Charting library

## Project Structure

```
pro2/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth route group (login, signup, logout)
│   ├── (dashboard)/            # Dashboard route group
│   │   ├── admin/              # Admin dashboard
│   │   ├── teacher/            # Teacher dashboard
│   │   ├── student/            # Student dashboard
│   │   ├── profile/            # User profile
│   │   ├── settings/           # Settings
│   │   ├── notifications/      # Notifications
│   │   ├── help/               # Help center
│   │   └── layout.tsx          # Dashboard layout
│   ├── (marketing)/            # Marketing/landing page
│   │   └── page.tsx
│   ├── layout.tsx              # Root layout with providers
│   ├── globals.css             # Global styles & theme
│   ├── error.tsx               # Error boundary
│   └── not-found.tsx           # 404 page
├── components/                 # React components
│   ├── app-shell/              # Application shell
│   ├── assignments/            # Assignment-related components
│   ├── auth/                   # Authentication components
│   ├── landing-page-features/  # Landing page features
│   ├── layout/                 # Layout components
│   ├── navbar/                 # Navigation components
│   ├── providers/              # Context providers (theme, client)
│   ├── shared/                 # Shared components
│   └── ui/                     # shadcn/ui components
├── hooks/                      # Custom React hooks
│   ├── use-toast.tsx
│   └── useAuth.tsx
├── lib/                        # Utilities & business logic
│   ├── api/                    # API utilities
│   ├── data/                   # Data utilities
│   ├── hooks/                  # Library hooks
│   ├── types/                  # TypeScript types
│   ├── validations/            # Zod schemas
│   └── utils.ts                # Utility functions (cn helper)
├── proxy.ts                    # Next.js middleware for auth/routing
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.mjs          # PostCSS configuration
└── components.json             # shadcn/ui configuration
```

## Key Architecture Decisions

### Route Groups

The app uses Next.js Route Groups `(auth)`, `(dashboard)`, and `(marketing)` to organize routes without affecting URL structure. This allows shared layouts per section.

### Path Aliases

Configured in `tsconfig.json`:

- `@/*` maps to project root (e.g., `@/lib/utils` → `./lib/utils`)
- Component aliases set in `components.json` for `@/components`, `@/ui`, `@/lib`, `@/hooks`

### Middleware (`proxy.ts`)

Handles:

- Authentication checks via cookie (`auth_token`) or Authorization header
- Redirects unauthenticated users to login
- Role-based access control structure (admin, teacher, student)
- Excludes static files and public assets from middleware processing

### Theme System

- Uses `next-themes` for dark/light mode toggle
- CSS custom properties with OKLCH color space
- shadcn/ui radix-nova style with CSS variables
- Custom glassmorphic styles in `globals.css`

## Building and Running

### Prerequisites

- Node.js (latest LTS recommended)
- npm

### Setup

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Development Conventions

### TypeScript

- Strict mode enabled
- No emit (Next.js handles compilation)
- ES2017 target
- Module resolution: bundler

### Styling

- Tailwind CSS v4 with `@theme` directive for custom properties
- shadcn/ui components with radix-nova style
- Custom glassmorphic design patterns (glass-card, glass-button, glass-input)
- CSS variables for theming
- OKLCH color space for design tokens

### Component Patterns

- Server Components by default (RSC enabled)
- Client components marked with `"use client"` directive
- Components use `cn()` utility for conditional className merging
- Variants managed via `class-variance-authority`

### Form Handling

- React Hook Form for form state
- Zod for schema validation
- `@hookform/resolvers` for integration

### State Management

- TanStack React Query for server state
- React context for client-side state (auth, theme)

### Code Quality

- ESLint with `eslint-config-next` (core-web-vitals + typescript)
- PostCSS with Tailwind CSS plugin

## Important Notes

### Next.js Version

This project uses **Next.js 16**, which may have breaking changes compared to earlier versions. Always consult the Next.js documentation in `node_modules/next/dist/docs/` before making changes.

### Component Library

Uses shadcn/ui with the radix-nova style. Components are generated into `components/ui/` and can be customized. New components can be added via the shadcn CLI.

### Deployment

The project is configured for deployment on Vercel (indicated by `.vercel` in .gitignore and metadata Open Graph URLs).
