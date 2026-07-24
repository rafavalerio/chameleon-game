import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { TEXT_STYLES } from "@/lib/typography";

export function ScreenTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn(TEXT_STYLES.screenTitle, className)} {...props} />;
}

export function ScreenSubtitle({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(TEXT_STYLES.screenSubtitle, className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(TEXT_STYLES.label, className)} {...props} />;
}

export function Prompt({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(TEXT_STYLES.prompt, className)} {...props} />;
}

export function Hint({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(TEXT_STYLES.hint, className)} {...props} />;
}

export function Value({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(TEXT_STYLES.value, className)} {...props} />;
}

export function Quote({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(TEXT_STYLES.quote, className)} {...props} />;
}

export function Pill({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(TEXT_STYLES.pill, className)} {...props} />;
}
