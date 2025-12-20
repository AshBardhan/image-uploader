import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Icon } from "@/components/atoms/Icon";
import { formatFileSize } from "@/utils/file";
import { formatTime } from "@/utils/time";
import type { File, FileUploadStats } from "@/types/file";

export interface FilesUploadProgressProps {
  files: File[];
  uploadStats: FileUploadStats;
}

export const FilesUploadProgress = ({
  files,
  uploadStats,
}: FilesUploadProgressProps) => {
  const totalFiles = files.length;
  const completedFiles = files.filter((f) => f.status === "completed").length;
  const failedFiles = files.filter((f) => f.status === "error").length;
  const uploadingFiles = files.filter((f) => f.status === "uploading").length;
  const pendingFiles = files.filter((f) => f.status === "pending").length;

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
    // Return 0 if not uploading or has errors (upload stopped)
    if (uploadingFiles === 0 || uploadStats.startTime === 0 || hasErrors) {
      return 0;
    }

    const elapsedTime = (Date.now() - uploadStats.startTime) / 1000; // in seconds
    const remainingBytes = totalBytes - uploadedBytes;

    // Return 0 if can't calculate yet
    if (uploadedBytes === 0 || elapsedTime === 0) {
      return 0;
    }

    const uploadSpeed = uploadedBytes / elapsedTime; // bytes per second
    const estimatedTimeRemaining = remainingBytes / uploadSpeed;

    return estimatedTimeRemaining;
  };

  const estimatedTimeRemaining = calculateETA();

  if (uploadedBytes === 0 || pendingFiles > 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-gray-950 sm:text-lg">
            Overall File Upload Progress
          </h3>
          <div className="text-xs font-medium text-gray-800 sm:text-sm">
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
        <div className="grid grid-cols-2 gap-3 pt-2 sm:gap-4 lg:grid-cols-4">
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

          {/* Estimated Time - Show only when > 0 */}
          {estimatedTimeRemaining > 0 && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-700 uppercase tracking-wide font-semibold">
                Time Left
              </span>
              <span className="text-sm font-semibold text-gray-950">
                {formatTime(estimatedTimeRemaining)}
              </span>
            </div>
          )}

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
        </div>

        {/* Status Message */}
        {isUploading && (
          <div
            className="flex items-center gap-2 text-xs font-medium text-blue-800 sm:text-sm"
            role="status"
            aria-live="polite"
          >
            <div
              className="h-2 w-2 animate-pulse rounded-full bg-blue-800"
              aria-hidden="true"
            />
            <span>Uploading files...</span>
          </div>
        )}

        {!isUploading && completedFiles === totalFiles && totalFiles > 0 && (
          <div
            className="flex items-center gap-2 text-xs font-medium text-green-800 sm:text-sm"
            role="status"
            aria-live="polite"
          >
            <Icon type="check" size="sm" />
            <span>All files uploaded successfully!</span>
          </div>
        )}

        {hasErrors && !isUploading && (
          <div
            className="flex items-center gap-2 text-xs font-medium text-amber-800 sm:text-sm"
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
