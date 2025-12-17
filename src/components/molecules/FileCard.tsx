import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { Badge } from "../atoms/Badge";
import { ProgressBar } from "../atoms/ProgressBar";
import { clsx } from "clsx";

export interface FileCardProps {
  id: string;
  name: string;
  size: number;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const FileCard = ({
  id,
  name,
  size,
  preview,
  progress,
  status,
  error,
  onRemove,
  onRetry,
}: FileCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return <Badge variant="default">Pending</Badge>;
      case "uploading":
        return <Badge variant="info">Uploading</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "error":
        return <Badge variant="error">Failed</Badge>;
    }
  };

  const getProgressVariant = () => {
    switch (status) {
      case "completed":
        return "success";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-lg border p-4 transition-all",
        status === "error"
          ? "border-red-300 bg-red-50"
          : "border-gray-200 bg-white",
      )}
    >
      {/* Preview or Icon */}
      <div className="flex-shrink-0">
        {preview ? (
          <img
            src={preview}
            alt={name}
            className="h-16 w-16 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100">
            <Icon type="image" className="text-gray-500" size="lg" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">{name}</p>
            <p className="text-sm text-gray-600">{formatFileSize(size)}</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Progress Bar */}
        {status === "uploading" && (
          <div className="mt-2">
            <ProgressBar
              progress={progress}
              variant={getProgressVariant()}
              showPercentage
            />
          </div>
        )}

        {/* Error Message */}
        {status === "error" && error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <Icon type="error" size="sm" />
            <span>{error}</span>
          </div>
        )}

        {/* Completed Indicator */}
        {status === "completed" && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
            <Icon type="check" size="sm" />
            <span>Upload complete</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {status === "error" && onRetry && (
          <Button
            variant="danger"
            size="icon"
            onClick={() => onRetry(id)}
            aria-label="Retry upload"
          >
            <Icon type="retry" />
          </Button>
        )}
        <Button
          variant="danger"
          size="icon"
          onClick={() => onRemove(id)}
          aria-label="Remove file"
        >
          <Icon type="close" />
        </Button>
      </div>
    </div>
  );
};
