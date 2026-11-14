import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameProvider } from "@/lib/game-context";
import { topics } from "@/lib/game-data";
import { TopicSelection } from "../topic-selection";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("framer-motion", async (importOriginal) => ({
  ...await importOriginal<typeof import("framer-motion")>(),
  useReducedMotion: () => motionPreference.reduced,
}));

beforeEach(() => {
  localStorage.clear();
  motionPreference.reduced = false;
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

  it("keeps tile entrance motion free of transforms that can jump", () => {
    render(
      <GameProvider>
        <TopicSelection />
      </GameProvider>
    );

    expect(screen.getByRole("button", { name: /Animals/ }).style.transform).toBe("");
  });

  it("skips the tile entrance when reduced motion is preferred", () => {
    motionPreference.reduced = true;

    render(
      <GameProvider>
        <TopicSelection />
      </GameProvider>
    );

    expect(screen.getByRole("button", { name: /Animals/ }).style.opacity).not.toBe("0");
  });
});
