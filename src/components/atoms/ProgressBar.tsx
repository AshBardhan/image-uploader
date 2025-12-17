import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const progressBarVariants = cva(
  "h-2 rounded-full transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary-600",
        success: "bg-green-600",
        error: "bg-red-600",
        warning: "bg-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ProgressBarProps
  extends VariantProps<typeof progressBarVariants> {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({
  progress,
  variant,
  className,
  showPercentage = false,
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={clsx("w-full", className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={progressBarVariants({ variant })}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-right text-xs text-gray-600">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
};
