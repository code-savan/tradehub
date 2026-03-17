import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0"
      >
        <img
          src="/cta_panorama_bg.jpg"
          alt="City panorama"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-deep-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-deep-black/50" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-aqua/10 border border-neon-aqua/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-neon-aqua" />
            <span className="text-sm text-neon-aqua font-medium">Start for free</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sora font-bold text-4xl sm:text-5xl lg:text-6xl text-text-primary mb-6 leading-tight"
          >
            Start trading in minutes.
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Create your account, fund your wallet, and access global markets—
            no paperwork, no waiting.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => navigate('/auth')}
              className="btn-primary text-lg px-10 py-5 inline-flex items-center gap-3 group"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-aqua" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-aqua" />
              <span>Free demo account</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-aqua" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            © 2026 TradeFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Support</a>
          </div>
        </div>
      </div>
    </section>
  );
}
