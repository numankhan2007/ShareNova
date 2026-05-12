import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, FileText, Trash2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import ShareOptionsForm from '@/components/forms/ShareOptionsForm';
import CountdownTimer from '@/components/common/CountdownTimer';

export default function DocumentInfoDropdown({ 
  isOpen, 
  onClose, 
  title, 
  setTitle, 
  options, 
  setOptions, 
  contentLength, 
  onClear,
  expiresAt,
  sessionStart
}) {
  // Local draft state to prevent instant updates to the main editor
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftOptions, setDraftOptions] = useState(options);

  // Sync local state when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setDraftTitle(title);
      setDraftOptions(options);
    }
  }, [isOpen, title, options]);

  const handleDone = () => {
    setTitle(draftTitle);
    setOptions(draftOptions);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full right-0 mt-3 w-80 z-50"
        >
          <div className="bg-(--bg-secondary) border border-(--border-strong) rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-(--border-soft)">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                  <Info className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-(--text-primary)">Information</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-(--surface-2) text-(--text-dim) hover:text-(--text-primary) transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Document Title Edit */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-(--text-dim) uppercase tracking-wider">Document Title</label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-dim) group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Untitled Document..."
                    className="w-full bg-(--surface-2) border border-(--border-subtle) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--text-primary) focus:outline-none focus:border-orange-500/40 transition-all placeholder:text-(--text-placeholder)"
                  />
                </div>
              </div>

              {/* Status & Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-(--surface-1) border border-(--border-subtle)">
                  <div className="text-[10px] text-(--text-dim) uppercase tracking-wider font-bold mb-1">Status</div>
                  <div className="text-xs text-(--text-secondary) flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live Draft
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-(--surface-1) border border-(--border-subtle)">
                  <div className="text-[10px] text-(--text-dim) uppercase tracking-wider font-bold mb-1">Length</div>
                  <div className="text-xs text-(--text-secondary)">
                    {contentLength.toLocaleString()} chars
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="pt-2 border-t border-(--border-soft)">
                <label className="text-[10px] font-semibold text-(--text-dim) uppercase tracking-wider block mb-3">Share Configuration</label>
                <ShareOptionsForm options={draftOptions} onChange={setDraftOptions} />
              </div>

              {/* Countdown / Expiry */}
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] text-orange-500/60 uppercase tracking-widest font-bold">Time Remaining</div>
                  {!expiresAt && (
                    <span className="text-[9px] text-orange-400/50 italic">Preview — resets on save</span>
                  )}
                </div>
                <CountdownTimer expiresAt={expiresAt} expiresIn={draftOptions.expiresIn} sessionStart={sessionStart} />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-(--border-soft) flex gap-3">
                <button 
                  onClick={() => {
                    if(confirm('Are you sure you want to clear this document?')) {
                      onClear();
                      onClose();
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/5 text-red-400 text-[11px] font-bold border border-red-500/10 hover:bg-red-500 hover:text-white transition-all group"
                >
                  <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  Clear Sheet
                </button>
                <button 
                  onClick={handleDone}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all active:scale-[0.98]"
                >
                  Done Editing
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
