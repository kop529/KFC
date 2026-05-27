// U-03 Fix: Re-export Framer Motion's built-in useReducedMotion hook.
// Import this instead of the framer-motion one directly for consistent usage.
// Usage:
//   const shouldReduce = useReducedMotion();
//   <motion.div initial={shouldReduce ? false : { opacity: 0, y: 20 }} ... />

export { useReducedMotion } from 'framer-motion';
