import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Star, Clock, MapPin, Globe, Sparkles, Heart, Info } from "lucide-react";
import { fetchServices } from "../../lib/api";
import { FALLBACK_SERVICES, REGISTRATION_PRICE, getServicePriceUnit, normalizeServicesResponse } from "../../lib/services";

const AESTHETICS = [
  { icon: Star, bg: "bg-[#FDF3E6]", accent: "text-[#E5BE90]" },
  { icon: Sparkles, bg: "bg-[#FDEBD0]", accent: "text-[#E84C3D]" },
  { icon: Heart, bg: "bg-[#FFF5EA]", accent: "text-[#E5BE90]" },
  { icon: Clock, bg: "bg-white", accent: "text-[#E84C3D]" },
];

export function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then((res) => {
        setServices(normalizeServicesResponse(res));
      })
      .catch((err) => {
        console.error("Failed to load services", err);
        setServices(FALLBACK_SERVICES);
      })
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-24 pt-20">
      <section className="text-center max-w-3xl mx-auto">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md text-[#7A7A7A] font-medium text-sm mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#E5BE90]" />
          My Offerings
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-semibold text-[#585858] leading-tight mb-6">
          Find the Right Path <br /> for You
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg text-[#7A7A7A] leading-relaxed">
          I offer structured counselling and therapy sessions designed to meet you exactly where you are, with one-on-one support for healing, clarity, and alignment.
        </motion.p>
      </section>

      <motion.section variants={itemVariants} className="bg-white rounded-[2rem] border border-[#E5BE90]/30 p-6 md:p-8 shadow-[0_8px_32px_rgba(88,88,88,0.02)]">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-[#585858]">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#E84C3D] mt-1 shrink-0" />
            <div>
              <p className="font-semibold">Each session would be of 1½ hr.</p>
              <p className="text-[#7A7A7A] mt-1">Number of sessions may vary for each client.</p>
            </div>
          </div>
          <div className="rounded-full bg-[#FFF5EA] px-5 py-3 text-sm font-semibold text-[#585858]">
            Registration charges: ₹{REGISTRATION_PRICE} per head, one-time
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-1 md:col-span-2 text-center text-[#7A7A7A] py-12">Loading offerings...</div>
        ) : services.map((service, idx) => {
          const aesthetic = AESTHETICS[idx % AESTHETICS.length];
          const Icon = aesthetic.icon;
          return (
            <motion.div
              key={service.id || idx}
              variants={itemVariants}
              className={`${aesthetic.bg} p-10 md:p-12 rounded-[3rem] border border-black/5 shadow-[0_8px_32px_rgba(88,88,88,0.02)] flex flex-col h-full hover:shadow-[0_12px_48px_rgba(88,88,88,0.05)] transition-shadow duration-500`}
            >
              <div className="flex items-start justify-between gap-6 mb-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <Icon className={`w-8 h-8 ${aesthetic.accent}`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-serif font-semibold text-[#585858] mb-1">₹{service.price}</div>
                  <div className="text-xs text-[#7A7A7A] font-semibold uppercase tracking-wider mb-2">{getServicePriceUnit(service.title)}</div>
                  <div className="flex items-center justify-end gap-1 text-sm text-[#7A7A7A] font-medium">
                    <Clock className="w-4 h-4" /> {service.durationMin} mins
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-3xl font-serif font-semibold text-[#585858] mb-4">{service.title}</h3>
                <p className="text-lg text-[#7A7A7A] mb-8 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mb-10">
                  <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-xs font-semibold text-[#585858] flex items-center gap-1.5 border border-black/5">
                    {service.sessionMode === "OFFLINE" ? <MapPin className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                    {service.sessionMode === "OFFLINE" ? "In-person" : "Online Only"}
                  </div>
                  <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-xs font-semibold text-[#585858] border border-black/5">
                    Registration ₹{REGISTRATION_PRICE} one-time
                  </div>
                </div>
              </div>

              <Link
                to={`/booking?service=${service.id}`}
                className="w-full text-center px-8 py-4 bg-[#E84C3D] text-white rounded-full text-lg font-semibold hover:bg-[#C0392B] hover:shadow-[0_12px_40px_rgba(117,162,158,0.2)] transition-all transform hover:-translate-y-1"
              >
                Book Session
              </Link>
            </motion.div>
          );
        })}
      </section>

    </motion.div>
  );
}
