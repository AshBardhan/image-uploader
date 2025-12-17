import { useDrop, type ConnectDropTarget } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { clsx } from "clsx";
import { Icon } from "../atoms/Icon";
import { FileSelector } from "../molecules/FileSelector";
import type { Ref } from "react";

export interface DropZoneProps {
  onFilesDropped: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
}

export const DropZone = ({
  onFilesDropped,
  accept = "image/*",
  multiple = true,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB
}: DropZoneProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop: (item: { files: File[] }) => {
        if (!disabled && item.files) {
          const fileList = createFileList(item.files);
          onFilesDropped(fileList);
        }
      },
      canDrop: () => !disabled,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [disabled, onFilesDropped],
  );

  const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop as Ref<HTMLDivElement> & ConnectDropTarget}
      className={clsx(
        "relative rounded-lg border-2 border-dashed p-12 transition-all",
        isActive
          ? "border-primary-600 bg-primary-100 scale-[1.01]"
          : "border-gray-300 bg-gray-50",
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "hover:border-primary-400 hover:bg-primary-50",
      )}
    >
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        {/* Icon */}
        <div
          className={clsx(
            "rounded-full p-6 transition-colors",
            isActive ? "bg-primary-200" : "bg-gray-100",
          )}
        >
          <Icon
            type="upload"
            size="xl"
            className={clsx(
              "transition-colors",
              isActive ? "text-primary-700" : "text-gray-600",
            )}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-semibold text-gray-900">
            Drop files here
          </p>
          <p className="text-gray-600">
            or use the button below to browse
          </p>
          <div className="text-center mb-4">
          <FileSelector
            onFilesSelected={onFilesDropped}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
          />
          </div>
          <p className="text-sm text-gray-500">
            <strong>Supports:</strong> JPG, PNG, GIF, WebP (Max {maxSize / (1024 * 1024)}MB)
          </p>
        </div>
      </div>

      {/* Drag Overlay */}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-primary-200/30" />
      )}
    </div>
  );
};
