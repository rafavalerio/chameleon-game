"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ResetGameButton } from "./reset-game-button";

const safeAreaX = {
  paddingLeft: "max(1rem, env(safe-area-inset-left))",
  paddingRight: "max(1rem, env(safe-area-inset-right))",
};

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="h-full flex flex-col max-w-md mx-auto">{children}</div>;
}

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
  showReset?: boolean;
}

export function PageHeader({ children, className, showReset = true }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex-shrink-0 pt-3 pb-3 px-4 text-center space-y-2 border-b border-border/50 bg-background/95 backdrop-blur-sm",
        className
      )}
      style={{
        paddingTop: "max(1rem, calc(env(safe-area-inset-top) + 1rem))",
        ...safeAreaX,
      }}
    >
      {showReset && (
        <div className="flex justify-end mb-1">
          <ResetGameButton />
        </div>
      )}
      {children}
    </motion.div>
  );
}

export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-4 py-4", className)} style={safeAreaX}>
      {children}
    </div>
  );
}

export function PageFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex-shrink-0 px-4 pt-3 pb-4 border-t border-border/50 bg-background/95 backdrop-blur-sm",
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
