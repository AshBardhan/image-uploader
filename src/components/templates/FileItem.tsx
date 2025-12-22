import { cn } from "@/utils/style";
import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { Button } from "@/components/atoms/Button";
import { SkeletonBar } from "@/components/atoms/SkeletonBar";
import { Badge } from "@/components/atoms/Badge";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Card } from "@/components/molecules/Card";
import type { File } from "@/types/file";
import { FILE_STATUS_MAP } from "@/constants/file";

interface FileItemProps extends File {
  className?: string;
}

export const FileItem = ({
  name,
  preview,
  progress,
  status,
  error,
  className,
}: FileItemProps) => {
  const [showStatusMessage, setShowStatusMessage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isFileLoading =
    !preview && (status === "pending" || status === "uploading");

  useEffect(() => {
    if (status === "completed" || status === "error") {
      setShowStatusMessage(true);
    }
  }, [status]);

  useEffect(() => {
    if (preview) {
      setImageLoaded(false);
    }
  }, [preview]);

  const closeMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowStatusMessage(false);
  };

  return (
    <Card
      padded={false}
      className={cn(
        "group relative overflow-hidden bg-gray-100 border-2 transition-colors",
        status !== "completed" && status !== "error" && "border-gray-300",
        status === "uploading" && "border-blue-400",
        status === "completed" && "border-green-400",
        status === "error" && "border-red-400",
        className,
      )}
    >
      {/* Image taking entire cell space */}
      {isFileLoading ? (
        // Loading skeleton
        <div className="animate-pulse relative aspect-square md:aspect-video">
          <SkeletonBar className="absolute inset-0" />
          <Icon
            type="image"
            className="text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            size="lg"
          />
        </div>
      ) : preview ? (
        // Image preview
        <div className="relative aspect-square md:aspect-video">
          <div
            className={cn(
              "absolute z-10 inset-0 bg-gray-100",
              imageLoaded && "opacity-0 invisible",
            )}
          >
            <Icon
              type="image"
              className="text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              size="lg"
            />
          </div>
          <img
            src={preview}
            alt={`Preview of ${name}`}
            className={cn(
              "w-full object-cover transition-transform duration-300",
              "group-hover:scale-105",
              !imageLoaded && "opacity-0 invisible",
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      ) : (
        // Fallback when no preview
        <div
          className="flex aspect-square items-center justify-center bg-gray-200 md:aspect-video"
          aria-label="No preview available"
        >
          <Icon type="image" className="text-gray-400" size="lg" />
        </div>
      )}

      {/* Status Badge - Absolute top-right */}
      {!isFileLoading && (
        <div className="absolute right-1 top-1 sm:right-2 sm:top-2">
          <Badge
            variant={FILE_STATUS_MAP[status].variant}
            ariaLabel={`Status: ${FILE_STATUS_MAP[status].label}`}
          >
            {FILE_STATUS_MAP[status].label}
          </Badge>
        </div>
      )}

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
              onClick={closeMessage}
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
              onClick={closeMessage}
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
    </Card>
  );
};
