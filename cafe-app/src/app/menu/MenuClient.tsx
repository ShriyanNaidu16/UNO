'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MenuItem, MenuCategory } from '@/lib/types';
import { ShoppingCart, Plus, Minus, Search, Filter, ChevronLeft, Phone, Mail, MapPin, Coffee, Utensils, Pizza, ChefHat, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import GodavariLogo from '@/components/GodavariLogo';

// Data will be fetched from API
// State types based on API response


export default function MenuClient() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const loc = (obj: any, key: string) => {
    if (language === 'en') return obj[key];
    return obj[`${key}_${language}`] || obj[key];
  };
  // Fallback to table 12 if missing for demo purposes (so refresh works even if param is lost somehow)
  const tableId = searchParams.get('table') || '12';

  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isCartViewOpen, setIsCartViewOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [activeToastItem, setActiveToastItem] = useState<MenuItem | null>(null);
  const [aiSuggestionMap, setAiSuggestionMap] = useState<Record<string, string>>({});

  // Fetch AI suggestion map on mount
  useEffect(() => {
    fetch('/api/suggest')
      .then(res => res.json())
      .then(data => setAiSuggestionMap(data))
      .catch(err => console.error('Failed to fetch AI suggestions:', err));
  }, []);
  
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  
  // New State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'categories' | 'items'>('categories');

  // Fetch Menu Data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        setCategories(data.categories);
        setItems(data.items);
        if (!activeCategory && data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch menu");
      }
    };
    fetchMenu();
    // Poll every 2 seconds for availability changes
    const interval = setInterval(fetchMenu, 2000);
    return () => clearInterval(interval);
  }, [activeCategory]);


  const cartItemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const updateQuantity = (item: MenuItem, delta: number) => {
    if (delta > 0 && cartItemCount >= 30) {
      alert("You can only order a maximum of 30 items at a time.");
      return;
    }

    if (delta > 0) {
      const suggestionId = aiSuggestionMap[item.id];
      if (suggestionId) {
        const suggestionItem = items.find(i => i.id === suggestionId);
        // Only suggest if available and not already in cart
        if (suggestionItem && suggestionItem.is_available && !cart.some(c => c.item.id === suggestionId)) {
          setActiveToastItem(suggestionItem);
          setTimeout(() => setActiveToastItem(null), 5000);
        }
      }
    }

    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        const nextQty = existing.quantity + delta;
        if (nextQty <= 0) {
          const newCart = prev.filter(c => c.item.id !== item.id);
          if (newCart.length === 0) setIsCartViewOpen(false); // Close cart if empty
          return newCart;
        }
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: nextQty } : c);
      }
      if (delta > 0) {
        return [...prev, { item, quantity: delta }];
      }
      return prev;
    });
  };

  const getQuantity = (itemId: string) => {
    return cart.find(c => c.item.id === itemId)?.quantity || 0;
  };

  const cartTotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);

  // Computed Suggestions for Cart (AI suggested or Fallback)
  const cartItemIds = new Set(cart.map(c => c.item.id));
  const aiSuggestedIdsForCart = [...new Set(cart.map(c => aiSuggestionMap[c.item.id]).filter(Boolean))];
  
  let cartSuggestions = items.filter(item => aiSuggestedIdsForCart.includes(item.id) && item.is_available && !cartItemIds.has(item.id));
  
  if (cartSuggestions.length === 0) {
    cartSuggestions = items.filter(
      item => (item.category_id === 'c1' || item.category_id === 'c3') && item.is_available && !cartItemIds.has(item.id)
    ).slice(0, 4);
  } else {
    cartSuggestions = cartSuggestions.slice(0, 4);
  }

  const handleProceedFromCart = () => {
    if (!tableId || cart.length === 0) return;
    if (!customerName.trim()) {
      alert('Please enter your name before proceeding.');
      return;
    }
    placeOrder();
  };

  const placeOrder = async () => {
    if (!tableId || cart.length === 0) return;
    
    if (!customerName.trim()) {
      alert('Please enter your name before placing the order.');
      return;
    }

    setIsPlacingOrder(true);
    try {
      await fetch('/api/orders', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tableId, 
          tableNumber: parseInt(tableId), 
          items: cart,
          customerName: customerName.trim()
        }) 
      });
      setCart([]);
      setIsCartViewOpen(false);
      router.push(`/order-status?table=${tableId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (viewMode === 'categories') {
      setViewMode('items');
    } else {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        // Offset for sticky headers
        const y = element.getBoundingClientRect().top + window.scrollY - 180;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  if (isCartViewOpen) {
    return (
      <div className="min-h-screen bg-secondary pb-40 animate-in slide-in-from-right-full duration-300">
        <header className="sticky top-0 z-40 bg-white shadow-sm p-4 flex items-center gap-4 text-foreground">
          <button onClick={() => setIsCartViewOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1">{t('Your Cart')}</h1>
        </header>

        {/* Mock Savings Banner like the image */}
        <div className="bg-green-100 text-green-800 p-3 text-sm font-semibold text-center border-b border-green-200">
          {t('SavedBanner')}
        </div>

        <main className="p-4 max-w-2xl mx-auto space-y-4">
          <div className="bg-card rounded-2xl shadow-sm border p-4">
            <div className="flex justify-between items-center border-b border-dashed pb-3 mb-3">
              <h2 className="font-bold text-lg">16 Mins</h2>
              <span className="text-sm text-foreground/60">{cartItemCount} {t('items')}</span>
            </div>

            <div className="space-y-6">
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`w-3 h-3 flex-shrink-0 rounded-full border-2 ${cartItem.item.veg_nonveg_tag === 'veg' ? 'border-green-600 bg-green-100' : 'border-red-600 bg-red-100'}`} />
                    <div>
                      <h3 className="font-semibold leading-tight">{loc(cartItem.item, 'name')}</h3>
                      <p className="text-xs text-foreground/50 mt-1">₹{cartItem.item.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center bg-white text-primary rounded-lg border shadow-sm h-8">
                      <button onClick={() => updateQuantity(cartItem.item, -1)} className="w-8 flex items-center justify-center hover:bg-gray-50 rounded-l-lg transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-foreground">{cartItem.quantity}</span>
                      <button onClick={() => updateQuantity(cartItem.item, 1)} className="w-8 flex items-center justify-center hover:bg-gray-50 rounded-r-lg transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-sm">₹{cartItem.item.price * cartItem.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-dashed">
              <button 
                onClick={() => setIsCartViewOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-gray-200 font-semibold text-foreground/80 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-300 ease-out"
              >
                <Plus size={18} /> {t('Add more items')}
              </button>
            </div>
            
            {/* Inline Cart Suggestions (Swiggy/Zomato style) */}
            {cartSuggestions.length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-3">{t('Perfect Pairings')}</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4">
                  {cartSuggestions.map(item => (
                    <div key={item.id} className="min-w-[160px] max-w-[160px] bg-white rounded-2xl shadow-sm border p-3 flex flex-col flex-shrink-0">
                      <div className="flex items-start gap-2 mb-2">
                        <span className={`w-2 h-2 mt-1 flex-shrink-0 rounded-full ${item.veg_nonveg_tag === 'veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <h4 className="font-semibold text-sm leading-tight flex-1 line-clamp-2">{loc(item, 'name')}</h4>
                      </div>
                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                        <p className="font-bold text-sm text-foreground/90">₹{item.price}</p>
                        <button 
                          onClick={() => updateQuantity(item, 1)}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all duration-300 text-xs font-bold px-3 py-1.5 rounded-full"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </main>

        {/* Sticky Cart Bar for Final Place Order */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-secondary/80 backdrop-blur-md border-t">
          <div className="max-w-md mx-auto space-y-3">
            <input 
              type="text" 
              placeholder={t('Your Name (Required)')} 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 rounded-xl border bg-card text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
            <div className="flex justify-between items-center px-2">
              <p className="font-extrabold text-xl text-foreground">₹{cartTotal}</p>
              <button 
                onClick={handleProceedFromCart}
                disabled={isPlacingOrder}
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
              >
                {t('Proceed')}
                <ChevronLeft className="rotate-180" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryMeta = (categoryName: string) => {
    const name = categoryName.toUpperCase();
    if (name.includes('SOUP')) return {
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop",
      icon: <Coffee size={24} className="text-accent mb-2" />,
      desc: "Comforting traditional starters"
    };
    if (name.includes('APPETIZER')) return {
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop",
      icon: <Utensils size={24} className="text-accent mb-2" />,
      desc: "Delightful bites to begin your journey"
    };
    if (name.includes('THALI')) return {
      image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=400&auto=format&fit=crop",
      icon: <ChefHat size={24} className="text-accent mb-2" />,
      desc: "Wholesome meals full of tradition and flavor"
    };
    if (name.includes('CURRY') || name.includes('CURRIES')) return {
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop",
      icon: <Coffee size={24} className="text-accent mb-2" />,
      desc: "Rich, aromatic curries cooked to perfection"
    };
    if (name.includes('BREAD')) return {
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&auto=format&fit=crop",
      icon: <Pizza size={24} className="text-accent mb-2" />,
      desc: "Freshly made breads to complement"
    };
    if (name.includes('NOODLE')) return {
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop",
      icon: <Utensils size={24} className="text-accent mb-2" />,
      desc: "Flavorful noodles and rice creations"
    };
    if (name.includes('DESSERT') || name.includes('SWEET')) return {
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
      icon: <Coffee size={24} className="text-accent mb-2" />,
      desc: "Sweet endings to a perfect meal"
    };
    if (name.includes('IDLY')) return {
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
      icon: <ChefHat size={24} className="text-accent mb-2" />,
      desc: "Soft and fluffy traditional idlys"
    };
    if (name.includes('DOSA')) return {
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=400&auto=format&fit=crop",
      icon: <Utensils size={24} className="text-accent mb-2" />,
      desc: "Crispy dosas with flavorful chutneys"
    };
    if (name.includes('VADA') || name.includes('BAJJI') || name.includes('SNACK')) return {
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=400&auto=format&fit=crop",
      icon: <Coffee size={24} className="text-accent mb-2" />,
      desc: "Crispy fried traditional evening snacks"
    };
    if (name.includes('BEVERAGE')) return {
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=400&auto=format&fit=crop",
      icon: <Coffee size={24} className="text-accent mb-2" />,
      desc: "Refreshing drinks to quench your thirst"
    };
    if (name.includes('SIGNATURE') || name.includes('SPECIAL')) return {
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
      icon: <ChefHat size={24} className="text-accent mb-2" />,
      desc: "Our exclusive signature delicacies"
    };
    return {
      image: "https://images.unsplash.com/photo-1626082895617-2c6ab3475d14?q=80&w=400&auto=format&fit=crop",
      icon: <ChefHat size={24} className="text-accent mb-2" />,
      desc: "Quick, healthy and traditional favorites"
    };
  };

  // --- Normal Menu View below ---

  return (
    <div className="min-h-screen heritage-bg text-foreground pb-32 font-sans relative">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-6 py-4 shadow-sm border-b border-primary/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
          >
            <GodavariLogo size={40} className="rounded-full" />
            <div>
              <h1 className="font-playfair font-bold text-xl leading-tight text-primary uppercase">Godavari</h1>
              <p className="text-[10px] tracking-widest text-accent uppercase font-bold">The House of Heritage Experiences</p>
            </div>
          </div>
          
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder={t('Search Authentic Telugu Delicacies...')} 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value && viewMode === 'categories') {
                  setViewMode('items');
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-primary/20 outline-none focus:ring-2 focus:ring-primary/50 shadow-sm bg-white text-foreground placeholder:text-foreground/50 transition-all duration-300"
            />
            <Search className="absolute left-3.5 top-3 text-accent" size={18} />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2">
              <Utensils size={16} />
              {t('Table')} {tableId}
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      {viewMode === 'categories' && !searchQuery && (
        <div className="pt-16 pb-12 text-center max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 15C50 15 65 35 75 50C85 65 85 75 75 85C65 95 50 85 50 85C50 85 35 95 25 85C15 75 15 65 25 50C35 35 50 15 50 15Z" fill="#C9A84C" fillOpacity="0.8"/>
              <path d="M50 30C50 30 60 45 65 55C70 65 70 70 65 75C60 80 50 75 50 75C50 75 40 80 35 75C30 70 30 65 35 55C40 45 50 30 50 30Z" fill="#F9F6F0"/>
            </svg>
          </div>
          <h2 className="font-playfair text-3xl md:text-5xl font-extrabold text-primary mb-4 uppercase tracking-wider">
            {t('Experience The Taste of Heritage')}
          </h2>
          <p className="text-foreground/80 font-medium md:text-lg mb-8">
            {t('Authentic Godavari Style Telugu Cuisine')}
          </p>
          <div className="flex items-center justify-center gap-4 text-accent">
            <span className="w-16 h-px bg-accent"></span>
            <span className="text-2xl">❖</span>
            <span className="w-16 h-px bg-accent"></span>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="p-4 max-w-6xl mx-auto">
        {viewMode === 'categories' && !searchQuery ? (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-center gap-4 mb-8 text-primary">
              <span className="w-8 h-px bg-primary/40"></span>
              <span className="text-sm tracking-[0.2em] font-bold">❖</span>
              <h2 className="font-playfair text-2xl font-bold uppercase tracking-widest">{t('Categories')}</h2>
              <span className="text-sm tracking-[0.2em] font-bold">❖</span>
              <span className="w-8 h-px bg-primary/40"></span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(category => {
                const meta = getCategoryMeta(category.name);
                return (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className="group bg-card rounded-2xl shadow-sm border border-primary/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-accent/40 transition-all duration-300 active:scale-95 text-left flex"
                  >
                    <div className="w-2/5 h-36 bg-gray-100 overflow-hidden relative">
                       <img src={meta.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" onError={(e) => { const fb = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop'; if (e.currentTarget.src !== fb) e.currentTarget.src = fb; }} />
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card"></div>                    </div>
                    <div className="w-3/5 p-4 flex flex-col justify-center items-center text-center">
                      {meta.icon}
                      <h3 className="font-playfair font-bold text-primary uppercase text-sm mb-2">{loc(category, 'name')}</h3>
                      <p className="text-[10px] text-foreground/60 leading-tight">{t(meta.desc as any)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-4xl mx-auto">
            {/* Menu Header (when items view active) */}
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-primary/20">
              <button 
                onClick={() => setViewMode('categories')}
                className="p-2 hover:bg-white rounded-full transition-colors active:scale-95 shadow-sm border border-transparent hover:border-gray-200"
              >
                <ChevronLeft size={24} className="text-primary" />
              </button>
              <h2 className="font-playfair text-3xl font-bold text-primary uppercase">{searchQuery ? t('Search Results') : t('Menu Items')}</h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar items-center animate-in fade-in duration-300 mb-6">
              {categories.filter(c => !c.name.includes('QSR - ')).map(category => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition-all duration-300 active:scale-95 text-sm uppercase tracking-wide
                    ${activeCategory === category.id && !searchQuery
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white text-primary border border-primary/20 hover:bg-primary/5 shadow-sm'}`}
                >
                  {loc(category, 'name')}
                </button>
              ))}
            </div>

            {/* Dietary Filters */}
            <div className="flex gap-2 mb-8">
              {(['all', 'veg'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setDietaryFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-sm
                    ${dietaryFilter === filter 
                      ? 'bg-foreground text-background border-2 border-foreground' 
                      : 'bg-white text-foreground/70 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {filter === 'veg' && <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />}
                  {filter === 'all' && <Filter size={16} />}
                  {t(filter.charAt(0).toUpperCase() + filter.slice(1) as any)}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="space-y-12">
              {categories.map(category => {
                // If not searching, only show active category
                if (!searchQuery && category.id !== activeCategory) return null;

                const filteredItems = items.filter(item => {
                  if (item.category_id !== category.id) return false;
                  if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                  if (dietaryFilter !== 'all' && item.veg_nonveg_tag !== dietaryFilter) return false;
                  return true;
                });

                if (filteredItems.length === 0) return null;

                return (
                  <section key={category.id} id={`category-${category.id}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="font-playfair text-2xl font-bold text-primary uppercase">{loc(category, 'name')}</h2>
                      <span className="flex-1 h-px bg-primary/20"></span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredItems.map(item => (
                        <div key={item.id} className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start hover:shadow-md transition-shadow ${!item.is_available ? 'opacity-60 grayscale' : ''}`}>
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-3.5 h-3.5 flex-shrink-0 rounded-full border-2 ${item.veg_nonveg_tag === 'veg' ? 'border-green-600 bg-green-100' : 'border-red-600 bg-red-100'}`} />
                              <h3 className="font-bold text-lg leading-tight text-foreground">{loc(item, 'name')}</h3>
                            </div>
                            <p className="font-extrabold text-primary mt-1">₹{item.price}</p>
                            <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{loc(item, 'description')}</p>
                            {!item.is_available && <p className="text-xs text-destructive mt-3 font-bold uppercase tracking-wider bg-red-50 inline-block px-2 py-1 rounded">{t('Out of stock')}</p>}
                          </div>

                          <div className="flex-shrink-0 flex flex-col items-center relative w-28">
                            {item.image_url ? (
                              <div className="w-28 h-28 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" onError={(e) => { const fb = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop'; if (e.currentTarget.src !== fb) e.currentTarget.src = fb; }} />
                              </div>
                            ) : (
                              <div className="w-28 h-28 rounded-xl border border-dashed bg-gray-50 flex items-center justify-center text-xs text-gray-400 font-medium">
                                No Image
                              </div>
                            )}
                            
                            <div className="absolute -bottom-4 w-full flex justify-center">
                              {item.is_available && (
                                getQuantity(item.id) === 0 ? (
                                  <button 
                                    onClick={() => updateQuantity(item, 1)}
                                    className="bg-white text-primary border-2 border-primary/20 hover:border-primary hover:bg-primary/5 font-extrabold px-6 py-2 rounded-xl shadow-md active:scale-95 transition-all duration-300 text-sm uppercase tracking-wide"
                                  >
                                    {t('Add')}
                                  </button>
                                ) : (
                                  <div className="flex items-center bg-white text-primary rounded-xl shadow-md border-2 border-primary/20 h-10 overflow-hidden">
                                    <button onClick={() => updateQuantity(item, -1)} className="w-9 h-full flex items-center justify-center hover:bg-primary/10 active:bg-primary/20 transition-colors">
                                      <Minus size={14} />
                                    </button>
                                    <span className="w-6 text-center font-bold text-sm text-foreground">{getQuantity(item.id)}</span>
                                    <button onClick={() => updateQuantity(item, 1)} className="w-9 h-full flex items-center justify-center hover:bg-primary/10 active:bg-primary/20 transition-colors">
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      {!isCartViewOpen && (
        <footer className="mt-20 border-t border-accent/20 pt-10 pb-20 px-4 text-center text-primary/80">
          <div className="flex items-center justify-center gap-4 mb-6 text-accent">
            <span className="w-12 h-px bg-accent"></span>
            <span className="text-xl">❖</span>
            <h3 className="font-playfair text-lg md:text-xl font-bold uppercase tracking-wider text-primary">{t('Tradition on a Plate, Memories for a Lifetime')}</h3>
            <span className="text-xl">❖</span>
            <span className="w-12 h-px bg-accent"></span>
          </div>
          
          <div className="flex justify-center gap-4 mb-6">
            <a href="#" className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors shadow-sm">
              <Phone size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors shadow-sm">
              <Mail size={20} />
            </a>
            <a href="https://maps.app.goo.gl/WPPKAKjF9bi2CLYw7" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors shadow-sm">
              <MapPin size={20} />
            </a>
          </div>
          
          <p className="text-sm font-medium text-primary/70">
            © 2026 Godavari The House of Heritage Experiences. All Rights Reserved.
          </p>
        </footer>
      )}

      {/* Smart Suggestion Toast */}
      {activeToastItem && !isCartViewOpen && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-gradient-to-r from-accent to-primary text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-0.5">{t('Pairs perfectly with')}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{loc(activeToastItem, 'name')}</span>
              <span className="text-secondary/90 font-medium border-l border-white/30 pl-2 text-sm">₹{activeToastItem.price}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              updateQuantity(activeToastItem, 1);
              setActiveToastItem(null);
            }}
            className="bg-white text-primary px-5 py-2.5 rounded-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-transform text-sm"
          >
            + Add
          </button>
        </div>
      )}

      {/* Sticky Cart Bar for Normal Menu View */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-primary text-primary-foreground p-4 rounded-3xl shadow-2xl flex items-center justify-between z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-primary-foreground/10">
          <div>
            <p className="text-sm font-medium text-primary-foreground/90">{cartItemCount} {t('items')}</p>
            <p className="font-extrabold text-xl text-primary-foreground">₹{cartTotal}</p>
          </div>
          <button 
            onClick={() => setIsCartViewOpen(true)}
            className="bg-white text-primary px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 active:scale-95"
          >
            {t('Your Cart')}
            <ShoppingCart size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
