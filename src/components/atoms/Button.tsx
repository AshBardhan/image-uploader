import type { ButtonHTMLAttributes, Ref } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/style";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md transition-colors font-medium cursor-pointer",
    "focus-visible:outline-none focus-visible:shadow-xl focus-visible:ring-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
        secondary:
          "bg-gray-800 text-white hover:bg-gray-900 focus-visible:ring-gray-600",
        success:
          "bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-600",
        danger:
          "bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-600",
        outline:
          "border-2 border-gray-400 text-gray-900 bg-white hover:bg-gray-50 hover:border-gray-500 focus-visible:ring-gray-500",
        ghost:
          "text-gray-900 hover:text-gray-950 hover:bg-gray-100 focus-visible:ring-gray-500",
      },
      size: {
        sm: "h-8 px-3 gap-1 text-sm",
        md: "h-10 px-4 gap-2 text-base",
        lg: "h-12 px-6 gap-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/* Button Component with variants, sizes, loading state and accessibility support */
export const Button = ({
  className,
  variant,
  size,
  loading,
  children,
  disabled,
  ref,
  ...props
}: ButtonProps) => {
  const a11yProps = {
    "aria-busy": loading && true,
    "aria-disabled": (disabled || loading) && true,
  };

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      disabled={disabled || loading}
      {...a11yProps}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};
