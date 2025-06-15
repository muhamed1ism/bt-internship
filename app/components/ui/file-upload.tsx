import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@app/lib/utils';

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
}

export const FileUpload = ({
  label,
  accept = '*/*',
  onFileSelect,
  className,
  disabled = false,
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const file = event.dataTransfer.files?.[0] || null;
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleButtonClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>

      <div
        className={cn(
          'relative cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          disabled && 'cursor-not-allowed opacity-50',
          selectedFile && 'border-primary/50 bg-primary/5',
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <File className="text-primary h-5 w-5" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                <p className="text-muted-foreground text-xs">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground mb-1 text-sm">
              <span className="text-primary font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-muted-foreground text-xs">
              {accept === '.pdf'
                ? 'PDF files only'
                : accept.includes('image')
                  ? 'Image files only'
                  : 'Any file type'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
