# Field Guide UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh every Chameleon game screen with the approved Field guide visual system while preserving game rules, state, and phase flow.

**Architecture:** Keep the current Next.js and Tailwind foundations. Reuse shared game components where they help consistency, and adjust component boundaries when a small, clear change improves primitive or typography organisation. Keep game state and phase handling unchanged.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Lucide React, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-14-field-guide-ui-refresh-design.md`

## Global Constraints

- Preserve score-award conditions, player limits, word selection, turn order, voting, game state, and phase sequence.
- Use the installed Onest Variable font and the shared type roles in `src/lib/typography.ts` for consistent sizes and weights.
- Reorganise presentation components only when doing so improves shared responsibility and clarity without changing interactions.
- Use the installed font, Tailwind setup, Lucide icons, and existing brand assets. Add no dependency.
- Product UI contains no emoji characters.
- Preserve touch-friendly controls, visible focus and disabled states, safe-area spacing, and reduced-motion support.

## Review Focus

- Long player names and question text must wrap without overlapping actions or clipping.
- Minimum and maximum player counts must remain clear and usable on setup.
- Word reveal must keep the secret-word and chameleon states distinct and readable.
- Voting and guess choices must remain easy to identify and tap on narrow screens.
- Results with tied scores and long names must remain aligned and scannable.

---

### Task 1: Shared Field guide foundation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/lib/typography.ts`
- Modify: `src/components/game/shared/page-layout.tsx`
- Modify: `src/components/game/shared/content-text.tsx`
- Modify: `src/components/game/shared/phase-progress.tsx`
- Modify: `src/components/game/shared/player-avatar.tsx`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/input.tsx`
- Modify: `src/components/ui/badge.tsx`
- Test: `src/components/game/shared/__tests__/content-text.test.tsx`

- [x] Ensure each phase title uses the page's primary semantic heading level.
- [x] Update shared colour and surface tokens to warm paper neutrals and restrained leafy greens; retain readable contrast and existing avatar/chameleon accents.
- [x] Refine shared type roles, page width/spacing, header/content/footer alignment, progress indicator, and primitive shapes/states.
- [x] Keep safe-area insets, visible focus/disabled styling, responsive wrapping, and reduced-motion behaviour intact.
- [ ] Review at narrow and wide viewport sizes, including long text and keyboard focus.

### Task 2: Phase screen hierarchy

**Files:**
- Modify: `src/components/game/player-setup.tsx`
- Modify: `src/components/game/topic-selection.tsx`
- Modify: `src/components/game/word-reveal.tsx`
- Modify: `src/components/game/questions-phase.tsx`
- Modify: `src/components/game/voting-phase.tsx`
- Modify: `src/components/game/chameleon-guess.tsx`
- Modify: `src/components/game/final-results.tsx`
- Test: `src/components/game/__tests__/player-setup.test.tsx`
- Test: `src/components/game/__tests__/topic-selection.test.tsx`

- [x] Apply the shared styles consistently to setup, topic selection, secret-word passing, discussion, voting, last chance, and results.
- [x] Clarify each screen's heading, context, current player/task, progress, and primary action without removing needed information.
- [x] Ensure player entry has a visible programmatic label and topic choices are semantic, keyboard-accessible buttons.
- [x] Preserve existing handlers, conditional states, text meaning, and phase transitions; use only existing Lucide and brand imagery, with no emoji characters.
- [x] Review empty, partial, complete, and result states where present, including long names, tied scores, and narrow mobile widths.

### Task 3: Requested verification

**Files:** None

- [x] Run `npm test` after implementation and report the result.
- [ ] Run the app for visual review at mobile and desktop widths; check alignment, reading order, controls, and that no emoji characters appear in the product UI.
- [x] Run `npm run lint` and `npm run build` to catch styling/type integration issues.
- [x] Confirm changes are limited to presentation and score values, with score-award conditions, game state, and phase flow preserved.

### Task 4: Balance score values

**Files:**
- Modify: `src/lib/game-config.ts`
- Modify: `src/lib/__tests__/game-context.test.ts`
- Modify: `README.md`

- [x] Update expected score assertions first so the current escape and correct-guess rewards fail against the agreed values.
- [x] Set caught-group points to 10 each, chameleon escape points to 20, and caught-and-correct guess bonus to 10; leave wrong guesses at 0.
- [x] Document all four score outcomes in the README without changing when scores are awarded.
- [x] Run the focused game-context tests, then the full suite after all work.

### Task 5: Refine the chameleon reveal effect

**Files:**
- Modify: `src/app/globals.css`

- [x] Use vivid, cohesive green, teal, violet, and amber tones that retain strong white-text contrast.
- [x] Make the pill's gradient flow more expressively, with a restrained glow, while preserving the existing reduced-motion rule.
- [x] Review the chameleon word reveal in the running app for legibility and visual balance.
