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
        <section className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold capitalize text-gray-950 sm:text-2xl">
              {FILE_TYPE_MAP[type].label}
              {total ? "s" : ""} ({total})
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                onClick={onUploadAll}
                disabled={pending === 0 || uploading > 0}
                variant="primary"
                size="sm"
              >
                <Icon type="upload" size="sm" />
                <span className="hidden sm:inline">
                  Upload
                  {pending > 0
                    ? pending === total
                      ? " All"
                      : ` (${pending})`
                    : ""}
                </span>
                <span className="sm:hidden">
                  Upload{pending > 0 ? ` (${pending})` : ""}
                </span>
              </Button>

              {failed > 0 && (
                <Button onClick={onRetryFailed} variant="danger" size="sm">
                  <Icon type="retry" size="sm" />
                  <span className="hidden sm:inline">
                    Retry Failed ({failed})
                  </span>
                  <span className="sm:hidden">Retry ({failed})</span>
                </Button>
              )}

              {completed > 0 && (
                <Button onClick={onClearCompleted} variant="outline" size="sm">
                  <Icon type="trash" size="sm" />
                  <span className="hidden sm:inline">
                    Clear Completed
                    {completed > 0
                      ? completed === total
                        ? " All"
                        : ` (${completed})`
                      : ""}
                  </span>
                  <span className="sm:hidden">Clear ({completed})</span>
                </Button>
              )}

              {pending > 0 && (
                <Button
                  onClick={onCancelAll}
                  variant="outline"
                  size="sm"
                  disabled={uploading > 0}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Masonry grid of file cards */}
          <div className="columns-1 gap-2 sm:columns-2 sm:gap-3 lg:columns-3 lg:gap-4">
            {files.map((file) => (
              <div key={file.id}>
                <FileCard {...file} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-lg border-2 border-gray-400 bg-gray-50 p-12 text-center">
          <p className="text-gray-800">
            No {type === "all" ? "files" : type + "s"} available for upload.
          </p>
        </div>
      )}
    </>
  );
};
