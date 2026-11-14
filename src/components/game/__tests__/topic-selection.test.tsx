import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameProvider } from "@/lib/game-context";
import { topics } from "@/lib/game-data";
import { TopicSelection } from "../topic-selection";

beforeEach(() => {
  localStorage.clear();
});

describe("TopicSelection", () => {
  it("exposes each topic choice as a button", () => {
    render(
      <GameProvider>
        <TopicSelection />
      </GameProvider>
    );

    expect(screen.getByRole("button", { name: /Animals/ })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(topics.length + 1);
  });
});
