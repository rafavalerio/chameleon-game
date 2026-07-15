import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dialog, DialogContent, DialogTitle } from "../dialog";

describe("Dialog", () => {
  it("portals outside a backdrop-blur ancestor instead of being trapped in its containing block", () => {
    const blurredAncestor = document.createElement("div");
    blurredAncestor.className = "backdrop-blur-sm";
    document.body.appendChild(blurredAncestor);

    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
      { container: blurredAncestor }
    );

    const dialogTitle = screen.getByText("Test Dialog");
    expect(blurredAncestor.contains(dialogTitle)).toBe(false);
    expect(document.body.contains(dialogTitle)).toBe(true);

    document.body.removeChild(blurredAncestor);
  });
});
