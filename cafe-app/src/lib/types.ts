export type Table = {
  id: string;
  table_number: number;
  qr_code_url: string | null;
  status: 'idle' | 'occupied';
  created_at: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  veg_nonveg_tag: 'veg' | 'non-veg' | 'vegan' | null;
  created_at: string;
};

export type Order = {
  id: string;
  table_id: string;
  customer_name: string | null;
  status: 'placed' | 'accepted' | 'preparing' | 'ready' | 'served' | 'billed' | 'paid' | 'closed';
  round_number: number;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_order_time: number;
  special_instructions: string | null;
  created_at: string;
};

export type Bill = {
  id: string;
  table_id: string;
  subtotal: number;
  gst_amount: number;
  service_charge_amount: number;
  total_amount: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: 'upi' | 'card' | 'cash' | null;
  payment_date: string | null;
  created_at: string;
};
