import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
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

export function Contact() {
  const { isLoaded } = useUI();
  return (
    <div className="flex flex-col flex-grow bg-surface">
      <section className="px-6 lg:px-24 py-32 bg-surface-container-lowest text-on-surface">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <motion.div 
            className="lg:col-span-6 sticky top-32"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="overflow-hidden mb-8">
              <motion.span variants={itemVariants} className="font-mono text-primary font-bold tracking-[0.2em] uppercase block">Inquiries</motion.span>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1 
                variants={itemVariants}
                className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none"
              >
                Reach<br />Out
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-16">
              <motion.p variants={itemVariants} className="font-body text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed">
                Not ready to book? Request a callback from our team. We'll answer any questions about our methodology and approach.
              </motion.p>
            </div>
            
            <motion.div variants={containerVariants} className="space-y-8 font-mono text-sm tracking-widest uppercase text-on-surface-variant mt-16">
              <motion.div variants={itemVariants}>
                <span className="text-on-surface block mb-2 font-bold">Location</span>
                New Delhi, India
              </motion.div>
              <motion.div variants={itemVariants}>
                <span className="text-on-surface block mb-2 font-bold">Email</span>
                truth@kosmicalign.com
              </motion.div>
              <motion.div variants={itemVariants}>
                <span className="text-on-surface block mb-2 font-bold">Hours</span>
                Monday - Friday, 10am - 6pm IST
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-6"
            initial={{ opacity: 0, x: 50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }}
          >
            <div className="bg-surface p-8 lg:p-12 shadow-ambient space-y-8 border-t-4 border-primary">
              <h2 className="font-display text-4xl font-bold uppercase tracking-tighter mb-12">Request Callback</h2>
              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert("Request received. We will contact you soon."); }}>
                <div>
                  <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Full Name</label>
                  <Input placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Phone Number</label>
                  <Input type="tel" placeholder="+91 98765 43210" required />
                </div>
                <div>
                  <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Preferred Callback Time (IST)</label>
                  <Input type="time" required />
                </div>
                <div>
                  <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Reason for Contact</label>
                  <Textarea placeholder="What would you like to discuss?" required />
                </div>
                
                <div className="pt-8">
                  <Button variant="primary" type="submit" className="w-full">Submit Request</Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
