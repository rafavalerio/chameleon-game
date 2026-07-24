"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Check, Users, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/lib/game-context";
import { PageContainer, PageHeader, PageContent, PageFooter } from "./shared/page-layout";
import { ScreenTitle, ScreenSubtitle, Prompt, Hint, Label } from "./shared/content-text";
import { TEXT_STYLES } from "@/lib/typography";
import { cn } from "@/lib/utils";

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
    <PageContainer>
      <PageHeader>
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring" }}
        >
          <Vote className="w-12 h-12 mx-auto text-primary" />
        </motion.div>
        <ScreenTitle>Time to Vote!</ScreenTitle>
        <ScreenSubtitle>Who do you think is the chameleon?</ScreenSubtitle>
      </PageHeader>

      <PageContent>
        <AnimatePresence mode="wait">
          {currentVoterId && currentVoter ? (
            /* Voting selection */
            <motion.div
              key="voting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className={cn(TEXT_STYLES.prompt, "text-center")}>
                    {currentVoter.name}&apos;s Vote
                  </CardTitle>
                  <Hint className="text-center">
                    Select who you think is the chameleon
                  </Hint>
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
                          className="w-full h-12 justify-start text-base border border-border/60 hover:border-primary/40 hover:bg-primary/5"
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
                  <Label className="text-center">Pass the device to vote:</Label>
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
                          className="w-full h-14 justify-between text-base border border-border/60 hover:border-primary/40 hover:bg-primary/5"
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
                      <Label className="mb-2">Already voted:</Label>
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
                <Card className="border border-border/60">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <Vote className="w-12 h-12 mx-auto mb-2 text-primary" />
                      <Prompt>All votes are in!</Prompt>
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
      </PageContent>

      {allVoted && (
        <PageFooter>
          <Button
            onClick={handleCalculateResults}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
            icon={Eye}
          >
            Reveal the Chameleon!
          </Button>
        </PageFooter>
      )}
    </PageContainer>
  );
}
