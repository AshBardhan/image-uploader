import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import { useToast } from "@/contexts/ToastContext";
import type { File, FileUploadTime, UppyUploaderConfig } from "@/types/file";

const DEFAULT_CONFIG: Required<UppyUploaderConfig> = {
  maxFileSize: 10 * 1024 * 1024,
  allowedFileTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  endpoint: import.meta.env.VITE_CLOUDINARY_ENDPOINT || "",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
  thumbnailWidth: 600,
  thumbnailHeight: 400,
  concurrentUploadLimit: 2,
};

/* Send a copy of updated Uppy files */
function getLocalFiles(uppy: Uppy): File[] {
  return uppy.getFiles().map((file) => ({
    id: file.id,
    name: file.name,
    size: file.size ?? 0,
    preview: file.preview,
    bytesUploaded: file.progress?.bytesUploaded || 0,
    bytesTotal: file.progress?.bytesTotal || 0,
    progress: file.progress?.percentage ?? 0,
    status: file.error
      ? "error"
      : file.progress?.uploadComplete
        ? "completed"
        : file.progress?.uploadStarted
          ? "uploading"
          : "pending",
    error: file.error || undefined,
  }));
}

/* Custom hook to manage Uppy file uploader */
export function useUppyUploader(config?: UppyUploaderConfig) {
  const { showToast } = useToast();
  const uppyRef = useRef<Uppy | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [time, setTime] = useState<FileUploadTime>({
    start: 0,
    current: 0,
  });

  const finalConfig = useMemo(() => {
    return { ...DEFAULT_CONFIG, ...config };
  }, [config]);

  useEffect(() => {
    /* Initialize Uppy instance with configuration and plugins */
    const uppy = new Uppy({
      autoProceed: false,
      restrictions: {
        maxFileSize: finalConfig.maxFileSize,
        allowedFileTypes: finalConfig.allowedFileTypes,
      },
    })
      .use(XHRUpload, {
        endpoint: finalConfig.endpoint,
        formData: true,
        fieldName: "file",
        bundle: false,
        allowedMetaFields: ["upload_preset"],
        limit: finalConfig.concurrentUploadLimit,
      })
      .use(ThumbnailGenerator, {
        thumbnailWidth: finalConfig.thumbnailWidth,
        thumbnailHeight: finalConfig.thumbnailHeight,
      });

    /* Synchronize Uppy files with local state */
    const sync = () => {
      setFiles(getLocalFiles(uppy));
      setTime((prev) => (prev.start ? { ...prev, current: Date.now() } : prev));
    };

    /* Set upload preset metadata when a file is added */
    const onFileAdded = (file: any) => {
      uppy.setFileMeta(file.id, {
        upload_preset: finalConfig.uploadPreset,
      });
      sync();
    };

    /* Revoke generated thumbnail URLs to free up memory */
    const revokeThumbnails = () => {
      uppy.getFiles().forEach((file) => {
        if (
          file.preview &&
          typeof file.preview === "string" &&
          file.preview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };

    /* Uppy event listeners */
    uppy.on("file-added", onFileAdded);
    uppy.on("file-removed", (file) => {
      if (
        file.preview &&
        typeof file.preview === "string" &&
        file.preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(file.preview);
      }
      sync();
    });
    uppy.on("upload-progress", sync);
    uppy.on("thumbnail:generated", sync);
    uppy.on("upload-error", sync);
    uppy.on("upload-success", sync);

    uppyRef.current = uppy;

    return () => {
      revokeThumbnails();
      uppy.destroy();
    };
  }, [finalConfig, showToast]);

  /* Add new files to upload */
  const addFiles = useCallback(
    (fileList: FileList) => {
      Array.from(fileList).forEach((file) => {
        try {
          uppyRef.current?.addFile({
            name: file.name,
            type: file.type,
            data: file,
          });
        } catch (error: any) {
          showToast({
            theme: "warning",
            title: "Upload restriction",
            message:
              error?.message || "File cannot be uploaded due to restrictions.",
            duration: 3000,
          });
        }
      });
    },
    [showToast],
  );

  /* Start uploading all files */
  const uploadAll = useCallback(() => {
    const now = Date.now();
    setTime({ start: now, current: now });
    showToast({
      title: "Uploading Started",
      message: "Your files are being uploaded to Cloudinary server.",
    });
    uppyRef.current?.upload();
  }, [showToast]);

  /* Cancel all ongoing uploads */
  const cancelAll = useCallback(() => {
    uppyRef.current?.cancelAll();
    setFiles([]);
    setTime({ start: 0, current: 0 });
  }, []);

  /* Retry all failed uploads */
  const retryFailed = useCallback(() => {
    files
      .filter((f) => f.status === "error")
      .forEach((f) => uppyRef.current?.retryUpload(f.id));
    showToast({
      title: "Retrying Failed Uploads",
      message: "Attempting to re-upload all failed files.",
      duration: 2000,
    });
  }, [files, showToast]);

  /* Clear all completed uploads from the list */
  const clearCompleted = useCallback(() => {
    files
      .filter((f) => f.status === "completed")
      .forEach((f) => uppyRef.current?.removeFile(f.id));
    showToast({
      theme: "success",
      title: "Cleared Completed Files",
      message: "All completed files have been removed from the list.",
    });
  }, [files, showToast]);

  return {
    files,
    time,
    actions: {
      addFiles,
      uploadAll,
      cancelAll,
      retryFailed,
      clearCompleted,
    },
  };
}
