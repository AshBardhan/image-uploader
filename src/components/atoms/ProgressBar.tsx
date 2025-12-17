import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const progressBarWrapperVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-gray-200",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const progressBarVariants = cva(
  "h-full rounded-full transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary-600",
        info: "bg-blue-600",
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
  size?: "sm" | "md" | "lg";
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({
  progress,
  variant,
  size,
  className,
  showPercentage = false,
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={clsx("w-full", className)}>
      <div className={clsx(progressBarWrapperVariants({ size }))}>
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
