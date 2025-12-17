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
  | "close"
  | "trash"
  | "retry"
  | "mobile"
  | "folder";

interface IconProps {
  type: IconType;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
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
  close: X,
  trash: Trash2,
  retry: RotateCw,
  mobile: Smartphone,
  folder: Folder,
};

export const Icon = ({ type, className, size = "md" }: IconProps) => {
  const IconComponent = iconMap[type];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={sizeMap[size]} className={className} />;
};
