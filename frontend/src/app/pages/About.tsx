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

const scrollVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any },
  },
};

export function About() {
  const { isLoaded } = useUI();
  return (
    <div className="flex flex-col flex-grow bg-surface overflow-hidden">
      <section className="px-6 lg:px-24 py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <motion.div 
          className="lg:col-span-6 sticky top-32"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <div className="overflow-hidden mb-8">
            <motion.h1 
              variants={itemVariants}
              className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none"
            >
              About<br />The Guide
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.p variants={itemVariants} className="font-mono text-primary uppercase tracking-widest text-sm">
              Astrologer / Reader / Truth-Teller
            </motion.p>
          </div>
          <motion.div variants={itemVariants}>
            <img 
              src="https://images.unsplash.com/photo-1717309078407-d688e66766bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlzdGFscyUyMHNwaXJpdHVhbHxlbnwxfHx8fDE3NzQ5NDczMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Spiritual Guide Portrait"
              className="w-full aspect-[4/5] object-cover mix-blend-multiply opacity-80 shadow-ambient filter grayscale"
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-6 lg:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="prose prose-lg prose-on-surface font-body max-w-none">
            <div className="overflow-hidden mb-8">
              <motion.h2 variants={itemVariants} className="font-display text-4xl font-bold uppercase tracking-tighter text-on-surface">The Journey</motion.h2>
            </div>
            <motion.p variants={itemVariants} className="text-xl leading-relaxed text-on-surface-variant mb-8">
              Based in Delhi, Kosmic Align was founded on a singular principle: clarity over comfort. For over a decade, we have studied the esoteric arts, not as mystical escapes, but as brutal tools for self-awareness and strategy.
            </motion.p>
            <motion.p variants={itemVariants} className="text-xl leading-relaxed text-on-surface-variant mb-8">
              The modern spiritual space is cluttered with toxic positivity. We reject the template-ready look and feel of "love and light." Our readings are architectural blueprints of your life—raw, unpolished, and intensely accurate.
            </motion.p>
            
            <div className="overflow-hidden mt-16 mb-6">
              <motion.h3 variants={itemVariants} className="font-display text-3xl font-bold uppercase tracking-tighter text-on-surface">Our Approach</motion.h3>
            </div>
            <motion.ul variants={itemVariants} className="list-disc pl-6 mb-12 text-lg text-on-surface-variant space-y-4">
              <li>No sugarcoating: The stars do not care about your ego.</li>
              <li>Data-driven mysticism: We treat natal charts as complex datasets.</li>
              <li>Actionable strategy: We don't just predict; we prepare you.</li>
            </motion.ul>

            <div className="overflow-hidden mt-16 mb-6">
              <motion.h3 variants={itemVariants} className="font-display text-3xl font-bold uppercase tracking-tighter text-on-surface">Credentials</motion.h3>
            </div>
            
            <motion.div variants={containerVariants} className="flex flex-col gap-4">
              <motion.div variants={itemVariants} className="flex justify-between border-b-2 border-surface-container-low pb-4">
                <span className="font-mono text-on-surface-variant">Certification</span>
                <span className="font-body font-bold text-on-surface">Vedic Astrology (Jyotish)</span>
              </motion.div>
              <motion.div variants={itemVariants} className="flex justify-between border-b-2 border-surface-container-low pb-4">
                <span className="font-mono text-on-surface-variant">Experience</span>
                <span className="font-body font-bold text-on-surface">10+ Years Reading</span>
              </motion.div>
              <motion.div variants={itemVariants} className="flex justify-between border-b-2 border-surface-container-low pb-4">
                <span className="font-mono text-on-surface-variant">Location</span>
                <span className="font-body font-bold text-on-surface">Delhi & Online</span>
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-16">
              <Button variant="primary" onClick={() => window.location.href='/booking'}>Schedule a consultation</Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
