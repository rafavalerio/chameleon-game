import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScreenTitle } from "../content-text";

describe("ScreenTitle", () => {
  it("uses the page's primary heading level", () => {
    render(<ScreenTitle>Choose a Topic</ScreenTitle>);

    expect(screen.getByRole("heading", { level: 1, name: "Choose a Topic" })).toBeInTheDocument();
  });
});
