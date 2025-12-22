import { useRef } from "react";
import { cn } from "@/utils/style";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import type { FileType } from "@/types/file";
import { FILE_TYPE_MAP } from "@/constants/file";

export interface FileSelectorButtonProps {
  onFilesSelected: (files: FileList) => void;
  type?: FileType;
  multiple?: boolean;
  disabled?: boolean;
  isMobile?: boolean;
}

export const FileSelectorButton = ({
  onFilesSelected,
  type = "all",
  multiple = false,
  disabled = false,
  isMobile = false,
}: FileSelectorButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept={FILE_TYPE_MAP[type].accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
          aria-hidden="true"
        />
        <div
          role="button"
          aria-disabled={disabled}
          onClick={handleClick}
          tabIndex={disabled ? -1 : 0}
          aria-label={`Select ${FILE_TYPE_MAP[type].label}${multiple ? "s" : ""}`}
          className={cn(
            "w-full rounded-lg border-2 p-4 transition-colors sm:p-6",
            "border-gray-300 bg-gray-100",
            "flex flex-col items-center justify-center gap-2 sm:gap-4",
            disabled && "cursor-not-allowed opacity-50",
            !disabled &&
              "hover:bg-blue-50 focus-visible:outline-none focus-visible:border-blue-600",
          )}
        >
          {/* Icon */}
          <div className="rounded-full bg-gray-700 p-4 sm:p-6">
            <Icon type="upload" size="lg" className="text-white" />
          </div>

          {/* Text */}
          <div className="space-y-1 text-center">
            <p className="text-base font-semibold text-gray-950 sm:text-lg">
              Select {FILE_TYPE_MAP[type].label}
              {multiple ? "s" : ""}
            </p>
            <p className="text-xs text-gray-800 sm:text-sm">
              Tap to browse your {FILE_TYPE_MAP[type].label}
              {multiple ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="inline-flex gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept={FILE_TYPE_MAP[type].accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        <Button onClick={handleClick} disabled={disabled} variant="primary">
          <Icon type="folder" size="sm" />
          Browse {FILE_TYPE_MAP[type].label}
          {multiple ? "s" : ""}
        </Button>
      </div>
    );
  }
};
