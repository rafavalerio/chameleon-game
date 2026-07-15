# CLAUDE.md

This file gives Claude Code (claude.ai/code) guidance for working in this repository.

## Project Overview

Chameleon is a pass-and-play party game: one device is passed around a group of 3-10 players.
Each player sees a secret word except the "Chameleon," who must bluff through a discussion round
and avoid being voted out. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and
Shadcn UI. Ships as an installable PWA for use on a single phone at a table.

## Commands

```bash
npm run dev      # Start dev server (Next.js, Turbopack)
npm run build    # Production build
npm start        # Run the production build
npm run lint     # ESLint
```

There is no test suite configured in this repo.

## Architecture

### State machine

All game state lives in a single `useReducer` in [src/lib/game-context.tsx](src/lib/game-context.tsx),
exposed via the `useGame()` hook and `<GameProvider>`. There is no external state library and no
server — the whole game runs client-side in one `GameState` object, driven by a `phase` field:

```
setup → topic-selection → word-reveal → questions → voting → (chameleon-guess |) → final-results
```

[src/components/game/game.tsx](src/components/game/game.tsx) is a pure switch over `state.phase`
that renders one phase component per state, with Framer Motion page transitions. Each phase has a
matching component in [src/components/game/](src/components/game/) (`player-setup.tsx`,
`topic-selection.tsx`, `word-reveal.tsx`, `questions-phase.tsx`, `voting-phase.tsx`,
`chameleon-guess.tsx`, `final-results.tsx`). To change how a phase behaves, edit its component; to
change what transitions are possible, edit the reducer.

Player names (not scores or game state) persist to `localStorage` so players don't have to
re-enter names between rounds — see `loadPlayersFromStorage`/`savePlayersToStorage` in
game-context.tsx.

### Config and content are data, not code

- [src/lib/game-config.ts](src/lib/game-config.ts) — point values, min/max players, name length
  limits. Change numbers here, not in the reducer.
- [src/lib/game-data.ts](src/lib/game-data.ts) — topics, words, and discussion questions. Adding a
  topic is a data change here, not a component change.

### UI layer

- `src/components/ui/` — Shadcn UI primitives (button, card, dialog, input, etc.). Follow the
  existing Shadcn conventions (`cva` variants, `cn()` from `src/lib/utils.ts`) when adding new
  primitives rather than hand-rolling styles.
- Theme colours are CSS custom properties in `src/app/globals.css` using OKLCH. Key variables:
  `--primary`, `--chameleon`, `--game-*`.
- Path alias `@/*` maps to `src/*` (see tsconfig.json).

### PWA

`public/manifest.json` and `public/icons/` provide install-to-homescreen support. Icons are
generated via `scripts/generate-icons.js` from `public/chameleon-logo.png` — regenerate icons with
that script rather than editing files under `public/icons/` by hand.

## Working in this repo

- This is a single-player-device, no-backend app — don't introduce a server, database, or network
  calls unless the user explicitly asks for multiplayer/networked features (listed as a future
  idea in the README, not yet built).
- Scoring, player limits, and other tunables belong in `game-config.ts`; game content (topics,
  words, questions) belongs in `game-data.ts`. Keep both out of component files.
- Phase transitions should go through reducer actions in `game-context.tsx`, not be inferred
  ad-hoc in components.
