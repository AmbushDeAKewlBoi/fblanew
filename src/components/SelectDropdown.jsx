import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

export default function SelectDropdown({ value, onChange, options, placeholder = 'Select...', searchable = false }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search term when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  const getLabel = (opt) => {
    if (typeof opt === 'string') return opt;
    return opt.label || opt.name || opt.value || opt;
  };

  const getValue = (opt) => {
    if (typeof opt === 'string') return opt;
    return opt.value || opt.name || opt;
  };

  const selectedOption = options.find(o => getValue(o) === value);
  const selectedLabel = selectedOption ? getLabel(selectedOption) : placeholder;

  const filteredOptions = searchable 
    ? options.filter(opt => {
        const label = getLabel(opt);
        return typeof label === 'string' && label.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : options;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-200 ${
          open
            ? 'border-navy-400 ring-2 ring-navy-400/20 dark:border-navy-500 dark:ring-navy-500/20'
            : 'border-warm-200 hover:border-warm-300 dark:border-warm-700 dark:hover:border-warm-600'
        } dark:bg-warm-900 dark:text-warm-100`}
      >
        <span className={value ? 'text-warm-900 font-medium dark:text-warm-100 truncate max-w-[90%] text-left' : 'text-warm-400 dark:text-warm-500'}>
          {selectedLabel}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <ChevronDown size={16} className="text-warm-400 shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            className="absolute z-50 mt-2 max-h-80 w-full overflow-hidden rounded-xl border border-warm-200/80 bg-white/95 p-1 backdrop-blur-xl shadow-xl dark:border-warm-700/60 dark:bg-warm-900/95 flex flex-col"
          >
            {searchable && (
              <div className="sticky top-0 z-10 px-2 pt-2 pb-2 mb-1 border-b border-warm-100 dark:border-warm-800">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-lg border border-warm-200 bg-warm-50 py-1.5 pl-8 pr-3 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-400 focus:bg-white focus:outline-none dark:border-warm-700 dark:bg-warm-950 dark:text-warm-100 dark:placeholder:text-warm-500"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              </div>
            )}
            <div className="overflow-y-auto px-1 pb-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, i) => {
                  const optValue = getValue(opt);
                  const optLabel = getLabel(opt);
                  const isSelected = optValue === value;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onChange(optValue);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all text-left ${
                        isSelected
                          ? 'bg-navy-50 text-navy-700 font-semibold dark:bg-navy-900/40 dark:text-navy-300'
                          : 'text-warm-700 hover:bg-warm-100 hover:text-warm-900 dark:text-warm-300 dark:hover:bg-warm-800 dark:hover:text-warm-100'
                      }`}
                    >
                      <span className="truncate pr-4">{optLabel}</span>
                      {isSelected && <Check size={14} className="text-navy-600 dark:text-navy-400 shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-sm text-warm-500">No options found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
