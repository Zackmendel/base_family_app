# FamFunds

A prototype application for collaborative family financial management, enabling families to pool resources, track expenses, and make collective financial decisions with AI-powered assistance.

## Tech Stack

- **Framework:** Next.js 15 (App Router + Pages Router for API)
- **Language:** TypeScript
- **Styling:** TailwindCSS 4
- **Animations:** Framer Motion
- **Code Quality:** ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd famfunds
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Lint the codebase
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
.
├── app/                   # Next.js App Router
│   ├── globals.css       # Global styles with Tailwind
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── components/           # Reusable React components
│   ├── Button.tsx       # Animated button component
│   ├── Card.tsx         # Card component
│   └── index.ts         # Component exports
├── lib/                  # Utilities and configurations
│   ├── constants.ts     # App constants
│   ├── theme.ts         # Theme configuration
│   ├── types.ts         # TypeScript types
│   ├── utils.ts         # Utility functions
│   └── index.ts         # Library exports
├── pages/                # Pages Router (API routes)
│   └── api/             # API endpoints
│       └── health.ts    # Health check endpoint
└── public/               # Static assets

```

## Key Features

### Styling
- TailwindCSS 4 for utility-first styling
- Dark mode support with CSS variables
- Responsive design built-in

### Animations
- Framer Motion for smooth, performant animations
- Pre-configured animation variants in `lib/theme.ts`

### Type Safety
- Full TypeScript coverage
- Shared type definitions in `lib/types.ts`

### Code Quality
- ESLint with Next.js recommended config
- Prettier for consistent code formatting
- Import alias `@/*` for cleaner imports

## Development Guidelines

### Components
- Use `"use client"` directive for components with client-side features
- Import utilities from `@/lib` using the path alias
- Use the `cn()` utility for conditional className merging
- Follow existing component patterns

### Styling
- Prefer Tailwind utility classes
- Use theme configuration from `lib/theme.ts`
- Support dark mode with `dark:` prefix
- Use Framer Motion for animations

### API Routes
- Create API endpoints in `pages/api/`
- Use TypeScript for request/response types
- Follow RESTful conventions

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run format`
4. Ensure `npm run build` succeeds
5. Submit a pull request

## License

ISC
