"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GodavariLogo from "@/components/GodavariLogo";
import GodavariFooter from "@/components/GodavariFooter";

export default function GodavariHomePage() {
  const destinations = [
    {
      title: "Restaurant",
      descriptor: "A culinary journey of flavors.",
      href: "/menu",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Rooms",
      descriptor: "Heritage luxury stays.",
      href: "/rooms",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Sky Lounge",
      descriptor: "Elevated evening experiences.",
      href: "/sky-lounge",
      image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground"
         style={{
           backgroundImage: "url('/bg-illustration.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed',
           backgroundColor: '#F5EFE6'
         }}>

      {/* Hero Section */}
      <section 
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="flex flex-col items-center space-y-8 text-center mt-16 px-4">
          <GodavariLogo size={120} className="text-primary animate-float mix-blend-multiply" />
          
          <div className="space-y-4">
            <h1 className="font-serif text-primary text-5xl md:text-7xl tracking-[0.25em] uppercase">
              Godavari
            </h1>
            <p className="italic text-foreground text-lg md:text-xl tracking-widest font-light">
              The House of Heritage Experiences
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
            {destinations.map((dest) => (
              <Link 
                key={dest.title}
                href={dest.href}
                className="border border-primary text-primary px-8 py-3 rounded-full hover:-translate-y-1 transition-transform duration-200 shadow-md hover:shadow-lg tracking-wider text-sm uppercase bg-white/20 backdrop-blur-sm"
              >
                {dest.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Animated Chevron */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-12 text-primary opacity-70"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </motion.div>
      </section>

      {/* Three Destination Cards */}
      <section className="px-8 py-24 bg-transparent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ y: -16, scale: 1.02 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="relative h-96 rounded-2xl overflow-hidden shadow-lg border border-primary/20 flex flex-col justify-end p-8 group cursor-pointer"
                style={{
                  backgroundImage: `url(${dest.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
                
                <div className="relative z-10 space-y-3">
                  <h2 className="font-serif text-white text-3xl tracking-wide">{dest.title}</h2>
                  <p className="text-white/80 text-sm">{dest.descriptor}</p>
                  <div className="pt-2">
                    <Link href={dest.href} className="text-white uppercase tracking-widest text-xs font-bold inline-flex items-center gap-2 transition-colors group/link hover:text-primary-foreground">
                      Explore 
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <GodavariFooter />
    </div>
  );
}
