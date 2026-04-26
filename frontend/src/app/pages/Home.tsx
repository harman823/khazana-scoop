import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Star, Heart, Sun, MapPin, Globe, Sparkles, User, Calendar, MessageCircle, HelpCircle } from "lucide-react";
import { fetchServices } from "../../lib/api";
import { InstagramFeed } from "../components/InstagramFeed";

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
    fetchServices().then(res => setDbServices(res.data || res)).catch(console.error);
  }, []);

  const servicesData = [
    {
      title: "Individual Therapy",
      desc: "One-on-one sessions tailored to your unique journey and emotional needs.",
      icon: User,
      bg: "bg-[#FDF3E6]", // Light Sand
      image: "/img/services/ind_therapy.png",
    },
    {
      title: "Adolescence Counselling",
      desc: "Providing a safe, understanding space for teenagers to navigate challenges.",
      icon: Star,
      bg: "bg-[#FDEBD0]", // Light Orange
      image: "/img/services/adol_therapy.png",
    },
    {
      title: "Emotional Counselling",
      desc: "Compassionate support for processing and healing difficult emotions.",
      icon: Heart,
      bg: "bg-[#FDF3E6]", // Light Sand
      image: "/img/services/emo_therapy.png",
    },
    {
      title: "Relationship Counselling",
      desc: "Fostering authentic communication and healing between partners.",
      icon: MessageCircle,
      bg: "bg-[#FDEBD0]", // Light Orange
      image: "/img/services/rel_therapy.png",
    },
    {
      title: "Repetitive Patterns",
      desc: "Identify and resolve deeply ingrained cycles holding you back.",
      icon: Sparkles,
      bg: "bg-[#FDF3E6]", // Light Sand
      image: "/img/services/rep_therapy.png",
    },
    {
      title: "Feeling 'Stuck in Life'",
      desc: "Find your direction and regain momentum when life feels stagnant.",
      icon: Sun,
      bg: "bg-[#FDEBD0]", // Light Orange
      image: "/img/services/stuck_therapy.png",
    },
  ];

  const toolsUsed = [
    { name: "NLP Tools & Techniques", desc: "Reprogramming neural pathways to improve communication and habits." },
    { name: "CBT Techniques", desc: "Restructuring negative thought patterns into positive behaviors." },
    { name: "Micro Constellation Work", desc: "Visualizing and resolving hidden family dynamics and entanglements." },
    { name: "Attachment Trauma Therapy", desc: "Rebuilding secure relational bonds by addressing past traumas." },
    { name: "Inner Child Therapy", desc: "Healing early emotional wounds to nurture a healthy adult self." },
    { name: "Intergenerational Trauma Therapy", desc: "Healing inherited traumas passed down through family lines." },
    { name: "Self Analysis", desc: "Empowering introspection to understand personal emotional triggers." },
    { name: "Guided Meditations", desc: "Deep relaxation practices to center the mind and spirit." },
    { name: "Art Therapy", desc: "Expressive healing through creative visual mediums." }
  ];

  const steps = [
    { title: "Select Service", desc: "Choose from our curated list of spiritual and life guidance services.", icon: User },
    { title: "Pick a Time", desc: "Find a slot that works for you via our live availability calendar.", icon: Calendar },
    { title: "Begin Journey", desc: "Join your online or in-person session and find your clarity.", icon: MessageCircle },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-32">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center rounded-[3rem] overflow-hidden bg-white mt-4 px-6 md:px-20 py-20 shadow-[0_8px_32px_rgba(88,88,88,0.02)]">
        <div className="absolute inset-0 opacity-10">
          <img src="/img/stones_healing.png" alt="Moon sky pastel" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF5EA] text-[#7A7A7A] font-medium text-sm mb-8 shadow-sm">
            <Star className="w-4 h-4 text-[#E5BE90]" />
            Trusted Spiritual Advisor
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-semibold text-[#585858] leading-tight mb-8">
            Here to Help You Navigate <br className="hidden md:block" /> Life's Tough Moments
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-[#7A7A7A] mb-12 max-w-2xl mx-auto leading-relaxed">
            At KosmicAlign, we believe that true well-being is achieved through a harmonious balance of mind, body, and spirit. Book your premium reading today.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/booking" className="w-full sm:w-auto px-8 py-4 bg-[#E84C3D] text-white rounded-full text-lg font-semibold hover:bg-[#C0392B] hover:shadow-[0_12px_40px_rgba(117,162,158,0.3)] transition-all duration-200 ease-out transform hover:scale-[1.02] flex items-center justify-center gap-2">
              Book Your Reading <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/services" className="w-full sm:w-auto px-8 py-4 bg-white text-[#585858] rounded-full text-lg font-semibold hover:bg-[#FFF5EA] transition-all border border-[#7A7A7A]/10">
              Explore Services
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
            Compassionate, expert guidance tailored to your unique psychological and emotional footprint.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, idx) => {
            const dbService = dbServices.find(s => s.title === service.title);
            const bookingLink = dbService ? `/booking?service=${dbService.id}` : "/booking";

            return (
            <motion.div key={service.title} variants={itemVariants} whileHover={{ y: -8 }} className={`rounded-[2rem] overflow-hidden ${service.bg} group flex flex-col h-full shadow-sm`}>
              <div className="h-56 overflow-hidden relative">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#585858]/30 to-transparent" />
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
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div variants={itemVariants} className="space-y-8 pr-0 md:pr-12">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#585858]">
            Find Guidance Wherever You Are
          </h2>
          <p className="text-lg text-[#7A7A7A] leading-relaxed">
            Whether you prefer the grounding energy of an in-person session or the convenience of remote guidance, KosmicAlign is structured to meet you where you are.
          </p>

          <div className="space-y-6">
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
                <p className="text-[#7A7A7A]">Connect via Zoom or Skype for intuitive readings from the comfort of your home, anywhere in the world.</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="relative">
          <motion.div 
            initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.05 }}
            whileInView={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[4/5] rounded-[2rem] overflow-hidden relative z-10"
          >
             <img src="/img/serene_tree.png" alt="Abstract soft watercolor" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#E5BE90] opacity-30 rounded-full blur-[80px] z-0" />
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
            "I've never had such a great experience with a reading. The insight was excellent, and the professional care is unmatched. Highly recommended!"
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 bg-[#E84C3D] rounded-full flex items-center justify-center text-white font-serif font-semibold text-xl">
              AL
            </div>
            <div className="text-left">
              <div className="font-semibold text-[#585858]">Alisha Meglio</div>
              <div className="text-sm text-[#7A7A7A]">Verified Client</div>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}