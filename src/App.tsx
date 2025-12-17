import { useState, useEffect, useRef } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import "./App.css";

interface FileWithPreview {
  id: string;
  name: string;
  size: number;
  preview?: string;
  progress: number;
  uploadComplete: boolean;
  error?: string;
}

function App() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const uppyRef = useRef<Uppy | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Note: You'll need to replace this with your actual Cloudinary endpoint and upload preset
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
      const newFile: FileWithPreview = {
        id: file.id,
        name: file.name,
        size: file.size || 0,
        progress: 0,
        uploadComplete: false,
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
            f.id === file.id ? { ...f, progress: Math.round(percentage) } : f,
          ),
        );
      }
    });

    // Subscribe to upload-success event
    uppy.on("upload-success", (file) => {
      if (file) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, uploadComplete: true, progress: 100 }
              : f,
          ),
        );
      }
    });

    // Subscribe to upload-error event
    uppy.on("upload-error", (file, error) => {
      if (file) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, error: error.message } : f,
          ),
        );
      }
    });

    uppyRef.current = uppy;

    return () => {
      uppy.destroy();
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && uppyRef.current) {
      Array.from(selectedFiles).forEach((file) => {
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
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (uppyRef.current) {
      uppyRef.current.upload();
    }
  };

  const handleRemoveFile = (fileId: string) => {
    if (uppyRef.current) {
      uppyRef.current.removeFile(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const handleClearAll = () => {
    if (uppyRef.current) {
      uppyRef.current.cancelAll();
      setFiles([]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>Uppy Headless Image Uploader Demo</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Select Images
        </button>
        <button
          onClick={handleUpload}
          disabled={files.length === 0}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: files.length === 0 ? "not-allowed" : "pointer",
            marginRight: "10px",
          }}
        >
          Upload All
        </button>
        <button
          onClick={handleClearAll}
          disabled={files.length === 0}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: files.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Clear All
        </button>
      </div>

      <div>
        {files.length === 0 ? (
          <div style={{ padding: "20px", border: "1px solid #666" }}>
            No files selected
          </div>
        ) : (
          <div>
            <h2>Files ({files.length})</h2>
            {files.map((file) => (
              <div
                key={file.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {file.preview && (
                  <img
                    src={file.preview}
                    alt={file.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    {file.name}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    {formatFileSize(file.size)}
                  </div>
                  {file.error ? (
                    <div style={{ color: "red", fontSize: "14px" }}>
                      Error: {file.error}
                    </div>
                  ) : file.uploadComplete ? (
                    <div style={{ color: "green", fontSize: "14px" }}>
                      ✓ Upload complete
                    </div>
                  ) : file.progress > 0 ? (
                    <div>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "#eee",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${file.progress}%`,
                            height: "100%",
                            backgroundColor: "#4CAF50",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "14px", marginTop: "4px" }}>
                        {file.progress}%
                      </div>
                    </div>
                  ) : null}
                </div>
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  style={{
                    padding: "8px 16px",
                    cursor: "pointer",
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
