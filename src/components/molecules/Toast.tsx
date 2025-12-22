import { cva } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/style";
import { Icon, type IconType } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";

export type ToastTheme = "success" | "warning" | "error" | "info";
export type ToastPosition = "top" | "bottom";

type ToastState = "entering" | "visible" | "exitingTop" | "exitingBottom";

const toastVariants = cva(
  "relative flex items-start gap-3 border-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out p-4",
  {
    variants: {
      theme: {
        success: "border-green-500 bg-green-50",
        warning: "border-yellow-500 bg-yellow-50",
        error: "border-red-500 bg-red-50",
        info: "border-blue-500 bg-blue-50",
      },
      state: {
        entering: "opacity-0 scale-95",
        visible: "opacity-100 scale-100",
        exitingTop: "opacity-0 scale-95 -translate-y-2",
        exitingBottom: "opacity-0 scale-95 translate-y-2",
      },
    },
  },
);

const iconMap: Record<ToastTheme, IconType> = {
  success: "check",
  warning: "warning",
  error: "error",
  info: "info",
};

const iconColorMap: Record<ToastTheme, string> = {
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
  info: "text-blue-600",
};

export interface ToastProps {
  title?: string;
  message: string;
  theme: ToastTheme;
  position: ToastPosition;
  duration: number;
  onClose: () => void;
}

export const Toast = ({
  title,
  message,
  theme,
  position,
  duration,
  onClose,
}: ToastProps) => {
  const [state, setState] = useState<ToastState>("entering");
  const isClosingRef = useRef(false);

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    setState(position === "bottom" ? "exitingBottom" : "exitingTop");

    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => {
      setState("visible");
    });

    const autoCloseTimer = setTimeout(handleClose, duration);

    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(autoCloseTimer);
    };
  }, [duration]);

  return (
    <div
      role="alert"
      aria-live={theme === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={cn(toastVariants({ theme, state }))}
    >
      {/* Icon */}
      <div className="pt-0.5">
        <Icon type={iconMap[theme]} size="lg" className={iconColorMap[theme]} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {title && <Text variant="h5">{title}</Text>}
        <Text variant="p" className="break-words text-xs md:text-sm">
          {message}
        </Text>
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        aria-label="Dismiss notification"
        onClick={handleClose}
        className="absolute right-1 top-1 h-auto px-1 py-1 hover:bg-black/10"
      >
        <Icon type="cross" size="xs" />
      </Button>
    </div>
  );
};
