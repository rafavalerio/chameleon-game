"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  const { state, selectTopic } = useGame();

  const handleSelectTopic = (topic: Topic) => {
    selectTopic(topic);
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
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {topics.map((topic) => (
            <motion.div key={topic.id} variants={item}>
              <Card
                onClick={() => handleSelectTopic(topic)}
                className="p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-2 border-border/60 hover:border-primary/50"
              >
                <div className="text-center space-y-2">
                  <span className="text-4xl block">{topic.emoji}</span>
                  <h3 className="font-semibold text-base">{topic.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
