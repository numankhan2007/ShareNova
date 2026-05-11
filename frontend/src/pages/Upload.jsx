import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';
import DropZone from '@/components/upload/DropZone';
import ProgressBar from '@/components/upload/ProgressBar';
import ShareOptionsForm from '@/components/forms/ShareOptionsForm';
import UIDDisplay from '@/components/share/UIDDisplay';
import { createFileShare } from '@/lib/api';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState({ expiresIn: '24h' });
  const [state, setState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [uid, setUid] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [error, setError] = useState('');

  async function handleUpload() {
    if (files.length === 0) return;
    setState('uploading');
    setError('');
    setProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 15, 85));
      }, 400);

      const res = await createFileShare(files, {
        expiresIn: options.expiresIn,
        password: options.password,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (res.success && res.data) {
        setUid(res.data.uid);
        const expiryMs = {
          '1h': 3600000, '6h': 21600000, '24h': 86400000,
          '7d': 604800000, '30d': 2592000000,
        };
        if (options.expiresIn && expiryMs[options.expiresIn]) {
          setExpiresAt(new Date(Date.now() + expiryMs[options.expiresIn]).toISOString());
        }
        setState('done');
      } else {
        setError(res.error || 'Upload failed');
        setState('idle');
        setProgress(0);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      setState('idle');
      setProgress(0);
    }
  }

  function reset() {
    setFiles([]);
    setOptions({ expiresIn: '24h' });
    setState('idle');
    setProgress(0);
    setUid('');
    setExpiresAt(null);
    setError('');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {state === 'done' && uid ? (
            <>
              <UIDDisplay uid={uid} expiresAt={expiresAt} />
              <button onClick={reset} className="w-full py-3.5 rounded-xl bg-(--surface-2) border border-(--border-soft) text-(--text-muted) hover:bg-(--surface-4) hover:text-(--text-primary) transition-all text-sm font-medium">
                Share more files
              </button>
            </>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-(--text-primary) mb-2">Upload Files</h1>
                <p className="text-(--text-muted)">Drop your files and get a secure share code.</p>
              </div>

              <DropZone files={files} onFilesChange={setFiles} />

              {files.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="p-5 rounded-2xl bg-(--surface-1) border border-(--border-subtle) space-y-4">
                    <h3 className="text-sm font-medium text-(--text-secondary)">Share Options</h3>
                    <ShareOptionsForm options={options} onChange={setOptions} />
                  </div>

                  {state === 'uploading' && <ProgressBar progress={progress} label="Uploading..." />}
                  {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                  <button
                    onClick={handleUpload}
                    disabled={state === 'uploading'}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium disabled:opacity-50 hover:shadow-xl hover:shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {state === 'uploading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadIcon className="w-5 h-5" />}
                    {state === 'uploading' ? 'Uploading...' : 'Upload & Get Code'}
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
