import React from "react";
import { motion } from "motion/react";
import { BookOpen, Star, Heart, Sparkles } from "lucide-react";

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
      <section className="text-center pt-20 pb-16">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md text-[#7A7A7A] font-medium text-sm mb-8 shadow-sm">
          <Star className="w-4 h-4 text-[#E5BE90]" />
          About Me
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-semibold text-[#585858] leading-tight mb-8">
          Who Am I?
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg text-[#7A7A7A] leading-relaxed max-w-3xl mx-auto">
          A seeker, holistic guidance counsellor, integrative psychotherapist, and encompassing trainer offering structured therapy for healing and alignment.
        </motion.p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="relative">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative z-10 shadow-[0_8px_32px_rgba(88,88,88,0.05)]">
            <img
              src="/img/stones_healing_alt.png"
              alt="Meditation stones"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-1/2 -right-12 w-64 h-64 bg-[#E84C3D] opacity-20 rounded-full blur-[80px] z-0" />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-8 pr-0 md:pr-12 relative z-10">
          <h2 className="text-4xl font-serif font-semibold text-[#585858]">My Journey</h2>
          <p className="text-lg text-[#7A7A7A] leading-relaxed">
            “Who am I?” was the question that began my journey as a child. I am not a spiritual master or an enlightened guru. I have always been someone in quest of the Divine for healing my own inner world of trauma, grief, and suffering.
          </p>
          <p className="text-lg text-[#7A7A7A] leading-relaxed">
            This quest led me to study the mind, body, and soul. Spirituality is the core and base of my search and study, and I deliver my learnings in the form of structured, one-on-one customised therapy.
          </p>
          <div className="pt-6">
            <div className="text-[#585858] font-serif text-2xl italic font-medium">"Harmony WithIn is Harmony WithOut."</div>
            <div className="text-[#7A7A7A] text-sm mt-2">Founder, KosmicAlign</div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white rounded-[3rem] p-12 md:p-24 shadow-[0_8px_32px_rgba(88,88,88,0.02)] max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E5BE90]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="w-16 h-16 bg-[#FFF5EA] rounded-full flex items-center justify-center border border-[#E5BE90]/30">
              <Heart className="w-8 h-8 text-[#E5BE90]" />
            </div>
            <h3 className="text-3xl font-serif font-semibold text-[#585858]">My Philosophy</h3>
            <p className="text-[#7A7A7A] leading-relaxed text-lg">
              Every client is unique. Each person perceives and absorbs trauma differently, so therapy cannot be a one-hour or one-day task. It is a process and an art in progress, involving soul work to align the mind, body, and spirit.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-8">
            <div className="w-16 h-16 bg-[#FFF5EA] rounded-full flex items-center justify-center border border-[#E5BE90]/30">
              <BookOpen className="w-8 h-8 text-[#E84C3D]" />
            </div>
            <h3 className="text-3xl font-serif font-semibold text-[#585858]">Methodology</h3>
            <p className="text-[#7A7A7A] leading-relaxed text-lg">
              My methodology is culture-sensitive and draws from Cognitive Based Therapy, Neuro Linguistic Programming, meridian channelling, Qi flow techniques, and customised meditations. I observe patterns, listen for missing links, and work with the client's life story.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="bg-[#FDF3E6] rounded-[3rem] p-10 md:p-12">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
            <Sparkles className="w-8 h-8 text-[#E84C3D]" />
          </div>
          <h3 className="text-3xl font-serif font-semibold text-[#585858] mb-6">Therapeutic Approach</h3>
          <p className="text-[#7A7A7A] leading-relaxed text-lg">
            Regression, intergenerational trauma work, ancestral path work, inner child work, mother and father influence impact, womb healing, traumagram, and constellations are used as essential strategies to approach core issues and their source of origin.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[#FFF5EA] rounded-[3rem] p-10 md:p-12">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
            <Heart className="w-8 h-8 text-[#E5BE90]" />
          </div>
          <h3 className="text-3xl font-serif font-semibold text-[#585858] mb-6">A Safe Space</h3>
          <p className="text-[#7A7A7A] leading-relaxed text-lg">
            KosmicAlign is a safe space for healing and alignment. My work is guided by values, ethics, knowledge, and the belief that every individual is a beautiful creation in this universe.
          </p>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto text-center space-y-16">
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl font-serif font-semibold text-[#585858] mb-4">Training & Trust</h2>
          <p className="text-lg text-[#7A7A7A] max-w-2xl mx-auto">
            Grounded in deep study, mentorship, spiritual inquiry, and customised one-on-one therapeutic practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { number: "Integrative", label: "Psychotherapist", color: "text-[#E84C3D]", bg: "bg-[#FDEBD0]" },
            { number: "Holistic", label: "Guidance Counsellor", color: "text-[#585858]", bg: "bg-white shadow-sm" },
            { number: "Structured", label: "One-on-One Therapy", color: "text-[#E5BE90]", bg: "bg-[#FDF3E6]" },
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
