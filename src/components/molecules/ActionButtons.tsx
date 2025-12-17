import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";

export interface ActionButtonsProps {
  fileCount: number;
  uploadingCount: number;
  completedCount: number;
  failedCount: number;
  onUploadAll: () => void;
  onCancelAll: () => void;
  onRetryFailed: () => void;
  onClearCompleted: () => void;
  disabled?: boolean;
}

export const ActionButtons = ({
  fileCount,
  uploadingCount,
  completedCount,
  failedCount,
  onUploadAll,
  onCancelAll,
  onRetryFailed,
  onClearCompleted,
  disabled = false,
}: ActionButtonsProps) => {
  const hasFiles = fileCount > 0;
  const hasUploading = uploadingCount > 0;
  const hasCompleted = completedCount > 0;
  const hasFailed = failedCount > 0;
  const hasPendingFiles = fileCount > uploadingCount + completedCount;

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onUploadAll}
        disabled={disabled || !hasPendingFiles || hasUploading}
        variant="success"
        className="gap-2"
      >
        <Icon type="upload" size="sm" />
        Upload All ({fileCount - uploadingCount - completedCount})
      </Button>

      {hasUploading && (
        <Button
          onClick={onCancelAll}
          disabled={disabled}
          variant="danger"
          className="gap-2"
        >
          <Icon type="close" size="sm" />
          Cancel Upload
        </Button>
      )}

      {hasFailed && (
        <Button
          onClick={onRetryFailed}
          disabled={disabled}
          variant="secondary"
          className="gap-2"
        >
          <Icon type="retry" size="sm" />
          Retry Failed ({failedCount})
        </Button>
      )}

      {hasCompleted && (
        <Button
          onClick={onClearCompleted}
          disabled={disabled}
          variant="danger"
          className="gap-2"
        >
          <Icon type="trash" size="sm" />
          Clear Completed ({completedCount})
        </Button>
      )}

      {hasFiles && !hasUploading && (
        <Button
          onClick={onCancelAll}
          disabled={disabled}
          variant="danger"
          className="gap-2"
        >
          <Icon type="trash" size="sm" />
          Clear All
        </Button>
      )}
    </div>
  );
};
