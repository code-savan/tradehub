import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Zap, Bell, Shield, ChevronRight } from 'lucide-react';

export default function FeatureHighlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  
  const ringScale = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);
  const ringRotate = useTransform(scrollYProgress, [0, 0.3], [-90, 0]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  
  const lineScaleY = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const contentX = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  const features = [
    {
      icon: Zap,
      title: 'Real-time Charts',
      description: 'Candlesticks, depth, and volume—refreshed in milliseconds.',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Set triggers and let the market come to you.',
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: '2FA, withdrawal approvals, and encryption at rest.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-deep-black">
        <div className="absolute inset-0 bg-gradient-radial from-neon-aqua/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Neon Ring */}
          <div className="relative flex items-center justify-center">
            {/* Glow effect */}
            <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-neon-aqua/10 blur-3xl" />
            
            {/* Neon Ring SVG */}
            <motion.div
              style={{
                scale: ringScale,
                rotate: ringRotate,
                opacity: ringOpacity,
              }}
              className="relative w-64 h-64 sm:w-80 sm:h-80"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4DFFCE" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#4DFFCE" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#4DFFCE" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="4 8"
                  className="animate-spin-slow"
                  style={{ transformOrigin: 'center' }}
                />
                <circle
                  cx="100"
                  cy="100"
                  r="75"
                  fill="none"
                  stroke="#4DFFCE"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-sora font-bold text-5xl sm:text-6xl text-neon-aqua mb-2">0.3s</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Execution Time</div>
                </div>
              </div>
            </motion.div>

            {/* Vertical divider (desktop only) */}
            <motion.div
              style={{ scaleY: lineScaleY }}
              className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-3/4 bg-gradient-to-b from-transparent via-white/20 to-transparent origin-center"
            />
          </div>

          {/* Right Side - Content */}
          <motion.div
            style={{ x: contentX, opacity: contentOpacity }}
            className="space-y-8"
          >
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-6 leading-tight"
              >
                Built for speed.
                <br />
                <span className="text-gradient">Designed for clarity.</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-text-secondary leading-relaxed max-w-lg"
              >
                From live order books to custom alerts, TradeFlow keeps you ahead of the market 
                without the clutter. Experience trading the way it should be.
              </motion.p>
            </div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="glass-subtle rounded-xl p-4 flex items-start gap-4 group hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-neon-aqua/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-aqua/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-neon-aqua" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-sora font-semibold text-text-primary mb-1 flex items-center gap-2">
                      {feature.title}
                      <ChevronRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-text-secondary">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <button className="text-neon-aqua flex items-center gap-2 group">
                <span className="font-medium">Explore features</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
