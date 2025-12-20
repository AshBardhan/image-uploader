import { clsx } from "clsx";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Icon } from "@/components/atoms/Icon";
import { formatFileSize } from "@/utils/file";
import type { File, FileUploadStats } from "@/types/file";

export interface FilesUploadProgressProps {
  files: File[];
  uploadStats: FileUploadStats;
}

export const FilesUploadProgress = ({
  files,
  uploadStats,
}: FilesUploadProgressProps) => {
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

  const totalFiles = files.length;
  const completedFiles = files.filter((f) => f.status === "completed").length;
  const failedFiles = files.filter((f) => f.status === "error").length;
  const uploadingFiles = files.filter((f) => f.status === "uploading").length;

  const isUploading = uploadingFiles > 0;
  const hasErrors = failedFiles > 0;

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const uploadedBytes = files.reduce((sum, file) => {
    if (file.status === "completed") {
      return sum + file.size;
    } else if (file.status === "uploading" && file.uploadedBytes) {
      return sum + file.uploadedBytes;
    }
    return sum;
  }, 0);
  const uploadProgress =
    totalBytes > 0 ? Math.round((uploadedBytes / totalBytes) * 100) : 0;

  const calculateETA = (): number => {
    if (uploadingFiles === 0 || uploadStats.startTime === 0) {
      return 0;
    }

    const elapsedTime = (Date.now() - uploadStats.startTime) / 1000; // in seconds
    const remainingBytes = totalBytes - uploadedBytes;

    if (uploadedBytes === 0 || elapsedTime === 0) {
      return 0;
    }

    const uploadSpeed = uploadedBytes / elapsedTime; // bytes per second
    const estimatedTimeRemaining = remainingBytes / uploadSpeed;

    return estimatedTimeRemaining;
  };

  const estimatedTimeRemaining = calculateETA();

  if (uploadedBytes === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-950 flex items-center gap-2">
            <Icon
              type="upload"
              size="md"
              className={clsx(
                isUploading && "text-blue-700 animate-pulse",
                !isUploading &&
                  completedFiles === totalFiles &&
                  "text-green-700",
                hasErrors && !isUploading && "text-amber-700",
              )}
            />
            Overall File Upload Progress
          </h3>
          <div className="text-sm font-medium text-gray-800">
            {completedFiles} / {totalFiles} files
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <ProgressBar
            progress={uploadProgress}
            variant={
              hasErrors && !isUploading
                ? "error"
                : completedFiles === totalFiles && totalFiles > 0
                  ? "success"
                  : "info"
            }
            size="lg"
            showPercentage={true}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Uploaded Bytes */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-700 uppercase tracking-wide font-semibold">
              Uploaded
            </span>
            <span className="text-sm font-semibold text-gray-950">
              {formatFileSize(uploadedBytes)} / {formatFileSize(totalBytes)}
            </span>
          </div>

          {/* Uploading */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-700 uppercase tracking-wide font-semibold">
              Uploading
            </span>
            <span className="text-sm font-semibold text-blue-700">
              {uploadingFiles} file{uploadingFiles !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Failed */}
          {failedFiles > 0 && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-700 uppercase tracking-wide font-semibold">
                Failed
              </span>
              <span className="text-sm font-semibold text-red-700">
                {failedFiles} file{failedFiles !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Estimated Time */}
          {estimatedTimeRemaining > 0 && isUploading && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-700 uppercase tracking-wide font-semibold">
                Time Left
              </span>
              <span className="text-sm font-semibold text-gray-950">
                ~{formatTime(estimatedTimeRemaining)}
              </span>
            </div>
          )}
        </div>

        {/* Status Message */}
        {isUploading && (
          <div
            className="flex items-center gap-2 text-sm text-blue-800 font-medium"
            role="status"
            aria-live="polite"
          >
            <div
              className="w-2 h-2 bg-blue-800 rounded-full animate-pulse"
              aria-hidden="true"
            />
            <span>Uploading files...</span>
          </div>
        )}

        {!isUploading && completedFiles === totalFiles && totalFiles > 0 && (
          <div
            className="flex items-center gap-2 text-sm text-green-800 font-medium"
            role="status"
            aria-live="polite"
          >
            <Icon type="check" size="sm" />
            <span>All files uploaded successfully!</span>
          </div>
        )}

        {hasErrors && !isUploading && (
          <div
            className="flex items-center gap-2 text-sm text-amber-800 font-medium"
            role="alert"
            aria-live="assertive"
          >
            <Icon type="error" size="sm" />
            <span>
              {failedFiles} file{failedFiles !== 1 ? "s" : ""} failed to upload
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
