"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Check, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/lib/game-context";

export function VotingPhase() {
  const { state, castVote, calculateResults } = useGame();
  const [currentVoterId, setCurrentVoterId] = useState<string | null>(null);

  const playersWhoHaventVoted = state.players.filter((p) => !p.votedFor);
  const allVoted = playersWhoHaventVoted.length === 0;

  const currentVoter = state.players.find((p) => p.id === currentVoterId);

  const handleStartVoting = (playerId: string) => {
    setCurrentVoterId(playerId);
  };

  const handleVote = (votedForId: string) => {
    if (currentVoterId) {
      castVote(currentVoterId, votedForId);
      setCurrentVoterId(null);
    }
  };

  const handleCalculateResults = () => {
    calculateResults();
  };

  // Get vote counts for display after everyone voted
  const getVoteCount = (playerId: string): number => {
    return state.players.filter((p) => p.votedFor === playerId).length;
  };

  return (
    <div className="h-full flex flex-col max-w-md mx-auto">
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-shrink-0 pt-6 pb-4 px-4 text-center space-y-2 border-b border-border/50 bg-background/95 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring" }}
        >
          <Vote className="w-12 h-12 mx-auto text-game-purple" />
        </motion.div>
        <h2 className="text-2xl font-bold">Time to Vote!</h2>
        <p className="text-muted-foreground">
          Who do you think is the chameleon?
        </p>
      </motion.div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
      <AnimatePresence mode="wait">
        {currentVoterId && currentVoter ? (
          /* Voting selection */
          <motion.div
            key="voting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="border-2 border-primary/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg">
                  {currentVoter.name}&apos;s Vote
                </CardTitle>
                <p className="text-sm text-center text-muted-foreground">
                  Select who you think is the chameleon
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {state.players
                  .filter((p) => p.id !== currentVoterId)
                  .map((player) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Button
                        onClick={() => handleVote(player.id)}
                        variant="outline"
                        className="w-full h-12 justify-start text-base border-2 hover:border-destructive/50 hover:bg-destructive/5"
                      >
                        <User className="w-5 h-5 mr-3 text-muted-foreground" />
                        {player.name}
                      </Button>
                    </motion.div>
                  ))}

                <Button
                  onClick={() => setCurrentVoterId(null)}
                  variant="ghost"
                  className="w-full mt-2 text-muted-foreground"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Player list / Results */
          <motion.div
            key="player-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {!allVoted ? (
              <>
                <p className="text-sm font-medium text-center text-muted-foreground">
                  Pass the device to vote:
                </p>
                <div className="space-y-2">
                  {playersWhoHaventVoted.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        onClick={() => handleStartVoting(player.id)}
                        variant="outline"
                        className="w-full h-14 justify-between text-base border-2 hover:border-primary/30 hover:bg-primary/5"
                      >
                        <span className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-muted-foreground" />
                          {player.name}
                        </span>
                        <Badge variant="secondary">Vote</Badge>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Already voted */}
                {state.players.filter((p) => p.votedFor).length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">
                      Already voted:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {state.players
                        .filter((p) => p.votedFor)
                        .map((player) => (
                          <Badge
                            key={player.id}
                            variant="outline"
                            className="text-sm"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {player.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* All voted - show summary */
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <span className="text-4xl block mb-2">🗳️</span>
                    <p className="font-semibold text-lg">All votes are in!</p>
                  </div>

                  <div className="space-y-2">
                    {state.players
                      .sort(
                        (a, b) => getVoteCount(b.id) - getVoteCount(a.id)
                      )
                      .map((player) => {
                        const voteCount = getVoteCount(player.id);
                        return (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <span className="font-medium">{player.name}</span>
                            <Badge
                              variant={voteCount > 0 ? "default" : "secondary"}
                            >
                              {voteCount} vote{voteCount !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Fixed Footer */}
      {allVoted && (
        <div className="flex-shrink-0 px-4 pt-4 pb-6 border-t border-border/50 bg-background/95 backdrop-blur-sm">
          <Button
            onClick={handleCalculateResults}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-game-purple to-game-pink hover:from-game-pink hover:to-game-purple border-2 border-game-pink/30"
            size="lg"
          >
            Reveal the Chameleon! 🦎
          </Button>
        </div>
      )}
    </div>
  );
}
