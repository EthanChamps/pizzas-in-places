## Project: Pizzas in Places
Mobile pizza business website - schedule, menu, events, blog, contact.

## Quick Start
```bash
npm install
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Project Structure
```
src/
  app/           # Pages (Next.js App Router)
  components/    # React components by feature
  lib/           # Utilities (schedule, blog)
  hooks/         # Custom React hooks
public/          # Static assets, icons
```

## Key Patterns
- Server components by default, "use client" when needed
- `@/` path alias for src imports
- Fonts: Cormorant Garamond (serif), Inter (sans)
- Styling: Tailwind utilities, neutral color palette

## Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

## Gotchas
- Images use external Unsplash URLs (configured in next.config)
- No database - schedule/blog data lives in lib/ files
