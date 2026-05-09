import { motion } from 'framer-motion';

export default function ProgressBar({ progress, label }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-white/50">{label}</span>
        <span className="text-white/70 font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
        />
      </div>
    </div>
  );
}
