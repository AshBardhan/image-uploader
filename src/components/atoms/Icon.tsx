import {
  Upload,
  Image,
  Info,
  Check,
  CircleX,
  TriangleAlert,
  X,
  Trash2,
  RotateCw,
  SquareDashedMousePointer,
  Smartphone,
  Folder,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/style";

export type IconType =
  | "upload"
  | "image"
  | "info"
  | "check"
  | "error"
  | "warning"
  | "cross"
  | "trash"
  | "retry"
  | "drop"
  | "mobile"
  | "folder";

interface IconProps {
  type: IconType;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
  strokeWidth?: number;
  ariaLabel?: string;
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const iconMap: Record<IconType, LucideIcon> = {
  upload: Upload,
  image: Image,
  info: Info,
  check: Check,
  error: CircleX,
  warning: TriangleAlert,
  cross: X,
  trash: Trash2,
  retry: RotateCw,
  drop: SquareDashedMousePointer,
  mobile: Smartphone,
  folder: Folder,
};

/* Icon Component with size and accessibility support */
export const Icon = ({
  type,
  className,
  size = "md",
  strokeWidth = 2,
  ariaLabel,
}: IconProps) => {
  const IconComponent = iconMap[type];

  if (!IconComponent) {
    return null;
  }

  const a11yProps = {
    role: ariaLabel ? "img" : "presentation",
    "aria-label": ariaLabel,
    "aria-hidden": !ariaLabel,
  };

  return (
    <IconComponent
      size={sizeMap[size]}
      strokeWidth={strokeWidth}
      className={cn("inline-flex", className)}
      {...a11yProps}
    />
  );
};
