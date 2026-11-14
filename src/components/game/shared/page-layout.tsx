"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGame } from "@/lib/game-context";
import { ResetGameButton } from "./reset-game-button";
import { PhaseProgress } from "./phase-progress";

const safeAreaX = {
  paddingLeft: "max(1rem, env(safe-area-inset-left))",
  paddingRight: "max(1rem, env(safe-area-inset-right))",
};

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-lg flex-col bg-background shadow-sm md:border-x md:border-border/50">
      {children}
    </div>
  );
}

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
  showReset?: boolean;
  showProgress?: boolean;
}

export function PageHeader({
  children,
  className,
  showReset = true,
  showProgress = true,
}: PageHeaderProps) {
  const { state } = useGame();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex-shrink-0 space-y-4 border-b border-border/70 bg-background/95 px-5 pb-5 pt-3 text-center backdrop-blur-sm",
        className
      )}
      style={{
        paddingTop: "max(1rem, calc(env(safe-area-inset-top) + 1rem))",
        ...safeAreaX,
      }}
    >
      {(showProgress || showReset) && (
        <div className="flex min-h-11 items-center gap-3">
          {showProgress && (
            <div className="min-w-0 flex-1">
              <PhaseProgress phase={state.phase} />
            </div>
          )}
          {showReset && <ResetGameButton />}
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-6", className)} style={safeAreaX}>
      {children}
    </div>
  );
}

export function PageFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex-shrink-0 border-t border-border/70 bg-background/95 px-5 pt-4 pb-5 backdrop-blur-sm",
        className
      )}
      style={{
        paddingBottom: "max(1rem, calc(env(safe-area-inset-bottom) + 1rem))",
        ...safeAreaX,
      }}
    >
      {children}
    </div>
  );
}
