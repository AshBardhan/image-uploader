import {
  FileUploader,
  type FileUploaderProps,
} from "@/components/templates/FileUploader";
import {
  FileQueue,
  type FileQueueProps,
} from "@/components/templates/FileQueue";
import {
  OverallProgress,
  type OverallProgressProps,
} from "@/components/molecules/OverallProgress";

export interface DashboardProps {
  fileUploaderProps: FileUploaderProps;
  fileQueueProps: FileQueueProps;
  overallProgressProps?: OverallProgressProps;
}

export const Dashboard = ({
  fileUploaderProps,
  fileQueueProps,
  overallProgressProps,
}: DashboardProps) => {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Image Uploader</h1>
        <p className="text-gray-600">
          Upload your images to Cloudinary with drag & drop or browse
        </p>
      </div>

      {/* File Uploader */}
      <FileUploader {...fileUploaderProps} />

      {/* Overall Progress - Only show when files are actively uploading */}
      {overallProgressProps && overallProgressProps.uploadingFiles > 0 && (
        <OverallProgress {...overallProgressProps} />
      )}

      {/* File Queue */}
      <FileQueue {...fileQueueProps} />
    </div>
  );
};
