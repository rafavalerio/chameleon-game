"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";
import { GAME_CONFIG } from "@/lib/game-config";
import { PageContainer, PageHeader, PageContent } from "./shared/page-layout";

export function ChameleonGuess() {
  const { state, chameleonGuess } = useGame();

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

  return (
    <PageContainer>
      <PageHeader className="space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex justify-center"
        >
          <Image
            src="/chameleon-logo.png"
            alt="Chameleon"
            width={1186}
            height={1096}
            className="w-20 h-auto"
          />
        </motion.div>
        <h2 className="text-2xl font-bold">Chameleon&apos;s Last Chance!</h2>
        <p className="text-muted-foreground">
          {chameleon?.name} was caught, but can still earn{" "}
          <span className="font-semibold text-primary">
            {GAME_CONFIG.POINTS_CHAMELEON_GUESSES_WORD} points
          </span>{" "}
          by guessing the word
        </p>
      </PageHeader>

      <PageContent className="space-y-6">
        {/* Topic hint */}
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">The topic was:</p>
            <div className="flex items-center justify-center gap-2">
              {state.currentTopic && (
                <state.currentTopic.icon className="w-5 h-5 text-primary" />
              )}
              <span className="text-lg font-semibold">
                {state.currentTopic?.name}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Word options */}
        <Card className="border border-border/60">
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
                    className="w-full h-12 text-sm font-medium border border-border/60 hover:border-primary/40 hover:bg-primary/5"
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
          className="flex items-start gap-2 p-4 rounded-xl bg-primary/5 border border-primary/20"
        >
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Think about the clues other players gave. What word fits all their
            answers?
          </p>
        </motion.div>
      </PageContent>
    </PageContainer>
  );
}
