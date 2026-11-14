import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChameleonGuess } from "../chameleon-guess";
import { FinalResults } from "../final-results";

const mockedGame = vi.hoisted(() => ({ useGame: vi.fn() }));

vi.mock("@/lib/game-context", () => ({ useGame: mockedGame.useGame }));

const longName = "Uncharacteristically";

beforeEach(() => {
  mockedGame.useGame.mockReturnValue({
    state: {
      phase: "chameleon-guess",
      players: [
        {
          id: "chameleon",
          name: longName,
          score: 10,
          hasRevealed: true,
          isChameleon: true,
          votedFor: null,
        },
      ],
      currentTopic: {
        id: "test",
        name: "Animals",
        description: "Animals",
        icon: () => null,
        words: ["Tiger", "The Shawshank Redemption"],
        questions: [],
      },
      secretWord: "Tiger",
      eliminatedPlayerId: "chameleon",
      chameleonGuessedCorrectly: null,
    },
    chameleonGuess: vi.fn(),
    newRound: vi.fn(),
    resetGame: vi.fn(),
  });
});

describe("long content on narrow screens", () => {
  it("lets a chameleon name wrap beside the fixed status badge", () => {
    render(<FinalResults />);

    expect(screen.getAllByText(longName)[0]).toHaveClass("min-w-0", "break-words");
  });

  it("lets long secret word choices wrap and expand their buttons", () => {
    render(<ChameleonGuess />);

    expect(screen.getByRole("button", { name: "The Shawshank Redemption" })).toHaveClass(
      "whitespace-normal",
      "break-words",
      "min-h-14"
    );
  });
});
