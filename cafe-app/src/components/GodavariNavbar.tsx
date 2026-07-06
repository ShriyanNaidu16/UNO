"use client";

import Link from 'next/link';
import GodavariLogo from './GodavariLogo';

export default function GodavariNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#732525] backdrop-blur-lg shadow-lg py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-4 group">
          <GodavariLogo size={40} className="text-gold group-hover:text-gold-light transition-colors" />
          <div className="flex flex-col">
            <span className="font-serif text-gold tracking-widest text-xl uppercase leading-tight group-hover:text-gold-light transition-colors">Godavari</span>
            <span className="italic text-text-muted text-xs tracking-widest mt-0.5">The House of Heritage Experiences</span>
          </div>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/menu" className="text-gold uppercase tracking-widest text-sm hover:underline underline-offset-4 decoration-gold-light transition-all hover:text-gold-light">Restaurant</Link>
          <Link href="/rooms" className="text-gold uppercase tracking-widest text-sm hover:underline underline-offset-4 decoration-gold-light transition-all hover:text-gold-light">Rooms</Link>
          <Link href="/sky-lounge" className="text-gold uppercase tracking-widest text-sm hover:underline underline-offset-4 decoration-gold-light transition-all hover:text-gold-light">Sky Lounge</Link>
        </div>
      </div>
    </nav>
  );
}
