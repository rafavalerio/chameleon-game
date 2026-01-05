"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGame } from "@/lib/game-context";
import { topics, Topic } from "@/lib/game-data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function TopicSelection() {
  const { state, selectTopic, resetGame } = useGame();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleSelectTopic = (topic: Topic) => {
    selectTopic(topic);
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
        className="flex-shrink-0 pt-3 pb-3 px-4 text-center space-y-2 border-b border-border/50 bg-background/95 backdrop-blur-sm safe-area-header relative"
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
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Sparkles className="w-12 h-12 mx-auto text-game-yellow" />
        </motion.div>
        <h2 className="text-2xl font-bold">Choose a Topic</h2>
        <p className="text-muted-foreground text-sm">
          Round {state.roundNumber} • {state.players.length} players
        </p>
      </motion.div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 auto-rows-fr"
        >
          {topics.map((topic) => (
            <motion.div key={topic.id} variants={item} className="h-full">
              <Card
                onClick={() => handleSelectTopic(topic)}
                className="h-full p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-2 border-border/60 hover:border-primary/50 flex flex-col"
              >
                <div className="text-center space-y-2 flex flex-col flex-1 justify-between">
                  <span className="text-4xl block">{topic.emoji}</span>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-semibold text-base">{topic.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
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
