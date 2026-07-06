import GodavariLogo from './GodavariLogo';

export default function GodavariFooter() {
  return (
    <footer className="bg-bg-dark py-6 text-center border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-3">
        <GodavariLogo size={28} className="text-gold" />
        <p className="text-text-muted text-xs tracking-wider">
          &copy; 2025 Godavari. The House of Heritage Experiences.
        </p>
      </div>
    </footer>
  );
}
