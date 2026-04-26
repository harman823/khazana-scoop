import React from "react";
import { motion } from "motion/react";
import { Instagram } from "lucide-react";

const INSTAGRAM_URL =
  "https://www.instagram.com/kosmicalign?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export function InstagramFeed() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
  };

  const feedItems = [
    "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&q=80",
    "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=400&q=80"
  ];

  return (
    <section className="-mt-12 px-6 py-10 md:-mt-20 md:py-14">
      <div className="max-w-7xl mx-auto text-center mb-8">
        <motion.div variants={itemVariants} className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFF5EA] mb-4 shadow-sm border border-[#E5BE90]/30">
          <Instagram className="w-6 h-6 text-[#E84C3D]" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-serif font-semibold text-[#585858] mb-3">
          Follow Our Journey
        </motion.h2>
        <motion.p variants={itemVariants} className="text-[#7A7A7A] max-w-xl mx-auto text-base md:text-lg mb-6">
          Daily affirmations, insights, and behind the scenes on Instagram.
        </motion.p>
        <motion.a 
          variants={itemVariants} 
          href={INSTAGRAM_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#E84C3D] text-[#E84C3D] rounded-full font-semibold hover:bg-[#E84C3D] hover:text-white transition-all duration-300"
        >
          @KosmicAlign
        </motion.a>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {feedItems.map((img, idx) => (
          <motion.a
            key={idx}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-sm"
          >
            <img src={img} alt="Instagram feed" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Instagram className="w-10 h-10 text-white" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
