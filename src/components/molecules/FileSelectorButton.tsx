import { useRef } from "react";
import type { FileType } from "@/types/file";
import { FILE_TYPE_MAP } from "@/constants/file";
import { cn } from "@/utils/style";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";

export interface FileSelectorButtonProps {
  onFilesSelected: (files: FileList) => void;
  type?: FileType;
  multiple?: boolean;
  disabled?: boolean;
  isMobile?: boolean;
}

/* File Selector component to add files via button or mobile-friendly UI */
export const FileSelectorButton = ({
  onFilesSelected,
  type = "all",
  multiple = false,
  disabled = false,
  isMobile = false,
}: FileSelectorButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Click handler to trigger file input */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  /* Change handler to process selected files */
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
          <Icon
            type="drop"
            size="xl"
            strokeWidth={1.5}
            className={"text-gray-500"}
          />

          {/* Text */}
          <div className="space-y-1 text-center">
            <Text variant="h3">
              Select {FILE_TYPE_MAP[type].label}
              {multiple ? "s" : ""}
            </Text>
            <Text variant="p" className="text-xs md:text-sm">
              Tap to browse your {FILE_TYPE_MAP[type].label}
              {multiple ? "s" : ""}
            </Text>
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
        <Button
          onClick={handleClick}
          disabled={disabled}
          variant="primary"
          size="lg"
        >
          <Icon type="folder" size="md" />
          Browse {FILE_TYPE_MAP[type].label}
          {multiple ? "s" : ""}
        </Button>
      </div>
    );
  }
};
