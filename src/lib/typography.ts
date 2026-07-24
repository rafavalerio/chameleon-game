/**
 * Typography
 *
 * Single source of truth for text styling used across game phase screens.
 * Change a role here rather than editing className strings in components.
 */

export const TEXT_STYLES = {
  /** Screen-level heading, e.g. "Discussion Time", "Time to Vote!" */
  screenTitle: "text-2xl font-bold",

  /** Supporting line under a screen title */
  screenSubtitle: "text-sm text-muted-foreground",

  /** Small caption above a value or a section, e.g. "Rafa's turn", "The topic was:" */
  label: "text-sm text-muted-foreground",

  /** A card's main title or question, e.g. "Tap to reveal your word", a player's name */
  prompt: "text-lg font-semibold",

  /** Secondary supporting line below a card's main content */
  hint: "text-sm text-muted-foreground",

  /** A standout single fact, e.g. the chameleon's name or the secret word in results */
  value: "text-2xl font-bold text-primary",

  /** A quoted line of content, e.g. the discussion question */
  quote: "text-lg font-medium text-center leading-relaxed",

  /** The bold pill banner used for the big word reveal */
  pill: "inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-black px-6 py-2",

  /** The colour-shifting pill used specifically for the CHAMELEON reveal */
  pillChameleon:
    "inline-flex items-center justify-center rounded-full chameleon-pill text-primary-foreground text-2xl font-black px-6 py-2",
} as const;
