import React, { forwardRef, useEffect, useMemo, useState } from 'react';

const MOTION_ONLY_PROPS = new Set([
  'animate',
  'exit',
  'initial',
  'layout',
  'transition',
  'variants',
  'whileHover',
  'whileTap',
]);

function cleanMotionProps(props) {
  const cleaned = {};
  for (const [key, value] of Object.entries(props)) {
    if (!MOTION_ONLY_PROPS.has(key)) cleaned[key] = value;
  }
  return cleaned;
}

function createMotionElement(tag) {
  const Component = forwardRef(function MotionLiteElement(props, ref) {
    return React.createElement(tag, { ...cleanMotionProps(props), ref });
  });
  Component.displayName = `MotionLite.${tag}`;
  return Component;
}

const motionElements = new Map();

export const motion = new Proxy({}, {
  get(_, tag) {
    if (typeof tag !== 'string') return undefined;
    if (!motionElements.has(tag)) {
      motionElements.set(tag, createMotionElement(tag));
    }
    return motionElements.get(tag);
  },
});

export function AnimatePresence({ children }) {
  return <>{children}</>;
}

export function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const mediaQuery = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return null;
    return window.matchMedia(query);
  }, []);
  const [reduced, setReduced] = useState(() => mediaQuery?.matches ?? false);

  useEffect(() => {
    if (!mediaQuery) return undefined;
    const update = () => setReduced(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [mediaQuery]);

  return reduced;
}
