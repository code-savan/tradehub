import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function MobileSearchModal({
  isOpen,
  onClose,
  placeholder,
  value,
  onChange
}: MobileSearchModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-deep-black border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
