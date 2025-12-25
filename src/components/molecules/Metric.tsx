import { memo } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/style";

const metricContainerVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row items-center gap-1.5",
      column: "flex-col gap-0",
    },
  },
  defaultVariants: {
    direction: "row",
  },
});

const metricLabelVariants = cva("font-normal text-gray-700", {
  variants: {
    size: {
      small: "text-xs md:text-sm",
      medium: "text-sm md:text-base",
    },
    reverse: {
      true: "order-2",
      false: "",
    },
  },
  defaultVariants: {
    size: "medium",
    reverse: false,
  },
});

const metricValueVariants = cva("font-semibold", {
  variants: {
    theme: {
      success: "text-green-700",
      danger: "text-red-700",
      default: "text-gray-900",
    },
    size: {
      small: "text-sm md:text-base",
      medium: "text-lg md:text-xl",
    },
    reverse: {
      true: "order-1",
      false: "",
    },
  },
  defaultVariants: {
    theme: "default",
    size: "medium",
    reverse: false,
  },
});

interface MetricProps {
  label: string;
  value: string | number;
  direction?: "row" | "column";
  theme?: "default" | "success" | "danger";
  size?: "small" | "medium";
  reverse?: boolean;
  className?: string;
}

/* Memoized Metric Component to show label-value pair with direction, theme, size and reverse options */
export const Metric = memo(
  ({
    label,
    value,
    theme = "default",
    direction = "row",
    size = "medium",
    reverse = false,
    className,
  }: MetricProps) => {
    return (
      <div className={cn(metricContainerVariants({ direction }), className)}>
        <div className={metricLabelVariants({ size, reverse })}>{label}</div>
        <div className={metricValueVariants({ theme, size, reverse })}>
          {value}
        </div>
      </div>
    );
  },
);
