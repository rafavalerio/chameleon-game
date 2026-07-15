"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff, Check, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/lib/game-context";
import { PageContainer, PageHeader, PageContent } from "./shared/page-layout";

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
      <PageHeader>
        <div className="flex items-center justify-center gap-2 text-lg font-semibold">
          {state.currentTopic && (
            <state.currentTopic.icon className="w-5 h-5 text-primary" />
          )}
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
                          className="flex-1 flex flex-col justify-center p-8 rounded-2xl text-center min-h-[128px] bg-primary/5 border border-primary/20"
                        >
                          {isChameleon ? (
                            <>
                              <div className="flex justify-center mb-4">
                                <Image
                                  src="/chameleon-logo.png"
                                  alt="Chameleon"
                                  width={1186}
                                  height={1096}
                                  className="w-16 h-auto"
                                />
                              </div>
                              <p className="text-2xl font-bold text-primary">
                                You are the
                              </p>
                              <p className="text-3xl font-black text-primary">
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
                            className="w-full h-32 text-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5"
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
                  <p className="text-lg font-semibold">All players ready!</p>
                  <p className="text-muted-foreground text-sm">
                    Moving to discussion phase...
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </PageContent>
    </PageContainer>
  );
}
