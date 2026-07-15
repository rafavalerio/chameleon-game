"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/game-context";
import { ConfirmDialog } from "./confirm-dialog";

export function ResetGameButton() {
  const { resetGame } = useGame();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="absolute h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60"
        style={{
          top: "max(0.5rem, calc(env(safe-area-inset-top) + 0.5rem))",
          right: "max(0.75rem, calc(env(safe-area-inset-right) + 0.75rem))",
        }}
        aria-label="Reset game"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Reset Game?"
        description="Are you sure you want to reset the game? This will return you to the player setup screen and all progress will be lost."
        confirmLabel="Reset Game"
        onConfirm={resetGame}
      />
    </>
  );
}
