import type { File, FileType } from "@/types/fileTypes";
import { FileCard } from "@/components/molecules/FileCard";
import { Button } from "@/components/atoms/Button";
import { clsx } from "clsx";
import { Icon } from "@/components/atoms/Icon";

export interface FileQueueProps {
  files: File[];
  type?: FileType;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  onUploadAll: () => void;
  onCancelAll: () => void;
  onRetryFailed: () => void;
  onClearCompleted: () => void;
}

export const FileQueue = ({
  files,
  type = "all",
  onRemove,
  onRetry,
  onUploadAll,
  onCancelAll,
  onRetryFailed,
  onClearCompleted,
}: FileQueueProps) => {
  const completedFiles = files.filter((f) => f.status === "completed");
  const failedFiles = files.filter((f) => f.status === "error");
  const uploadingFiles = files.filter((f) => f.status === "uploading");
  const pendingFiles = files.filter((f) => f.status === "pending");

  const renderSection = (
    title: string,
    sectionFiles: File[],
    variant: "default" | "info" | "success" | "error",
  ) => {
    if (sectionFiles.length === 0) return null;

    const colors = {
      default: "text-gray-700",
      info: "text-blue-500",
      success: "text-green-700",
      error: "text-red-500",
    };

    return (
      <div className="space-y-3">
        <h3 className={clsx("text-xl font-semibold", colors[variant])}>
          {title} ({sectionFiles.length})
        </h3>
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

  return (
    <>
      {files.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">File Queue</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onUploadAll}
                disabled={
                  pendingFiles.length === 0 || uploadingFiles.length > 0
                }
                variant="success"
              >
                <Icon type="upload" size="sm" />
                Upload All ({pendingFiles.length})
              </Button>

              {uploadingFiles.length > 0 && (
                <Button onClick={onCancelAll} variant="danger">
                  <Icon type="close" size="sm" />
                  Cancel Upload
                </Button>
              )}

              {failedFiles.length > 0 && (
                <Button onClick={onRetryFailed} variant="secondary">
                  <Icon type="retry" size="sm" />
                  Retry Failed ({failedFiles.length})
                </Button>
              )}

              {completedFiles.length > 0 && (
                <Button onClick={onClearCompleted} variant="danger">
                  <Icon type="trash" size="sm" />
                  Clear Completed ({completedFiles.length})
                </Button>
              )}

              {files.length > 0 && uploadingFiles.length === 0 && (
                <Button onClick={onCancelAll} variant="danger">
                  <Icon type="trash" size="sm" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
          {renderSection("Uploading", uploadingFiles, "info")}
          {renderSection("Pending", pendingFiles, "default")}
          {renderSection("Failed", failedFiles, "error")}
          {renderSection("Completed", completedFiles, "success")}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">
            No {type === "all" ? "files" : type + "s"} in queue
          </p>
        </div>
      )}
    </>
  );
};
