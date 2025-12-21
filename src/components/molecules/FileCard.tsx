import { cn } from "@/utils/style";
import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import type { File } from "@/types/file";
import { FILE_STATUS_MAP } from "@/constants/file";

interface FileCardProps extends File {
  className?: string;
}

export const FileCard = ({
  name,
  preview,
  progress,
  status,
  error,
  className,
}: FileCardProps) => {
  const [showStatusMessage, setShowStatusMessage] = useState(false);

  useEffect(() => {
    if (status === "completed" || status === "error") {
      setShowStatusMessage(true);
    }
  }, [status]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg bg-gray-100 border-2 transition-all shadow-lg",
        status !== "completed" && status !== "error" && "border-gray-200",
        status === "uploading" && "border-blue-300",
        status === "completed" && "border-green-300",
        status === "error" && "border-red-300",
        className,
      )}
    >
      {/* Image taking entire cell space */}
      {preview ? (
        <img
          src={preview}
          alt={`Preview of ${name}`}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className="flex aspect-square w-full items-center justify-center"
          aria-label="No preview available"
        >
          <Icon type="image" className="text-gray-400" size="lg" />
        </div>
      )}

      {/* Status Badge - Absolute top-right */}
      <div className="absolute right-1 top-1 sm:right-2 sm:top-2">
        <Badge
          variant={FILE_STATUS_MAP[status].variant}
          ariaLabel={`Status: ${FILE_STATUS_MAP[status].label}`}
        >
          {FILE_STATUS_MAP[status].label}
        </Badge>
      </div>

      {/* Progress Bar - Absolute bottom-center (only when uploading) */}
      {status === "uploading" && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 backdrop-blur-sm sm:p-3">
          <ProgressBar
            progress={progress}
            variant={FILE_STATUS_MAP[status].variant}
            showPercentage
            size="sm"
          />
        </div>
      )}

      {/* Success Message - Absolute bottom-center */}
      {status === "completed" && showStatusMessage && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-green-600/70 backdrop-blur-sm p-2 sm:p-3"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
            <Icon type="check" size="sm" />
            <span>Upload complete</span>
            <Button
              variant="ghost"
              onClick={() => setShowStatusMessage(false)}
              className="absolute right-1 top-1 h-auto px-1 py-1 text-white hover:bg-white/20 hover:text-white"
              aria-label="Dismiss message"
            >
              <Icon type="cross" size="xs" />
            </Button>
          </div>
        </div>
      )}

      {/* Error Message - Absolute bottom-center */}
      {status === "error" && showStatusMessage && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-red-600/70 backdrop-blur-sm p-2 sm:p-3"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Icon type="error" size="sm" />
              <span>Upload failed</span>
            </div>
            <div className="text-xs text-white/90">
              {error || "Please retry again."}
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowStatusMessage(false)}
              className="absolute right-1 top-1 h-auto px-1 py-1 text-white hover:bg-white/20 hover:text-white"
              aria-label="Dismiss message"
            >
              <Icon type="cross" size="xs" />
            </Button>
          </div>
        </div>
      )}

      {/* File name overlay on hover */}
      <div className="absolute inset-x-0 top-0 translate-y-[-100%] bg-black/90 p-2 backdrop-blur-sm transition-transform group-hover:translate-y-0">
        <div className="truncate text-xs sm:text-sm font-medium text-white">
          {name}
        </div>
      </div>
    </div>
  );
};
