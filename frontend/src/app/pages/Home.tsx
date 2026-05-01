import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Star, Heart, Sun, MapPin, Globe, Sparkles, User, Calendar, MessageCircle } from "lucide-react";
import { fetchServices } from "../../lib/api";
import { FALLBACK_SERVICES, normalizeServicesResponse } from "../../lib/services";
import { InstagramFeed } from "../components/InstagramFeed";

const fallingLeaves = [
  { x: "72%", y: "19%", size: 18, delay: 0, rotate: -24 },
  { x: "82%", y: "27%", size: 14, delay: 0.8, rotate: 18 },
  { x: "93%", y: "18%", size: 16, delay: 1.4, rotate: -10 },
  { x: "67%", y: "37%", size: 12, delay: 1.1, rotate: 32 },
  { x: "87%", y: "45%", size: 15, delay: 0.4, rotate: -34 },
  { x: "75%", y: "54%", size: 13, delay: 1.8, rotate: 16 },
];

function HeroTreeIllustration() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.svg
        viewBox="0 0 1100 620"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-y-0 right-[-8%] h-full w-[94%] min-w-[720px] opacity-95"
        initial={{ opacity: 0, x: 36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <pattern id="hero-bark-lines" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 4 C6 0 12 8 18 4 M0 12 C6 8 12 16 18 12" fill="none" stroke="#EEE5D3" strokeWidth="2" />
          </pattern>
          <filter id="soft-leaf-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#2E2455" floodOpacity="0.12" />
          </filter>
        </defs>

        <g filter="url(#soft-leaf-shadow)" opacity="0.96">
          <circle cx="520" cy="-38" r="150" fill="#32115F" />
          <circle cx="670" cy="-16" r="170" fill="#3C146D" />
          <circle cx="830" cy="-22" r="158" fill="#32115F" />
          <circle cx="980" cy="16" r="152" fill="#3C146D" />
          <circle cx="735" cy="82" r="132" fill="#32115F" />
          <circle cx="900" cy="108" r="122" fill="#3C146D" />
          <circle cx="560" cy="88" r="118" fill="#3C146D" />
        </g>

        <g opacity="0.82">
          {Array.from({ length: 95 }).map((_, index) => {
            const cx = 450 + ((index * 73) % 610);
            const cy = -12 + ((index * 41) % 180);
            const rx = 6 + (index % 5);
            const angle = (index * 29) % 180;

            return (
              <ellipse
                key={index}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={rx * 1.85}
                transform={`rotate(${angle} ${cx} ${cy})`}
                fill={index % 3 === 0 ? "#FFFFFF" : "#4B1B7D"}
                opacity={index % 3 === 0 ? 0.92 : 0.78}
              />
            );
          })}
        </g>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M920 -30 C946 62 936 148 900 230 C875 287 865 352 900 455 C918 511 920 566 906 634" stroke="#615333" strokeWidth="70" />
          <path d="M920 -30 C946 62 936 148 900 230 C875 287 865 352 900 455 C918 511 920 566 906 634" stroke="url(#hero-bark-lines)" strokeWidth="70" />

          <path d="M877 242 C760 208 664 172 582 58" stroke="#615333" strokeWidth="58" />
          <path d="M877 242 C760 208 664 172 582 58" stroke="url(#hero-bark-lines)" strokeWidth="58" />

          <path d="M750 191 C674 228 608 266 536 304" stroke="#615333" strokeWidth="42" />
          <path d="M750 191 C674 228 608 266 536 304" stroke="url(#hero-bark-lines)" strokeWidth="42" />

          <path d="M926 155 C1010 136 1060 91 1118 20" stroke="#615333" strokeWidth="52" />
          <path d="M926 155 C1010 136 1060 91 1118 20" stroke="url(#hero-bark-lines)" strokeWidth="52" />

          <path d="M663 128 C622 92 585 54 554 -18" stroke="#615333" strokeWidth="44" />
          <path d="M663 128 C622 92 585 54 554 -18" stroke="url(#hero-bark-lines)" strokeWidth="44" />
        </g>
      </motion.svg>

      {fallingLeaves.map((leaf, index) => (
        <motion.span
          key={index}
          className="absolute block rounded-[70%_0_70%_0] bg-[#3B126D]"
          style={{ left: leaf.x, top: leaf.y, width: leaf.size, height: leaf.size * 0.55, rotate: leaf.rotate }}
          animate={{
            x: [0, index % 2 ? -14 : 18, index % 2 ? 10 : -8, 0],
            y: [0, 16, 34, 48],
            rotate: [leaf.rotate, leaf.rotate + 18, leaf.rotate - 14, leaf.rotate + 8],
            opacity: [0.15, 0.9, 0.72, 0.15],
          }}
          transition={{
            duration: 6.2 + index * 0.35,
            delay: leaf.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-white via-white/95 to-white/20" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </div>
  );
}

export function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
  };

  const [dbServices, setDbServices] = useState<any[]>([]);

  useEffect(() => {
    fetchServices()
      .then((res) => setDbServices(normalizeServicesResponse(res)))
      .catch(() => setDbServices(FALLBACK_SERVICES));
  }, []);

  const servicesData = [
    {
      title: "Individual Therapy Sessions",
      desc: "One-on-one customised therapy for personal healing, emotional clarity, and inner alignment.",
      icon: User,
      bg: "bg-[#FDF3E6]", // Light Sand
      image: "/img/services/individual-therapy-relatable.png",
    },
    {
      title: "Adolescence Counselling",
      desc: "A safe, understanding space for teenagers to process emotions, change, and identity.",
      icon: Star,
      bg: "bg-[#FDEBD0]", // Light Orange
      image: "/img/services/adolescence-counselling-relatable.png",
    },
    {
      title: "Emotional Counselling",
      desc: "Compassionate support for understanding, processing, and healing difficult emotions.",
      icon: Heart,
      bg: "bg-[#FDF3E6]", // Light Sand
      image: "/img/services/emotional-counselling-relatable.png",
    },
    {
      title: "Relationship Counselling",
      desc: "Guidance for communication, attachment patterns, and healthier connection.",
      icon: MessageCircle,
      bg: "bg-[#FDEBD0]", // Light Orange
      image: "/img/services/relationship-counselling-relatable.png",
    },
    {
      title: "Issues Related to Repetitive Patterns in Life",
      desc: "Observe visible and hidden patterns, connect missing links, and begin resolving cycles.",
      icon: Sparkles,
      bg: "bg-[#FDF3E6]", // Light Sand
      image: "/img/services/repetitive-patterns-relatable.png",
    },
    {
      title: "Feeling 'Stuck in Life'",
      desc: "Therapeutic guidance for moments when life feels stagnant, unclear, or disconnected.",
      icon: Sun,
      bg: "bg-[#FDEBD0]", // Light Orange
      image: "/img/services/stuck-in-life-relatable.png",
    },
    {
      title: "Intergenerational Trauma Therapy",
      desc: "Structured work with inherited trauma, ancestral patterns, and family imprints.",
      icon: Sparkles,
      bg: "bg-[#FDF3E6]",
      image: "/img/services/rep_therapy.png",
    },
  ];

  const toolsUsed = [
    { name: "Inner Child Therapy", desc: "Healing early emotional wounds with care and awareness." },
    { name: "Attachment Trauma Therapy", desc: "Understanding relationship imprints and rebuilding secure connection." },
    { name: "CBT techniques", desc: "Working with thoughts, emotions, and behavioral patterns." },
    { name: "NLP tools and techniques", desc: "Practical language and perception tools for inner change." },
    { name: "Customised and guided Meditations", desc: "Meditative practices shaped around the client's process." },
    { name: "Self Analysis Techniques", desc: "Structured reflection to understand triggers and life patterns." },
    { name: "Art therapy", desc: "Creative expression as a doorway into emotional material." },
    { name: "Music therapy", desc: "Using sound and music as support for regulation and expression." },
    { name: "Representative Micro Constellation Work", desc: "A focused way to observe hidden relational and family dynamics." }
  ];

  const steps = [
    { title: "Select Service", desc: "Choose the counselling or therapy support that matches your present need.", icon: User },
    { title: "Pick a Time", desc: "Find a slot that works for you via our live availability calendar.", icon: Calendar },
    { title: "Begin Journey", desc: "Join your online or in-person session and begin the work with care.", icon: MessageCircle },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-32">
      {/* Hero Section */}
      <section className="relative min-h-[86vh] flex items-center overflow-hidden bg-white mt-4 px-6 sm:px-10 md:px-20 py-20 md:py-28 shadow-[0_8px_32px_rgba(88,88,88,0.02)]">
        <HeroTreeIllustration />

        <div className="relative z-10 max-w-[46rem]">
          <motion.p variants={itemVariants} className="mb-6 text-sm font-medium tracking-[0.08em] uppercase text-[#6C5B32]">
            Holistic Guidance Counsellor
          </motion.p>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold text-[#171717] leading-[1.06] mb-7">
            Here to help you navigate life's tough moments
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg text-[#313131] mb-4 max-w-xl leading-relaxed">
            At KosmicAlign, therapy is a process of aligning the mind, body, and spirit with structured, one-on-one support created around your life story.
          </motion.p>

          <motion.p variants={itemVariants} className="text-lg font-serif text-[#171717] mb-9">
            You do not have to move through it alone.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Link to="/booking" className="w-full sm:w-auto px-7 py-3.5 bg-white text-[#171717] rounded-full text-base font-semibold transition-all border border-[#171717] hover:bg-[#171717] hover:text-white flex items-center justify-center gap-2">
              Book Your Session <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/services" className="w-full sm:w-auto px-2 py-3.5 text-[#171717] text-base font-semibold hover:text-[#4B2B83] transition-all flex items-center justify-center gap-2">
              Explore Services <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-serif font-semibold text-[#585858] mb-4">
            Our Core Services
          </motion.h2>
          <motion.p variants={itemVariants} className="text-[#7A7A7A] max-w-xl mx-auto text-lg">
            Compassionate, structured guidance tailored to your unique emotional and psychological footprint.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, idx) => {
            const dbService = dbServices.find(s => s.title === service.title);
            const bookingLink = dbService ? `/booking?service=${dbService.id}` : "/booking";

            return (
            <motion.div key={service.title} variants={itemVariants} whileHover={{ y: -8 }} className={`rounded-[2rem] overflow-hidden ${service.bg} group flex flex-col h-full shadow-sm`}>
              <div className="h-56 overflow-hidden relative">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-70 grayscale saturate-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 group-hover:saturate-100" />
                <div className="absolute inset-0 bg-white/20 transition-opacity duration-700 group-hover:opacity-0" />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between bg-white/60 backdrop-blur-sm">
                <div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <service.icon className="w-6 h-6 text-[#E84C3D]" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-[#585858] mb-3">{service.title}</h3>
                  <p className="text-[#7A7A7A] leading-relaxed mb-6">{service.desc}</p>
                </div>
                <Link to={bookingLink} className="inline-flex items-center text-[#E84C3D] font-semibold hover:gap-3 transition-all gap-2">
                  Book Session <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )})}
        </div>
      </section>

      {/* Tools Used */}
      <section className="max-w-5xl mx-auto bg-[#FDF3E6] rounded-[3rem] p-12 md:p-20 text-center shadow-inner">
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-serif font-semibold text-[#585858] mb-8">
          Therapeutic Tools & Techniques
        </motion.h2>
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
          {toolsUsed.map((tool, idx) => (
            <div key={idx} className="group relative bg-white px-6 py-3 rounded-full text-[#585858] font-medium shadow-sm hover:shadow-md transition-all border border-[#E5BE90]/30 hover:border-[#E84C3D]/50 cursor-default">
              <Sparkles className="w-4 h-4 inline-block mr-2 text-[#E84C3D]" /> {tool.name}
              
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-[#585858] text-white text-xs px-3 py-2 rounded-lg pointer-events-none z-20 shadow-lg text-center">
                {tool.desc}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-opacity-0 border-4 border-t-[#585858]"></div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="bg-white rounded-[3rem] p-12 md:p-24 shadow-[0_8px_32px_rgba(88,88,88,0.02)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-semibold text-[#585858] mb-4">How It Works</h2>
            <p className="text-[#7A7A7A] text-lg">A simple way to find alignment and confidence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-[#FFF5EA]" />
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#FFF5EA] border-4 border-white shadow-md flex items-center justify-center mb-6">
                  <step.icon className="w-10 h-10 text-[#E84C3D]" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#585858] mb-3">
                  <span className="text-[#E5BE90] mr-2">0{idx + 1}.</span>
                  {step.title}
                </h3>
                <p className="text-[#7A7A7A] max-w-[250px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In Person vs Online */}
      <section className="bg-white rounded-[3rem] p-10 md:p-20 shadow-[0_8px_32px_rgba(88,88,88,0.02)]">
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto space-y-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#585858]">
            Find Guidance Wherever You Are
          </h2>
          <p className="text-lg text-[#7A7A7A] leading-relaxed">
            Whether you prefer the grounding energy of an in-person session or the convenience of remote therapy, KosmicAlign is structured to meet you where you are.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E5BE90]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-[#E5BE90]" />
              </div>
              <div>
                <h4 className="text-xl font-serif font-semibold text-[#585858] mb-1">In-Person in Delhi</h4>
                <p className="text-[#7A7A7A]">Visit our serene wellness space in the heart of Delhi for a deeply personal, grounded experience.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E84C3D]/20 flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-[#E84C3D]" />
              </div>
              <div>
                <h4 className="text-xl font-serif font-semibold text-[#585858] mb-1">Online Worldwide</h4>
                <p className="text-[#7A7A7A]">Connect online for structured therapy sessions from the comfort of your home, anywhere in the world.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Testimonials */}
      <section className="bg-white rounded-[3rem] py-24 px-6 md:px-12 text-center relative overflow-hidden shadow-[0_8px_32px_rgba(88,88,88,0.02)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFF5EA] rounded-full blur-[100px]" />
        
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto relative z-10">
          <Heart className="w-12 h-12 text-[#E5BE90] mx-auto mb-8" />
          <h2 className="text-3xl md:text-4xl font-serif text-[#585858] font-medium leading-relaxed mb-12">
            "I've never had such a supportive experience in a session. The insight was excellent, and the professional care is unmatched. Highly recommended!"
          </h2>
        </motion.div>
      </section>
    </motion.div>
  );
}
