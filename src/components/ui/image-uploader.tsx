"use client";

import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon, FileWarning, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onFileSelect?: (file: File) => void;
  onClear?: () => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
}

export function ImageUploader({
  onFileSelect,
  onClear,
  acceptedTypes = ["image/jpeg", "image/png", "image/dicom"],
  maxSizeMB = 20,
  className,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): string | null => {
    if (!acceptedTypes.includes(f.type)) {
      return `Unsupported file type: ${f.type}. Please upload JPEG, PNG, or DICOM files.`;
    }
    if (f.size > maxSizeMB * 1024 * 1024) {
      return `File too large: ${(f.size / (1024 * 1024)).toFixed(1)}MB. Maximum is ${maxSizeMB}MB.`;
    }
    return null;
  };

  const handleFile = useCallback(
    (f: File) => {
      setError(null);
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        return;
      }
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
      onFileSelect?.(f);
    },
    [onFileSelect, acceptedTypes, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleChange}
        className="hidden"
        aria-label="Upload skin lesion image"
      />

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-200",
            dragOver
              ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40"
              : "border-slate-300 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
          )}
        >
          <div className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
            dragOver ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
          )}>
            <Upload className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
            Drop a dermatoscopic image here, or click to browse
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Supports JPEG, PNG, DICOM — up to {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start gap-4">
            {preview && (
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-600">
                <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB &middot; {file.type}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Ready for analysis</span>
              </div>
            </div>
            <button
              onClick={clear}
              className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-700 dark:hover:text-red-400 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
          <FileWarning className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
