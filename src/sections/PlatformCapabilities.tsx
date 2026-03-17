import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart3, Bell, Shield, Cpu, Globe, Lock } from 'lucide-react';

export default function PlatformCapabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const capabilities = [
    {
      icon: BarChart3,
      title: 'Real-time Charts',
      description: 'Candlesticks, depth, and volume—refreshed in milliseconds with sub-second latency.',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Set price triggers, volume thresholds, and custom conditions. Get notified instantly.',
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: '2FA, withdrawal approvals, cold storage, and encryption at rest for maximum security.',
    },
    {
      icon: Cpu,
      title: 'AI-Powered Insights',
      description: 'Machine learning models analyze market patterns and provide actionable trading signals.',
    },
    {
      icon: Globe,
      title: 'Global Markets',
      description: 'Access 500+ trading pairs across cryptocurrencies, forex, and commodities.',
    },
    {
      icon: Lock,
      title: 'Institutional Grade',
      description: 'Used by hedge funds and prop traders. 99.99% uptime with redundant infrastructure.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="markets"
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-deep-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-aqua/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-6">
            Everything you need to{' '}
            <span className="text-gradient">trade with confidence.</span>
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Real-time execution, risk controls, and analytics—wrapped in an interface 
            that stays out of your way.
          </p>
        </motion.div>

        {/* Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 group hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-neon-aqua/10 flex items-center justify-center mb-4 group-hover:bg-neon-aqua/20 transition-colors">
                <cap.icon className="w-6 h-6 text-neon-aqua" />
              </div>
              <h3 className="font-sora font-semibold text-lg text-text-primary mb-2">
                {cap.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Media Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="glass-card-strong rounded-3xl p-2">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/capabilities_media.jpg"
                alt="Trading workspace"
                className="w-full h-[300px] sm:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent" />
              
              {/* Caption */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-subtle rounded-xl p-4 sm:p-6 inline-block">
                  <p className="font-sora font-semibold text-text-primary mb-1">
                    Designed for focus. Built for performance.
                  </p>
                  <p className="text-sm text-text-secondary">
                    Professional-grade tools that adapt to your trading style.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
