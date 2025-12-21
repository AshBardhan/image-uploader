import { useEffect, useRef, useState, useCallback } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import type { File, FileUploadTime } from "@/types/file";

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

export function useUppyUploader() {
  const uppyRef = useRef<Uppy | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [time, setTime] = useState<FileUploadTime>({
    start: 0,
    current: 0,
  });

  useEffect(() => {
    const uppy = new Uppy({
      autoProceed: false,
      restrictions: {
        maxFileSize: 10 * 1024 * 1024,
        allowedFileTypes: ["image/*"],
      },
    })
      .use(XHRUpload, {
        endpoint: "https://api.cloudinary.com/v1_1/ash-test/image/upload",
        formData: true,
        fieldName: "file",
        bundle: false,
        allowedMetaFields: ["upload_preset"],
      })
      .use(ThumbnailGenerator, {
        thumbnailWidth: 200,
        thumbnailHeight: 200,
      });

    const sync = () => {
      setFiles(mapUppyFiles(uppy));
      setTime((prev) => (prev.start ? { ...prev, current: Date.now() } : prev));
    };

    const onFileAdded = (file: any) => {
      uppy.setFileMeta(file.id, { upload_preset: "ash-test-upload" });
      sync();
    };

    const onUploadError = (file: any, error: any) => {
      console.error(`Upload failed for ${file.name}:`, error?.message || error);
      sync();
    };

    const events = [
      ["file-added", onFileAdded],
      ["file-removed", sync],
      ["upload-progress", sync],
      ["thumbnail:generated", sync],
      ["upload-success", sync],
      ["upload-error", onUploadError],
    ] as const;

    events.forEach(([event, handler]) => uppy.on(event, handler));

    uppyRef.current = uppy;

    return () => {
      uppy.destroy();
    };
  }, []);

  const addFiles = useCallback((fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      uppyRef.current?.addFile({
        name: file.name,
        type: file.type,
        data: file,
      });
    });
  }, []);

  const uploadAll = useCallback(() => {
    try {
      const now = Date.now();
      setTime({ start: now, current: now });
      uppyRef.current?.upload();
    } catch {
      setTime({ start: 0, current: 0 });
    }
  }, []);

  const cancelAll = useCallback(() => {
    uppyRef.current?.cancelAll();
    setFiles([]);
    setTime({ start: 0, current: 0 });
  }, []);

  const retryFailed = useCallback(() => {
    files
      .filter((f) => f.status === "error")
      .forEach((f) => {
        uppyRef.current?.retryUpload(f.id);
      });
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
