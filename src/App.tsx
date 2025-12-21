import { Header } from "@/components/templates/Header";
import { FileUploader } from "@/components/templates/FileUploader";
import { FilesUploadStats } from "@/components/templates/FilesUploadStats";
import { FilesPreview } from "@/components/templates/FilesPreview";
import { useUppyUploader } from "@/hooks/useUppyUploader";

function App() {
  const { files, time, actions } = useUppyUploader();

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <Header
          title="Image Uploader"
          description="Upload your images to Cloudinary server"
        />

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
      </div>
    </div>
  );
}

export default App;
