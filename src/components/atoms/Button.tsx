import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading, children, disabled, ...props },
    ref,
  ) => {
    const a11yProps = {
      "aria-busy": isLoading && true,
      "aria-disabled": (disabled || isLoading) && true,
    };

    return (
      <button
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...a11yProps}
        {...props}
      >
        {isLoading ? (
          <span
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
