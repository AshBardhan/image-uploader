import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/style";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-gray-100",
        success: "bg-green-900 text-green-200",
        danger: "bg-red-900 text-red-200",
        info: "bg-blue-900 text-blue-200",
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
