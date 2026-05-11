import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { formatUID, normalizeUID, isValidUID } from '@/lib/uid';

export default function UIDInput({ onSubmit, isLoading }) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleChange = useCallback((e) => {
    const raw = normalizeUID(e.target.value);
    setValue(raw);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const clean = normalizeUID(value);
      if (isValidUID(clean)) {
        onSubmit(clean);
      }
    },
    [value, onSubmit]
  );

  const displayValue = formatUID(value);
  const isValid = isValidUID(normalizeUID(value));

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <motion.div
        animate={{
          borderColor: isFocused
            ? 'var(--accent-ring)'
            : 'var(--border-subtle)',
          boxShadow: isFocused
            ? '0 0 30px var(--accent-ring-glow)'
            : '0 0 0px transparent',
        }}
        className="relative flex items-center rounded-2xl border border-(--border-subtle) bg-(--surface-1) backdrop-blur-xl overflow-hidden"
      >
        <div className="pl-5">
          <Search className="w-5 h-5 text-(--text-dim)" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="0000 0000 0000"
          maxLength={14}
          className="flex-1 bg-transparent px-4 py-5 text-2xl font-mono tracking-[0.2em] text-(--text-primary) placeholder:text-(--text-placeholder) focus:outline-none text-center"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="mr-3 p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </motion.div>
      <p className="text-center text-sm text-(--text-dim) mt-3">
        Enter the 12-digit share code to retrieve files or text
      </p>
    </form>
  );
}
