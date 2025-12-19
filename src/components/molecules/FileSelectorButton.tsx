import { useRef } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import type { FileType } from "@/types/file";

export interface FileSelectorButtonProps {
  onFilesSelected: (files: FileList) => void;
  accept?: string;
  type?: FileType;
  multiple?: boolean;
  disabled?: boolean;
  isMobile?: boolean;
}

export const FileSelectorButton = ({
  onFilesSelected,
  accept = "/*",
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
    // Reset input
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
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        <button
          onClick={handleClick}
          disabled={disabled}
          className={clsx(
            "w-full rounded-lg border-2 p-8 transition-all",
            "border-gray-300 bg-gray-50",
            "flex flex-col items-center justify-center gap-4",
            disabled && "cursor-not-allowed opacity-50",
            !disabled && "hover:border-primary-400 hover:bg-primary-100",
          )}
        >
          {/* Icon */}
          <div className="rounded-full p-6 bg-gray-600">
            <Icon type="upload" size="xl" className="text-white" />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold text-gray-900">
              Select {type === "all" ? "file" : type}
              {multiple ? "s" : ""}
            </p>
            <p className="text-sm text-gray-600">
              Tap to browse your {type === "all" ? "file" : type}
              {multiple ? "s" : ""}
            </p>
          </div>
        </button>
      </div>
    );
  } else {
    return (
      <div className="inline-flex gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <Button onClick={handleClick} disabled={disabled} variant="primary">
          <Icon type="folder" size="sm" />
          Browse {type === "all" ? "file" : type}
          {multiple ? "s" : ""}
        </Button>
      </div>
    );
  }
};
