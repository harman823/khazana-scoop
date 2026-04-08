import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Moon } from "lucide-react";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Hold the loading screen for 2.4s to let the cinematic animations play
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const text = "KosmicAlign";
  const letters = Array.from(text);

  // Cinematic sequence: 60-120ms stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#FFF5EA] flex flex-col items-center justify-center overflow-hidden"
      initial={{ y: 0 }}
      // Sliding mask exit feeling (translates up smoothly)
      exit={{ 
        y: "-100%", 
        transition: { 
          duration: 1, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1 
        } 
      }}
    >
      {/* Soft inertial ambient background blobs */}
      <motion.div
        className="absolute w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-[#E5BE90] rounded-full blur-[120px] opacity-20 pointer-events-none"
        animate={{ 
          x: ["-5%", "5%", "-5%"], 
          y: ["-5%", "5%", "-5%"] 
        }}
        transition={{ duration: 12, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-[#E84C3D] rounded-full blur-[120px] opacity-20 pointer-events-none mix-blend-multiply"
        animate={{ 
          x: ["5%", "-5%", "5%"], 
          y: ["5%", "-5%", "5%"] 
        }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Soft inertial movement for icon */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <Moon className="w-12 h-12 md:w-16 md:h-16 text-[#E84C3D]" strokeWidth={1.5} />
        </motion.div>

        {/* Character stagger reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex font-serif text-4xl md:text-5xl text-[#585858] font-semibold tracking-tight"
        >
          {letters.map((letter, index) => (
            <motion.div key={index} variants={letterVariants}>
              {letter}
            </motion.div>
          ))}
        </motion.div>

        {/* Minimalist Progress Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-32 h-[2px] bg-[#E5BE90]/30 mt-8 origin-left overflow-hidden rounded-full"
        >
          <motion.div 
            className="h-full bg-[#E84C3D]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
            style={{ originX: 0 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}