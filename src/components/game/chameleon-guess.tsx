"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGame } from "@/lib/game-context";
import { GAME_CONFIG } from "@/lib/game-config";

export function ChameleonGuess() {
  const { state, chameleonGuess, resetGame } = useGame();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const chameleon = state.players.find((p) => p.isChameleon);
  const topicWords = state.currentTopic?.words ?? [];
  const secretWord = state.secretWord;

  // Select 6 words: the secret word + 5 random others
  // Ensure secretWord exists before proceeding
  if (!secretWord) {
    return null;
  }

  const otherWords = topicWords.filter((word) => word !== secretWord);
  const randomOtherWords = [...otherWords]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
  
  // Combine secret word with 5 random words and shuffle
  const wordOptions: string[] = [secretWord, ...randomOtherWords].sort(
    () => Math.random() - 0.5
  );

  const handleGuess = (word: string) => {
    const isCorrect = word === state.secretWord;
    chameleonGuess(isCorrect);
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
        className="flex-shrink-0 pt-3 pb-3 px-4 text-center space-y-3 border-b border-border/50 bg-background/95 backdrop-blur-sm relative"
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
          transition={{ type: "spring", duration: 0.6 }}
          className="text-6xl"
        >
          🦎
        </motion.div>
        <h2 className="text-2xl font-bold">Chameleon&apos;s Last Chance!</h2>
        <p className="text-muted-foreground">
          {chameleon?.name} was caught, but can still earn{" "}
          <span className="font-semibold text-chameleon">
            {GAME_CONFIG.POINTS_CHAMELEON_GUESSES_WORD} points
          </span>{" "}
          by guessing the word
        </p>
      </motion.div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 space-y-6"
        style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        {/* Topic hint */}
        <Card className="border-2 border-chameleon/20 bg-chameleon/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">The topic was:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{state.currentTopic?.emoji}</span>
              <span className="text-lg font-semibold">
                {state.currentTopic?.name}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Word options */}
        <Card className="border-2 border-primary/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              What was the secret word?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.03 },
                },
              }}
              className="grid grid-cols-2 gap-2"
            >
              {wordOptions.map((word) => (
                <motion.div
                  key={word}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <Button
                    onClick={() => handleGuess(word)}
                    variant="outline"
                    className="w-full h-12 text-sm font-medium border-2 hover:border-chameleon/50 hover:bg-chameleon/5 transition-all"
                  >
                    {word}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-2 p-4 rounded-xl bg-game-yellow/10 border border-game-yellow/20"
        >
          <Sparkles className="w-5 h-5 text-game-yellow shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Think about the clues other players gave. What word fits all their
            answers?
          </p>
        </motion.div>
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
