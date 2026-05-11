import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Loader2, Sparkles, Search, Save } from 'lucide-react';
import ShareOptionsForm from '@/components/forms/ShareOptionsForm';
import UIDDisplay from '@/components/share/UIDDisplay';
import { createTextShare, getShareByUID, getTextContent } from '@/lib/api';
import { MAX_TEXT_SIZE } from '@/lib/constants';

export default function TextPage() {
  const location = useLocation();
  const initialState = location.state || {};

  const [content, setContent] = useState('');
  const [title, setTitle] = useState(initialState.title || '');
  const [options, setOptions] = useState({
    expiresIn: initialState.expiresIn || '24h',
    password: initialState.password || ''
  });
  
  const [state, setState] = useState('idle');
  const [uid, setUid] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // ─── Search Logic ─────────────────────────────────────────
  const handleSearch = async (val) => {
    setSearch(val);
    if (val.length === 12) {
      setIsSearching(true);
      try {
        const res = await getShareByUID(val);
        if (res.success && res.data) {
          setSearchResults(res.data);
        } else {
          setSearchResults(null);
        }
      } catch (err) {
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults(null);
    }
  };

  const loadShareContent = async () => {
    if (!searchResults || searchResults.type !== 'TEXT') return;
    setIsSearching(true);
    try {
      const contentRes = await getTextContent(searchResults.uid);
      if (contentRes.success && contentRes.data) {
        setContent(contentRes.data);
        setTitle(searchResults.title || '');
        setSearchResults(null);
        setSearch('');
      }
    } catch (err) {
      console.error('Failed to load content', err);
    } finally {
      setIsSearching(false);
    }
  };

  async function handleSubmit() {
    if (!content.trim()) return;
    setState('submitting');
    setError('');

    try {
      const res = await createTextShare({
        content,
        title: title || undefined,
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
    setState('idle');
    setUid('');
    setExpiresAt(null);
    setError('');
  }

  // Check if we are in "active editing" mode (from home or loaded)
  const isEditing = !!initialState.title || content.length > 0 || state === 'done';

  return (
    <div className="page-split">
      {/* ── Left 80% Main Area ── */}
      <div className="page-split__main" style={{ padding: 0 }}>
        {!isEditing ? (
          <div className="word-sheet__empty">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="relative">
                <FileText className="word-sheet__empty-icon" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-12 h-12 text-orange-500/20" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-(--text-primary)">Word Sheet Ready</h2>
                <p className="text-(--text-muted) max-w-md mx-auto">
                  To begin, use the <strong>Create Editor</strong> button on the home page or 
                  <strong>Search</strong> for a 12-digit code in the sidebar to join an existing sheet.
                </p>
              </div>
              <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-(--surface-2) border border-(--border-soft) text-sm font-medium hover:bg-(--surface-3) transition-all">
                Go to Home
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="word-sheet-container">
            {state === 'done' && uid ? (
              <div className="w-full max-w-2xl mx-auto px-6">
                <UIDDisplay uid={uid} expiresAt={expiresAt} />
                <button onClick={reset} className="page-split__btn-secondary mt-6">
                  Create New Sheet
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="word-sheet"
              >
                <div className="mb-8 pb-4 border-b border-(--border-soft) flex items-center justify-between">
                  <h1 className="text-2xl text-(--text-primary)">{title || 'Untitled Document'}</h1>
                  <span className="text-[10px] text-(--text-dim) font-mono uppercase tracking-widest">Microsoft Word Style</span>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, MAX_TEXT_SIZE))}
                  placeholder="Start typing your document here..."
                  className="word-sheet__textarea"
                />

                <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 uppercase tracking-tighter font-medium">
                    {content.length.toLocaleString()} Characters / {MAX_TEXT_SIZE.toLocaleString()} Max
                  </span>
                  {state === 'idle' && content.trim() && (
                    <button 
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save & Get Code
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* ── Right 20% Sidebar ── */}
      <aside className="page-split__sidebar">
        <div className="page-split__sidebar-card">
          <span className="page-split__sidebar-label">Retrieve Share</span>
          <input
            id="text-search"
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter 12-digit code…"
            className="page-split__search"
            maxLength={12}
          />
        </div>

        {isSearching && (
          <div className="page-split__sidebar-card">
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-(--text-muted)" />
            </div>
          </div>
        )}

        {searchResults && (
          <div className="page-split__sidebar-card page-split__result-card animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="page-split__sidebar-label">Found Share</span>
            <div className="space-y-2 mt-1">
              <div className="text-sm font-semibold text-(--text-primary) truncate">
                {searchResults.title || 'Untitled Share'}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  searchResults.type === 'TEXT' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {searchResults.type}
                </span>
              </div>
              <button 
                onClick={loadShareContent}
                disabled={searchResults.type !== 'TEXT'}
                className="block w-full text-center py-2 mt-2 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchResults.type === 'TEXT' ? 'Load into Editor' : 'File Only'}
              </button>
            </div>
          </div>
        )}

        {isEditing && state === 'idle' && (
          <div className="page-split__sidebar-card mt-auto animate-in slide-in-from-bottom-4 duration-500">
            <span className="page-split__sidebar-label">Options</span>
            <ShareOptionsForm options={options} onChange={setOptions} />
          </div>
        )}
      </aside>
    </div>
  );
}
