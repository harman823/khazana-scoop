import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Star, Heart, Sun, MapPin, Globe, Sparkles, User, Calendar, MessageCircle } from "lucide-react";
import { fetchServices } from "../../lib/api";
import { FALLBACK_SERVICES, normalizeServicesResponse } from "../../lib/services";
import { InstagramFeed } from "../components/InstagramFeed";

const fallingPetals = [
  { x: "54%", y: "49%", size: 8, delay: 0, drift: 16 },
  { x: "61%", y: "42%", size: 7, delay: 0.7, drift: -12 },
  { x: "69%", y: "47%", size: 9, delay: 1.4, drift: 18 },
  { x: "76%", y: "45%", size: 7, delay: 2.1, drift: -14 },
  { x: "84%", y: "48%", size: 8, delay: 2.8, drift: 12 },
  { x: "92%", y: "43%", size: 7, delay: 3.5, drift: -16 },
  { x: "97%", y: "40%", size: 8, delay: 4.2, drift: 14 },
];

function HeroTreeIllustration() {
  const berryClusters = [
    { x: 240, y: 390, points: [[0, 0], [24, -30], [40, -2], [60, -42], [80, -16], [96, -58]] },
    { x: 408, y: 438, points: [[0, 0], [28, -18], [48, 10], [64, -28], [84, -6]] },
    { x: 664, y: 355, points: [[0, 0], [18, -38], [44, -18], [52, -60], [80, -40], [98, -72]] },
    { x: 822, y: 390, points: [[0, 0], [26, -26], [50, -10], [66, -46], [88, -24], [106, -58]] },
    { x: 1012, y: 436, points: [[0, 0], [20, -28], [42, -4], [58, -42], [76, -18]] },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.svg
        viewBox="0 0 1240 700"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-y-0 right-[-7%] h-full w-[110%] min-w-[880px] opacity-95"
        initial={{ opacity: 0, x: 42, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <filter id="branch-shadow" x="-15%" y="-20%" width="130%" height="150%">
            <feDropShadow dx="0" dy="14" stdDeviation="11" floodColor="#5B2C17" floodOpacity="0.11" />
          </filter>
        </defs>

        <g filter="url(#branch-shadow)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-78 496 C70 476 172 438 280 460 C390 484 456 527 574 492 C684 459 772 392 884 410 C1006 430 1096 388 1288 330" stroke="#5A321F" strokeWidth="16" />
          <path d="M-60 501 C82 488 172 450 278 471 C392 494 464 530 574 501 C690 472 770 414 886 422 C1006 432 1102 401 1284 348" stroke="#7B4A2A" strokeWidth="7" opacity="0.7" />

          <path d="M128 468 C148 420 160 370 202 342 C228 326 258 315 284 289" stroke="#4D2B1B" strokeWidth="7" />
          <path d="M196 345 C195 309 205 276 234 252" stroke="#4D2B1B" strokeWidth="4.4" />
          <path d="M220 330 C246 316 266 300 278 270" stroke="#4D2B1B" strokeWidth="4.4" />
          <path d="M250 359 C292 346 326 332 360 296" stroke="#4D2B1B" strokeWidth="5.2" />
          <path d="M320 322 C318 288 330 262 354 240" stroke="#4D2B1B" strokeWidth="3.8" />

          <path d="M390 496 C410 458 432 434 474 414" stroke="#4D2B1B" strokeWidth="5.6" />
          <path d="M456 424 C454 392 468 370 494 350" stroke="#4D2B1B" strokeWidth="4.2" />
          <path d="M476 414 C500 412 524 402 548 378" stroke="#4D2B1B" strokeWidth="4.2" />

          <path d="M626 474 C640 428 654 370 690 330" stroke="#4D2B1B" strokeWidth="7" />
          <path d="M682 340 C674 294 682 260 710 230" stroke="#4D2B1B" strokeWidth="4.5" />
          <path d="M690 338 C722 312 756 288 790 246" stroke="#4D2B1B" strokeWidth="5.3" />
          <path d="M756 290 C756 260 770 234 796 214" stroke="#4D2B1B" strokeWidth="3.8" />

          <path d="M804 412 C828 376 858 344 904 320" stroke="#4D2B1B" strokeWidth="5.4" />
          <path d="M882 331 C886 294 904 266 936 244" stroke="#4D2B1B" strokeWidth="4.2" />
          <path d="M904 324 C942 318 974 300 1010 270" stroke="#4D2B1B" strokeWidth="4.8" />

          <path d="M982 410 C1010 374 1042 334 1094 304" stroke="#4D2B1B" strokeWidth="5.8" />
          <path d="M1070 318 C1084 280 1110 250 1142 226" stroke="#4D2B1B" strokeWidth="4.2" />
          <path d="M1095 304 C1146 306 1194 286 1246 248" stroke="#4D2B1B" strokeWidth="4.4" />
          <path d="M1210 272 C1242 284 1268 300 1296 326" stroke="#4D2B1B" strokeWidth="3.6" />
        </g>

        {berryClusters.map((cluster, clusterIndex) => (
          <g key={clusterIndex}>
            {cluster.points.map(([x, y], pointIndex) => (
              <motion.circle
                key={`${clusterIndex}-${pointIndex}`}
                cx={cluster.x + x}
                cy={cluster.y + y}
                r={pointIndex % 3 === 0 ? 9 : 7}
                fill={pointIndex % 2 === 0 ? "#D60E5B" : "#F04A83"}
                stroke="#FFE3EC"
                strokeWidth="2"
                initial={{ scale: 0.72, opacity: 0 }}
                animate={{ scale: [0.95, 1.08, 0.95], opacity: 1 }}
                transition={{ duration: 3.8, delay: clusterIndex * 0.18 + pointIndex * 0.08, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </g>
        ))}
      </motion.svg>

      {fallingPetals.map((petal, index) => (
        <motion.span
          key={index}
          className="absolute block rounded-full bg-[#D60E5B]"
          style={{ left: petal.x, top: petal.y, width: petal.size, height: petal.size }}
          animate={{
            x: [0, petal.drift, petal.drift * -0.35, petal.drift * 0.45],
            y: [0, 54, 118, 190],
            opacity: [0, 0.86, 0.55, 0],
            scale: [0.75, 1, 0.92, 0.72],
          }}
          transition={{
            duration: 7.2 + index * 0.22,
            delay: petal.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-y-0 left-0 w-[58%] bg-[#FFF3E4]/80" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[#FFF3E4]/70" />
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
      <section className="relative min-h-[calc(100vh-2rem)] flex items-center overflow-hidden mt-4 px-6 sm:px-10 md:px-20 py-20 md:py-28">
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
