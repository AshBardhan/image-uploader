import { useEffect, useRef, useState, useCallback } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import type { File, FileUploadTime, UppyUploaderConfig } from "@/types/file";

const DEFAULT_CONFIG: Required<UppyUploaderConfig> = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  endpoint: "https://api.cloudinary.com/v1_1/ash-test/image/upload",
  uploadPreset: "ash-test-upload",
  thumbnailWidth: 200,
  thumbnailHeight: 200,
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
  const uppyRef = useRef<Uppy | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [time, setTime] = useState<FileUploadTime>({
    start: 0,
    current: 0,
  });

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

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
      })
      .use(ThumbnailGenerator, {
        thumbnailWidth: finalConfig.thumbnailWidth,
        thumbnailHeight: finalConfig.thumbnailHeight,
      });

    const sync = () => {
      setFiles(mapUppyFiles(uppy));
      setTime((prev) => (prev.start ? { ...prev, current: Date.now() } : prev));
    };

    uppy.on("file-added", (file) => {
      uppy.setFileMeta(file.id, {
        upload_preset: finalConfig.uploadPreset,
      });
      sync();
    });

    uppy.on("file-removed", sync);
    uppy.on("upload-progress", sync);
    uppy.on("upload-success", sync);
    uppy.on("thumbnail:generated", sync);

    uppy.on("upload-error", (file, error) => {
      const message = error?.message || "Upload failed due to network error";
      console.error(`[Uppy][UploadError] ${file?.name}: ${message}`);
      sync();
    });

    uppy.on("error", (error) => {
      console.error("[Uppy][Error]", error);
    });

    uppyRef.current = uppy;

    return () => {
      uppy.destroy();
    };
  }, []);

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
          console.error(`[Uppy][AddFileError] ${file.name}: ${error?.message}`);
        }
      });
    },
    [config],
  );

  const uploadAll = useCallback(() => {
    const now = Date.now();
    setTime({ start: now, current: now });
    uppyRef.current?.upload();
  }, []);

  const cancelAll = useCallback(() => {
    uppyRef.current?.cancelAll();
    setFiles([]);
    setTime({ start: 0, current: 0 });
  }, []);

  const retryFailed = useCallback(() => {
    files
      .filter((f) => f.status === "error")
      .forEach((f) => uppyRef.current?.retryUpload(f.id));
  }, [files]);

  const clearCompleted = useCallback(() => {
    files
      .filter((f) => f.status === "completed")
      .forEach((f) => uppyRef.current?.removeFile(f.id));
  }, [files]);

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
