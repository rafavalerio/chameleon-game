import { describe, it, expect, beforeEach } from "vitest";
import { FlaskConical } from "lucide-react";
import { gameReducer, getInitialState, GameState, Player } from "../game-context";
import { GAME_CONFIG } from "../game-config";
import { Topic } from "../game-data";

const testTopic: Topic = {
  id: "test-topic",
  name: "Test Topic",
  icon: FlaskConical,
  description: "A topic for tests",
  words: ["Alpha", "Beta", "Gamma", "Delta"],
  questions: ["Question A?", "Question B?", "Question C?"],
};

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: overrides.id ?? Math.random().toString(36).slice(2),
    name: overrides.name ?? "Player",
    score: overrides.score ?? 0,
    hasRevealed: overrides.hasRevealed ?? false,
    isChameleon: overrides.isChameleon ?? false,
    votedFor: overrides.votedFor ?? null,
  };
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: "setup",
    players: [],
    currentTopic: null,
    secretWord: null,
    questions: [],
    currentPlayerIndex: 0,
    roundNumber: 1,
    chameleonId: null,
    eliminatedPlayerId: null,
    chameleonGuessedCorrectly: null,
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe("ADD_PLAYER / REMOVE_PLAYER / CLEAR_PLAYERS", () => {
  it("adds a player", () => {
    const state = makeState();
    const next = gameReducer(state, { type: "ADD_PLAYER", name: "Amy" });
    expect(next.players).toHaveLength(1);
    expect(next.players[0].name).toBe("Amy");
  });

  it("refuses to add a player beyond MAX_PLAYERS", () => {
    const players = Array.from({ length: GAME_CONFIG.MAX_PLAYERS }, () => makePlayer());
    const state = makeState({ players });
    const next = gameReducer(state, { type: "ADD_PLAYER", name: "Overflow" });
    expect(next.players).toHaveLength(GAME_CONFIG.MAX_PLAYERS);
  });

  it("removes a player by id", () => {
    const p1 = makePlayer({ id: "1", name: "A" });
    const p2 = makePlayer({ id: "2", name: "B" });
    const state = makeState({ players: [p1, p2] });
    const next = gameReducer(state, { type: "REMOVE_PLAYER", id: "1" });
    expect(next.players).toEqual([p2]);
  });

  it("clears all players", () => {
    const state = makeState({ players: [makePlayer(), makePlayer()] });
    const next = gameReducer(state, { type: "CLEAR_PLAYERS" });
    expect(next.players).toEqual([]);
  });
});

describe("START_TOPIC_SELECTION", () => {
  it("is blocked below MIN_PLAYERS", () => {
    const players = Array.from({ length: GAME_CONFIG.MIN_PLAYERS - 1 }, () => makePlayer());
    const state = makeState({ players });
    const next = gameReducer(state, { type: "START_TOPIC_SELECTION" });
    expect(next.phase).toBe("setup");
  });

  it("transitions to topic-selection at MIN_PLAYERS", () => {
    const players = Array.from({ length: GAME_CONFIG.MIN_PLAYERS }, () => makePlayer());
    const state = makeState({ players });
    const next = gameReducer(state, { type: "START_TOPIC_SELECTION" });
    expect(next.phase).toBe("topic-selection");
  });
});

describe("SELECT_TOPIC", () => {
  it("assigns exactly one chameleon and sets the secret word from the topic", () => {
    const players = [
      makePlayer({ id: "1" }),
      makePlayer({ id: "2" }),
      makePlayer({ id: "3" }),
    ];
    const state = makeState({ players, phase: "topic-selection" });
    const next = gameReducer(state, { type: "SELECT_TOPIC", topic: testTopic });

    expect(next.phase).toBe("word-reveal");
    expect(next.currentTopic).toBe(testTopic);
    expect(testTopic.words).toContain(next.secretWord);
    expect(next.chameleonId).not.toBeNull();

    const chameleons = next.players.filter((p) => p.isChameleon);
    expect(chameleons).toHaveLength(1);
    expect(chameleons[0].id).toBe(next.chameleonId);
  });

  it("resets per-round player fields", () => {
    const players = [
      makePlayer({ id: "1", hasRevealed: true, votedFor: "2" }),
      makePlayer({ id: "2", hasRevealed: true, votedFor: "1" }),
      makePlayer({ id: "3", hasRevealed: true }),
    ];
    const state = makeState({ players, phase: "topic-selection" });
    const next = gameReducer(state, { type: "SELECT_TOPIC", topic: testTopic });

    next.players.forEach((p) => {
      expect(p.hasRevealed).toBe(false);
      expect(p.votedFor).toBeNull();
    });
  });
});

describe("REVEAL_WORD", () => {
  it("stays in word-reveal until every player has revealed", () => {
    const players = [makePlayer({ id: "1" }), makePlayer({ id: "2" })];
    const state = makeState({ players, phase: "word-reveal" });
    const next = gameReducer(state, { type: "REVEAL_WORD", playerId: "1" });
    expect(next.phase).toBe("word-reveal");
    expect(next.players.find((p) => p.id === "1")?.hasRevealed).toBe(true);
  });

  it("advances to questions once all players have revealed", () => {
    const players = [
      makePlayer({ id: "1", hasRevealed: true }),
      makePlayer({ id: "2" }),
    ];
    const state = makeState({ players, phase: "word-reveal" });
    const next = gameReducer(state, { type: "REVEAL_WORD", playerId: "2" });
    expect(next.phase).toBe("questions");
    expect(next.currentPlayerIndex).toBe(0);
  });
});

describe("NEXT_QUESTION", () => {
  it("advances currentPlayerIndex while players remain", () => {
    const players = [makePlayer(), makePlayer(), makePlayer()];
    const state = makeState({ players, phase: "questions", currentPlayerIndex: 0 });
    const next = gameReducer(state, { type: "NEXT_QUESTION" });
    expect(next.currentPlayerIndex).toBe(1);
    expect(next.phase).toBe("questions");
  });

  it("moves to voting after the last player's question", () => {
    const players = [makePlayer(), makePlayer()];
    const state = makeState({ players, phase: "questions", currentPlayerIndex: 1 });
    const next = gameReducer(state, { type: "NEXT_QUESTION" });
    expect(next.phase).toBe("voting");
    expect(next.currentPlayerIndex).toBe(0);
  });
});

describe("CAST_VOTE / CALCULATE_RESULTS", () => {
  it("scores non-chameleons and moves to chameleon-guess when the chameleon is caught", () => {
    const chameleon = makePlayer({ id: "c", isChameleon: true });
    const p2 = makePlayer({ id: "2" });
    const p3 = makePlayer({ id: "3" });
    let state = makeState({
      players: [chameleon, p2, p3],
      phase: "voting",
      chameleonId: "c",
    });

    state = gameReducer(state, { type: "CAST_VOTE", voterId: "2", votedForId: "c" });
    state = gameReducer(state, { type: "CAST_VOTE", voterId: "3", votedForId: "c" });
    const next = gameReducer(state, { type: "CALCULATE_RESULTS" });

    expect(next.eliminatedPlayerId).toBe("c");
    expect(next.phase).toBe("chameleon-guess");
    expect(next.players.find((p) => p.id === "2")?.score).toBe(
      GAME_CONFIG.POINTS_CHAMELEON_CAUGHT
    );
    expect(next.players.find((p) => p.id === "3")?.score).toBe(
      GAME_CONFIG.POINTS_CHAMELEON_CAUGHT
    );
    expect(next.players.find((p) => p.id === "c")?.score).toBe(0);
  });

  it("scores the chameleon and moves to final-results when they escape", () => {
    const chameleon = makePlayer({ id: "c", isChameleon: true });
    const p2 = makePlayer({ id: "2" });
    const p3 = makePlayer({ id: "3" });
    let state = makeState({
      players: [chameleon, p2, p3],
      phase: "voting",
      chameleonId: "c",
    });

    state = gameReducer(state, { type: "CAST_VOTE", voterId: "c", votedForId: "2" });
    state = gameReducer(state, { type: "CAST_VOTE", voterId: "2", votedForId: "3" });
    state = gameReducer(state, { type: "CAST_VOTE", voterId: "3", votedForId: "2" });
    const next = gameReducer(state, { type: "CALCULATE_RESULTS" });

    expect(next.eliminatedPlayerId).toBe("2");
    expect(next.phase).toBe("final-results");
    expect(next.players.find((p) => p.id === "c")?.score).toBe(
      GAME_CONFIG.POINTS_CHAMELEON_SURVIVES
    );
  });

  it("treats a tied vote as no elimination, so the chameleon escapes", () => {
    const chameleon = makePlayer({ id: "c", isChameleon: true });
    const p2 = makePlayer({ id: "2" });
    let state = makeState({
      players: [chameleon, p2],
      phase: "voting",
      chameleonId: "c",
    });

    state = gameReducer(state, { type: "CAST_VOTE", voterId: "c", votedForId: "2" });
    state = gameReducer(state, { type: "CAST_VOTE", voterId: "2", votedForId: "c" });
    const next = gameReducer(state, { type: "CALCULATE_RESULTS" });

    expect(next.eliminatedPlayerId).toBeNull();
    expect(next.phase).toBe("final-results");
    expect(next.players.find((p) => p.id === "c")?.score).toBe(
      GAME_CONFIG.POINTS_CHAMELEON_SURVIVES
    );
  });
});

describe("CHAMELEON_GUESS", () => {
  it("awards bonus points on a correct guess", () => {
    const chameleon = makePlayer({ id: "c", isChameleon: true });
    const state = makeState({
      players: [chameleon, makePlayer({ id: "2" })],
      phase: "chameleon-guess",
      chameleonId: "c",
    });
    const next = gameReducer(state, { type: "CHAMELEON_GUESS", correct: true });
    expect(next.phase).toBe("final-results");
    expect(next.chameleonGuessedCorrectly).toBe(true);
    expect(next.players.find((p) => p.id === "c")?.score).toBe(
      GAME_CONFIG.POINTS_CHAMELEON_GUESSES_WORD
    );
  });

  it("awards no bonus on an incorrect guess", () => {
    const chameleon = makePlayer({ id: "c", isChameleon: true, score: 10 });
    const state = makeState({
      players: [chameleon, makePlayer({ id: "2" })],
      phase: "chameleon-guess",
      chameleonId: "c",
    });
    const next = gameReducer(state, { type: "CHAMELEON_GUESS", correct: false });
    expect(next.chameleonGuessedCorrectly).toBe(false);
    expect(next.players.find((p) => p.id === "c")?.score).toBe(10);
  });
});

describe("NEW_ROUND", () => {
  it("increments roundNumber, resets per-round fields, keeps players and scores", () => {
    const players = [
      makePlayer({ id: "1", score: 20, isChameleon: true, hasRevealed: true, votedFor: "2" }),
      makePlayer({ id: "2", score: 10, votedFor: "1" }),
      makePlayer({ id: "3" }),
    ];
    const state = makeState({
      players,
      phase: "final-results",
      roundNumber: 1,
      currentTopic: testTopic,
      secretWord: "Alpha",
      chameleonId: "1",
      eliminatedPlayerId: "1",
      chameleonGuessedCorrectly: true,
    });

    const next = gameReducer(state, { type: "NEW_ROUND" });

    expect(next.phase).toBe("topic-selection");
    expect(next.roundNumber).toBe(2);
    expect(next.currentTopic).toBeNull();
    expect(next.secretWord).toBeNull();
    expect(next.chameleonId).toBeNull();
    expect(next.eliminatedPlayerId).toBeNull();
    expect(next.chameleonGuessedCorrectly).toBeNull();
    expect(next.players.map((p) => p.score)).toEqual([20, 10, 0]);
    next.players.forEach((p) => {
      expect(p.isChameleon).toBe(false);
      expect(p.hasRevealed).toBe(false);
      expect(p.votedFor).toBeNull();
    });
  });

  it("returns to setup if too few players remain", () => {
    const players = Array.from({ length: GAME_CONFIG.MIN_PLAYERS - 1 }, () => makePlayer());
    const state = makeState({ players, phase: "final-results" });
    const next = gameReducer(state, { type: "NEW_ROUND" });
    expect(next.phase).toBe("setup");
  });
});

describe("RESET_GAME", () => {
  it("returns to the initial state", () => {
    const state = makeState({
      players: [makePlayer()],
      phase: "final-results",
      roundNumber: 3,
    });
    const next = gameReducer(state, { type: "RESET_GAME" });
    const initial = getInitialState();
    expect(next.phase).toBe(initial.phase);
    expect(next.roundNumber).toBe(initial.roundNumber);
  });
});
