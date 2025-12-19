import { clsx } from "clsx";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Icon } from "@/components/atoms/Icon";
import { formatFileSize } from "@/utils/file";

export interface OverallProgressProps {
  totalFiles: number;
  completedFiles: number;
  uploadingFiles: number;
  failedFiles: number;
  totalBytes: number;
  uploadedBytes: number;
  overallProgress: number;
  estimatedTimeRemaining?: number; // in seconds
}

export const OverallProgress = ({
  totalFiles,
  completedFiles,
  uploadingFiles,
  failedFiles,
  totalBytes,
  uploadedBytes,
  overallProgress,
  estimatedTimeRemaining,
}: OverallProgressProps) => {
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins}m ${secs}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${mins}m`;
    }
  };

  const isUploading = uploadingFiles > 0;
  const hasErrors = failedFiles > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon
              type="upload"
              size="md"
              className={clsx(
                isUploading && "text-blue-600 animate-pulse",
                !isUploading &&
                  completedFiles === totalFiles &&
                  "text-green-600",
                hasErrors && !isUploading && "text-amber-600",
              )}
            />
            Overall Progress
          </h3>
          <div className="text-sm font-medium text-gray-600">
            {completedFiles} / {totalFiles} files
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <ProgressBar
            progress={overallProgress}
            variant={
              hasErrors && !isUploading
                ? "error"
                : completedFiles === totalFiles && totalFiles > 0
                  ? "success"
                  : "info"
            }
            size="lg"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Uploaded Bytes */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Uploaded
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {formatFileSize(uploadedBytes)} / {formatFileSize(totalBytes)}
            </span>
          </div>

          {/* Uploading */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Uploading
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {uploadingFiles} file{uploadingFiles !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Failed */}
          {failedFiles > 0 && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Failed
              </span>
              <span className="text-sm font-semibold text-red-600">
                {failedFiles} file{failedFiles !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Estimated Time */}
          {estimatedTimeRemaining !== undefined &&
            estimatedTimeRemaining > 0 &&
            isUploading && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Time Left
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ~{formatTime(estimatedTimeRemaining)}
                </span>
              </div>
            )}
        </div>

        {/* Status Message */}
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span>Uploading files...</span>
          </div>
        )}

        {!isUploading && completedFiles === totalFiles && totalFiles > 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Icon type="check" size="sm" />
            <span>All files uploaded successfully!</span>
          </div>
        )}

        {hasErrors && !isUploading && (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <Icon type="error" size="sm" />
            <span>
              {failedFiles} file{failedFiles !== 1 ? "s" : ""} failed to upload
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
