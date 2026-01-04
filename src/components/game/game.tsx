"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { PlayerSetup } from "./player-setup";
import { TopicSelection } from "./topic-selection";
import { WordReveal } from "./word-reveal";
import { QuestionsPhase } from "./questions-phase";
import { VotingPhase } from "./voting-phase";
import { ChameleonGuess } from "./chameleon-guess";
import { FinalResults } from "./final-results";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function Game() {
  const { state } = useGame();

  const renderPhase = () => {
    switch (state.phase) {
      case "setup":
        return <PlayerSetup />;
      case "topic-selection":
        return <TopicSelection />;
      case "word-reveal":
        return <WordReveal />;
      case "questions":
        return <QuestionsPhase />;
      case "voting":
        return <VotingPhase />;
      case "chameleon-guess":
        return <ChameleonGuess />;
      case "results":
      case "final-results":
        return <FinalResults />;
      default:
        return <PlayerSetup />;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden safe-area-inset">
      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.phase}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
