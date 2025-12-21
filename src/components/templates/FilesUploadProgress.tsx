import { Text } from "@/components/atoms/Text";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Metric } from "@/components/molecules/Metric";
import { Icon } from "@/components/atoms/Icon";
import { formatFileSize } from "@/utils/file";
import { formatTime } from "@/utils/time";
import type { File, FileUploadTime } from "@/types/file";

export interface FilesUploadProgressProps {
  files: File[];
  time: FileUploadTime;
}

export const FilesUploadProgress = ({
  files,
  time,
}: FilesUploadProgressProps) => {
  const { start, current } = time;
  const totalFiles = files.length;
  const completedFiles = files.filter((f) => f.status === "completed").length;
  const pendingFiles = files.filter((f) => f.status === "pending").length;
  const failedFiles = files.filter((f) => f.status === "error").length;
  const uploadingFiles = files.filter((f) => f.status === "uploading").length;

  const isUploading = uploadingFiles > 0;
  const hasErrors = failedFiles > 0;

  const bytesTotal = files.reduce((sum, file) => sum + file.size, 0);
  const bytesUploaded = files.reduce(
    (sum, file) => sum + (file.bytesUploaded || 0),
    0,
  );

  const uploadProgress =
    bytesTotal > 0 ? Math.round((bytesUploaded / bytesTotal) * 100) : 0;

  const calculateETA = (): number => {
    if (bytesUploaded === 0 || start === 0 || start === current) {
      return 0;
    }

    if (uploadProgress === 100 || (hasErrors && !isUploading)) {
      return 0;
    }

    const duration = (current - start) / 1000;
    const bytesLeft = bytesTotal - bytesUploaded;
    const uploadSpeed = bytesUploaded / duration;

    return bytesLeft / uploadSpeed;
  };

  const timeLeft = calculateETA();

  // Hide if no active upload states (only pending or no files)
  if (uploadingFiles === 0 && completedFiles === 0 && failedFiles === 0) {
    return null;
  }

  // Hide if there are pending files alongside completed/failed files
  // (user added new files after previous upload finished)
  if (pendingFiles > 0 && (completedFiles > 0 || failedFiles > 0)) {
    return null;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        <Text variant="h4">Overall File Upload Progress</Text>

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
            value={`${formatFileSize(bytesUploaded)}/${formatFileSize(bytesTotal)}`}
          />

          {/* Files Uploaded */}
          <Metric
            label="Uploaded"
            direction="column"
            size="small"
            value={`${completedFiles}/${totalFiles}`}
          />

          {/* Estimated Time to Complete */}
          {timeLeft > 0 && (
            <Metric
              className="ml-0 sm:ml-auto"
              label="Time Left"
              direction="column"
              size="small"
              value={`approx. ${formatTime(timeLeft)}`}
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

        {!isUploading && completedFiles === totalFiles && (
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
              {failedFiles} file{failedFiles > 1 ? "s" : ""} failed to upload
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
