import type { HTMLAttributes, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/style";

const textVariants = cva("transition-colors", {
  variants: {
    variant: {
      h1: "text-2xl font-bold text-gray-900 md:text-3xl",
      h2: "text-xl font-bold text-gray-900 md:text-2xl",
      h3: "text-lg font-bold text-gray-900 md:text-xl",
      h4: "text-base font-semibold text-gray-900 md:text-lg",
      h5: "text-base font-semibold text-gray-900 md:text-lg",
      h6: "text-sm font-semibold text-gray-900 md:text-base",
      p: "text-sm text-gray-800 md:text-base",
      div: "text-sm text-gray-800 md:text-base",
    },
    theme: {
      success: "text-green-600",
      warning: "text-yellow-600",
      danger: "text-red-600",
      white: "text-white",
      default: "",
    },
  },
});

type TextVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  theme?: "danger" | "warning" | "success" | "white" | "default";
  children: ReactNode;
}

/* Text Component with variant and theme support */
export const Text = ({
  variant = "div",
  theme = "default",
  children,
  className,
  ...props
}: TextProps) => {
  const Tag = variant;

  return (
    <Tag className={cn(textVariants({ theme, variant }), className)} {...props}>
      {children}
    </Tag>
  );
};
