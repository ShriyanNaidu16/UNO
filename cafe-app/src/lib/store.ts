import { MenuItem, MenuCategory, Order, OrderItem, Bill } from './types';

// Global memory store for local testing across Next.js API route calls
type Store = {
  categories: MenuCategory[];
  items: MenuItem[];
  orders: (Order & { table_number: number, items: (OrderItem & { menu_item_name: string })[] })[];
  bills: Bill[];
};

// Use a global variable to persist state in Next.js development server
declare global {
  var __CAFE_STORE__: Store | undefined;
}

const initialCategories: MenuCategory[] = [
  { id: 'c1', name: 'Coffee', display_order: 1, created_at: new Date().toISOString() },
  { id: 'c2', name: 'Snacks', display_order: 2, created_at: new Date().toISOString() },
  { id: 'c3', name: 'Chinese', display_order: 3, created_at: new Date().toISOString() },
];

const initialItems: MenuItem[] = [
  { id: 'm1', category_id: 'c1', name: 'Espresso', description: 'Strong black coffee', price: 150, image_url: 'https://images.unsplash.com/photo-1510113110967-0c6798e3b3e6?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
  { id: 'm2', category_id: 'c1', name: 'Cappuccino', description: 'Espresso with steamed milk', price: 200, image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
  { id: 'm3', category_id: 'c2', name: 'Chicken Sandwich', description: 'Grilled chicken with mayo', price: 350, image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
  { id: 'm4', category_id: 'c2', name: 'Fries', description: 'Crispy potato fries', price: 180, image_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=200&q=80', is_available: false, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
  { id: 'm5', category_id: 'c3', name: 'Hakka Noodles', description: 'Wok-tossed noodles with veggies', price: 250, image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
  { id: 'm6', category_id: 'c3', name: 'Chilli Chicken', description: 'Spicy wok-tossed chicken chunks', price: 320, image_url: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
];

if (!global.__CAFE_STORE__) {
  global.__CAFE_STORE__ = {
    categories: initialCategories,
    items: initialItems,
    orders: [],
    bills: [
      // Add a mock bill to ensure the dashboard has data today
      {
        id: 'mock-bill-1',
        table_id: 'table-12',
        subtotal: 500,
        gst_amount: 25,
        service_charge_amount: 25,
        total_amount: 550,
        razorpay_order_id: null,
        razorpay_payment_id: null,
        payment_status: 'paid',
        payment_method: 'upi',
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-bill-2',
        table_id: 'table-10',
        subtotal: 800,
        gst_amount: 40,
        service_charge_amount: 40,
        total_amount: 880,
        razorpay_order_id: null,
        razorpay_payment_id: null,
        payment_status: 'paid',
        payment_method: 'cash',
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ],
  };
}

export const store = global.__CAFE_STORE__;
