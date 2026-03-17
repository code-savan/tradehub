import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      toast.success('Welcome back, Demo Trader!');
      navigate('/dashboard');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@trade.com');
    setPassword('password123');
    toast.info('Demo credentials filled. Click Sign In to continue.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-deep-black">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/hero_city_bg.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black/80 via-deep-black/90 to-deep-black" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-neon-aqua/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neon-aqua/10 flex items-center justify-center border border-neon-aqua/20">
              <TrendingUp className="w-6 h-6 text-neon-aqua" />
            </div>
            <span className="font-sora font-bold text-2xl text-text-primary">TradeFlow</span>
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card-strong rounded-3xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-sora font-bold text-2xl text-text-primary mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-text-secondary text-sm">
              {isSignUp 
                ? 'Start your trading journey today' 
                : 'Sign in to access your dashboard'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:border-neon-aqua focus:ring-1 focus:ring-neon-aqua/30 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-text-primary placeholder:text-text-secondary/50 focus:border-neon-aqua focus:ring-1 focus:ring-neon-aqua/30 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-deep-black/30 border-t-deep-black rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-text-secondary uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-subtle rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-neon-aqua flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary mb-1">Demo Account</p>
                <p className="text-xs text-text-secondary mb-3">
                  Use these credentials to explore the platform
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Email:</span>
                    <span className="font-mono text-text-primary">demo@trade.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Password:</span>
                    <span className="font-mono text-text-primary">password123</span>
                  </div>
                </div>
                <button
                  onClick={fillDemoCredentials}
                  className="mt-3 text-xs text-neon-aqua hover:underline"
                >
                  Fill credentials automatically
                </button>
              </div>
            </div>
          </motion.div>

          {/* Toggle */}
          <p className="text-center text-sm text-text-secondary">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-neon-aqua hover:underline font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => navigate('/')}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
