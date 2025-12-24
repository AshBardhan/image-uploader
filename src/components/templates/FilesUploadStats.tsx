import { Text } from "@/components/atoms/Text";
import { Card } from "@/components/molecules/Card";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Metric } from "@/components/molecules/Metric";
import { Icon } from "@/components/atoms/Icon";
import { formatFileSize } from "@/utils/file";
import { formatTime } from "@/utils/time";
import type { File, FileUploadTime } from "@/types/file";
import { AnimatePresence, motion } from "framer-motion";

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

  return (
    <AnimatePresence mode="wait">
      {isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="space-y-3 sm:space-y-4"
            role="status"
            aria-live="polite"
          >
            <Text variant="h4">
              {hasFailed ? "Re-uploading" : "Uploading"} Files
            </Text>
            {/* Progress Bar */}
            <ProgressBar
              progress={uploadProgress}
              variant={
                hasFailed && !isUploading
                  ? "danger"
                  : isUploadComplete && totalFiles > 0
                    ? "success"
                    : "info"
              }
              size="lg"
              showPercentage={true}
            />
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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

              {/* Files Failed */}
              {failedFiles > 0 && (
                <Metric
                  label="Failed"
                  direction="column"
                  size="small"
                  value={`${failedFiles}/${totalFiles}`}
                />
              )}

              {/* Estimated Time to Complete */}
              {timeLeft > 0 && (
                <Metric
                  label="Time Left"
                  direction="column"
                  size="small"
                  value={`${formatTime(timeLeft)}`}
                />
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Success Message */}
      {completedFiles > 0 && isUploadComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            theme="success"
            className="flex items-center gap-2 sm:gap-4"
            role="status"
            aria-live="polite"
          >
            <Icon type="check" size="xl" className="text-green-500" />
            <div>
              <Text variant="h4" theme="success">
                All files uploaded successfully
              </Text>
              <Text className="text-xs">Please clear the completed files</Text>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Failed Message */}
      {hasFailed && !isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            theme="error"
            className="flex items-center gap-2 sm:gap-4"
            role="alert"
            aria-live="assertive"
          >
            <Icon type="error" size="xl" className="text-red-500" />
            <div>
              <Text variant="h4" theme="danger">
                Unable to upload files
              </Text>

              <Text className="text-xs">
                Please retry to upload again after some time
              </Text>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Warning Message */}
      {pendingFiles > 0 && !isUploading && !hasFailed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            theme="warning"
            className="flex items-center gap-2 sm:gap-4"
            role="status"
            aria-live="polite"
          >
            <Icon type="info" size="xl" className="text-yellow-500" />
            <div>
              <Text variant="h4" theme="warning">
                {pendingFiles} file{pendingFiles > 1 ? "s" : ""} pending upload
              </Text>
              <Text className="text-xs">Please upload the pending files</Text>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
