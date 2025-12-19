import { useState } from "react";
import { clsx } from "clsx";
import { Icon } from "@/components/atoms/Icon";
import { FileSelectorButton } from "@/components/molecules/FileSelectorButton";
import type { FileType } from "@/types/file";
import { FILE_TYPE_MAP } from "@/constants/file";

export interface FileUploaderProps {
  onFilesDropped: (files: FileList) => void;
  type?: FileType;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
}

export const FileUploader = ({
  onFilesDropped,
  type = "all",
  multiple = false,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  // Auto-detect device type if mode is not explicitly set
  const detectMobile = (): boolean => {
    // Fallback: Check for touch support and screen size
    const hasTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

    // Check user agent string as last resort
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(navigator.userAgent);

    return (hasTouchScreen && isSmallScreen) || isMobileUA;
  };

  const isMobile = detectMobile();

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
      onFilesDropped(e.dataTransfer.files);
    }
  };

  // Desktop Mode: Full drop zone with drag & drop
  if (!isMobile) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          "relative rounded-lg border-2 border-dashed p-12 transition-all",
          isDragging
            ? "border-primary-600 bg-primary-100"
            : "border-gray-300 bg-gray-50",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "hover:border-primary-400 hover:bg-primary-100",
        )}
      >
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          {/* Icon */}
          <div
            className={clsx(
              "rounded-full p-6 transition-colors",
              isDragging ? "bg-primary-500" : "bg-gray-600",
            )}
          >
            <Icon
              type="upload"
              size="xl"
              className="transition-colors text-white"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-semibold text-gray-900">
              Drop {type === "all" ? "file" : type}
              {multiple ? "s" : ""} here
            </p>
            <p className="text-gray-600">or use the button below to</p>
            <div className="text-center mb-4">
              <FileSelectorButton
                onFilesSelected={onFilesDropped}
                accept={FILE_TYPE_MAP[type].accept}
                type={type}
                multiple={multiple}
                disabled={disabled}
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm text-gray-500">
                <strong>Supports:</strong> {FILE_TYPE_MAP[type].format}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Limit:</strong> {maxSize / (1024 * 1024)}MB per file
              </p>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 rounded-lg bg-primary-200/30" />
        )}
      </div>
    );
  } else {
    // Mobile Mode: Large vertical button with icon and text
    return (
      <div className="w-full">
        <FileSelectorButton
          onFilesSelected={onFilesDropped}
          accept={FILE_TYPE_MAP[type].accept}
          type={type}
          multiple={multiple}
          disabled={disabled}
          isMobile={true}
        />
      </div>
    );
  }
};
