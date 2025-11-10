"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  EyeIcon,
  DownloadIcon,
  FileTextIcon,
  FileImageIcon,
  FileVideoIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileIcon,
  X,
  Loader2,
} from "lucide-react";
import { Dialog } from "@headlessui/react";

type Props = {
  fileUrl: string;
  fileName?: string;
};

export default function DocumentPreviewButton({ fileUrl, fileName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState<string>("");

  if (!fileUrl) return null;

  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
  };

  const getFileIcon = (ext: string) => {
    if (["pdf"].includes(ext)) return <FileTextIcon className="w-4 h-4" />;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FileImageIcon className="w-4 h-4" />;
    if (["mp4", "mov", "webm"].includes(ext))
      return <FileVideoIcon className="w-4 h-4" />;
    if (["mp3", "wav", "ogg"].includes(ext))
      return <FileAudioIcon className="w-4 h-4" />;
    if (["zip", "rar", "7z", "tar"].includes(ext))
      return <FileArchiveIcon className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  const handlePreview = async () => {
    setLoading(true);
    try {
      const ext = getFileExtension(fileUrl);
      setFileType(ext);
      setIsOpen(true);
    } catch (error) {
      console.error("Error previewing file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName || "download";
    a.rel = "noopener noreferrer";
    a.click();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={handlePreview}
          variant="outline"
          size="sm"
          disabled={loading}
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <EyeIcon className="w-4 h-4 mr-2" />
          )}
          {loading ? "Loading..." : "Open Document"}
        </Button>

        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Modal Preview */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <div className="relative bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2 text-gray-800">
              {getFileIcon(fileType)}
              <h2 className="font-semibold truncate max-w-xs">
                {fileName || "Document Preview"}
              </h2>
            </div>
          </div>

          <div className="flex justify-center items-center bg-gray-50 h-[80vh] p-4 overflow-auto">
            {["pdf"].includes(fileType) && (
              <iframe
                src={fileUrl}
                title="PDF Preview"
                className="w-full h-full border rounded-md"
              />
            )}

            {["jpg", "jpeg", "png", "gif", "webp"].includes(fileType) && (
              <img
                src={fileUrl}
                alt={fileName || "Image Preview"}
                className="max-h-full max-w-full rounded-md object-contain"
              />
            )}

            {["mp4", "mov", "webm"].includes(fileType) && (
              <video
                src={fileUrl}
                controls
                className="max-h-full max-w-full rounded-md"
              />
            )}

            {["mp3", "wav", "ogg"].includes(fileType) && (
              <audio
                src={fileUrl}
                controls
                className="w-full max-w-md"
              />
            )}

            {!["pdf", "jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "webm", "mp3", "wav", "ogg"].includes(fileType) && (
              <div className="text-gray-600 text-center">
                <p>Preview not available for this file type.</p>
                <p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Click here to open it directly
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
