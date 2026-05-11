import { motion } from 'framer-motion';
import { FileIcon, Download, Archive } from 'lucide-react';
import { getFileDownloadUrl, getZipDownloadUrl, formatBytes } from '@/lib/api';
import CountdownTimer from '@/components/common/CountdownTimer';

export default function FileShareView({ share, sessionToken }) {
  const downloadUrl = (fileId) => {
    const url = getFileDownloadUrl(fileId);
    return sessionToken ? `${url}?token=${sessionToken}` : url;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-(--text-primary)">Shared Files</h2>
          <p className="text-sm text-(--text-muted) mt-1">
            {share.fileCount} file{(share.fileCount || 0) > 1 ? 's' : ''} · {formatBytes(share.totalSize)}
          </p>
        </div>
        {share.expiresAt && <CountdownTimer expiresAt={share.expiresAt} />}
      </div>

      <div className="space-y-2">
        {share.files?.map((file, i) => (
          <motion.a
            key={file.id}
            href={downloadUrl(file.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-(--surface-1) border border-(--border-subtle) hover:bg-(--surface-3) transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center shrink-0">
              <FileIcon className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-(--text-secondary) truncate">{file.filename}</p>
              <p className="text-xs text-(--text-dim)">{formatBytes(file.size)} · {file.mimeType}</p>
            </div>
            <Download className="w-4 h-4 text-(--text-dim) group-hover:text-orange-400 transition-colors shrink-0" />
          </motion.a>
        ))}
      </div>

      {(share.fileCount || 0) > 1 && (
        <a
          href={getZipDownloadUrl(share.uid)}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-(--surface-2) border border-(--border-soft) text-(--text-secondary) hover:bg-(--surface-4) hover:text-(--text-primary) transition-all text-sm font-medium"
        >
          <Archive className="w-4 h-4" />
          Download all as ZIP
        </a>
      )}
    </motion.div>
  );
}
