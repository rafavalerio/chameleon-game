"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { topics, Topic } from "@/lib/game-data";
import { PageContainer, PageHeader, PageContent } from "./shared/page-layout";
import { ScreenTitle, ScreenSubtitle } from "./shared/content-text";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.18,
      ease: "easeOut",
      staggerChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { type: "tween", duration: 0.18, ease: "easeOut" },
  },
};

export function TopicSelection() {
  const { state, selectTopic } = useGame();
  const shouldReduceMotion = useReducedMotion();

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
          initial={shouldReduceMotion ? false : "hidden"}
          animate="show"
          className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4"
        >
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
            <motion.button
              key={topic.id}
              variants={item}
              type="button"
                onClick={() => handleSelectTopic(topic)}
              className="flex h-full min-h-36 w-full flex-col items-start rounded-2xl border border-border/70 bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 sm:min-h-40 sm:p-5"
            >
              <span className="mb-3 grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="font-semibold leading-snug">{topic.name}</span>
              <span className="mt-1 text-sm leading-snug text-muted-foreground">
                {topic.description}
              </span>
            </motion.button>
            );
          })}
        </motion.div>
      </PageContent>
    </PageContainer>
  );
}
