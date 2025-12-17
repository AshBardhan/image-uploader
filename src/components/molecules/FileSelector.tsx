import { useRef } from "react";
import { Button} from "../atoms/Button";
import { Icon } from "../atoms/Icon";

export interface FileSelectorProps {
  onFilesSelected: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export const FileSelector = ({
  onFilesSelected,
  accept = "image/*",
  multiple = true,
  disabled = false,
}: FileSelectorProps) => {
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

      <Button
        onClick={handleClick}
        disabled={disabled}
        variant="secondary"
        className="gap-2"
      >
        <Icon type="folder" size="sm" />
        Browse Files
      </Button>
    </div>
  );
};
