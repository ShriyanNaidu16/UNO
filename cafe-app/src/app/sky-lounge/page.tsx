import GodavariNavbar from '@/components/GodavariNavbar';
import GodavariFooter from '@/components/GodavariFooter';

export default function SkyLoungePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GodavariNavbar />
      <main className="flex-1 flex flex-col pt-24">
        <div className="relative w-full h-[60vh] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1600&q=80" 
            alt="Sky Lounge"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="font-serif text-white text-6xl md:text-8xl tracking-widest text-center px-4 drop-shadow-xl">
              SKY LOUNGE
            </h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h2 className="text-3xl text-primary font-serif mb-6">Elevated Evening Experiences</h2>
          <p className="text-foreground/80 leading-relaxed text-lg">
            Sip on handcrafted cocktails while enjoying panoramic views of the city skyline. 
            The Sky Lounge is the ultimate destination for sophisticated nightlife, 
            featuring live music and an exclusive atmosphere.
          </p>
        </div>
      </main>
      <GodavariFooter />
    </div>
  );
}
