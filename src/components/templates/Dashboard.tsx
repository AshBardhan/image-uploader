import { DropZone, type DropZoneProps } from "../organisms/DropZone";
import { FileQueue, type FileQueueProps } from "../organisms/FileQueue";
import { ActionButtons, type ActionButtonsProps } from "../molecules/ActionButtons";

export interface DashboardProps {
  dropZoneProps: DropZoneProps;
  fileQueueProps: FileQueueProps;
  actionButtonsProps: ActionButtonsProps;
}

export const Dashboard = ({
  dropZoneProps,
  fileQueueProps,
  actionButtonsProps,
}: DashboardProps) => {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Image Uploader</h1>
        <p className="text-gray-600">
          Upload your images to Cloudinary with drag & drop or browse
        </p>
      </div>

      {/* Drop Zone */}
      <DropZone {...dropZoneProps} />

      {/* Action Buttons */}
      {fileQueueProps.files.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <ActionButtons {...actionButtonsProps} />
        </div>
      )}

      {/* File Queue */}
      <div>
        <FileQueue {...fileQueueProps} />
      </div>
    </div>
  );
};
