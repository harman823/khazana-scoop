import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(88,88,88,0.1)] w-80 mb-4 overflow-hidden border border-[#FFF5EA]"
          >
            {/* Header */}
            <div className="bg-[#E84C3D] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg leading-tight">KosmicAlign</h3>
                  <p className="text-xs text-white/80">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-6 bg-[#FFF5EA]/50 h-64 overflow-y-auto flex flex-col gap-4">
              <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-[#E5BE90]/20 text-sm text-[#585858]">
                Namaste 🙏 I'm here to guide you toward inner alignment.
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-[#E5BE90]/20 text-sm text-[#585858]">
                Are you feeling stuck or seeking clarity? Book a session with me to explore your path.
              </div>
            </div>

            {/* Footer / CTA */}
            <div className="p-5 bg-white border-t border-[#E5BE90]/20">
              <Link 
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-[#E84C3D] text-white rounded-full text-sm font-semibold hover:bg-[#C0392B] transition-colors flex items-center justify-center gap-2"
              >
                Book a Session Now <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#E84C3D] text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(232,76,61,0.4)] hover:bg-[#C0392B] hover:scale-105 transition-all duration-300"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>
    </div>
  );
}
