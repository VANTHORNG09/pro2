# AssignBridge - Project Context

## Project Overview

**AssignBridge** is a smart assignment management platform built with Next.js 16. It provides role-based access control for admins, teachers, and students to manage educational assignments, submissions, and class workflows.

### Core Features

- **Authentication System**: Login, signup, and logout flows with role-based access control
- **Multi-Role Dashboards**: Separate dashboards for admin, teacher, and student roles
- **Assignment Management**: Create, manage, and track assignments
- **Submission Tracking**: Manage and review student submissions
- **Class Management**: Organize and manage classes
- **Notifications & Settings**: User preferences and system notifications
- **Landing Page**: Marketing/landing page with feature showcases

### Tech Stack

- **Framework**: Next.js 16.2.2 (React 19.2.4)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **UI Components**: shadcn/ui (radix-nova style) with Radix UI primitives
- **State Management**: TanStack React Query 5
- **Forms**: React Hook Form with Zod validation
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts 3
- **Animations**: Framer Motion 12
- **Icons**: Lucide React, Tabler Icons, React Icons
- **Theme**: next-themes (dark/light mode support)
- **Toasts**: Sonner

## Project Structure

```
pro2/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (login, signup, logout)
│   ├── (dashboard)/              # Role-based dashboards
│   │   ├── admin/                # Admin dashboard
│   │   ├── teacher/              # Teacher dashboard
│   │   ├── student/              # Student dashboard
│   │   ├── profile/              # User profile
│   │   ├── settings/             # User settings
│   │   ├── notifications/        # Notifications center
│   │   └── help/                 # Help section
│   ├── (marketing)/              # Public marketing pages
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles
│   ├── error.tsx                 # Error boundary
│   └── not-found.tsx             # 404 page
├── components/
│   ├── assignments/              # Assignment-related components
│   ├── auth/                     # Authentication components
│   ├── landing-page-features/    # Landing page sections
│   ├── layout/                   # Layout components
│   ├── navbar/                   # Navigation components
│   ├── providers/                # React providers (theme, query, etc.)
│   ├── shared/                   # Shared components
│   └── ui/                       # shadcn/ui components
├── hooks/                        # Custom React hooks
├── lib/
│   ├── api/                      # API client functions
│   │   ├── assignments.ts
│   │   ├── auth.ts
│   │   ├── classes.ts
│   │   ├── submissions.ts
│   │   └── users.ts
│   ├── data/                     # Static data
│   ├── hooks/                    # Hook implementations
│   ├── types/                    # TypeScript type definitions
│   │   ├── assignment.ts
│   │   ├── auth.ts
│   │   ├── classes.ts
│   │   ├── landing-page.ts
│   │   └── user.ts
│   ├── validations/              # Zod validation schemas
│   └── utils.ts                  # Utility functions (cn for class merging)
└── proxy.ts                      # Next.js middleware for auth/routing
```

## Building and Running

### Development

```bash
npm run dev
```

Starts the development server.

### Production Build

```bash
npm run build
npm start
```

Builds the application and starts the production server.

### Linting

```bash
npm run lint
```

Runs ESLint with Next.js core web vitals configuration.

### Environment Setup

- Requires Node.js 20+
- Uses TypeScript with strict mode enabled
- Module resolution: bundler mode with path aliases (`@/*` maps to project root)

## Development Conventions

### Code Style

- **Strict TypeScript**: All code must be strictly typed
- **ESLint**: Uses `eslint-config-next` with core web vitals and TypeScript rules
- **Path Aliases**: Use `@/*` for imports (e.g., `@/components/ui/button`)
- **Component Naming**: PascalCase for components, camelCase for utilities
- **File Naming**: kebab-case for files, PascalCase for React components

### UI/UX Patterns

- **shadcn/ui**: Uses radix-nova style with CSS variables for theming
- **Dark Mode**: Supported via `next-themes` with system preference detection
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Animations**: Framer Motion for smooth transitions and interactions
- **Form Validation**: Zod schemas with React Hook Form integration

### Authentication & Authorization

- **Middleware**: `proxy.ts` handles route protection
- **Token-based Auth**: JWT tokens stored in cookies or Authorization header
- **Role-based Access**: Three roles (admin, teacher, student) with different route access
- **Protected Routes**: All routes except `/`, `/login`, `/signup`, `/forgot-password` require authentication

### State Management

- **Server State**: TanStack React Query for API data caching and synchronization
- **Local State**: React useState/useReducer for component-level state
- **Forms**: React Hook Form with Zod resolver for type-safe validation

### API Layer

- API client functions are organized by domain in `lib/api/`
- Type definitions in `lib/types/` ensure type safety across the app
- Validation schemas in `lib/validations/` for request/response validation

## Key Configuration Files

- **`next.config.ts`**: Next.js configuration (currently default)
- **`tsconfig.json`**: TypeScript configuration with strict mode and path aliases
- **`components.json`**: shadcn/ui configuration
- **`eslint.config.mjs`**: ESLint configuration with Next.js rules
- **`postcss.config.mjs`**: PostCSS configuration for Tailwind
- **`proxy.ts`**: Middleware for authentication and route protection

## Important Notes

⚠️ **Next.js 16 Breaking Changes**: This project uses Next.js 16.2.2 which has breaking changes from earlier versions. Always consult the documentation in `node_modules/next/dist/docs/` before making changes.

⚠️ **Deprecation Notices**: Pay attention to deprecation warnings during build and address them promptly.

## Architecture Patterns

### Route Groups

The app uses Next.js route groups `(auth)`, `(dashboard)`, and `(marketing)` to organize routes without affecting the URL structure.

### Layout Hierarchy

- Root layout (`app/layout.tsx`) provides global providers (theme, tooltip, client providers)
- Dashboard layout likely provides sidebar/navigation for authenticated users
- Route group layouts provide section-specific layouts

### Component Organization

- **UI Components**: Primitive components in `components/ui/` (shadcn/ui)
- **Feature Components**: Domain-specific components in feature folders
- **Shared Components**: Reusable components across features in `components/shared/`
