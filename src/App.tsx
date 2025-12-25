import { ErrorBoundary } from "react-error-boundary";
import { useUppyUploader } from "@/hooks/useUppyUploader";
import { Header } from "@/components/organisms/Header";
import { FileUploader } from "@/components/templates/FileUploader";
import { FilesUploadStats } from "@/components/templates/FilesUploadStats";
import { FilesPreview } from "@/components/templates/FilesPreview";
import { FilesErrorFallback } from "@/components/templates/FilesErrorFallback";

/* Main Page Application Component */
function App() {
  const { files, time, actions } = useUppyUploader();

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <Header
          title="Image Uploader"
          description="Upload your images to Cloudinary server"
        />

        <ErrorBoundary fallback={<FilesErrorFallback />}>
          {/* File Uploader */}
          <FileUploader
            type="image"
            multiple
            onFilesSelected={actions.addFiles}
          />

          {/* Files Upload Overall Progress */}
          <FilesUploadStats files={files} time={time} />

          {/* Files List Preview */}
          <FilesPreview
            files={files}
            type="image"
            onUploadAll={actions.uploadAll}
            onCancelAll={actions.cancelAll}
            onRetryFailed={actions.retryFailed}
            onClearCompleted={actions.clearCompleted}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
