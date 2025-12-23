import type { File, FileType } from "@/types/file";
import { Text } from "@/components/atoms/Text";
import { FileItem } from "@/components/templates/FileItem";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { FILE_TYPE_MAP } from "@/constants/file";
import { Card } from "../molecules/Card";

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
      <section className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Text variant="h3" className="capitalize">
            {FILE_TYPE_MAP[type].label}s {total > 0 && `(${total})`}
          </Text>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              onClick={onUploadAll}
              disabled={pending === 0 || uploading > 0}
              loading={uploading > 0}
              variant="primary"
              size="sm"
            >
              {uploading === 0 && <Icon type="upload" size="sm" />}
              Upload
            </Button>

            {failed > 0 && (
              <Button onClick={onRetryFailed} variant="danger" size="sm">
                <Icon type="retry" size="sm" />
                <span className="hidden sm:inline">
                  Retry Failed {failed !== total ? ` (${failed})` : ""}
                </span>
                <span className="sm:hidden">Retry ({failed})</span>
              </Button>
            )}

            {completed > 0 && (
              <Button onClick={onClearCompleted} variant="secondary" size="sm">
                <Icon type="trash" size="sm" />
                <span className="hidden sm:inline">
                  Clear Completed
                  {completed !== total ? ` (${completed})` : ""}
                </span>
                <span className="sm:hidden">Clear ({completed})</span>
              </Button>
            )}

            <Button
              onClick={onCancelAll}
              variant="outline"
              size="sm"
              disabled={total === 0 || uploading > 0}
            >
              Cancel
            </Button>
          </div>
        </div>
        {total > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <FileItem {...file} key={file.id} />
            ))}
          </div>
        ) : (
          <Card>
            <Text variant="p" className="text-center py-5">
              No {type === "all" ? "files" : type + "s"} available for upload.
            </Text>
          </Card>
        )}
      </section>
    </>
  );
};
