import React from "react";
import { motion } from "motion/react";
import { Award, BookOpen, Star, Heart } from "lucide-react";

export function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-32">
      {/* Hero */}
      <section className="text-center pt-20 pb-16">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md text-[#7A7A7A] font-medium text-sm mb-8 shadow-sm">
          <Star className="w-4 h-4 text-[#E5BE90]" />
          About Me
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-semibold text-[#585858] leading-tight mb-8">
          Guiding You Toward <br /> Inner Alignment
        </motion.h1>
      </section>

      {/* Personal Story & Image */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="relative">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative z-10 shadow-[0_8px_32px_rgba(88,88,88,0.05)]">
            <img
              src="https://images.unsplash.com/photo-1631962590420-077084e3dedc?w=800&q=80"
              alt="Serene meditation"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-1/2 -right-12 w-64 h-64 bg-[#E84C3D] opacity-20 rounded-full blur-[80px] z-0" />
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-8 pr-0 md:pr-12 relative z-10">
          <h2 className="text-4xl font-serif font-semibold text-[#585858]">My Journey</h2>
          <p className="text-lg text-[#7A7A7A] leading-relaxed">
            I believe that everyone has an innate compass—a deep-seated intuition that points toward their highest good. For over a decade, I have dedicated myself to helping individuals quiet the noise of modern life and tune back into that subtle, powerful frequency.
          </p>
          <p className="text-lg text-[#7A7A7A] leading-relaxed">
            My journey began in the vibrant chaos of Delhi, where the interplay of ancient traditions and modern struggles sparked my curiosity. Through rigorous study of astrology and tarot, I found profound tools for healing and clarity. Today, KosmicAlign is a sanctuary for those seeking trusted, authentic spiritual guidance.
          </p>
          <div className="pt-6">
            <div className="text-[#585858] font-serif text-2xl italic font-medium">"Making sure you live your life to the fullest."</div>
            <div className="text-[#7A7A7A] text-sm mt-2">— Founder, KosmicAlign</div>
          </div>
        </motion.div>
      </section>

      {/* Methodology & Philosophy */}
      <section className="bg-white rounded-[3rem] p-12 md:p-24 shadow-[0_8px_32px_rgba(88,88,88,0.02)] max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E5BE90]/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="w-16 h-16 bg-[#FFF5EA] rounded-full flex items-center justify-center border border-[#E5BE90]/30">
              <Heart className="w-8 h-8 text-[#E5BE90]" />
            </div>
            <h3 className="text-3xl font-serif font-semibold text-[#585858]">My Philosophy</h3>
            <p className="text-[#7A7A7A] leading-relaxed text-lg">
              Spiritual care is a right, not a privilege. Anyone who needs guidance should have access to it. I approach every reading with empathy, zero judgment, and a commitment to helping you uncover your own inner truth. My style is less "fortune-telling" and more "soul-illuminating."
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="w-16 h-16 bg-[#FFF5EA] rounded-full flex items-center justify-center border border-[#E5BE90]/30">
              <BookOpen className="w-8 h-8 text-[#E84C3D]" />
            </div>
            <h3 className="text-3xl font-serif font-semibold text-[#585858]">Methodology</h3>
            <p className="text-[#7A7A7A] leading-relaxed text-lg">
              Combining intuitive tarot pulls with the exact mathematics of astrology, my sessions are structured to provide both immediate clarity and long-term strategic insight. I translate abstract cosmic themes into practical, actionable steps for your everyday life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience / Certifications */}
      <section className="max-w-4xl mx-auto text-center space-y-16">
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl font-serif font-semibold text-[#585858] mb-4">Credentials & Trust</h2>
          <p className="text-lg text-[#7A7A7A] max-w-2xl mx-auto">
            Grounded in years of dedicated study and thousands of hours of client practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { number: "10+", label: "Years Experience", color: "text-[#E84C3D]", bg: "bg-[#FDEBD0]" },
            { number: "3,500+", label: "Readings Completed", color: "text-[#585858]", bg: "bg-white shadow-sm" },
            { number: "Certified", label: "Astrologer & Tarot Reader", color: "text-[#E5BE90]", bg: "bg-[#FDF3E6]" },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className={`${stat.bg} p-8 rounded-[2rem] border border-transparent hover:border-[#E5BE90]/40 transition-colors`}>
              <div className={`text-4xl font-serif font-semibold mb-2 ${stat.color}`}>{stat.number}</div>
              <div className="text-[#7A7A7A] text-sm font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}