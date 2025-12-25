import { useState } from "react";
import type { FileType } from "@/types/file";
import { FILE_TYPE_MAP } from "@/constants/file";
import { cn } from "@/utils/style";
import { isMobileDevice } from "@/utils/mobile";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { FileSelectorButton } from "@/components/molecules/FileSelectorButton";
import { Card } from "@/components/molecules/Card";

export interface FileUploaderProps {
  onFilesSelected: (files: FileList) => void;
  type?: FileType;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
}

/* File Uploader Component with drag-and-drop and file selection button */
export const FileUploader = ({
  onFilesSelected,
  type = "all",
  multiple = false,
  disabled = false,
  maxSize = 10 * 1024 * 1024,
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = isMobileDevice();

  /* Drag-based event handlers */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled && e.dataTransfer.files) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <>
      {isMobile ? (
        <Card padded={false} className="border-none">
          {/* Files upload button for mobile devices */}
          <FileSelectorButton
            onFilesSelected={onFilesSelected}
            type={type}
            multiple={multiple}
            disabled={disabled}
            isMobile={true}
          />
        </Card>
      ) : (
        <Card
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          role="region"
          aria-label="File upload drop zone"
          className={cn(
            "relative rounded-lg border-2 border-dashed p-4 transition-colors sm:p-6 md:p-8",
            isDragging
              ? "border-blue-600 bg-blue-100"
              : "border-gray-400 bg-gray-100",
            disabled && "cursor-not-allowed opacity-50",
            !disabled &&
              " hover:bg-blue-50 focus-visible:outline-none focus-visible:border-blue-600",
          )}
        >
          {/* Files drop zone and upload button for desktop devices */}
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 text-center">
            <div className="space-y-2">
              <Icon
                type="drop"
                size="xl"
                strokeWidth={1.5}
                className={isDragging ? "text-black" : "text-gray-500"}
              />
              <Text variant="h3">
                Drop {FILE_TYPE_MAP[type].label}
                {multiple ? "s" : ""} here
              </Text>
            </div>
            <div className="space-y-1">
              <Text>or use the button below to</Text>
              <FileSelectorButton
                onFilesSelected={onFilesSelected}
                type={type}
                multiple={multiple}
                disabled={disabled}
              />
            </div>
            <div className="space-y-0">
              <Text className="text-xs md:text-sm">
                <strong>Supports:</strong> {FILE_TYPE_MAP[type].format}
              </Text>
              <Text className="text-xs md:text-sm">
                <strong>Limit:</strong> {maxSize / (1024 * 1024)}MB per file
              </Text>
            </div>
          </div>

          {/* Drag overlay */}
          {isDragging && (
            <div
              className="pointer-events-none absolute inset-0 rounded-lg bg-blue-200/30"
              aria-hidden="true"
            />
          )}
        </Card>
      )}
    </>
  );
};
