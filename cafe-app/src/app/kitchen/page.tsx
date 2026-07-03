'use client';

import { useEffect, useState } from 'react';
import { Order, OrderItem, MenuItem, MenuCategory } from '@/lib/types';
import { Clock, Check, ChefHat, PowerOff, CheckCircle } from 'lucide-react';

// Extended type for UI
type KitchenOrder = Order & {
  table_number: number;
  customer_name?: string | null;
  items: (OrderItem & { menu_item_name: string })[];
};

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'billing' | 'menu'>('orders');

  // New Item Form State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemVeg, setNewItemVeg] = useState<'veg' | 'non-veg'>('veg');
  const [newItemImage, setNewItemImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/menu')
        ]);
        const ordersData = await ordersRes.json();
        const menuData = await menuRes.json();
        
        setOrders(ordersData.orders);
        setMenuItems(menuData.items);
        setCategories(menuData.categories);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Polling for real-time effect
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    try {
      await fetch('/api/orders/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  const markAsPaid = async (orderId: string, method: 'cash' | 'card' | 'upi') => {
    // 1. Update order status to paid
    updateOrderStatus(orderId, 'paid');
    
    // 2. We need to find the bill ID associated with this order.
    // For this prototype, if there's no bill, we might create one or assume the backend handles it.
    // Assuming the backend has a way to mark the bill. Let's call a new endpoint:
    try {
      await fetch(`/api/bills/order_${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: method })
      });
    } catch (err) {
      console.error("Failed to mark bill as paid", err);
    }
  };

  const toggleItemAvailability = async (itemId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimistic update
    setMenuItems(prev => prev.map(i => i.id === itemId ? { ...i, is_available: newStatus } : i));
    
    try {
      await fetch('/api/menu/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, isAvailable: newStatus })
      });
    } catch (err) {
      console.error("Failed to toggle availability");
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemCategory) return;
    
    try {
      await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName,
          description: newItemDesc,
          price: newItemPrice,
          category_id: newItemCategory,
          veg_nonveg_tag: newItemVeg,
          image_url: newItemImage
        })
      });
      // Reset form
      setIsAddingItem(false);
      setNewItemName('');
      setNewItemDesc('');
      setNewItemPrice('');
      setNewItemImage('');
      alert("Item added successfully!");
    } catch (err) {
      alert("Failed to add item");
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kitchen Dashboard</h1>
          <p className="text-foreground/60 mt-1">Manage live orders and menu availability</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex bg-card p-1 rounded-xl shadow-sm border">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-gray-100'}`}
            >
              Live Orders
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'billing' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-gray-100'}`}
            >
              Pending Payments
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'menu' ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-gray-100'}`}
            >
              Menu Stock
            </button>
          </div>

          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold border border-green-200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live API
          </div>
        </div>
      </header>

      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.filter(o => o.status !== 'served' && o.status !== 'billed' && o.status !== 'paid' && o.status !== 'closed').map(order => (
            <div key={order.id} className="bg-card rounded-2xl p-6 shadow-sm border flex flex-col">
              <div className="flex justify-between items-start mb-4 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    Table {order.table_number}
                    {order.customer_name && <span className="text-lg text-foreground/80 font-semibold ml-2">({order.customer_name})</span>}
                  </h2>
                  <p className="text-sm text-foreground/60 flex items-center gap-1 mt-1">
                    <Clock size={14} />
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-secondary-foreground">
                  {order.status}
                </div>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                {order.items.map(item => (
                  <div key={item.id}>
                    <div className="flex justify-between font-medium">
                      <span>{item.quantity}x {item.menu_item_name}</span>
                    </div>
                    {item.special_instructions && (
                      <p className="text-sm text-destructive bg-destructive/10 px-2 py-1 rounded mt-1">
                        Note: {item.special_instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-auto">
                {order.status === 'placed' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <ChefHat size={18} />
                    Accept & Prepare
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Check size={18} />
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'served')}
                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    Mark Served
                  </button>
                )}
              </div>
            </div>
          ))}
          {orders.filter(o => o.status !== 'served' && o.status !== 'billed' && o.status !== 'paid' && o.status !== 'closed').length === 0 && (
            <div className="col-span-full py-12 text-center text-foreground/50 border-2 border-dashed rounded-2xl">
              No active orders right now.
            </div>
          )}
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.filter(o => o.status === 'served' || o.status === 'billed').map(order => (
            <div key={order.id} className="bg-card rounded-2xl p-6 shadow-sm border flex flex-col">
              <div className="flex justify-between items-start mb-4 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    Table {order.table_number}
                    {order.customer_name && <span className="text-lg text-foreground/80 font-semibold ml-2">({order.customer_name})</span>}
                  </h2>
                  <p className="text-sm text-foreground/60 flex items-center gap-1 mt-1">
                    <Clock size={14} />
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                  Needs Payment
                </div>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                {order.items.map(item => (
                  <div key={item.id}>
                    <div className="flex justify-between font-medium">
                      <span>{item.quantity}x {item.menu_item_name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-auto">
                <div className="flex flex-col w-full gap-2">
                  <p className="text-sm font-semibold text-center w-full">Mark Paid Via:</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => markAsPaid(order.id, 'cash')}
                      className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg font-bold hover:bg-orange-200 transition-colors"
                    >
                      Cash
                    </button>
                    <button 
                      onClick={() => markAsPaid(order.id, 'upi')}
                      className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg font-bold hover:bg-green-200 transition-colors"
                    >
                      UPI
                    </button>
                    <button 
                      onClick={() => markAsPaid(order.id, 'card')}
                      className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg font-bold hover:bg-purple-200 transition-colors"
                    >
                      Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {orders.filter(o => o.status === 'served' || o.status === 'billed').length === 0 && (
            <div className="col-span-full py-12 text-center text-foreground/50 border-2 border-dashed rounded-2xl">
              No pending payments.
            </div>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="bg-card rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Toggle Item Availability</h2>
            <button 
              onClick={() => { setIsAddingItem(!isAddingItem); if (!newItemCategory && categories.length > 0) setNewItemCategory(categories[0].id); }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              {isAddingItem ? 'Cancel' : '+ Add New Item'}
            </button>
          </div>

          {isAddingItem && (
            <form onSubmit={handleAddItem} className="bg-secondary/30 p-6 rounded-2xl border mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Item Name *</label>
                <input required type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full p-2 rounded-lg border" placeholder="e.g. Schezwan Noodles" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price (₹) *</label>
                <input required type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full p-2 rounded-lg border" placeholder="e.g. 250" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <input type="text" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} className="w-full p-2 rounded-lg border" placeholder="e.g. Spicy wok tossed noodles..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category *</label>
                <select required value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} className="w-full p-2 rounded-lg border bg-white">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Type *</label>
                <select required value={newItemVeg} onChange={e => setNewItemVeg(e.target.value as any)} className="w-full p-2 rounded-lg border bg-white">
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input type="url" value={newItemImage} onChange={e => setNewItemImage(e.target.value)} className="w-full p-2 rounded-lg border" placeholder="https://images.unsplash.com/..." />
              </div>
              <div className="md:col-span-2 mt-2">
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors">
                  Save Item to Menu
                </button>
              </div>
            </form>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map(category => {
              const categoryItems = menuItems.filter(i => i.category_id === category.id);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <h3 className="font-bold text-lg border-b pb-2 mb-4">{category.name}</h3>
                  <div className="space-y-4">
                    {categoryItems.map(item => (
                      <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${item.is_available ? 'bg-white' : 'bg-red-50 border-red-100'}`}>
                        <div>
                          <p className={`font-semibold ${!item.is_available && 'text-red-800 line-through'}`}>{item.name}</p>
                          <p className="text-sm text-foreground/60">₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => toggleItemAvailability(item.id, item.is_available)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                            item.is_available 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {item.is_available ? <><PowerOff size={16} /> Mark Out of Stock</> : <><CheckCircle size={16} /> Mark Available</>}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
