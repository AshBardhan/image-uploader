import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/style";

const progressBarWrapperVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-gray-300",
  {
    variants: {
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const progressBarVariants = cva(
  "absolute top-0 h-full rounded-full transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-blue-700",
        info: "bg-blue-700",
        success: "bg-green-700",
        danger: "bg-red-700",
        warning: "bg-yellow-700",
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
  showPercentage?: boolean;
}

export const ProgressBar = ({
  progress,
  variant,
  size = "md",
  showPercentage = false,
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn(progressBarWrapperVariants({ size }))}>
      <div
        className={progressBarVariants({ variant })}
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
