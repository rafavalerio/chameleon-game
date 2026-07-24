"use client";

import { useState } from "react";
import { Home } from "lucide-react";
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
        size="icon-lg"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60"
        aria-label="Reset game"
      >
        <Home className="w-4 h-4" />
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
