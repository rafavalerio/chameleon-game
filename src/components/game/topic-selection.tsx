"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";
import { topics, Topic } from "@/lib/game-data";
import { PageContainer, PageHeader, PageContent } from "./shared/page-layout";
import { ScreenTitle, ScreenSubtitle } from "./shared/content-text";

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
    <PageContainer>
      <PageHeader>
        <ScreenTitle>Choose a Topic</ScreenTitle>
        <ScreenSubtitle>
          Round {state.roundNumber} • {state.players.length} players
        </ScreenSubtitle>
      </PageHeader>

      <PageContent>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 auto-rows-fr"
        >
          {topics.map((topic) => (
            <motion.div key={topic.id} variants={item} className="h-full">
              <Card
                onClick={() => handleSelectTopic(topic)}
                className="h-full p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] active:bg-primary/10 active:border-primary/40 border border-border/60 hover:border-primary/40 hover:bg-primary/5 flex flex-col"
              >
                <div className="text-center space-y-2 flex flex-col flex-1 justify-between">
                  <topic.icon className="w-9 h-9 mx-auto text-primary" />
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-semibold text-base">{topic.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </PageContent>
    </PageContainer>
  );
}
