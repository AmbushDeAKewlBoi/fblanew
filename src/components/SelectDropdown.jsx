import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown, Check, MagnifyingGlass } from '@phosphor-icons/react';

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
        aria-expanded={open}
        className={`flex w-full items-center justify-between border bg-[var(--atlas-surface)] px-4 py-3 text-sm text-[var(--atlas-fg)] transition-all duration-200 ${
          open
            ? 'border-[var(--atlas-accent)] ring-2 ring-[rgba(109,158,168,0.18)]'
            : 'border-[var(--atlas-border)] hover:border-[var(--atlas-accent)]/55'
        }`}
        style={{ borderRadius: 8 }}
      >
        <span className={value ? 'max-w-[90%] truncate text-left font-medium text-[var(--atlas-fg)]' : 'text-[var(--atlas-muted)]'}>
          {selectedLabel}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <CaretDown size={16} weight="regular" className="text-[var(--atlas-muted)] shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            className="absolute z-50 mt-2 flex max-h-80 w-full flex-col overflow-hidden border border-[var(--atlas-border)] bg-[var(--atlas-surface)]/95 p-1 shadow-[0_18px_48px_-28px_rgba(36,50,51,0.7)] backdrop-blur-xl"
            style={{ borderRadius: 12 }}
          >
            {searchable && (
              <div className="sticky top-0 z-10 mb-1 border-b border-[var(--atlas-border)] px-2 pb-2 pt-2">
                <div className="relative">
                  <MagnifyingGlass size={14} weight="regular" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--atlas-muted)]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="atlas-input py-1.5 pl-8 pr-3"
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
                      className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-all ${
                        isSelected
                          ? 'bg-[rgba(61,109,118,0.14)] font-semibold text-[var(--atlas-fg)]'
                          : 'text-[var(--atlas-muted)] hover:bg-[var(--atlas-elev)] hover:text-[var(--atlas-fg)]'
                      }`}
                      style={{ borderRadius: 8 }}
                    >
                      <span className="truncate pr-4">{optLabel}</span>
                      {isSelected && <Check size={14} className="shrink-0 text-[var(--atlas-accent)]" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-sm text-[var(--atlas-muted)]">No options found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
