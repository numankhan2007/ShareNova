import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { EXPIRY_OPTIONS } from '@/lib/constants';

export default function ShareOptionsForm({ options, onChange }) {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="space-y-4">
      {/* Expiry */}
      <div>
        <label className="block text-xs text-white/40 mb-2">Expiry</label>
        <div className="flex flex-wrap gap-2">
          {EXPIRY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...options, expiresIn: opt.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                options.expiresIn === opt.value
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs text-white/40 mb-2">Password (optional)</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type={showPw ? 'text' : 'password'}
            value={options.password || ''}
            onChange={(e) => onChange({ ...options, password: e.target.value || undefined })}
            placeholder="Set a password"
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
