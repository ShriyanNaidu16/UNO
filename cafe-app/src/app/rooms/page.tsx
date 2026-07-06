import GodavariNavbar from '@/components/GodavariNavbar';
import GodavariFooter from '@/components/GodavariFooter';

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GodavariNavbar />
      <main className="flex-1 flex flex-col pt-24">
        <div className="relative w-full h-[60vh] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80" 
            alt="Luxury Room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="font-serif text-white text-6xl md:text-8xl tracking-widest text-center px-4 drop-shadow-xl">
              ROOMS
            </h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h2 className="text-3xl text-primary font-serif mb-6">Heritage Luxury Stays</h2>
          <p className="text-foreground/80 leading-relaxed text-lg">
            Immerse yourself in comfort and luxury. Our rooms are designed to provide 
            a tranquil retreat from the bustling world, featuring premium amenities, 
            plush bedding, and breathtaking views.
          </p>
        </div>
      </main>
      <GodavariFooter />
    </div>
  );
}
