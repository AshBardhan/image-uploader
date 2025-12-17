import type { FileType } from "../../types/fileTypes";
import { FileCard, type FileCardProps } from "../molecules/FileCard";

export interface FileQueueProps {
  files: Omit<FileCardProps, "onRemove" | "onRetry">[];
  type?: FileType;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
}

export const FileQueue = ({
  files,
  type = "all",
  onRemove,
  onRetry,
}: FileQueueProps) => {
  const pendingFiles = files.filter((f) => f.status === "pending");
  const uploadingFiles = files.filter((f) => f.status === "uploading");
  const completedFiles = files.filter((f) => f.status === "completed");
  const errorFiles = files.filter((f) => f.status === "error");

  const renderSection = (
    title: string,
    sectionFiles: typeof files,
    variant: "default" | "info" | "success" | "error",
  ) => {
    if (sectionFiles.length === 0) return null;

    const colors = {
      default: "text-gray-300 border-gray-700",
      info: "text-blue-300 border-blue-700",
      success: "text-green-300 border-green-700",
      error: "text-red-300 border-red-700",
    };

    return (
      <div className="space-y-3">
        <div className={clsx(colors[variant])}>
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            {title} ({sectionFiles.length})
          </h3>
        </div>
        <div className="space-y-3">
          {sectionFiles.map((file) => (
            <FileCard
              key={file.id}
              {...file}
              onRemove={onRemove}
              onRetry={onRetry}
            />
          ))}
        </div>
      </div>
    );
  };

  if (files.length === 0) {
    return (
      <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-12 text-center">
        <p className="text-gray-600">
          No {type === "all" ? "files" : type + "s"} in queue
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderSection("Uploading", uploadingFiles, "info")}
      {renderSection("Pending", pendingFiles, "default")}
      {renderSection("Failed", errorFiles, "error")}
      {renderSection("Completed", completedFiles, "success")}
    </div>
  );
};

// Helper for clsx (should already be imported from molecules/FileCard)
import { clsx } from "clsx";
