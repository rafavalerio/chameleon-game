import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameProvider } from "@/lib/game-context";
import { GAME_CONFIG } from "@/lib/game-config";
import { PlayerSetup } from "../player-setup";

function renderPlayerSetup() {
  return render(
    <GameProvider>
      <PlayerSetup />
    </GameProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("PlayerSetup", () => {
  it("renders the empty state and a disabled Start Game button", () => {
    renderPlayerSetup();
    expect(screen.getByText(/No players yet/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start Game/i })).toBeDisabled();
  });

  it("provides a programmatic label for the player name field", () => {
    renderPlayerSetup();

    expect(screen.getByRole("textbox", { name: "Player name" })).toBeInTheDocument();
  });

  it("adds a player via the input and shows them in the list", async () => {
    const user = userEvent.setup();
    renderPlayerSetup();

    const input = screen.getByPlaceholderText("Enter player name...");
    await user.type(input, "Amy{enter}");

    expect(screen.getByText("Amy")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("allows long player names to wrap without pushing the remove action out", async () => {
    const user = userEvent.setup();
    renderPlayerSetup();

    const input = screen.getByRole("textbox", { name: "Player name" });
    await user.type(input, "Uncharacteristically{enter}");

    expect(screen.getByText("Uncharacteristically")).toHaveClass("min-w-0", "break-words");
  });

  it("enables Start Game once MIN_PLAYERS have been added", async () => {
    const user = userEvent.setup();
    renderPlayerSetup();

    const input = screen.getByPlaceholderText("Enter player name...");
    for (let i = 0; i < GAME_CONFIG.MIN_PLAYERS; i++) {
      await user.type(input, `Player${i}{enter}`);
    }

    expect(screen.getByRole("button", { name: /Start Game/i })).toBeEnabled();
  });
});
