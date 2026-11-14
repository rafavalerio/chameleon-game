"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Users, User, Eye } from "lucide-react";
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
        <ScreenTitle>Time to Vote!</ScreenTitle>
        <ScreenSubtitle>Who do you think is the chameleon?</ScreenSubtitle>
      </PageHeader>

      <PageContent className="space-y-6">
        <AnimatePresence mode="wait">
          {currentVoterId && currentVoter ? (
            /* Voting selection */
            <motion.div
              key="voting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-border/80">
                <CardHeader className="pb-3">
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
                          className="h-auto min-h-14 w-full justify-start whitespace-normal border border-border/70 bg-background py-3 text-base hover:border-primary/40 hover:bg-secondary"
                        >
                          <User className="mr-3 size-5 shrink-0 text-muted-foreground" />
                          <span className="min-w-0 break-words">{player.name}</span>
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
                          className="h-auto min-h-14 w-full justify-between gap-3 whitespace-normal border border-border/70 bg-card py-3 text-base shadow-sm hover:border-primary/40 hover:bg-secondary"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <Users className="size-5 shrink-0 text-muted-foreground" />
                            <span className="min-w-0 break-words">{player.name}</span>
                          </span>
                          <Badge className="shrink-0" variant="secondary">Vote</Badge>
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Vote progress */}
                  {state.players.filter((p) => p.votedFor).length > 0 && (
                    <Hint className="text-center pt-2">
                      {state.players.filter((p) => p.votedFor).length} of{" "}
                      {state.players.length} players have voted
                    </Hint>
                  )}
                </>
              ) : (
                /* All voted - show summary */
                <Card className="border-border/80">
                  <CardContent className="space-y-5 p-5 sm:p-6">
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
                              className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/45 p-3"
                            >
                              <span className="min-w-0 break-words font-medium">{player.name}</span>
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
