import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowRight, FileText, Lock, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function EditorConfigModal({ isOpen, onClose, data, onChange }) {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const isValid = data.title.trim() !== '' && data.password.trim() !== '';

  const handleProceed = () => {
    if (!isValid) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    navigate(data.fileEnabled ? '/upload' : '/text', { state: data });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md p-8 rounded-3xl bg-(--bg-secondary) border border-(--border-soft) shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-(--text-primary) mb-6">Editor Config</h2>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-(--text-dim) uppercase tracking-wider">Title</label>
            <div className="relative group">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-dim) group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                value={data.title}
                onChange={(e) => {
                  onChange({...data, title: e.target.value});
                  if (e.target.value.trim() && data.password.trim()) setShowError(false);
                }}
                placeholder="Enter share title..."
                className={`w-full bg-(--surface-2) border rounded-xl pl-10 pr-4 py-3 text-(--text-primary) focus:outline-none transition-all ${
                  showError && !data.title.trim() 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-(--border-subtle) focus:border-orange-500/40'
                }`}
              />
            </div>
            <AnimatePresence>
              {showError && !data.title.trim() && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  Title is required
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-(--text-dim) uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-dim) group-focus-within:text-orange-500 transition-colors" />
              <input
                type="password"
                value={data.password}
                onChange={(e) => {
                  onChange({...data, password: e.target.value});
                  if (e.target.value.trim() && data.title.trim()) setShowError(false);
                }}
                placeholder="Set a password..."
                className={`w-full bg-(--surface-2) border rounded-xl pl-10 pr-4 py-3 text-(--text-primary) focus:outline-none transition-all ${
                  showError && !data.password.trim() 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-(--border-subtle) focus:border-orange-500/40'
                }`}
              />
            </div>
            <AnimatePresence>
              {showError && !data.password.trim() && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  Password is required
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-(--text-dim) uppercase tracking-wider">Duration</label>
              <div className="relative group">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-dim) pointer-events-none" />
                <select
                  value={data.expiresIn}
                  onChange={(e) => onChange({...data, expiresIn: e.target.value})}
                  className="w-full bg-(--surface-2) border border-(--border-subtle) rounded-xl pl-10 pr-4 py-3 text-(--text-secondary) focus:outline-none focus:border-orange-500/40 transition-all appearance-none cursor-pointer"
                >
                  <option value="30m">30 Minutes</option>
                  <option value="1h">1 Hour</option>
                  <option value="6h">6 Hours</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                </select>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-(--text-dim) uppercase tracking-wider">Attachments</label>
              <button
                onClick={() => onChange({...data, fileEnabled: !data.fileEnabled})}
                className={`w-full py-3 rounded-xl border transition-all font-medium flex items-center justify-center gap-2 ${
                  data.fileEnabled 
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                  : 'bg-(--surface-2) border-(--border-subtle) text-(--text-muted)'
                }`}
              >
                {data.fileEnabled ? <Upload className="w-4 h-4" /> : null}
                {data.fileEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <button
            onClick={handleProceed}
            className={`w-full flex items-center justify-center gap-3 py-4 mt-4 rounded-2xl font-bold transition-all active:scale-[0.98] ${
              isValid 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-xl hover:shadow-orange-500/25' 
              : 'bg-(--surface-2) border border-(--border-subtle) text-(--text-muted) cursor-not-allowed'
            }`}
          >
            Proceed to Editor
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
