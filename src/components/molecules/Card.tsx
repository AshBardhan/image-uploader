import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/style";

const cardVariants = cva("rounded-xl border shadow-xl transition-colors", {
  variants: {
    theme: {
      default: "bg-white border-gray-300",
      success: "bg-green-50 border-green-400 border-2",
      warning: "bg-yellow-50 border-yellow-400 border-2",
      error: "bg-red-50 border-red-400 border-2",
    },
    padded: {
      true: "p-3 md:p-4",
      false: "p-0",
    },
  },
  defaultVariants: {
    theme: "default",
    padded: true,
  },
});

interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/* Card Component with theme and padding variants */
export const Card = ({
  theme,
  padded,
  children,
  className,
  ref,
  ...props
}: CardProps) => {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ theme, padded }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
