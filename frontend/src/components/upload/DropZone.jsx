import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileIcon } from 'lucide-react';
import { formatBytes } from '@/lib/api';
import { MAX_UPLOAD_SIZE, MAX_FILES } from '@/lib/constants';

export default function DropZone({ files, onFilesChange }) {
  const [isDragOver, setIsDragOver] = useState(false);

  function addFiles(newFiles) {
    const fileArray = Array.from(newFiles);
    const combined = [...files, ...fileArray].slice(0, MAX_FILES);

    const totalSize = combined.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_UPLOAD_SIZE) {
      alert(`Total file size exceeds ${formatBytes(MAX_UPLOAD_SIZE)} limit`);
      return;
    }

    onFilesChange(combined);
  }

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [files]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleInputChange = useCallback(
    (e) => {
      if (e.target.files) addFiles(e.target.files);
    },
    [files]
  );

  function removeFile(index) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <motion.label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={{
          borderColor: isDragOver ? 'var(--accent-ring)' : 'var(--border-subtle)',
          backgroundColor: isDragOver ? 'var(--accent-surface)' : 'var(--surface-1)',
        }}
        className="flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-(--border-strong)"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center">
          <Upload className="w-6 h-6 text-orange-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-(--text-secondary)">
            Drop files here or <span className="text-orange-400">browse</span>
          </p>
          <p className="text-xs text-(--text-dim) mt-1">
            Up to {MAX_FILES} files · Max {formatBytes(MAX_UPLOAD_SIZE)} total
          </p>
        </div>
        <input
          type="file"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
      </motion.label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <motion.div
              key={`${file.name}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-(--surface-1) border border-(--border-subtle)"
            >
              <FileIcon className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-sm text-(--text-secondary) truncate flex-1">{file.name}</span>
              <span className="text-xs text-(--text-dim) shrink-0">{formatBytes(file.size)}</span>
              <button
                onClick={() => removeFile(i)}
                className="p-1 rounded-lg hover:bg-(--surface-4) text-(--text-dim) hover:text-red-400 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
