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

function mapUppyFiles(uppy: Uppy): File[] {
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

    const sync = () => {
      setFiles(mapUppyFiles(uppy));
      setTime((prev) => (prev.start ? { ...prev, current: Date.now() } : prev));
    };

    const onFileAdded = (file: any) => {
      console.log("File added:", file);
      uppy.setFileMeta(file.id, {
        upload_preset: finalConfig.uploadPreset,
      });
      sync();
    };

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

  const addFiles = useCallback(
    (fileList: FileList) => {
      console.log("Adding files:", [...fileList]);
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

  const uploadAll = useCallback(() => {
    const now = Date.now();
    setTime({ start: now, current: now });
    showToast({
      title: "Uploading Started",
      message: "Your files are being uploaded to Cloudinary server.",
    });
    uppyRef.current?.upload();
  }, [showToast]);

  const cancelAll = useCallback(() => {
    uppyRef.current?.cancelAll();
    setFiles([]);
    setTime({ start: 0, current: 0 });
  }, []);

  const retryFailed = useCallback(() => {
    files
      .filter((f) => f.status === "error")
      .forEach((f) => uppyRef.current?.retryUpload(f.id));
    showToast({
      title: "Retrying Failed Uploads",
      message: "Attempting to re-upload all failed files.",
    });
  }, [files, showToast]);

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
