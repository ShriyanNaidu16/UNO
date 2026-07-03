'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MenuItem, MenuCategory } from '@/lib/types';
import { ShoppingCart, Plus, Minus, Search, Filter, ChevronLeft } from 'lucide-react';

// Data will be fetched from API
// State types based on API response


export default function MenuClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Fallback to table 12 if missing for demo purposes (so refresh works even if param is lost somehow)
  const tableId = searchParams.get('table') || '12';

  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isCartViewOpen, setIsCartViewOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  
  // New State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('');

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
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Offset for sticky headers
      const y = element.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (isCartViewOpen) {
    return (
      <div className="min-h-screen bg-secondary pb-40 animate-in slide-in-from-right-full duration-300">
        <header className="sticky top-0 z-40 bg-white shadow-sm p-4 flex items-center gap-4 text-foreground">
          <button onClick={() => setIsCartViewOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1">Your Cart</h1>
        </header>

        {/* Mock Savings Banner like the image */}
        <div className="bg-green-100 text-green-800 p-3 text-sm font-semibold text-center border-b border-green-200">
          ₹45 saved! Add items worth ₹200 to get ₹50 free cash
        </div>

        <main className="p-4 max-w-2xl mx-auto space-y-4">
          <div className="bg-card rounded-2xl shadow-sm border p-4">
            <div className="flex justify-between items-center border-b border-dashed pb-3 mb-3">
              <h2 className="font-bold text-lg">16 Mins</h2>
              <span className="text-sm text-foreground/60">{cartItemCount} items</span>
            </div>

            <div className="space-y-6">
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`w-3 h-3 flex-shrink-0 rounded-full border-2 ${cartItem.item.veg_nonveg_tag === 'veg' ? 'border-green-600 bg-green-100' : 'border-red-600 bg-red-100'}`} />
                    <div>
                      <h3 className="font-semibold leading-tight">{cartItem.item.name}</h3>
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
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-300 font-semibold text-foreground/80 hover:bg-gray-50 transition-colors"
              >
                <Plus size={18} /> Add more items
              </button>
            </div>
          </div>
        </main>

        {/* Sticky Cart Bar for Final Place Order */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-secondary/80 backdrop-blur-md border-t">
          <div className="max-w-md mx-auto space-y-3">
            <input 
              type="text" 
              placeholder="Your Name (Required)" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 rounded-xl border bg-card text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
            <div className="flex justify-between items-center px-2">
              <p className="font-extrabold text-xl text-foreground">₹{cartTotal}</p>
              <button 
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {isPlacingOrder ? 'Placing...' : 'Confirm Order'}
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Normal Menu View below ---

  return (
    <div className="min-h-screen bg-secondary pb-32">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 shadow-md rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Cafe Menu</h1>
          <div className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm font-semibold">
            Table {tableId}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 text-foreground">
          <input 
            type="text" 
            placeholder="Search for food..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary-foreground/50 shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 text-foreground/50" size={18} />
        </div>

        {/* Categories Nav */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-semibold transition-colors text-sm
                ${activeCategory === category.id 
                  ? 'bg-primary-foreground text-primary shadow-sm' 
                  : 'bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto mt-2">
        {/* Dietary Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'veg', 'non-veg'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setDietaryFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-1.5 transition-colors
                ${dietaryFilter === filter 
                  ? 'bg-foreground text-background border-foreground' 
                  : 'bg-card text-foreground/70 border-gray-200 hover:bg-gray-100'}`}
            >
              {filter === 'veg' && <span className="w-2.5 h-2.5 rounded-full bg-green-500" />}
              {filter === 'non-veg' && <span className="w-2.5 h-2.5 rounded-full bg-red-500" />}
              {filter === 'all' && <Filter size={14} />}
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-8">
          {categories.map(category => {
            const filteredItems = items.filter(item => {
              if (item.category_id !== category.id) return false;
              if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
              if (dietaryFilter !== 'all' && item.veg_nonveg_tag !== dietaryFilter) return false;
              return true;
            });

            if (filteredItems.length === 0) return null;

            return (
              <section key={category.id} id={`category-${category.id}`}>
                <h2 className="text-xl font-bold mb-4 text-foreground border-b pb-2">{category.name}</h2>
                <div className="space-y-4">
                  {filteredItems.map(item => (
                    <div key={item.id} className={`bg-card p-4 pb-6 rounded-2xl shadow-sm border flex justify-between items-start ${!item.is_available ? 'opacity-50' : ''}`}>
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full border-2 ${item.veg_nonveg_tag === 'veg' ? 'border-green-600 bg-green-100' : 'border-red-600 bg-red-100'}`} />
                          <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                        </div>
                        <p className="font-medium mt-2">₹{item.price}</p>
                        <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{item.description}</p>
                        {!item.is_available && <p className="text-xs text-destructive mt-2 font-semibold">Out of stock</p>}
                      </div>

                      <div className="flex-shrink-0 flex flex-col items-center relative w-28">
                        {item.image_url ? (
                          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-sm border bg-gray-100">
                            {/* Using regular img tag for local demo without next/image config issues */}
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-28 h-28 rounded-2xl border border-dashed bg-gray-50 flex items-center justify-center text-xs text-gray-400 font-medium">
                            No Image
                          </div>
                        )}
                        
                        <div className="absolute -bottom-4 w-full flex justify-center">
                          {item.is_available && (
                            getQuantity(item.id) === 0 ? (
                              <button 
                                onClick={() => updateQuantity(item, 1)}
                                className="bg-white text-primary border-2 border-primary/20 hover:border-primary font-extrabold px-8 py-1.5 rounded-xl shadow-md transition-all text-sm uppercase tracking-wide"
                              >
                                Add
                              </button>
                            ) : (
                              <div className="flex items-center bg-white text-primary rounded-xl shadow-md border-2 border-primary/20 h-9 overflow-hidden">
                                <button onClick={() => updateQuantity(item, -1)} className="w-9 h-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                                  <Minus size={14} />
                                </button>
                                <span className="w-6 text-center font-bold text-sm text-foreground">{getQuantity(item.id)}</span>
                                <button onClick={() => updateQuantity(item, 1)} className="w-9 h-full flex items-center justify-center hover:bg-gray-50 transition-colors">
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
      </main>

      {/* Sticky Cart Bar for Normal Menu View */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl glass p-4 rounded-3xl shadow-2xl flex items-center justify-between z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div>
            <p className="text-sm font-semibold text-foreground/90">{cartItemCount} item{cartItemCount > 1 ? 's' : ''}</p>
            <p className="font-extrabold text-xl text-foreground">₹{cartTotal}</p>
          </div>
          <button 
            onClick={() => setIsCartViewOpen(true)}
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
          >
            View Cart
            <ShoppingCart size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
