import { Link } from 'react-router';
import { Button } from '../components/Button';
import { motion } from 'motion/react';
import { useUI } from '../components/UIContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }
  },
};

export function Webinars() {
  const { isLoaded } = useUI();
  return (
    <div className="flex flex-col flex-grow bg-surface">
      <section className="px-6 lg:px-24 py-32 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="flex flex-col items-center"
        >
          <div className="overflow-hidden mb-8">
            <motion.h1 
              variants={itemVariants}
              className="font-display text-7xl md:text-9xl font-bold uppercase tracking-tighter leading-none max-w-5xl text-on-surface"
            >
              Webinars
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.div variants={itemVariants} className="font-mono text-primary font-bold tracking-[0.2em] uppercase block text-xl">
              Coming Soon
            </motion.div>
          </div>
          <div className="overflow-hidden mb-16">
            <motion.p variants={itemVariants} className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
              Future deep dives into astrological charting, predictive techniques, and the raw truth behind global cycles.
            </motion.p>
          </div>
          <motion.div variants={itemVariants}>
            <Link to="/">
              <Button variant="secondary">Return Home</Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
