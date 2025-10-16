# FamFunds Project Structure

## Directory Overview

```
.
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with Tailwind directives
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Button.tsx        # Button component with Framer Motion
│   ├── Card.tsx          # Card component with animations
│   └── index.ts          # Component exports
├── lib/                   # Utility functions and configurations
│   ├── constants.ts      # App-wide constants
│   ├── theme.ts          # Theme configuration (colors, spacing, animations)
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── index.ts          # Library exports
├── pages/                 # Pages Router (for API routes)
│   └── api/              # API routes
│       └── health.ts     # Health check endpoint
├── public/                # Static assets
└── ...config files

```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Key Configuration Files

- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.ts` - Next.js configuration
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `postcss.config.mjs` - PostCSS configuration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Format code:
   ```bash
   npm run format
   ```

5. Lint code:
   ```bash
   npm run lint
   ```

## Component Guidelines

- Use `"use client"` directive for components that use client-side features (hooks, Framer Motion)
- Import shared utilities from `@/lib`
- Use the `cn()` utility for conditional className merging
- Follow existing component patterns for consistency

## Styling Guidelines

- Use Tailwind utility classes for styling
- Use the theme configuration in `lib/theme.ts` for consistent colors and animations
- Support dark mode with `dark:` prefix
- Use Framer Motion for animations and transitions
