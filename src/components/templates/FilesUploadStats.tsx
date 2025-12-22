import { Text } from "@/components/atoms/Text";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Metric } from "@/components/molecules/Metric";
import { Icon } from "@/components/atoms/Icon";
import { formatFileSize } from "@/utils/file";
import { formatTime } from "@/utils/time";
import type { File, FileUploadTime } from "@/types/file";

export interface FilesUploadStatsProps {
  files: File[];
  time: FileUploadTime;
}

export const FilesUploadStats = ({ files, time }: FilesUploadStatsProps) => {
  const { start, current } = time;
  const totalFiles = files.length;
  const completedFiles = files.filter((f) => f.status === "completed").length;
  const pendingFiles = files.filter((f) => f.status === "pending").length;
  const failedFiles = files.filter((f) => f.status === "error").length;
  const uploadingFiles = files.filter((f) => f.status === "uploading").length;

  const isUploading = uploadingFiles > 0;
  const hasFailed = failedFiles > 0;
  const isUploadComplete = completedFiles === totalFiles;

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

    if (uploadProgress === 100 || (hasFailed && !isUploading)) {
      return 0;
    }

    const duration = (current - start) / 1000;
    const bytesLeft = bytesTotal - bytesUploaded;
    const uploadSpeed = bytesUploaded / duration;

    return bytesLeft / uploadSpeed;
  };

  const timeLeft = calculateETA();

  // Hide if no active upload states
  if (uploadingFiles === 0 && completedFiles === 0 && failedFiles === 0) {
    return null;
  } else {
    // Hide if there are pending files alongside completed/failed files
    // (user added new files after previous upload finished)
    if (pendingFiles > 0) {
      return null;
    }
  }

  return (
    <section className="rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-sm sm:p-6">
      {(isUploading || totalFiles > completedFiles + failedFiles) && (
        <div className="space-y-3 sm:space-y-4">
          <Text variant="h4" role="status" aria-live="polite">
            {hasFailed ? "Re-uploading" : "Uploading"} Files
          </Text>
          {/* Progress Bar */}
          <ProgressBar
            progress={uploadProgress}
            variant={
              hasFailed && !isUploading
                ? "error"
                : isUploadComplete && totalFiles > 0
                  ? "success"
                  : "info"
            }
            size="lg"
            showPercentage={true}
          />
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
        </div>
      )}

      {/* Status Message */}
      {!isUploading && isUploadComplete && (
        <div className="flex items-center gap-2 sm:gap-4">
          <Icon type="check" size="xl" className="text-green-500" />
          <div>
            <Text variant="h4" theme="success" role="status" aria-live="polite">
              All files uploaded successfully
            </Text>
            <Text className="text-xs">Please clear the completed files</Text>
          </div>
        </div>
      )}

      {hasFailed && !isUploading && (
        <div className="flex items-center gap-2 sm:gap-4">
          <Icon type="error" size="xl" className="text-red-500" />
          <div>
            <Text
              variant="h4"
              theme="danger"
              role="alert"
              aria-live="assertive"
            >
              Unable to upload files
            </Text>

            <Text className="text-xs">
              Please retry to upload again after some time
            </Text>
          </div>
        </div>
      )}
    </section>
  );
};
