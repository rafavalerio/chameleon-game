"use client";

import { motion } from "framer-motion";
import { MessageCircle, ChevronRight, Vote, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/lib/game-context";
import { PageContainer, PageHeader, PageContent, PageFooter } from "./shared/page-layout";
import { PlayerAvatar } from "./shared/player-avatar";
import { ScreenTitle, ScreenSubtitle, Prompt, Hint, Quote } from "./shared/content-text";

export function QuestionsPhase() {
  const { state, nextQuestion, startVoting } = useGame();

  const currentQuestion = state.questions[state.currentPlayerIndex];
  const currentPlayer = state.players[state.currentPlayerIndex];
  const isLastQuestion = state.currentPlayerIndex >= state.players.length - 1;
  const progress = ((state.currentPlayerIndex + 1) / state.players.length) * 100;
  const playerColorIndex = state.players.findIndex((p) => p.id === currentPlayer.id);

  const handleNext = () => {
    if (isLastQuestion) {
      startVoting();
    } else {
      nextQuestion();
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <MessageCircle className="w-12 h-12 mx-auto text-primary" />
        </motion.div>
        <ScreenTitle>Discussion Time</ScreenTitle>
        <ScreenSubtitle className="flex items-center justify-center gap-2">
          {state.currentTopic && (
            <state.currentTopic.icon className="w-5 h-5" />
          )}
          <span>{state.currentTopic?.name}</span>
        </ScreenSubtitle>
      </PageHeader>

      <PageContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <Hint className="text-center">
            Question {state.currentPlayerIndex + 1} of {state.players.length}
          </Hint>
        </div>

        {/* Current player's turn */}
        <motion.div
          key={currentPlayer.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="border border-border/60">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex mb-3"
                >
                  <PlayerAvatar name={currentPlayer.name} index={playerColorIndex} size="lg" />
                </motion.div>
                <Prompt>{currentPlayer.name}</Prompt>
                <Hint>answers the question</Hint>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-xl bg-primary/5 border border-primary/20"
              >
                <Quote>&ldquo;{currentQuestion}&rdquo;</Quote>
              </motion.div>

              <Hint className="text-center">
                {state.players
                  .filter((p) => p.id !== currentPlayer.id)
                  .map((p) => p.name)
                  .join(", ")}{" "}
                — listen carefully!
              </Hint>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-start justify-center gap-1.5 text-xs text-center text-muted-foreground pb-4"
        >
          <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Tip: Give enough detail to seem legitimate, but not too much that the
          chameleon can guess the word!
        </motion.p>
      </PageContent>

      <PageFooter>
        <Button
          onClick={handleNext}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
          icon={isLastQuestion ? Vote : ChevronRight}
        >
          {isLastQuestion ? "Start Voting" : "Next Player"}
        </Button>
      </PageFooter>
    </PageContainer>
  );
}
