import { GamePhase } from "./game-context";

/**
 * Round-level steps shown as progress dots in the header.
 * "setup" has no dot (it's the entry point, not a step within a round).
 * "results" and "chameleon-guess" both map to the final "Results" step,
 * since guessing the word is part of resolving the round's outcome.
 */
export const PHASE_STEPS = ["Topic", "Reveal", "Discuss", "Vote", "Results"] as const;

const PHASE_TO_STEP: Partial<Record<GamePhase, number>> = {
  "topic-selection": 0,
  "word-reveal": 1,
  questions: 2,
  voting: 3,
  "chameleon-guess": 4,
  results: 4,
  "final-results": 4,
};

/** Returns the current step index (0-based), or null if the phase has no dot (e.g. "setup"). */
export function getPhaseStepIndex(phase: GamePhase): number | null {
  return PHASE_TO_STEP[phase] ?? null;
}
