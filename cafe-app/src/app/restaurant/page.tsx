import GodavariNavbar from '@/components/GodavariNavbar';
import GodavariFooter from '@/components/GodavariFooter';

export default function RestaurantPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GodavariNavbar />
      <main className="flex-1 flex flex-col pt-24">
        <div className="relative w-full h-[60vh] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80" 
            alt="Restaurant Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="font-serif text-white text-6xl md:text-8xl tracking-widest text-center px-4 drop-shadow-xl">
              RESTAURANT
            </h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h2 className="text-3xl text-primary font-serif mb-6">A Culinary Journey</h2>
          <p className="text-foreground/80 leading-relaxed text-lg">
            Experience the finest blend of traditional flavors and modern culinary artistry. 
            Our restaurant offers an elegant ambiance perfect for intimate dinners, family gatherings, 
            and memorable celebrations.
          </p>
        </div>
      </main>
      <GodavariFooter />
    </div>
  );
}
