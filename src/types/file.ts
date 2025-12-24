export type FileType = "image" | "video" | "document" | "all";
export type FileStatus = "pending" | "uploading" | "completed" | "error";

export interface File {
  id: string;
  name: string;
  size: number;
  preview?: string;
  progress: number;
  status: FileStatus;
  bytesUploaded?: number;
  error?: string;
}

export interface FileUploadTime {
  start: number;
  current: number;
}

export interface UppyUploaderConfig {
  maxFileSize?: number;
  allowedFileTypes?: string[];
  endpoint?: string;
  uploadPreset?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  concurrentUploadLimit?: number;
}
