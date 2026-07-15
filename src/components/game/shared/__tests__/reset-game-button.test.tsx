import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameProvider } from "@/lib/game-context";
import { ResetGameButton } from "../reset-game-button";

beforeEach(() => {
  localStorage.clear();
});

function renderResetButton() {
  return render(
    <GameProvider>
      <ResetGameButton />
    </GameProvider>
  );
}

describe("ResetGameButton", () => {
  it("does not show the confirmation dialog initially", () => {
    renderResetButton();
    expect(screen.queryByText("Reset Game?")).not.toBeInTheDocument();
  });

  it("opens the confirmation dialog when clicked", async () => {
    const user = userEvent.setup();
    renderResetButton();

    await user.click(screen.getByRole("button", { name: "Reset game" }));

    expect(screen.getByText("Reset Game?")).toBeInTheDocument();
  });

  it("closes the dialog after confirming", async () => {
    const user = userEvent.setup();
    renderResetButton();

    await user.click(screen.getByRole("button", { name: "Reset game" }));
    await user.click(screen.getByRole("button", { name: "Reset Game" }));

    expect(screen.queryByText("Reset Game?")).not.toBeInTheDocument();
  });

  it("closes the dialog when cancelled", async () => {
    const user = userEvent.setup();
    renderResetButton();

    await user.click(screen.getByRole("button", { name: "Reset game" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByText("Reset Game?")).not.toBeInTheDocument();
  });
});
