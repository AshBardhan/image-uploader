import { cn } from "@/utils/style";

interface SkeletonBarProps {
  className?: string;
}

/* Skeleton Loading Bar Component with animation */
export const SkeletonBar = ({ className }: SkeletonBarProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-linear-to-r from-gray-100 via-gray-300 to-gray-100 bg-size-[200%_100%] animate-slide rounded",
        className,
      )}
    />
  );
};
