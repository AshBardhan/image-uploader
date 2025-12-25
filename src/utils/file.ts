import type { File } from "@/types/file";

/* Format file size in human-readable format */
export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
  return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/* Validate if the file size is within the allowed limit */
export const isFileSizeValid = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};
