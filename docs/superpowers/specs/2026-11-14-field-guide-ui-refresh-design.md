# Chameleon Field Guide UI Refresh

## Intent

Give Chameleon a coherent, polished, easy-to-scan interface for groups playing on one shared device. The accepted visual direction is **Field guide**: warm paper neutrals, leafy greens, calm spacing, clear player cards, and a friendly tabletop feel. Use the existing Chameleon brand artwork and Lucide icons. Do not use emojis in the product UI.

## Goals

- Improve visual hierarchy, readability, and consistency across every game phase.
- Make the interface comfortable on phones, with clear tap targets, visible keyboard focus, legible contrast, and safe-area support.
- Keep each screen's current information and actions easy to identify.
- Establish a consistent type scale and weight hierarchy using the existing Onest Variable font.
- Balance the score values while keeping the current award conditions and round sequence.

## Non-goals

- No changes to player limits, word selection, turn order, voting, game state, or phase transitions.
- No new game features, settings, themes, or dependencies.
- No emoji artwork or emoji characters in the interface.

## Approaches considered

1. **Shared Field guide system (selected):** Update the existing theme tokens, shared page layout, typography, and UI primitives, then adjust phase-specific layouts where their content needs clearer emphasis. This fits the current component structure and keeps the screens consistent.
2. **Style every phase independently:** This offers local freedom but repeats styling and risks visual drift across the game.
3. **Replace the UI component structure:** This would increase the change surface without helping the requested visual refresh, and adds avoidable risk to the existing interactions.

The user chose the Field guide visual direction. As an implementation assumption, use approach 1 because the game already shares layout, typography, and UI components across its phases.

## Scope

Apply the visual system to player setup, topic selection, word reveal, discussion, voting, chameleon guess, and final results. Shared page layout, phase progress, typography roles, player avatars, reset confirmation, and the button, card, input, and badge styles are in scope where needed. Keep the app's current mobile-first, single-column game presentation, while ensuring it remains balanced at wider viewport sizes.

Use warm off-white surfaces, restrained green accents, softer borders, purposeful spacing, and clear heading/body/caption roles. Keep secondary information visually quiet and game-critical prompts and actions prominent. Preserve touch-friendly controls, visible focus and disabled states, safe-area spacing, and reduced-motion support.

Make the chameleon word reveal more vivid with a cohesive deep jewel-tone gradient and a more expressive, smooth colour-flow animation. Keep the word highly legible and respect reduced-motion preferences.

Keep the installed, locally bundled Onest Variable font. Use the shared roles in `src/lib/typography.ts` as the type standard: screen title 30 px bold, prompt/quote 20 px semibold/medium, subtitle 16 px regular, supporting hint 14 px regular, and labels 12 px semibold uppercase. Use 600 weight for controls and 700 for standout values.

Score values: each non-chameleon earns 10 points when the chameleon is caught; a chameleon who escapes the vote earns 20; a caught chameleon earns a 10-point bonus for a correct guess and 0 for a wrong guess. Keep the existing conditions for when each award applies.

## Constraints

- Keep game interaction handlers and phase routing unchanged. Component boundaries may be reorganised when a small, clear change improves shared primitives, typography, or hierarchy.
- Do not change the state provider, game data, or phase routing. Preserve the existing score-award conditions; only the point values change.
- Use the installed font, Tailwind setup, Lucide icons, and existing brand assets. Add no dependency.
- Product UI contains no emoji characters.

## Builder choices

Use shared theme and layout updates for consistency, then make the smallest necessary local markup/class changes to improve hierarchy in each phase. Preserve all labels and information needed to play. Avoid adding decorative elements that compete with the current player's turn, secret-word reveal, voting choice, or next action.
