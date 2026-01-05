"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ChevronRight, Vote, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGame } from "@/lib/game-context";

export function QuestionsPhase() {
  const { state, nextQuestion, startVoting, resetGame } = useGame();
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const currentQuestion = state.questions[state.currentPlayerIndex];
  const currentPlayer = state.players[state.currentPlayerIndex];
  const isLastQuestion = state.currentPlayerIndex >= state.players.length - 1;
  const progress = ((state.currentPlayerIndex + 1) / state.players.length) * 100;

  const handleNext = () => {
    if (isLastQuestion) {
      startVoting();
    } else {
      nextQuestion();
    }
  };

  const handleReset = () => {
    resetGame();
    setShowResetDialog(false);
  };

  return (
    <div className="h-full flex flex-col max-w-md mx-auto">
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-shrink-0 pt-3 pb-3 px-4 text-center space-y-2 border-b border-border/50 bg-background/95 backdrop-blur-sm relative"
        style={{ paddingTop: 'max(0.5rem, calc(env(safe-area-inset-top) + 0.5rem))', paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowResetDialog(true)}
          className="absolute h-8 w-8 text-muted-foreground hover:text-destructive border-2"
          style={{ top: 'max(0.5rem, calc(env(safe-area-inset-top) + 0.5rem))', right: 'max(0.75rem, calc(env(safe-area-inset-right) + 0.75rem))' }}
          aria-label="Reset game"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <MessageCircle className="w-12 h-12 mx-auto text-game-blue" />
        </motion.div>
        <h2 className="text-2xl font-bold">Discussion Time</h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <span className="text-xl">{state.currentTopic?.emoji}</span>
          <span>{state.currentTopic?.name}</span>
        </div>
      </motion.div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 space-y-6"
        style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            Question {state.currentPlayerIndex + 1} of {state.players.length}
          </p>
        </div>

        {/* Current player's turn */}
        <motion.div
          key={currentPlayer.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="border-2 border-primary/40">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-3"
                >
                  <span className="text-2xl font-bold text-primary">
                    {currentPlayer.name.charAt(0).toUpperCase()}
                  </span>
                </motion.div>
                <p className="text-lg font-semibold">{currentPlayer.name}</p>
                <p className="text-sm text-muted-foreground">answers the question</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-xl bg-gradient-to-br from-game-yellow/20 to-game-orange/10 border border-game-yellow/20"
              >
                <p className="text-lg font-medium text-center leading-relaxed">
                  &ldquo;{currentQuestion}&rdquo;
                </p>
              </motion.div>

              <p className="text-sm text-center text-muted-foreground">
                {state.players
                  .filter((p) => p.id !== currentPlayer.id)
                  .map((p) => p.name)
                  .join(", ")}{" "}
                — listen carefully!
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-center text-muted-foreground pb-4"
        >
          💡 Tip: Give enough detail to seem legitimate, but not too much that the
          chameleon can guess the word!
        </motion.p>
      </div>

      {/* Fixed Footer */}
      <div 
        className="flex-shrink-0 px-4 pt-3 pb-4 border-t border-border/50 bg-background/95 backdrop-blur-sm"
        style={{ paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 1rem))', paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <Button
          onClick={handleNext}
          className={`w-full h-14 text-lg font-semibold ${
            isLastQuestion
              ? "bg-gradient-to-r from-game-purple to-game-pink hover:from-game-pink hover:to-game-purple"
              : ""
          }`}
          size="lg"
        >
          {isLastQuestion ? (
            <>
              <Vote className="w-5 h-5 mr-2" />
              Start Voting
            </>
          ) : (
            <>
              Next Player
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Game?</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the game? This will return you to the player setup screen and all progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
            >
              Reset Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
