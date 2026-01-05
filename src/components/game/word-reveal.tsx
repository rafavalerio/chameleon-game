"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff, Check, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGame } from "@/lib/game-context";

export function WordReveal() {
  const { state, revealWord, resetGame } = useGame();
  const [showingWord, setShowingWord] = useState(false);
  const [currentRevealingPlayer, setCurrentRevealingPlayer] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const unrevealedPlayers = state.players.filter((p) => !p.hasRevealed);
  const revealedCount = state.players.length - unrevealedPlayers.length;
  const progress = (revealedCount / state.players.length) * 100;

  const handleStartReveal = (playerId: string) => {
    setCurrentRevealingPlayer(playerId);
    setShowingWord(false);
  };

  const handleShowWord = () => {
    setShowingWord(true);
  };

  const handleConfirmSeen = () => {
    if (currentRevealingPlayer) {
      revealWord(currentRevealingPlayer);
      setCurrentRevealingPlayer(null);
      setShowingWord(false);
    }
  };

  const currentPlayer = state.players.find((p) => p.id === currentRevealingPlayer);
  const isChameleon = currentPlayer?.isChameleon ?? false;

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
        <div className="flex items-center justify-center gap-2 text-lg font-semibold">
          <span className="text-2xl">{state.currentTopic?.emoji}</span>
          <span>{state.currentTopic?.name}</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Pass the device to each player to reveal their word
        </p>
        {/* Progress */}
        <div className="space-y-1 pt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {revealedCount} of {state.players.length} players have seen their word
          </p>
        </div>
      </motion.div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >

      <AnimatePresence mode="wait">
        {currentRevealingPlayer ? (
          /* Reveal card */
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="border-2 border-primary/40 overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {currentPlayer?.name}&apos;s turn
                  </p>
                  <p className="text-lg font-medium">
                    {showingWord ? "Remember this!" : "Tap to reveal your word"}
                  </p>
                </div>

                {/* Fixed height container to prevent layout shift */}
                <div className="min-h-[128px] flex flex-col">
                  <AnimatePresence mode="wait">
                    {showingWord ? (
                      <motion.div
                        key="word-shown"
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: -90 }}
                        transition={{ duration: 0.3 }}
                        className={`flex-1 flex flex-col justify-center p-8 rounded-2xl text-center min-h-[128px] ${
                          isChameleon
                            ? "bg-gradient-to-br from-chameleon/20 to-chameleon-dark/20 border-2 border-chameleon/30"
                            : "bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20"
                        }`}
                      >
                        {isChameleon ? (
                          <>
                            <div className="flex justify-center mb-4">
                              <Image
                                src="/chameleon-logo.png"
                                alt="Chameleon"
                                width={64}
                                height={64}
                                className="w-16 h-16"
                              />
                            </div>
                            <p className="text-2xl font-bold text-chameleon">
                              You are the
                            </p>
                            <p className="text-3xl font-black text-chameleon">
                              CHAMELEON
                            </p>
                            <p className="text-sm text-muted-foreground mt-3">
                              Blend in! Don&apos;t reveal yourself.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-muted-foreground mb-2">
                              The secret word is:
                            </p>
                            <p className="text-3xl font-black text-primary">
                              {state.secretWord}
                            </p>
                          </>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="word-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-center min-h-[128px]"
                      >
                        <Button
                          onClick={handleShowWord}
                          variant="outline"
                          className="w-full h-32 text-lg border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5"
                        >
                          <Eye className="w-8 h-8 mr-3 text-primary" />
                          Tap to Reveal
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Reserve space for confirm button to prevent jump */}
                <div className="h-12">
                  {showingWord && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        onClick={handleConfirmSeen}
                        className="w-full h-12 text-base font-semibold"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        I&apos;ve memorised it
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Player list */
          <motion.div
            key="player-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {unrevealedPlayers.length > 0 ? (
              <>
                <p className="text-sm font-medium text-center text-muted-foreground">
                  Select next player:
                </p>
                {unrevealedPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      onClick={() => handleStartReveal(player.id)}
                      variant="outline"
                      className="w-full h-14 justify-between text-base border-2 hover:border-primary/30 hover:bg-primary/5"
                    >
                      <span className="flex items-center gap-3">
                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                        {player.name}
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </motion.div>
                ))}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <span className="text-5xl block mb-4">✨</span>
                <p className="text-lg font-semibold">All players ready!</p>
                <p className="text-muted-foreground text-sm">
                  Moving to discussion phase...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
