import { cva } from "class-variance-authority";

const progressBarWrapperVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-gray-500",
  {
    variants: {
      size: {
        sm: "h-2",
        md: "h-4",
        lg: "h-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface ProgressBarProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
}

/* Progress Bar Chart Component to display progress with optional percentage */
export const ProgressBar = ({
  progress,
  size = "md",
  showPercentage = false,
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const barColor = clampedProgress > 75 ? "bg-green-700" : "bg-blue-700";

  return (
    <div className={progressBarWrapperVariants({ size })}>
      <div
        className={`absolute top-0 h-full rounded-full transition-colors ${barColor}`}
        style={{ width: `${clampedProgress}%` }}
      />
      {showPercentage && size !== "sm" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
};
