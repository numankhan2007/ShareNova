import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

// Converts expiresIn string (e.g. "1h", "7d") to milliseconds
const EXPIRY_MS = {
  '30m': 30 * 60 * 1000,
  '1h':  1 * 60 * 60 * 1000,
  '6h':  6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d':  7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

export default function CountdownTimer({ expiresAt, expiresIn, sessionStart }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    function update() {
      let expiry;

      if (expiresAt) {
        expiry = new Date(expiresAt).getTime();
        if (isNaN(expiry)) return;
      } else if (expiresIn && EXPIRY_MS[expiresIn] && sessionStart) {
        // Use the stable session start time so the timer doesn't reset on re-open
        expiry = sessionStart + EXPIRY_MS[expiresIn];
      } else {
        return;
      }

      const diff = expiry - Date.now();

      if (diff <= 0) {
        setIsExpired(true);
        return;
      }

      setTime({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, expiresIn, sessionStart]);

  const pad = (n) => n.toString().padStart(2, '0');

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest">
        <Clock className="w-3.5 h-3.5" />
        Expired
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3"
    >
      <div className="flex items-center gap-1 font-mono text-lg font-bold text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
        {time.d > 0 && (
          <>
            <span>{pad(time.d)}</span>
            <span className="text-[10px] text-orange-500/50 -mt-2">d</span>
            <span className="text-orange-500/30 mx-1">:</span>
          </>
        )}
        <span>{pad(time.h)}</span>
        <span className="text-orange-500/30 animate-pulse">:</span>
        <span>{pad(time.m)}</span>
        <span className="text-orange-500/30 animate-pulse">:</span>
        <span>{pad(time.s)}</span>
      </div>
    </motion.div>
  );
}
