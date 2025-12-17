import type { FileType } from "../types/fileTypes";

export const getAcceptString = (type: FileType): string => {
  switch (type) {
    case "image":
      return "image/*";
    case "video":
      return "video/*";
    case "document":
      return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";
    default:
      return "*/*";
  }
};

export const getFileTypes = (type: FileType): string => {
  switch (type) {
    case "image":
      return "JPG, PNG, GIF";
    case "video":
      return "MP4, AVI, MOV";
    case "document":
      return "PDF, DOCX, TXT";
    default:
      return "All Files";
  }
};

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
  return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const isFileSizeValid = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};
