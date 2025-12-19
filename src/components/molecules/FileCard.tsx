import { Icon } from "@/components/atoms/Icon";
import { Badge } from "@/components/atoms/Badge";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import type { File } from "@/types/file";
import { FILE_STATUS_MAP } from "@/constants/file";

export const FileCard = ({ name, preview, progress, status, error }: File) => {
  return (
    <div className="group relative break-inside-avoid overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 transition-all hover:border-gray-300 hover:shadow-lg lg:mb-2">
      {/* Image taking entire cell space */}
      {preview ? (
        <img
          src={preview}
          alt={name}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center">
          <Icon type="image" className="text-gray-400" size="lg" />
        </div>
      )}

      {/* Status Badge - Absolute top-right */}
      <div className="absolute right-2 top-2">
        <Badge variant={FILE_STATUS_MAP[status].variant}>
          {FILE_STATUS_MAP[status].label}
        </Badge>
      </div>

      {/* Progress Bar - Absolute bottom-center (only when uploading) */}
      {status === "uploading" && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3 backdrop-blur-sm">
          <ProgressBar
            progress={progress}
            variant={FILE_STATUS_MAP[status].variant}
            showPercentage
            size="sm"
          />
        </div>
      )}

      {/* Success Message - Absolute bottom-center */}
      {status === "completed" && (
        <div className="absolute bottom-0 left-0 right-0 bg-green-600/90 p-3 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
            <Icon type="check" size="sm" />
            <span>Upload complete</span>
          </div>
        </div>
      )}

      {/* Error Message - Absolute bottom-center */}
      {status === "error" && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-600/90 p-3 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Icon type="error" size="sm" />
              <span>Upload failed</span>
            </div>
            {error && <p className="text-xs text-white/90">{error}</p>}
          </div>
        </div>
      )}

      {/* File name overlay on hover */}
      <div className="absolute inset-x-0 top-0 translate-y-[-100%] bg-black/90 p-2 backdrop-blur-sm transition-transform group-hover:translate-y-0">
        <div className="truncate text-sm font-medium text-white">{name}</div>
      </div>
    </div>
  );
};
