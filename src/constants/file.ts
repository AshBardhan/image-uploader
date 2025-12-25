import type { FileStatus, FileType } from "@/types/file";

/* File-based interfaces */
interface FileStatusInfo {
  label: string;
  variant: "default" | "info" | "success" | "danger";
}

interface FileTypeInfo {
  label: string;
  format: string;
  accept: string;
}

/* File-based records */
export const FILE_STATUS_MAP: Record<FileStatus, FileStatusInfo> = {
  pending: {
    label: "Pending",
    variant: "default",
  },
  uploading: {
    label: "Uploading",
    variant: "info",
  },
  completed: {
    label: "Uploaded",
    variant: "success",
  },
  error: { label: "Failed", variant: "danger" },
};

export const FILE_TYPE_MAP: Record<FileType, FileTypeInfo> = {
  image: {
    label: "image",
    format: "JPG, JPEG, PNG, GIF, WEBP",
    accept: ".jpg,.jpeg,.png,.gif,.webp",
  },
  video: { label: "video", format: "MP4, AVI, MOV", accept: "video/*" },
  document: {
    label: "document",
    format: "PDF, DOC, XLS",
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt",
  },
  all: { label: "files", format: "All Files", accept: "*/*" },
};
