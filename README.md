# Lumora: Illuminate Your Business Performance

A modern SaaS dashboard for monitoring business performance, analytics, and growth. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Brand

**Lumora** combines *luminous* + *ora* (time/now), a dashboard that illuminates real-time business insights. The logo features:

- **The Beam**: A stylized "L" letterform representing structural data foundations
- **The Prism**: A faceted crystal refracting light into actionable insight
- **The Spark**: A luminous point at the apex representing the moment of clarity

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Auth**: NextAuth.js v5
- **Data Fetching**: SWR
- **Icons**: Lucide React
- **i18n**: next-intl
- **Testing**: Vitest + Playwright

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

### Demo Credentials

- **Email**: alex@lumora.io
- **Password**: demo1234

## Project Structure

```
src/
  app/               # Next.js App Router pages
    (auth)/           # Login/Register pages
    (dashboard)/      # Main dashboard + sub-pages
    api/              # API route handlers
  components/
    dashboard/        # Dashboard-specific components
    layout/           # Sidebar, header, navigation
    ui/               # Reusable UI primitives
  hooks/              # Custom React hooks
  lib/                # Auth, SWR, theme, utilities
  i18n/               # Internationalization messages
medical-image-classifier/  # ML image classification pipeline (Python)
```

## Logo Assets

Run the logo generator to regenerate brand SVG assets:

```bash
python3 scripts/generate_logo.py
```

This produces 8 SVG variants in `public/`:

| File | Usage |
|------|-------|
| `lumora-icon.svg` | Favicon, footer logo (light bg) |
| `lumora-icon-white.svg` | Nav, auth headers (dark bg contexts) |
| `lumora-logo.svg` | Hero, horizontal logo (light bg) |
| `lumora-logo-white.svg` | Sidebar, auth gradient (dark bg) |
| `lumora-loading.svg` | Dashboard loading (light mode) |
| `lumora-loading-white.svg` | Dashboard loading (dark mode) |
| `favicon.svg` | Browser tab icon (simplified) |
| `apple-touch-icon.svg` | iOS home screen icon |

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run typecheck  # TypeScript type-checking
npm test           # Vitest unit tests
npm run test:e2e   # Playwright end-to-end tests
```

## License

MIT
