
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  location?: string;
}

export function PageTransition({ children, location }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="page-transition-container"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
