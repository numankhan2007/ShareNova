import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles } from 'lucide-react';
import { formatUID } from '@/lib/uid';
import CountdownTimer from '@/components/common/CountdownTimer';

export default function UIDDisplay({ uid, expiresAt }) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = uid;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="relative overflow-hidden rounded-2xl border border-(--border-soft) bg-(--surface-1) backdrop-blur-xl p-8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5" />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
          <Sparkles className="w-3 h-3" />
          Share created successfully
        </div>

        <div>
          <p className="text-sm text-(--text-muted) mb-3">Your Share Code</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl sm:text-5xl font-mono font-bold tracking-[0.15em] text-(--text-primary)">
              {formatUID(uid)}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-3 rounded-xl bg-(--surface-3) border border-(--border-soft) hover:bg-(--surface-4) transition-all hover:scale-105 active:scale-95"
              title="Copy UID"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5 text-(--text-muted)" />
              )}
            </button>
          </div>
        </div>

        <p className="text-sm text-(--text-dim) max-w-md mx-auto">
          Share this code with anyone who needs access. They can retrieve your files at the{' '}
          <span className="text-orange-400">Retrieve</span> page.
        </p>

        {expiresAt && (
          <div className="flex justify-center">
            <CountdownTimer expiresAt={expiresAt} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
