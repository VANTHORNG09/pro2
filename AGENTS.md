<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Guidelines for AssignBridge

This document provides coding guidelines, commands, and conventions for working in this Next.js application.

## Build, Lint, and Test Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint (includes Next.js core web vitals and TypeScript rules)
- Type checking: `npx tsc --noEmit` (TypeScript compilation check)

### Testing
- **Testing Framework**: Playwright is installed (`@playwright/test`) but no tests are currently implemented
- **Running Tests**: No test scripts configured yet. When tests are added:
  - Single test file: `npx playwright test path/to/test.spec.ts`
  - All tests: `npx playwright test`
  - UI mode: `npx playwright test --ui`
- **Test File Pattern**: `*.test.ts` or `*.spec.ts` (not yet used)

## Code Style Guidelines

### File Structure
```
app/                          # Next.js 13+ app router
  (dashboard)/               # Route groups
    admin/
      page.tsx              # Admin dashboard
      audit-logs/
        page.tsx            # Audit logs page
features/                    # Feature-based organization
  auth/
    types.ts                # Feature types
    hooks.ts                # Feature hooks
components/
  ui/                       # Reusable UI components
  layout/                   # Layout components
lib/
  types/                    # Shared type definitions
  utils.ts                  # Utility functions
hooks/                       # Custom React hooks
```

### Imports and Dependencies

#### Import Order
1. React imports (`import * as React from "react"`)
2. Next.js imports (`import Link from "next/link"`)
3. External libraries (alphabetically)
4. Internal imports (with `@/` alias)
5. Type imports (`import type { User } from "@/types"`)

#### Import Examples
```typescript
// Client components
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@/lib/types/auth";
```

#### Path Aliases
- `@/*` maps to `./*` (configured in `tsconfig.json`)
- Use `@/components/`, `@/lib/`, `@/features/`, etc.

### TypeScript

#### Type Definitions
- Use interfaces for object shapes: `interface User { ... }`
- Use types for unions: `type UserRole = 'admin' | 'teacher' | 'student'`
- Prefer `interface` over `type` for object definitions unless union types are needed
- Export types from dedicated files (e.g., `features/*/types.ts`)

#### Type Safety
- Strict TypeScript enabled (`"strict": true` in `tsconfig.json`)
- Avoid `any` type - use proper types or `unknown`
- Use `as const` for literal type assertions
- Define return types for functions when not obvious

#### Example Types
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export type UserRole = 'admin' | 'teacher' | 'student';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### React Components

#### Component Patterns
- Use functional components with hooks
- Add `"use client"` directive for client components
- Server components by default (no directive needed)
- Export default for page components

#### Props and Children
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }))}>
      {children}
    </button>
  );
}
```

#### State Management
- React hooks for local state (`useState`, `useEffect`)
- Context API for shared state (`useAuth.tsx`)
- React Query for server state (installed but not heavily used)

### Styling

#### Tailwind CSS
- Utility-first approach
- Use `cn()` utility for conditional classes (from `clsx` + `tailwind-merge`)
- Responsive design with Tailwind breakpoints
- Dark mode support built-in

#### CSS Classes
```typescript
import { cn } from "@/lib/utils";

const buttonClasses = cn(
  "px-4 py-2 rounded-md font-medium",
  variant === 'primary' && "bg-blue-500 text-white",
  variant === 'secondary' && "bg-gray-200 text-gray-800",
  disabled && "opacity-50 cursor-not-allowed"
);
```

#### UI Components
- Radix UI primitives for accessibility
- Shadcn/ui components (based on Radix + Tailwind)
- Lucide React icons

### Naming Conventions

#### Files and Directories
- `page.tsx` - Next.js route pages
- `layout.tsx` - Layout components
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundaries
- `not-found.tsx` - 404 pages
- `component-name.tsx` - React components
- `hook-name.ts` - Custom hooks
- `utils.ts` - Utility functions
- `types.ts` - Type definitions

#### Variables and Functions
- camelCase for variables and functions: `userData`, `handleSubmit`
- PascalCase for components and types: `UserCard`, `ApiResponse`
- UPPER_CASE for constants: `API_URL`, `DEFAULT_TIMEOUT`
- Prefix boolean variables: `isLoading`, `hasError`, `canEdit`

#### CSS Classes
- kebab-case for custom classes: `user-card`, `nav-item`
- BEM methodology for complex components: `button--primary`, `card__title`

### Error Handling

#### API Calls
```typescript
try {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Failed to fetch users:', error);
  throw error; // Re-throw for caller to handle
}
```

#### React Error Boundaries
- Use `error.tsx` files in app router for route-level error handling
- Wrap async operations with proper loading/error states

### Environment Variables
- `NEXT_PUBLIC_*` prefix for client-side variables
- Server-side variables without prefix
- Default values: `const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"`

### Data Fetching
- React Query installed (`@tanstack/react-query`)
- Prefer server components for initial data loading
- Use client components with React Query for interactive updates

### Performance
- Use `React.memo()` sparingly, rely on React Compiler
- Optimize images with Next.js `<Image>` component
- Code splitting with dynamic imports: `const Component = dynamic(() => import('./Component'))`
- Bundle analysis: Check `.next/static/chunks/` after build

### Accessibility
- Use semantic HTML elements
- ARIA attributes when needed
- Keyboard navigation support
- Screen reader friendly content
- Radix UI components provide built-in accessibility

### Git and Version Control
- Feature branches from `main`
- Conventional commits: `feat: add user profile`, `fix: resolve login bug`
- Pull requests with descriptions
- Code review required

### Security
- Input validation with Zod schemas
- Sanitize user inputs
- Secure API endpoints with authentication
- Environment variables for sensitive data
- HTTPS in production

## Next.js Specific Rules

### App Router
- Use `app/` directory structure
- Server components by default
- Client components with `"use client"` directive
- Route groups: `(dashboard)`, `(auth)`, `(marketing)`

### Route Structure
```
app/
  (dashboard)/           # Protected routes
    admin/
      page.tsx          # /admin
      audit-logs/
        page.tsx        # /admin/audit-logs
    teacher/
      assignments/
        page.tsx        # /teacher/assignments
```

### Metadata
```typescript
export const metadata: Metadata = {
  title: 'Dashboard | AssignBridge',
  description: 'Manage your assignments and classes',
};
```

### Server Actions (Future)
- When implemented, use `"use server"` directive
- Server actions for form submissions
- Optimistic updates with client components

## Code Quality Tools

### ESLint Configuration
- Next.js core web vitals rules
- TypeScript strict rules
- React hooks rules
- Custom rules for consistency

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- JSX: react-jsx
- Path mapping: `@/*` to `./*`

### Pre-commit Hooks
- ESLint runs on commit (if configured)
- Consider adding Husky for pre-commit validation

## Development Workflow

1. **Setup**: `npm install`
2. **Development**: `npm run dev`
3. **Code Quality**: `npm run lint` before committing
4. **Build Check**: `npm run build` to verify production build
5. **Testing**: Write Playwright tests in `*.spec.ts` files (future)

## Common Patterns

### Form Handling
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });
}
```

### API Integration
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function apiRequest(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

### Component Composition
```typescript
function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <RecentActivity />
      <QuickActions />
    </div>
  );
}
```

This document should be updated as the codebase evolves and new patterns emerge.
