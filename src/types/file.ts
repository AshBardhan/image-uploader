export type FileType = "image" | "video" | "document" | "all";
export type FileStatus = "pending" | "uploading" | "completed" | "error";

export interface File {
  id: string;
  name: string;
  size: number;
  preview?: string;
  progress: number;
  status: FileStatus;
  uploadedBytes?: number;
  error?: string;
}

export interface FileUploadStats {
  startTime: number;
  totalBytesUploaded: number;
}
