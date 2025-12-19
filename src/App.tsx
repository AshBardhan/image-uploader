import { useState, useEffect, useRef } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import type { File, FileUploadStats } from "@/types/file";
import { Header } from "@/components/templates/Header";
import { FileUploader } from "@/components/templates/FileUploader";
import { FileOverallProgress } from "@/components/templates/FileOverallProgress";
import { FileQueue } from "@/components/templates/FileQueue";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStats, setUploadStats] = useState<FileUploadStats>({
    startTime: 0,
    totalBytesUploaded: 0,
  });
  const uppyRef = useRef<Uppy | null>(null);

  useEffect(() => {
    // Initialize Uppy instance
    const uppy = new Uppy({
      restrictions: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ["image/*"],
      },
      autoProceed: false,
    });

    // Add XHR Upload plugin for Cloudinary
    uppy.use(XHRUpload, {
      endpoint: "https://api.cloudinary.com/v1_1/ash-test/image/upload",
      formData: true,
      fieldName: "file",
      bundle: false,
      allowedMetaFields: ["upload_preset"],
    });

    // Add Thumbnail Generator plugin
    uppy.use(ThumbnailGenerator, {
      thumbnailWidth: 200,
      thumbnailHeight: 200,
      waitForThumbnailsBeforeUpload: false,
    });

    // Subscribe to file-added event
    uppy.on("file-added", (file) => {
      uppy.setFileMeta(file.id, {
        upload_preset: "ash-test-upload",
      });

      const newFile: File = {
        id: file.id,
        name: file.name,
        size: file.size || 0,
        progress: 0,
        status: "pending",
      };

      setFiles((prev) => [...prev, newFile]);
    });

    // Subscribe to thumbnail:generated event
    uppy.on("thumbnail:generated", (file, preview: string) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, preview } : f)),
      );
    });

    // Subscribe to upload-progress event
    uppy.on("upload-progress", (file, progress) => {
      if (file) {
        const percentage = progress.bytesTotal
          ? (progress.bytesUploaded / progress.bytesTotal) * 100
          : 0;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  progress: Math.round(percentage),
                  status: "uploading",
                  uploadedBytes: progress.bytesUploaded,
                }
              : f,
          ),
        );
      }
    });

    // Subscribe to upload-success event
    uppy.on("upload-success", (file) => {
      if (file) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: "completed", progress: 100 } : f,
          ),
        );
      }
    });

    // Subscribe to upload-error event
    uppy.on("upload-error", (file, error) => {
      if (file) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: "error", error: error.message }
              : f,
          ),
        );
      }
    });

    uppyRef.current = uppy;

    return () => {
      uppy.destroy();
    };
  }, []);

  const handleFilesDropped = (fileList: FileList) => {
    if (uppyRef.current) {
      Array.from(fileList).forEach((file) => {
        try {
          uppyRef.current?.addFile({
            name: file.name,
            type: file.type,
            data: file,
          });
        } catch (err) {
          console.error("Error adding file:", err);
        }
      });
    }
  };

  const handleUploadAll = () => {
    if (uppyRef.current) {
      setUploadStats({
        startTime: Date.now(),
        totalBytesUploaded: 0,
      });
      uppyRef.current.upload();
    }
  };

  const handleCancelAll = () => {
    if (uppyRef.current) {
      uppyRef.current.cancelAll();
      setFiles([]);
    }
  };

  const handleRetryFailed = () => {
    if (uppyRef.current) {
      const failedFiles = files.filter((f) => f.status === "error");
      failedFiles.forEach((file) => {
        uppyRef.current?.retryUpload(file.id);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: "pending", error: undefined }
              : f,
          ),
        );
      });
    }
  };

  const handleClearCompleted = () => {
    if (uppyRef.current) {
      const completedFiles = files.filter((f) => f.status === "completed");
      completedFiles.forEach((file) => {
        uppyRef.current?.removeFile(file.id);
      });
      setFiles((prev) => prev.filter((f) => f.status !== "completed"));
    }
  };

  const handleRemoveFile = (fileId: string) => {
    if (uppyRef.current) {
      uppyRef.current.removeFile(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const handleRetryFile = (fileId: string) => {
    if (uppyRef.current) {
      uppyRef.current.retryUpload(fileId);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "pending", error: undefined } : f,
        ),
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <Header
          title="Image Uploader"
          description="Upload your images to Cloudinary with drag & drop or browse"
        />

        {/* File DnD Uploader */}
        <FileUploader
          type="image"
          onFilesDropped={handleFilesDropped}
          multiple={true}
        />

        {/* File Upload Overall Progress */}
        <FileOverallProgress files={files} uploadStats={uploadStats} />

        {/* File Queue */}
        <FileQueue
          files={files}
          type="image"
          onRemove={handleRemoveFile}
          onRetry={handleRetryFile}
          onUploadAll={handleUploadAll}
          onCancelAll={handleCancelAll}
          onRetryFailed={handleRetryFailed}
          onClearCompleted={handleClearCompleted}
        />
      </div>
    </div>
  );
}

export default App;
