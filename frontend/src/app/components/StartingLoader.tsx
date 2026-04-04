import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUI } from './UIContext';

export function StartingLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoaded } = useUI();

  useEffect(() => {
    // Hide loader after 2.5 seconds
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ y: 0, opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
          }}
          onAnimationComplete={() => setIsLoaded(true)}
          className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              className="font-display text-7xl md:text-9xl font-bold uppercase tracking-tighter text-on-surface leading-[0.8]"
            >
              Kosmic
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
              className="font-display text-7xl md:text-9xl font-bold uppercase tracking-tighter text-primary leading-[0.8] ml-12 md:ml-24 mt-4"
            >
              Align
            </motion.h1>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-24 w-64 h-[2px] bg-on-surface-variant origin-left"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-16 font-mono text-xs uppercase tracking-widest text-on-surface-variant"
          >
            Initiating Sequence...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
