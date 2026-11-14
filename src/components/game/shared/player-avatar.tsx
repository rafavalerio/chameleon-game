import { cn } from "@/lib/utils";

export const PLAYER_COLORS = [
  "bg-avatar-1",
  "bg-avatar-2",
  "bg-avatar-3",
  "bg-avatar-4",
  "bg-avatar-5",
  "bg-avatar-6",
];

const sizeClasses = {
  sm: "w-10 h-10 text-sm font-semibold border-2",
  lg: "w-16 h-16 text-2xl font-bold",
};

interface PlayerAvatarProps {
  name: string;
  index: number;
  size?: "sm" | "lg";
  className?: string;
}

export function PlayerAvatar({ name, index, size = "sm", className }: PlayerAvatarProps) {
  const colorClass = PLAYER_COLORS[index % PLAYER_COLORS.length];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border-2 border-background/80 font-bold text-white shadow-sm",
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
