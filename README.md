# 🦎 Chameleon - Party Game

A fun party game where players try to identify the chameleon among them. Built with Next.js, TypeScript, Tailwind CSS, and Shadcn UI.

## 🎮 How to Play

1. **Add Players** - Add 3-10 players to the game
2. **Choose a Topic** - Select a topic category (Animals, Food, Movies, etc.)
3. **Reveal Words** - Pass the device around. Each player taps to see their word. One player will be the "Chameleon" and won't see the word!
4. **Discussion** - Each player answers a question about the word. The Chameleon must bluff based on others' answers.
5. **Vote** - Everyone votes for who they think is the Chameleon
6. **Results** - The Chameleon is revealed! If caught, they get a chance to guess the word for bonus points.

## 🏆 Scoring

| Event | Points |
|-------|--------|
| Chameleon is caught | +10 points to everyone else |
| Chameleon survives | +30 points to Chameleon |
| Chameleon guesses word correctly | +20 bonus points |

Points are configurable in `src/lib/game-config.ts`.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📱 PWA Support

This app is designed to work as a Progressive Web App (PWA) and can be added to your iOS home screen:

1. Open the app in Safari on your iPhone
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will now work like a native app!

## 🎨 Customisation

### Themes & Colours

Colours are defined using CSS custom properties in `src/app/globals.css`. The app uses the OKLCH colour space for better colour manipulation.

Key colour variables:
- `--primary` - Main brand colour
- `--chameleon` - Chameleon-specific green
- `--game-*` - Playful accent colours

### Typography

The app font is [Onest](https://fonts.google.com/specimen/Onest), self-hosted via
`@fontsource-variable/onest` and wired to `--font-sans` in `globals.css`.

Text styling for game screens (titles, labels, hints, standout values, the word-reveal pill) is
centralised in `src/lib/typography.ts` as a single `TEXT_STYLES` object, consumed through the
components in `src/components/game/shared/content-text.tsx` (`ScreenTitle`, `Label`, `Prompt`,
`Hint`, `Value`, `Quote`, `Pill`, etc.). Change a role once in `typography.ts` and it updates
everywhere it's used.

### Game Configuration

Edit `src/lib/game-config.ts` to customise:
- Point values
- Min/max player counts
- Name length limits

### Topics, Words & Questions

Edit `src/lib/game-data.ts` to:
- Add new topics
- Add words to existing topics
- Add new questions

Example topic structure:

```typescript
{
  id: "unique-id",
  name: "Topic Name",
  emoji: "🎯",
  description: "Short description",
  words: ["Word1", "Word2", "Word3", ...],
  questions: [
    "Question about the word?",
    "Another question?",
    ...
  ],
}
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn UI
- **Font**: Onest (`@fontsource-variable/onest`, self-hosted)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Theme & global styles
│   ├── layout.tsx       # Root layout with PWA metadata
│   └── page.tsx         # Main game page
├── components/
│   ├── game/            # Game phase components
│   │   ├── player-setup.tsx
│   │   ├── topic-selection.tsx
│   │   ├── word-reveal.tsx
│   │   ├── questions-phase.tsx
│   │   ├── voting-phase.tsx
│   │   ├── chameleon-guess.tsx
│   │   ├── final-results.tsx
│   │   └── shared/          # Reusable page-layout, button, and content-text primitives
│   └── ui/              # Shadcn UI components
├── lib/
│   ├── game-config.ts   # Point values & settings
│   ├── game-data.ts     # Topics, words & questions
│   ├── game-context.tsx # Game state management
│   ├── typography.ts    # Centralised text-style tokens
│   └── utils.ts         # Utility functions
public/
├── icons/               # PWA icons
└── manifest.json        # PWA manifest
```

## 🎯 Future Improvements

- [ ] Add more topics and questions
- [ ] Implement dark mode toggle
- [ ] Add sound effects
- [ ] Multiplayer over network
- [ ] Game history/statistics
- [ ] Custom topic creation

## 📄 Licence

MIT License - feel free to use this for your own projects!

---

Made with 💚 for game nights everywhere!
