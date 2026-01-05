import { useState, useRef } from 'react';
import { Upload, FileAudio, FileText, AlertCircle, Loader2, X, CheckCircle } from 'lucide-react';
import { Button } from '../../common';

interface TranscriptUploadProps {
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  uploadProgress?: number;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.flac'];
const TEXT_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx'];

type FileType = 'audio' | 'text' | 'unknown';

function getFileType(file: File): FileType {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  if (TEXT_EXTENSIONS.includes(ext)) return 'text';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('text/') || file.type === 'application/pdf') return 'text';
  return 'unknown';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function TranscriptUpload({ onUpload, isUploading, uploadProgress }: TranscriptUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileType = selectedFile ? getFileType(selectedFile) : null;

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 25MB limit (${formatFileSize(file.size)})`;
    }
    const type = getFileType(file);
    if (type === 'unknown') {
      return 'Unsupported file type. Please upload audio (mp3, wav, m4a) or text (txt, pdf) files.';
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
    } else {
      setError(null);
      setSelectedFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,.txt,.pdf,.doc,.docx"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 text-primary mx-auto animate-spin" />
            <p className="text-sm font-medium text-slate-700">
              {fileType === 'audio' ? 'Transcribing audio...' : 'Processing file...'}
            </p>
            {uploadProgress !== undefined && (
              <div className="w-48 mx-auto">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{uploadProgress}% complete</p>
              </div>
            )}
          </div>
        ) : selectedFile ? (
          <div className="space-y-3">
            {fileType === 'audio' ? (
              <FileAudio className="w-10 h-10 text-purple-500 mx-auto" />
            ) : (
              <FileText className="w-10 h-10 text-blue-500 mx-auto" />
            )}
            <div>
              <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            {fileType === 'audio' && (
              <p className="text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full inline-block">
                Will be transcribed using OpenAI Whisper
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">
              Drop a file here or click to browse
            </p>
            <p className="text-xs text-slate-500">
              Audio (mp3, wav, m4a) or text (txt, pdf) files up to 25MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      {selectedFile && !isUploading && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={clearSelection}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleUpload}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Upload & Process
          </Button>
        </div>
      )}
    </div>
  );
}
