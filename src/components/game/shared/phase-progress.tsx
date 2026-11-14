import { GamePhase } from "@/lib/game-context";
import { PHASE_STEPS, getPhaseStepIndex } from "@/lib/phase-progress";
import { cn } from "@/lib/utils";

export function PhaseProgress({ phase }: { phase: GamePhase }) {
  const currentStep = getPhaseStepIndex(phase);
  if (currentStep === null) return null;

  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={PHASE_STEPS.length}
      aria-label={`Step ${currentStep + 1} of ${PHASE_STEPS.length}: ${PHASE_STEPS[currentStep]}`}
    >
      {PHASE_STEPS.map((step, index) => (
        <span
          key={step}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            index <= currentStep ? "bg-primary" : "bg-border"
          )}
        />
      ))}
    </div>
  );
}
