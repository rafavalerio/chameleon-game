"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { GAME_CONFIG } from "./game-config";
import { Topic, getRandomWord, getRandomQuestions } from "./game-data";

// Types
export interface Player {
  id: string;
  name: string;
  score: number;
  hasRevealed: boolean;
  isChameleon: boolean;
  votedFor: string | null;
}

export type GamePhase =
  | "setup" // Adding players
  | "topic-selection" // Selecting a topic
  | "word-reveal" // Players revealing their word/chameleon status
  | "questions" // Discussion phase with questions
  | "voting" // Voting for the chameleon
  | "results" // Showing round results
  | "chameleon-guess" // Chameleon guesses the word
  | "final-results"; // Final results after chameleon guess

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentTopic: Topic | null;
  secretWord: string | null;
  questions: string[];
  currentPlayerIndex: number;
  roundNumber: number;
  chameleonId: string | null;
  eliminatedPlayerId: string | null;
  chameleonGuessedCorrectly: boolean | null;
}

// Actions
type GameAction =
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "CLEAR_PLAYERS" }
  | { type: "START_TOPIC_SELECTION" }
  | { type: "SELECT_TOPIC"; topic: Topic }
  | { type: "REVEAL_WORD"; playerId: string }
  | { type: "START_QUESTIONS" }
  | { type: "NEXT_QUESTION" }
  | { type: "START_VOTING" }
  | { type: "CAST_VOTE"; voterId: string; votedForId: string }
  | { type: "CALCULATE_RESULTS" }
  | { type: "CHAMELEON_GUESS"; correct: boolean }
  | { type: "NEW_ROUND" }
  | { type: "RESET_GAME" };

// Initial state
function getInitialState(): GameState {
  return {
    phase: "setup",
    players: loadPlayersFromStorage(),
    currentTopic: null,
    secretWord: null,
    questions: [],
    currentPlayerIndex: 0,
    roundNumber: 1,
    chameleonId: null,
    eliminatedPlayerId: null,
    chameleonGuessedCorrectly: null,
  };
}

// Helper to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// LocalStorage helpers
const PLAYERS_STORAGE_KEY = "chameleon-game-players";

function savePlayersToStorage(players: Player[]): void {
  if (typeof window !== "undefined") {
    try {
      const playersData = players.map((p) => ({ id: p.id, name: p.name }));
      localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(playersData));
    } catch (error) {
      console.error("Failed to save players to localStorage:", error);
    }
  }
}

function loadPlayersFromStorage(): Player[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PLAYERS_STORAGE_KEY);
      if (stored) {
        const playersData = JSON.parse(stored);
        return playersData.map((p: { id: string; name: string }) => ({
          id: p.id,
          name: p.name,
          score: 0,
          hasRevealed: false,
          isChameleon: false,
          votedFor: null,
        }));
      }
    } catch (error) {
      console.error("Failed to load players from localStorage:", error);
    }
  }
  return [];
}

// Helper to select random chameleon
function selectRandomChameleon(players: Player[]): string {
  if (players.length === 0) {
    throw new Error("Cannot select chameleon from empty players array");
  }
  // Use crypto.getRandomValues for better randomness if available, otherwise fallback to Math.random
  let randomIndex: number;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    randomIndex = randomArray[0] % players.length;
  } else {
    randomIndex = Math.floor(Math.random() * players.length);
  }
  return players[randomIndex].id;
}

// Helper to count votes and determine eliminated player
function countVotes(players: Player[]): string | null {
  const voteCounts: Record<string, number> = {};
  
  players.forEach((player) => {
    if (player.votedFor) {
      voteCounts[player.votedFor] = (voteCounts[player.votedFor] || 0) + 1;
    }
  });
  
  let maxVotes = 0;
  let eliminatedId: string | null = null;
  let isTie = false;
  
  Object.entries(voteCounts).forEach(([playerId, votes]) => {
    if (votes > maxVotes) {
      maxVotes = votes;
      eliminatedId = playerId;
      isTie = false;
    } else if (votes === maxVotes) {
      isTie = true;
    }
  });
  
  // In case of a tie, no one is eliminated (or you could implement tie-breaker logic)
  return isTie ? null : eliminatedId;
}

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER": {
      if (state.players.length >= GAME_CONFIG.MAX_PLAYERS) {
        return state;
      }
      const newPlayer: Player = {
        id: generateId(),
        name: action.name,
        score: 0,
        hasRevealed: false,
        isChameleon: false,
        votedFor: null,
      };
      const updatedPlayers = [...state.players, newPlayer];
      savePlayersToStorage(updatedPlayers);
      return {
        ...state,
        players: updatedPlayers,
      };
    }

    case "REMOVE_PLAYER": {
      const updatedPlayers = state.players.filter((p) => p.id !== action.id);
      savePlayersToStorage(updatedPlayers);
      return {
        ...state,
        players: updatedPlayers,
      };
    }

    case "CLEAR_PLAYERS": {
      savePlayersToStorage([]);
      return {
        ...state,
        players: [],
      };
    }

    case "START_TOPIC_SELECTION": {
      if (state.players.length < GAME_CONFIG.MIN_PLAYERS) {
        return state;
      }
      return {
        ...state,
        phase: "topic-selection",
      };
    }

    case "SELECT_TOPIC": {
      // Ensure we have enough players
      if (state.players.length < GAME_CONFIG.MIN_PLAYERS) {
        return state;
      }
      
      // Select a random chameleon
      const chameleonId = selectRandomChameleon(state.players);
      const secretWord = getRandomWord(action.topic);
      const questions = getRandomQuestions(action.topic, state.players.length);
      
      // Reset all players and assign chameleon status
      const updatedPlayers = state.players.map((player) => ({
        ...player,
        hasRevealed: false,
        isChameleon: player.id === chameleonId,
        votedFor: null,
      }));
      
      // Verify chameleon was assigned correctly
      const chameleonExists = updatedPlayers.some((p) => p.isChameleon);
      if (!chameleonExists) {
        console.error("Failed to assign chameleon - this should not happen");
        return state;
      }
      
      return {
        ...state,
        phase: "word-reveal",
        currentTopic: action.topic,
        secretWord,
        questions,
        chameleonId,
        players: updatedPlayers,
        currentPlayerIndex: 0,
        eliminatedPlayerId: null,
        chameleonGuessedCorrectly: null,
      };
    }

    case "REVEAL_WORD": {
      const updatedPlayers = state.players.map((player) =>
        player.id === action.playerId
          ? { ...player, hasRevealed: true }
          : player
      );
      
      const allRevealed = updatedPlayers.every((p) => p.hasRevealed);
      
      return {
        ...state,
        players: updatedPlayers,
        phase: allRevealed ? "questions" : state.phase,
        currentPlayerIndex: allRevealed ? 0 : state.currentPlayerIndex,
      };
    }

    case "START_QUESTIONS": {
      return {
        ...state,
        phase: "questions",
        currentPlayerIndex: 0,
      };
    }

    case "NEXT_QUESTION": {
      const nextIndex = state.currentPlayerIndex + 1;
      if (nextIndex >= state.players.length) {
        return {
          ...state,
          phase: "voting",
          currentPlayerIndex: 0,
        };
      }
      return {
        ...state,
        currentPlayerIndex: nextIndex,
      };
    }

    case "START_VOTING": {
      return {
        ...state,
        phase: "voting",
      };
    }

    case "CAST_VOTE": {
      const updatedPlayers = state.players.map((player) =>
        player.id === action.voterId
          ? { ...player, votedFor: action.votedForId }
          : player
      );
      
      return {
        ...state,
        players: updatedPlayers,
      };
    }

    case "CALCULATE_RESULTS": {
      // Ensure we have a chameleon assigned
      if (!state.chameleonId) {
        console.error("Cannot calculate results - no chameleon assigned");
        return state;
      }
      
      const eliminatedId = countVotes(state.players);
      const chameleonCaught = eliminatedId === state.chameleonId;
      
      // Calculate scores
      const updatedPlayers = state.players.map((player) => {
        let scoreChange = 0;
        
        if (chameleonCaught && !player.isChameleon) {
          // Everyone except chameleon gets points
          scoreChange = GAME_CONFIG.POINTS_CHAMELEON_CAUGHT;
        } else if (!chameleonCaught && player.isChameleon) {
          // Chameleon survives
          scoreChange = GAME_CONFIG.POINTS_CHAMELEON_SURVIVES;
        }
        
        return {
          ...player,
          score: player.score + scoreChange,
        };
      });
      
      return {
        ...state,
        players: updatedPlayers,
        eliminatedPlayerId: eliminatedId,
        phase: chameleonCaught ? "chameleon-guess" : "final-results",
      };
    }

    case "CHAMELEON_GUESS": {
      // Ensure we have a chameleon
      if (!state.chameleonId) {
        console.error("Cannot process chameleon guess - no chameleon assigned");
        return state;
      }
      
      let updatedPlayers = state.players;
      
      if (action.correct) {
        updatedPlayers = state.players.map((player) =>
          player.isChameleon
            ? {
                ...player,
                score: player.score + GAME_CONFIG.POINTS_CHAMELEON_GUESSES_WORD,
              }
            : player
        );
      }
      
      // Verify chameleon exists in updated players
      const chameleonExists = updatedPlayers.some((p) => p.isChameleon);
      if (!chameleonExists) {
        console.error("Chameleon not found in players - this should not happen");
        return state;
      }
      
      return {
        ...state,
        players: updatedPlayers,
        chameleonGuessedCorrectly: action.correct,
        phase: "final-results",
      };
    }

    case "NEW_ROUND": {
      // Ensure we have enough players for a new round
      if (state.players.length < GAME_CONFIG.MIN_PLAYERS) {
        return {
          ...state,
          phase: "setup",
        };
      }
      
      // Reset all players for the new round (chameleon will be selected when topic is chosen)
      const resetPlayers = state.players.map((player) => ({
        ...player,
        hasRevealed: false,
        isChameleon: false,
        votedFor: null,
      }));
      
      return {
        ...state,
        phase: "topic-selection",
        players: resetPlayers,
        currentTopic: null,
        secretWord: null,
        questions: [],
        currentPlayerIndex: 0,
        roundNumber: state.roundNumber + 1,
        chameleonId: null,
        eliminatedPlayerId: null,
        chameleonGuessedCorrectly: null,
      };
    }

    case "RESET_GAME": {
      // Preserve players from localStorage
      const savedPlayers = loadPlayersFromStorage();
      return {
        ...getInitialState(),
        players: savedPlayers,
      };
    }

    default:
      return state;
  }
}

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Helper functions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  clearPlayers: () => void;
  startTopicSelection: () => void;
  selectTopic: (topic: Topic) => void;
  revealWord: (playerId: string) => void;
  nextQuestion: () => void;
  startVoting: () => void;
  castVote: (voterId: string, votedForId: string) => void;
  calculateResults: () => void;
  chameleonGuess: (correct: boolean) => void;
  newRound: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());

  const contextValue: GameContextType = {
    state,
    dispatch,
    addPlayer: (name: string) => dispatch({ type: "ADD_PLAYER", name }),
    removePlayer: (id: string) => dispatch({ type: "REMOVE_PLAYER", id }),
    clearPlayers: () => dispatch({ type: "CLEAR_PLAYERS" }),
    startTopicSelection: () => dispatch({ type: "START_TOPIC_SELECTION" }),
    selectTopic: (topic: Topic) => dispatch({ type: "SELECT_TOPIC", topic }),
    revealWord: (playerId: string) => dispatch({ type: "REVEAL_WORD", playerId }),
    nextQuestion: () => dispatch({ type: "NEXT_QUESTION" }),
    startVoting: () => dispatch({ type: "START_VOTING" }),
    castVote: (voterId: string, votedForId: string) =>
      dispatch({ type: "CAST_VOTE", voterId, votedForId }),
    calculateResults: () => dispatch({ type: "CALCULATE_RESULTS" }),
    chameleonGuess: (correct: boolean) =>
      dispatch({ type: "CHAMELEON_GUESS", correct }),
    newRound: () => dispatch({ type: "NEW_ROUND" }),
    resetGame: () => dispatch({ type: "RESET_GAME" }),
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}

// Hook
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
