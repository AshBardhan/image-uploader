import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/style";
import { cva } from "class-variance-authority";

const cardVariants = cva("rounded-xl border shadow-lg transition-colors", {
  variants: {
    theme: {
      default: "bg-white border-gray-300",
      success: "bg-green-50 border-green-400 border-2",
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

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  theme?: "default" | "success" | "error";
  padded?: boolean;
  children: ReactNode;
  className?: string;
}

export function Card({
  theme = "default",
  padded = true,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div className={cn(cardVariants({ theme, padded }), className)} {...props}>
      {children}
    </div>
  );
}
