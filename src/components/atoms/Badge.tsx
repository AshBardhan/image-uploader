import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/style";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-300 text-gray-900",
        success: "bg-green-200 text-green-900",
        danger: "bg-red-200 text-red-900",
        info: "bg-blue-200 text-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export const Badge = ({
  children,
  variant,
  className,
  ariaLabel,
}: BadgeProps) => {
  const a11yProps = {
    role: ariaLabel && "status",
    "aria-label": ariaLabel,
  };
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...a11yProps}>
      {children}
    </span>
  );
};
