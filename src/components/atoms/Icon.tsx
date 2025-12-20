import {
  Upload,
  Image,
  Check,
  AlertCircle,
  X,
  Trash2,
  RotateCw,
  Smartphone,
  Folder,
  type LucideIcon,
} from "lucide-react";

export type IconType =
  | "upload"
  | "image"
  | "check"
  | "error"
  | "cross"
  | "trash"
  | "retry"
  | "mobile"
  | "folder";

interface IconProps {
  type: IconType;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  ariaLabel?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const iconMap: Record<IconType, LucideIcon> = {
  upload: Upload,
  image: Image,
  check: Check,
  error: AlertCircle,
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
    <IconComponent size={sizeMap[size]} className={className} {...a11yProps} />
  );
};
