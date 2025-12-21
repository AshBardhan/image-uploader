import { cn } from "@/utils/style";

interface SkeletonBarProps {
  className?: string;
}

export function SkeletonBar({ className }: SkeletonBarProps) {
  return (
    <div aria-hidden="true" className={cn("bg-gray-300 rounded", className)} />
  );
}
