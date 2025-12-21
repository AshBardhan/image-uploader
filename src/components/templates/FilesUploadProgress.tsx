import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Metric } from "@/components/molecules/Metric";
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

  if (uploadedBytes === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base font-semibold text-gray-950 sm:text-lg">
          Overall File Upload Progress
        </h3>

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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {/* Uploaded Bytes */}
          <Metric
            label="Data"
            direction="column"
            size="small"
            value={`${formatFileSize(uploadedBytes)}/${formatFileSize(totalBytes)}`}
          />

          {/* Files Uploaded */}
          <Metric
            label="Uploaded"
            direction="column"
            size="small"
            value={`${completedFiles}/${totalFiles}`}
          />

          {/* Failed */}
          {failedFiles > 0 && (
            <Metric
              label="Failed"
              direction="column"
              size="small"
              theme="danger"
              value={`${failedFiles}/${totalFiles}`}
            />
          )}

          {/* Estimated Time to Complete */}
          {estimatedTimeRemaining > 0 && (
            <Metric
              className="ml-0 sm:ml-auto"
              label="Time to Complete"
              direction="column"
              size="small"
              value={formatTime(estimatedTimeRemaining)}
            />
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
