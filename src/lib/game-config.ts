/**
 * Game Configuration
 * 
 * This file contains all configurable values for the Chameleon game.
 * Adjust these values to customise the game experience.
 */

export const GAME_CONFIG = {
  /** Points awarded to non-chameleon players when the chameleon is caught */
  POINTS_CHAMELEON_CAUGHT: 10,
  
  /** Points awarded to the chameleon when they survive the vote */
  POINTS_CHAMELEON_SURVIVES: 20,
  
  /** Bonus points for the chameleon if they guess the word correctly */
  POINTS_CHAMELEON_GUESSES_WORD: 10,
  
  /** Minimum number of players required to play */
  MIN_PLAYERS: 3,
  
  /** Maximum number of players allowed */
  MAX_PLAYERS: 10,
  
  /** Minimum length for player names */
  MIN_NAME_LENGTH: 1,
  
  /** Maximum length for player names */
  MAX_NAME_LENGTH: 20,
} as const;

export type GameConfig = typeof GAME_CONFIG;
