import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2 } from 'lucide-react';
import ShareOptionsForm from '@/components/forms/ShareOptionsForm';
import UIDDisplay from '@/components/share/UIDDisplay';
import { createTextShare } from '@/lib/api';
import { SUPPORTED_LANGUAGES, MAX_TEXT_SIZE } from '@/lib/constants';

export default function TextPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [options, setOptions] = useState({ expiresIn: '24h' });
  const [state, setState] = useState('idle');
  const [uid, setUid] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!content.trim()) return;
    setState('submitting');
    setError('');

    try {
      const res = await createTextShare({
        content,
        title: title || undefined,
        language,
        expiresIn: options.expiresIn,
        password: options.password,
      });

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
        setError(res.error || 'Failed to create share');
        setState('idle');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setState('idle');
    }
  }

  function reset() {
    setContent('');
    setTitle('');
    setLanguage('plaintext');
    setOptions({ expiresIn: '24h' });
    setState('idle');
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
                Create another
              </button>
            </>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-(--text-primary) mb-2">Share Text</h1>
                <p className="text-(--text-muted)">Paste code, notes, or any text and get a share code.</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title (optional)"
                  className="w-full bg-(--surface-2) border border-(--border-subtle) rounded-xl px-4 py-3 text-(--text-primary) placeholder:text-(--text-placeholder) focus:outline-none focus:border-orange-500/30 transition-all"
                />

                <div className="flex gap-3">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-(--surface-2) border border-(--border-subtle) rounded-xl px-4 py-2.5 text-sm text-(--text-secondary) focus:outline-none focus:border-orange-500/30"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang} className="bg-(--bg-secondary) text-(--text-primary)">{lang}</option>
                    ))}
                  </select>
                  <span className="text-xs text-(--text-dim) self-center">
                    {content.length.toLocaleString()} / {MAX_TEXT_SIZE.toLocaleString()}
                  </span>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, MAX_TEXT_SIZE))}
                  placeholder="Paste your text here..."
                  rows={12}
                  className="w-full bg-(--surface-1) border border-(--border-subtle) rounded-xl px-5 py-4 text-sm font-mono text-(--text-secondary) placeholder:text-(--text-placeholder) focus:outline-none focus:border-orange-500/30 transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="p-5 rounded-2xl bg-(--surface-1) border border-(--border-subtle) space-y-4">
                <h3 className="text-sm font-medium text-(--text-secondary)">Share Options</h3>
                <ShareOptionsForm options={options} onChange={setOptions} />
              </div>

              {error && <p className="text-sm text-red-400 text-center">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!content.trim() || state === 'submitting'}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium disabled:opacity-50 hover:shadow-xl hover:shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {state === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                {state === 'submitting' ? 'Creating...' : 'Create & Get Code'}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
