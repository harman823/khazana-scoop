import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { ManifestItem } from '../components/ManifestItem';
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

export function Home() {
  const { isLoaded } = useUI();
  return (
    <div className="flex flex-col flex-grow">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col justify-center px-6 lg:px-24 py-24 relative overflow-hidden bg-surface">
        <motion.div 
          className="z-10 max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <motion.div className="overflow-hidden mb-8" variants={itemVariants}>
            <span className="font-mono text-primary font-bold tracking-[0.2em] uppercase block">
              Clarity Awaits
            </span>
          </motion.div>
          
          <div className="overflow-hidden mb-12">
            <motion.h1 
              variants={itemVariants}
              className="font-display text-7xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.9] text-on-surface"
            >
              Kosmic<br />Align
            </motion.h1>
          </div>
          
          <motion.div className="overflow-hidden mb-16" variants={itemVariants}>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
              A brutally honest fortune telling service. We pierce through the noise to bring you unfiltered truth about your past, present, and future.
            </p>
          </motion.div>
          
          <motion.div className="flex flex-wrap gap-6" variants={itemVariants}>
            <Link to="/booking">
              <Button variant="primary">Book Session</Button>
            </Link>
            <Link to="/services">
              <Button variant="secondary">View Services</Button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Asymmetrical Image */}
        <motion.div 
          initial={{ opacity: 0, x: "10%" }}
          animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: "10%" }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[120%] bg-surface-container shadow-ambient overflow-hidden z-0 hidden lg:block"
        >
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 2.8 }}
            src="https://images.unsplash.com/photo-1770832131480-95b6169a21f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc3Ryb2xvZ3klMjBjaGFydCUyMG15c3RpY2FsfGVufDF8fHx8MTc3NDk0NzMwMnww&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Astrology Chart" 
            className="w-full h-full object-cover object-center mix-blend-multiply opacity-80 filter grayscale"
          />
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-6 lg:px-24 bg-surface-container-lowest text-on-surface overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          <motion.div 
            className="lg:col-span-4 sticky top-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scrollVariants}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-8">Offerings</h2>
            <p className="font-body text-on-surface-variant max-w-sm">
              Curated readings designed to provide clarity. In-person in Delhi or online worldwide.
            </p>
          </motion.div>
          <div className="lg:col-span-8 flex flex-col gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={scrollVariants}
            >
              <ManifestItem 
                title="Birth Chart Analysis" 
                subtitle="Deep dive into your natal chart alignments."
                price="₹5,000"
                meta="60 Minutes"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={scrollVariants}
              transition={{ delay: 0.1 }}
            >
              <ManifestItem 
                title="Tarot Reading" 
                subtitle="Specific answers to pressing questions."
                price="₹3,000"
                meta="30 Minutes"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={scrollVariants}
              transition={{ delay: 0.2 }}
            >
              <ManifestItem 
                title="Past Life Regression" 
                subtitle="Uncover karmic patterns from previous incarnations."
                price="₹10,000"
                meta="90 Minutes"
              />
            </motion.div>
            
            <motion.div 
              className="mt-8 flex justify-end"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/services">
                <Button variant="ghost" className="text-primary hover:bg-surface hover:text-primary-dark">Full Manifest →</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Asymmetrical "The Medium" Section */}
      <section className="py-40 px-6 lg:px-24 bg-surface text-on-surface relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div 
            className="lg:col-span-5 lg:col-start-2 z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scrollVariants}
          >
            <div className="bg-surface-container-low p-12 shadow-ambient relative">
              <span className="font-mono text-xs tracking-widest uppercase text-on-surface-variant block mb-6">01 — The Medium</span>
              <h3 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-8 leading-[0.9]">
                Divination<br/> Without<br/> Delusion
              </h3>
              <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-8">
                The modern spiritual industry is built on comfort and vague assurances. Kosmic Align strips the industry down to its rawest material: truth. Expect sharp observations and unapologetic guidance.
              </p>
              <Link to="/about">
                <Button variant="secondary" className="border-on-surface">Meet The Reader</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-6 lg:col-start-6 mt-12 lg:mt-0 -ml-8 lg:-ml-24"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="aspect-[4/5] bg-surface-container-highest overflow-hidden relative shadow-ambient">
              <img 
                src="https://images.unsplash.com/photo-1518118014377-ce9e35b71900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXJvdCUyMGNhcmRzfGVufDF8fHx8MTc3NDk0NzMwMnww&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Tarot Cards" 
                className="w-full h-full object-cover mix-blend-multiply opacity-90 filter grayscale"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 px-6 lg:px-24 bg-surface-container-low text-on-surface relative overflow-hidden">
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          <motion.div className="overflow-hidden" variants={itemVariants}>
            <h2 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-12">The Raw Truth</h2>
          </motion.div>
          <motion.div className="overflow-hidden" variants={itemVariants}>
            <p className="font-body text-2xl leading-relaxed text-on-surface-variant mb-12">
              We don't sugarcoat the stars. Our approach is grounded in the reality of your cosmic blueprint, stripping away the mystical fluff to deliver actionable insights.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link to="/booking">
              <Button variant="primary">Begin Your Journey</Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
