"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink, FileCode, FileText, Image as ImageIcon } from "lucide-react";
import { storage } from "@/lib/storage";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    id: string;
    title: string;
    description: string;
    sourceType: string;
    fileUrl: string | null;
    externalUrl: string | null;
    iconEmoji: string | null;
    currentVersion: string;
    category: {
      name: string;
    };
  } | null;
}

export default function PreviewModal({ isOpen, onClose, resource }: PreviewModalProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && resource && resource.sourceType === "FILE" && resource.fileUrl) {
      // Check if it's a text-based file that we can preview
      const isTextFile = resource.fileUrl.endsWith(".js") || 
                         resource.fileUrl.endsWith(".ts") || 
                         resource.fileUrl.endsWith(".txt") || 
                         resource.fileUrl.endsWith(".md") ||
                         resource.fileUrl.endsWith(".json");
      
      const isImageFile = resource.fileUrl.endsWith(".png") || 
                          resource.fileUrl.endsWith(".jpg") || 
                          resource.fileUrl.endsWith(".svg");

      if (isTextFile) {
        setLoading(true);
        setError(null);
        fetch(storage.getDownloadUrl(resource.fileUrl))
          .then((res) => {
            if (!res.ok) throw new Error("Failed to load file content");
            return res.text();
          })
          .then((text) => {
            setContent(text);
          })
          .catch((err) => {
            setError(err.message);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (isImageFile) {
        // Handled by rendering an <img> tag directly
        setContent(null);
        setLoading(false);
      } else {
        // Zip files or other binaries
        setContent(null);
        setLoading(false);
      }
    } else {
      setContent(null);
      setLoading(false);
    }
  }, [isOpen, resource]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!resource) return null;

  const isImageFile = resource.fileUrl?.match(/\.(png|jpe?g|svg)$/i);
  const isZipFile = resource.fileUrl?.endsWith(".zip");

  const handleDownload = () => {
    if (resource.sourceType === "FILE" && resource.fileUrl) {
      const url = storage.getDownloadUrl(resource.fileUrl);
      const link = document.createElement("a");
      link.href = url;
      link.download = resource.fileUrl.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resource.sourceType === "LINK" && resource.externalUrl) {
      window.open(resource.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white/95 backdrop-blur-xl border-l border-pink-100 shadow-2xl z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{resource.iconEmoji || "📦"}</span>
                <div>
                  <h2 className="text-lg font-bold text-ink-900 leading-tight">
                    {resource.title}
                  </h2>
                  <p className="text-xs text-ink-500 font-medium">
                    {resource.category.name} • v{resource.currentVersion}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-pink-50 transition-colors text-ink-300 hover:text-pink-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Description */}
            <div className="px-6 py-5 border-b border-pink-100/50 bg-pink-50/30">
              <p className="text-sm text-ink-700 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto bg-[#fafafa]">
              {loading ? (
                <div className="flex items-center justify-center h-full text-ink-300">
                  <div className="pulse-dot mr-3"></div>
                  Loading preview...
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-pink-600 p-6 text-center">
                  <p className="text-sm font-semibold mb-1">Preview Unavailable</p>
                  <p className="text-xs text-ink-500">{error}</p>
                </div>
              ) : isImageFile && resource.fileUrl ? (
                <div className="flex justify-center items-center p-8 h-full">
                  <img 
                    src={storage.getDownloadUrl(resource.fileUrl)} 
                    alt={resource.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm border border-ink-100"
                  />
                </div>
              ) : content ? (
                <pre className="p-6 text-[13px] font-mono text-ink-900 whitespace-pre-wrap break-words">
                  {content}
                </pre>
              ) : isZipFile ? (
                <div className="flex flex-col items-center justify-center h-full text-ink-500 p-6 text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 mb-4 shadow-sm border border-pink-200">
                    <FileCode size={32} />
                  </div>
                  <p className="text-base font-semibold text-ink-900 mb-1">Archive Package</p>
                  <p className="text-sm max-w-xs">
                    This is a ZIP archive. Please download it to view and extract its contents.
                  </p>
                </div>
              ) : resource.sourceType === "LINK" ? (
                <div className="flex flex-col items-center justify-center h-full text-ink-500 p-6 text-center">
                  <ExternalLink size={48} className="text-pink-300 mb-4" />
                  <p className="text-base font-semibold text-ink-900 mb-1">External Resource</p>
                  <p className="text-sm max-w-xs">
                    This resource is hosted externally. Click below to open it in a new tab.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-ink-300">
                  <p className="text-sm">No preview available for this file type.</p>
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-pink-100/50 bg-white">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all shadow-md hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--pink-500) 0%, var(--pink-600) 100%)",
                }}
              >
                {resource.sourceType === "FILE" ? (
                  <>
                    <Download size={18} /> Download Resource
                  </>
                ) : (
                  <>
                    <ExternalLink size={18} /> Open External Link
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
