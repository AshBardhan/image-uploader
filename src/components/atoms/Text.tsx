import type { HTMLAttributes, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/style";

const textVariants = cva("transition-colors", {
  variants: {
    variant: {
      h1: "text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl",
      h2: "text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl",
      h3: "text-lg font-bold text-gray-900 md:text-xl lg:text-2xl",
      h4: "text-base font-bold text-gray-900 md:text-lg lg:text-xl",
      h5: "text-base font-semibold text-gray-900 md:text-lg lg:text-xl",
      h6: "text-sm font-semibold text-gray-900 md:text-base lg:text-lg",
      p: "text-sm text-gray-700 md:text-base",
      div: "text-sm text-gray-700 md:text-base",
    },
    theme: {
      danger: "text-red-500",
      success: "text-green-500",
      white: "text-white",
      default: "",
    },
  },
});

type TextVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  theme?: "danger" | "success" | "white" | "default";
  children: ReactNode;
}

export function Text({
  variant = "div",
  theme = "default",
  children,
  className,
  ...props
}: TextProps) {
  const Tag = variant;

  return (
    <Tag className={cn(textVariants({ theme, variant }), className)} {...props}>
      {children}
    </Tag>
  );
}
