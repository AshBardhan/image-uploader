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
  | "mobile"
  | "folder";

interface IconProps {
  type: IconType;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
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
  mobile: Smartphone,
  folder: Folder,
};

export const Icon = ({
  type,
  className,
  size = "md",
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
      className={cn(className)}
      {...a11yProps}
    />
  );
};
