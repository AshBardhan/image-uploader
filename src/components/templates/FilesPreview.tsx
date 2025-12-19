import type { File, FileType } from "@/types/file";
import { FileCard } from "@/components/molecules/FileCard";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { FILE_TYPE_MAP } from "@/constants/file";

export interface FilesPreviewProps {
  files: File[];
  type?: FileType;
  onUploadAll: () => void;
  onCancelAll: () => void;
  onRetryFailed: () => void;
  onClearCompleted: () => void;
}

export const FilesPreview = ({
  files,
  type = "all",
  onUploadAll,
  onCancelAll,
  onRetryFailed,
  onClearCompleted,
}: FilesPreviewProps) => {
  const total = files.length;
  const completed = files.filter((f) => f.status === "completed").length;
  const failed = files.filter((f) => f.status === "error").length;
  const uploading = files.filter((f) => f.status === "uploading").length;
  const pending = files.filter((f) => f.status === "pending").length;

  return (
    <>
      {total > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold capitalize">
              {FILE_TYPE_MAP[type].label}
              {total ? "s" : ""} ({total})
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onUploadAll}
                disabled={pending === 0 || uploading > 0}
                variant="primary"
              >
                <Icon type="upload" size="sm" />
                Upload{" "}
                {pending > 0
                  ? pending === total
                    ? "All"
                    : `(${pending})`
                  : ""}
              </Button>

              {failed > 0 && (
                <Button onClick={onRetryFailed} variant="danger">
                  <Icon type="retry" size="sm" />
                  Retry Failed ({failed})
                </Button>
              )}

              {completed > 0 && (
                <Button onClick={onClearCompleted} variant="outline">
                  <Icon type="trash" size="sm" />
                  Clear Completed{" "}
                  {completed > 0
                    ? completed === total
                      ? "All"
                      : `(${completed})`
                    : ""}
                </Button>
              )}

              {pending > 0 && (
                <Button
                  onClick={onCancelAll}
                  variant="outline"
                  disabled={uploading > 0}
                >
                  <Icon type="cross" size="sm" />
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Masonry grid of file cards */}
          <div className="columns-1 gap-1 lg:columns-3 lg:gap-2">
            {files.map((file) => (
              <FileCard key={file.id} {...file} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">
            No {type === "all" ? "files" : type + "s"} available for upload.
          </p>
        </div>
      )}
    </>
  );
};
