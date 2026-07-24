"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/lib/game-context";
import { PageContainer, PageHeader, PageContent } from "./shared/page-layout";
import { ResetGameButton } from "./shared/reset-game-button";
import { Label, Prompt, Hint, Pill } from "./shared/content-text";

export function WordReveal() {
  const { state, revealWord } = useGame();
  const [showingWord, setShowingWord] = useState(false);
  const [currentRevealingPlayer, setCurrentRevealingPlayer] = useState<string | null>(null);

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

  return (
    <PageContainer>
      <PageHeader showReset={false}>
        <div className="flex items-center justify-between gap-2">
          <Prompt className="flex items-center gap-2">
            {state.currentTopic && (
              <state.currentTopic.icon className="w-5 h-5 text-primary" />
            )}
            <span>{state.currentTopic?.name}</span>
          </Prompt>
          <ResetGameButton />
        </div>
        <Hint className="text-left">
          Pass the device to each player to reveal their word
        </Hint>
        {/* Progress */}
        <div className="space-y-1 pt-2">
          <Progress value={progress} className="h-2" />
          <Hint>
            {revealedCount} of {state.players.length} players have seen their word
          </Hint>
        </div>
      </PageHeader>

      <PageContent>
        <AnimatePresence mode="wait">
          {currentRevealingPlayer ? (
            /* Reveal card */
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="border border-border/60 overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-1">
                    <Label>{currentPlayer?.name}&apos;s turn</Label>
                    <Prompt>
                      {showingWord ? "Remember this!" : "Tap to reveal your word"}
                    </Prompt>
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
                          className="flex-1 flex flex-col justify-center p-8 rounded-2xl text-center min-h-[128px] bg-primary/5 border border-primary/20"
                        >
                          {isChameleon ? (
                            <div className="space-y-3">
                              <Label>You are the</Label>
                              <Pill>CHAMELEON</Pill>
                              <Hint>Blend in! Don&apos;t reveal yourself.</Hint>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Label>The secret word is:</Label>
                              <Pill>{state.secretWord}</Pill>
                            </div>
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
                            className="w-full h-32 text-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5"
                            icon={Eye}
                          >
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
                          icon={Check}
                        >
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
                  <Label className="text-center">Select next player:</Label>
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
                        className="w-full h-14 justify-between text-base border border-border/60 hover:border-primary/40 hover:bg-primary/5"
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
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <Prompt>All players ready!</Prompt>
                  <Hint>Moving to discussion phase...</Hint>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </PageContent>
    </PageContainer>
  );
}
