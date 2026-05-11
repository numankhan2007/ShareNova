import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Shield, Clock, Zap, Lock, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';

// ─── Animated glowing text component ────────────────────

function GlowText() {
  const letters = 'ShareNova'.split('');

  return (
    <h1 className="relative inline-block">
      {/* Background glow layer */}
      <motion.span
        className="absolute inset-0 blur-2xl opacity-60 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
          ShareNova
        </span>
      </motion.span>

      {/* Main text with per-letter animation */}
      <span className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight" style={{ perspective: '800px' }}>
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{
              opacity: 0,
              y: 60,
              rotateX: -90,
              filter: 'blur(12px)',
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
              scale: 1,
            }}
            transition={{
              delay: 0.3 + i * 0.08,
              duration: 1,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="inline-block bg-gradient-to-b from-(--hero-text-from) via-(--hero-text-via) to-(--hero-text-to) bg-clip-text text-transparent"
            style={{ transformOrigin: 'bottom center' }}
          >
            {letter}
          </motion.span>
        ))}
      </span>

      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ delay: 1.5, duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 5 }}
      >
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-(--text-faint) to-transparent skew-x-[-20deg]" />
      </motion.div>
    </h1>
  );
}

// ─── Floating particle background ───────────────────────

function FloatingOrbs() {
  const orbs = [
    { size: 300, x: '15%', y: '20%', color: 'orange', delay: 0 },
    { size: 400, x: '75%', y: '30%', color: 'amber', delay: 2 },
    { size: 200, x: '50%', y: '70%', color: 'cyan', delay: 4 },
    { size: 250, x: '85%', y: '75%', color: 'orange', delay: 1 },
    { size: 150, x: '10%', y: '80%', color: 'amber', delay: 3 },
  ];

  const colorMap = {
    orange: 'bg-orange-500/[0.06]',
    amber: 'bg-amber-500/[0.05]',
    cyan: 'bg-cyan-500/[0.04]',
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${colorMap[orb.color]}`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, 0, -15, 0],
            scale: [1, 1.1, 1, 0.95, 1],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated counter ───────────────────────────────────

function AnimatedStat({ value, label, delay }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = parseInt(value);
      const duration = 2000;
      const increment = end / (duration / 16);
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(counter);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.6 }}
      className="text-center"
    >
      <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-(--stat-text-from) to-(--stat-text-to) bg-clip-text text-transparent">
        {count}+
      </p>
      <p className="text-xs text-(--text-dim) mt-1">{label}</p>
    </motion.div>
  );
}

// ─── Feature card ───────────────────────────────────────

function FeatureCard({ icon: Icon, title, description, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative p-6 rounded-2xl bg-(--surface-1) border border-(--border-subtle) hover:border-(--border-strong) backdrop-blur-sm transition-colors duration-300 overflow-hidden"
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient.replace('/[0.03]', '/20').replace('/[0.02]', '/15')} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 text-(--text-secondary)" />
        </div>
        <h3 className="text-(--text-primary) font-semibold mb-2">{title}</h3>
        <p className="text-sm text-(--text-muted) leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Main page ──────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center relative overflow-hidden">
      <FloatingOrbs />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-(--surface-2) border border-(--border-soft) mb-10 backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
          </motion.div>
          <span className="text-sm text-(--text-muted) font-medium">Secure · Temporary · Private</span>
        </motion.div>

        {/* Animated Title */}
        <GlowText />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-lg sm:text-xl text-(--text-muted) max-w-2xl mx-auto mt-8 leading-relaxed"
        >
          The most secure way to share files and text.{' '}
          <span className="text-(--text-secondary)">No accounts, no public links.</span>{' '}
          Just a 12-digit code that auto-expires.
        </motion.p>

        {/* Two Main Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-12"
        >
          <Link
            to="/upload"
            className="group relative flex items-center gap-3 px-10 py-4.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-lg shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Upload className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Share</span>
            <ArrowRight className="w-4 h-4 relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>

          <Link
            to="/retrieve"
            className="group flex items-center gap-3 px-10 py-4.5 rounded-2xl bg-(--surface-2) border border-(--border-soft) text-(--text-secondary) font-semibold text-lg hover:bg-(--surface-4) hover:border-(--border-stronger) hover:text-(--text-primary) transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] backdrop-blur-sm"
          >
            <Download className="w-5 h-5" />
            <span>Receive</span>
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-(--text-muted)" />
          </Link>
        </motion.div>
      </section>

      {/* Divider line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2, duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-(--divider-line) to-transparent"
      />

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-(--text-primary) mb-4">
            How it{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              works
            </span>
          </h2>
          <p className="text-(--text-muted) max-w-lg mx-auto">
            Three simple steps. No sign-ups, no emails, no complicated setups.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Upload or Paste', desc: 'Drop your files or paste text. Set an expiry time and optional password.', icon: Upload },
            { step: '02', title: 'Get Your Code', desc: 'Receive a unique 12-digit code. Share it with anyone who needs access.', icon: Lock },
            { step: '03', title: 'Retrieve Securely', desc: 'Enter the code to instantly access the shared content. It auto-deletes.', icon: Download },
          ].map(({ step, title, desc, icon: Icon }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative p-6 rounded-2xl bg-(--surface-1) border border-(--border-subtle) group hover:border-(--border-strong) transition-all"
            >
              <div className="text-5xl font-black text-(--step-number) absolute top-4 right-5 group-hover:text-(--step-number-hover) transition-colors">
                {step}
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/15 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-(--text-primary) font-semibold mb-2">{title}</h3>
              <p className="text-sm text-(--text-muted) leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-(--text-primary) mb-4">
            Built for{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
              privacy
            </span>
          </h2>
          <p className="text-(--text-muted) max-w-lg mx-auto">
            Every decision is made with your security in mind.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard icon={Shield} title="Zero Knowledge" description="We never see your data. Files are stored with encryption and auto-deleted on expiry." gradient="from-orange-500/[0.03] to-amber-500/[0.02]" delay={1.8} />
          <FeatureCard icon={Clock} title="Auto Expiry" description="Set shares to expire in 1 hour to 30 days. No data lingers on our servers forever." gradient="from-cyan-500/[0.03] to-blue-500/[0.02]" delay={1.9} />
          <FeatureCard icon={Lock} title="Password Protection" description="Add an optional password. Recipients must verify before accessing content." gradient="from-amber-500/[0.03] to-orange-500/[0.02]" delay={2.0} />
          <FeatureCard icon={Zap} title="Instant Transfer" description="No waiting, no queues. Upload completes in seconds with instant code generation." gradient="from-emerald-500/[0.03] to-teal-500/[0.02]" delay={2.1} />
          <FeatureCard icon={EyeOff} title="No Tracking" description="No accounts, no cookies, no analytics. We don't know who you are." gradient="from-rose-500/[0.03] to-pink-500/[0.02]" delay={2.2} />
          <FeatureCard icon={Eye} title="UID Only Access" description="Content is accessible only via the exact 12-digit code. No guessable URLs." gradient="from-amber-500/[0.03] to-orange-500/[0.02]" delay={2.3} />
        </div>
      </section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-16 max-w-4xl mx-auto w-full"
      >
        <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/[0.06] to-amber-500/[0.04] border border-(--border-subtle) backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-8">
            <AnimatedStat value="500" label="MB Max Upload" delay={2400} />
            <AnimatedStat value="20" label="Files Per Share" delay={2600} />
            <AnimatedStat value="12" label="Digit Secure Code" delay={2800} />
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-20 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-(--text-primary)">
            Ready to share securely?
          </h2>
          <p className="text-(--text-muted)">
            No sign-ups required. Start sharing in seconds.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/upload"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:shadow-xl hover:shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
            >
              Start Sharing
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer gradient */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-(--divider-line) to-transparent" />
      <footer className="relative z-10 px-6 py-8 text-center">
        <p className="text-xs text-(--text-faint)">ShareNova — Secure Temporary Sharing</p>
      </footer>
    </div>
  );
}
