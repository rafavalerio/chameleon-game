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

  it("adds a player via the input and shows them in the list", async () => {
    const user = userEvent.setup();
    renderPlayerSetup();

    const input = screen.getByPlaceholderText("Enter player name...");
    await user.type(input, "Amy{enter}");

    expect(screen.getByText("Amy")).toBeInTheDocument();
    expect(input).toHaveValue("");
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
