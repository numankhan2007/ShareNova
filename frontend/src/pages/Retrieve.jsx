import { useState } from 'react';
import { motion } from 'framer-motion';
import UIDInput from '@/components/share/UIDInput';
import PasswordGate from '@/components/forms/PasswordGate';
import TextShareView from '@/components/share/TextShareView';
import FileShareView from '@/components/share/FileShareView';
import { getShareByUID, verifyPassword, getTextContent } from '@/lib/api';

export default function RetrievePage() {
  const [share, setShare] = useState(null);
  const [textContent, setTextContent] = useState(null);
  const [sessionToken, setSessionToken] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUIDSubmit(uid) {
    setIsLoading(true);
    setError('');
    setShare(null);
    setTextContent(null);
    setNeedsPassword(false);

    try {
      const res = await getShareByUID(uid);
      if (!res.success || !res.data) {
        setError(res.error || 'Share not found');
        setIsLoading(false);
        return;
      }

      const shareData = res.data;
      setShare(shareData);

      if (shareData.isPrivate) {
        setNeedsPassword(true);
        setIsLoading(false);
        return;
      }

      // If text share, fetch content
      if (shareData.type === 'TEXT') {
        const contentRes = await getTextContent(shareData.uid);
        if (contentRes.success && contentRes.data) {
          setTextContent(contentRes.data);
        }
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to retrieve share');
      setIsLoading(false);
    }
  }

  async function handlePasswordVerify(password) {
    if (!share) return false;
    const res = await verifyPassword(share.uid, password);
    if (res.success && res.data) {
      const token = res.data.sessionToken;
      setSessionToken(token);
      setNeedsPassword(false);

      if (share.type === 'TEXT') {
        const contentRes = await getTextContent(share.uid, token);
        if (contentRes.success && contentRes.data) {
          setTextContent(contentRes.data);
        }
      }
      return true;
    }
    return false;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Retrieve a Share</h1>
            <p className="text-white/50">Enter the 12-digit code to access shared content.</p>
          </div>

          <UIDInput onSubmit={handleUIDSubmit} isLoading={isLoading} />

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400 text-center">
              {error}
            </motion.p>
          )}

          {needsPassword && share && (
            <PasswordGate onVerify={handlePasswordVerify} />
          )}

          {share && !needsPassword && share.type === 'TEXT' && textContent && (
            <TextShareView share={share} content={textContent} />
          )}

          {share && !needsPassword && share.type === 'FILE' && (
            <FileShareView share={share} sessionToken={sessionToken} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
