import React from "react";
import { motion } from "motion/react";
import { ClipboardList, Instagram, MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc0-_Q7dRxEdjSYo0Q_39y3RbKJk3lzHgTwh5Fvh3RVctmh8Q/viewform?usp=send_form";
const INSTAGRAM_URL =
  "https://www.instagram.com/kosmicalign?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export function Contact() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-24 pt-20">
      <section className="text-center max-w-3xl mx-auto">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md text-[#7A7A7A] font-medium text-sm mb-8 shadow-sm">
          <MessageCircle className="w-4 h-4 text-[#E5BE90]" />
          Get in Touch
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-semibold text-[#585858] leading-tight mb-6">
          We're Here to Listen
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg text-[#7A7A7A] leading-relaxed">
          Whether you have a question about our services or need help booking your session, we are just a message away. Let us guide you to the right path.
        </motion.p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E5BE90]/20 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div variants={itemVariants} className="space-y-12 relative z-10">
          <div className="bg-white rounded-[3rem] p-10 shadow-[0_8px_32px_rgba(88,88,88,0.02)]">
            <h3 className="text-3xl font-serif font-semibold text-[#585858] mb-8">Request a Callback</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#585858] mb-2">Name</label>
                <input
                  type="text"
                  className="w-full bg-[#FFF5EA] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#E84C3D]/30 transition-all text-[#585858]"
                  placeholder="Your Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#585858] mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-[#FFF5EA] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#E84C3D]/30 transition-all text-[#585858]"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#585858] mb-2">How can we help?</label>
                <textarea
                  rows={4}
                  className="w-full bg-[#FFF5EA] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#E84C3D]/30 transition-all resize-none text-[#585858]"
                  placeholder="Briefly describe your inquiry..."
                ></textarea>
              </div>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#E84C3D] hover:bg-[#C0392B] text-white rounded-full text-lg font-semibold hover:shadow-[0_12px_40px_rgba(117,162,158,0.2)] transition-all flex items-center justify-center gap-2"
              >
                Send Request <Send className="w-5 h-5" />
              </a>
            </form>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-8 relative z-10 flex flex-col justify-center">
          <div className="bg-[#FDEBD0] rounded-[3rem] p-10 flex items-start gap-6 border border-white/50">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-[#E84C3D]" />
            </div>
            <div>
              <h4 className="text-2xl font-serif font-semibold text-[#585858] mb-2">WhatsApp Support</h4>
              <p className="text-[#7A7A7A] mb-4">Fastest way to get answers and quick guidance.</p>
              <a href="#" className="text-[#E84C3D] font-semibold hover:underline">+91 98765 43210</a>
            </div>
          </div>
          
          <div className="bg-[#FDF3E6] rounded-[3rem] p-10 flex items-start gap-6 border border-white/50">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-[#E5BE90]" />
            </div>
            <div>
              <h4 className="text-2xl font-serif font-semibold text-[#585858] mb-2">Email Us</h4>
              <p className="text-[#7A7A7A] mb-4">For corporate events, press, or detailed inquiries.</p>
              <a href="mailto:hello@kosmicalign.com" className="text-[#E84C3D] font-semibold hover:underline">hello@kosmicalign.com</a>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-[3rem] p-10 flex items-start gap-6 border border-black/5 hover:shadow-[0_12px_40px_rgba(88,88,88,0.08)] transition-all"
          >
            <div className="w-14 h-14 bg-[#FFF5EA] rounded-full flex items-center justify-center shrink-0">
              <Instagram className="w-6 h-6 text-[#E84C3D]" />
            </div>
            <div>
              <h4 className="text-2xl font-serif font-semibold text-[#585858] mb-2">Instagram</h4>
              <p className="text-[#7A7A7A] mb-4">Daily affirmations, updates, and behind-the-scenes moments.</p>
              <span className="text-[#E84C3D] font-semibold hover:underline">@kosmicalign</span>
            </div>
          </a>

          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FDEBD0] rounded-[3rem] p-10 flex items-start gap-6 border border-white/50 hover:shadow-[0_12px_40px_rgba(88,88,88,0.08)] transition-all"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6 text-[#E84C3D]" />
            </div>
            <div>
              <h4 className="text-2xl font-serif font-semibold text-[#585858] mb-2">Google Form</h4>
              <p className="text-[#7A7A7A] mb-4">Share your details and preferred support needs directly with us.</p>
              <span className="text-[#E84C3D] font-semibold hover:underline">Open Form</span>
            </div>
          </a>
          
          <div className="bg-white rounded-[3rem] p-10 flex items-start gap-6 border border-black/5">
            <div className="w-14 h-14 bg-[#FFF5EA] rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-[#E5BE90]" />
            </div>
            <div>
              <h4 className="text-2xl font-serif font-semibold text-[#585858] mb-2">Visit Us in Delhi</h4>
              <p className="text-[#7A7A7A] mb-4 leading-relaxed">
                KosmicAlign Wellness Studio<br />
                South Extension, Part II<br />
                New Delhi, 110049
              </p>
              <a href="#" className="text-[#E84C3D] font-semibold hover:underline">Get Directions</a>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
