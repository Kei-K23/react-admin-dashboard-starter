import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Upload, ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  value?: File;
  onChange: (file?: File) => void;
  disabled?: boolean;
  className?: string;
  initialUrl?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
  initialUrl,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(initialUrl);
    return;
  }, [value, initialUrl]);

  const handleSelectClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    onChange(undefined);
    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      {!previewUrl ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3 border border-dashed rounded-lg p-6 text-center",
            disabled && "opacity-50"
          )}
          onClick={disabled ? undefined : handleSelectClick}
          onDrop={disabled ? undefined : handleDrop}
          onDragOver={disabled ? undefined : handleDragOver}
          role="button"
          tabIndex={0}
        >
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            Click to select or drag & drop an image
          </div>
          <Button type="button" variant="outline" size="sm" disabled={disabled}>
            <Upload className="mr-2 h-4 w-4" /> Select Image
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <img
            src={previewUrl}
            alt="Selected preview"
            className="h-20 w-20 rounded-md object-cover border"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectClick}
              disabled={disabled}
            >
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="mr-2 h-4 w-4" /> Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
