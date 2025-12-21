import { cva } from "class-variance-authority";
import { clsx } from "clsx";

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
      success: "text-green-800",
      danger: "text-red-900",
      default: "text-gray-850",
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

export function Metric({
  label,
  value,
  theme = "default",
  direction = "row",
  size = "medium",
  reverse = false,
  className,
}: MetricProps) {
  return (
    <div className={clsx(metricContainerVariants({ direction }), className)}>
      <div className={metricLabelVariants({ size, reverse })}>{label}</div>
      <div className={metricValueVariants({ theme, size, reverse })}>
        {value}
      </div>
    </div>
  );
}
