import { useState } from "react";
import { cn } from "@/utils/style";
import { Icon } from "@/components/atoms/Icon";
import { FileSelectorButton } from "@/components/molecules/FileSelectorButton";
import { Card } from "@/components/molecules/Card";
import type { FileType } from "@/types/file";
import { FILE_TYPE_MAP } from "@/constants/file";

export interface FileUploaderProps {
  onFilesSelected: (files: FileList) => void;
  type?: FileType;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
}

export const FileUploader = ({
  onFilesSelected,
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
      onFilesSelected(e.dataTransfer.files);
    }
  };

  // Desktop Mode: Full drop zone with drag & drop
  if (!isMobile) {
    return (
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
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 text-center">
          <div className="space-y-2">
            <div
              className={cn(
                "rounded-full p-4 transition-colors sm:p-6 inline-flex",
                isDragging ? "bg-blue-600" : "bg-gray-700",
              )}
              aria-hidden="true"
            >
              <Icon type="upload" size="xl" className="text-white" />
            </div>

            <p className="text-base font-semibold text-gray-950 sm:text-lg md:text-xl">
              Drop {FILE_TYPE_MAP[type].label}
              {multiple ? "s" : ""} here
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-800 sm:text-base">
              or use the button below to
            </p>
            <FileSelectorButton
              onFilesSelected={onFilesSelected}
              type={type}
              multiple={multiple}
              disabled={disabled}
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-700 sm:text-sm">
              <strong>Supports:</strong> {FILE_TYPE_MAP[type].format}
            </p>
            <p className="text-xs text-gray-700 sm:text-sm">
              <strong>Limit:</strong> {maxSize / (1024 * 1024)}MB per file
            </p>
          </div>
        </div>

        {/* Drag Overlay */}
        {isDragging && (
          <div
            className="pointer-events-none absolute inset-0 rounded-lg bg-blue-200/30"
            aria-hidden="true"
          />
        )}
      </Card>
    );
  } else {
    // Mobile Mode: Large vertical button with icon and text
    return (
      <Card padded={false} className="border-none">
        <FileSelectorButton
          onFilesSelected={onFilesSelected}
          type={type}
          multiple={multiple}
          disabled={disabled}
          isMobile={true}
        />
      </Card>
    );
  }
};
