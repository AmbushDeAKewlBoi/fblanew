import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export default function SelectDropdown({ value, onChange, options, placeholder = "Select..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => (o.value || o.name || o) === value)?.label || options.find(o => (o.value || o.name || o) === value)?.name || value || placeholder;

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:outline-none dark:bg-warm-800 ${
          isOpen
            ? 'border-navy-500 shadow-sm ring-2 ring-navy-500/20 dark:border-navy-400'
            : 'border-warm-200 text-warm-900 hover:border-warm-300 dark:border-warm-700 dark:text-warm-100 dark:hover:border-warm-600'
        }`}
      >
        <span className={!value ? 'text-warm-400' : 'font-medium'}>{selectedLabel}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <ChevronDown size={16} className="text-warm-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-warm-200 bg-white/80 p-1 backdrop-blur-xl shadow-xl dark:border-warm-700 dark:bg-warm-900/90"
          >
            {options.map((opt, i) => {
              const val = opt.value || opt.name || opt;
              const label = opt.label || opt.name || opt;
              const isSelected = value === val;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
                    isSelected
                      ? 'bg-navy-50 text-navy-700 font-semibold dark:bg-navy-900/40 dark:text-navy-300'
                      : 'text-warm-700 hover:bg-warm-100 hover:text-warm-900 dark:text-warm-300 dark:hover:bg-warm-800 dark:hover:text-warm-100'
                  }`}
                >
                  {label}
                  {isSelected && <Check size={14} className="text-navy-600 dark:text-navy-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
