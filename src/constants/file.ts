import type { FileStatus, FileType } from "@/types/file";

interface FileStatusInfo {
  label: string;
  color: string;
  variant: "default" | "info" | "success" | "error";
}

export const FILE_STATUS_MAP: Record<FileStatus, FileStatusInfo> = {
  pending: {
    label: "Pending",
    color: "text-gray-700",
    variant: "default",
  },
  uploading: {
    label: "Uploading",
    color: "text-blue-700",
    variant: "info",
  },
  completed: {
    label: "Uploaded",
    color: "text-green-700",
    variant: "success",
  },
  error: { label: "Failed", color: "text-red-700", variant: "error" },
};

interface FileTypeInfo {
  label: string;
  format: string;
  accept: string;
}

export const FILE_TYPE_MAP: Record<FileType, FileTypeInfo> = {
  image: { label: "image", format: "JPG, PNG, GIF", accept: "image/*" },
  video: { label: "video", format: "MP4, AVI, MOV", accept: "video/*" },
  document: {
    label: "document",
    format: "PDF, DOC, XLS",
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt",
  },
  all: { label: "files", format: "All Files", accept: "*/*" },
};
