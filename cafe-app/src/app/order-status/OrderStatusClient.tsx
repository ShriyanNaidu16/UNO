'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/lib/types';
import { Clock, CheckCircle2, ChefHat, ReceiptText, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type StatusOrder = Order & {
  items: (OrderItem & { menu_item_name: string })[];
};

export default function OrderStatusClient() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = searchParams.get('table');

  const loc = (obj: any, key: string) => {
    if (language === 'en') return obj[key];
    return obj[`${key}_${language}`] || obj[key];
  };

  const [orders, setOrders] = useState<StatusOrder[]>([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!tableId) return;
      try {
        const res = await fetch(`/api/orders?table=${tableId}`);
        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        console.error("Failed to fetch orders");
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, [tableId]);


  // Note: Polling replaced Supabase realtime for local demo.

  const requestBill = async () => {
    // Mock request bill
    alert("Bill requested! Backend will generate Razorpay order and redirect to checkout.");
    router.push(`/checkout?table=${tableId}`);
  };

  if (!tableId) return <div className="p-8 text-center text-red-500">Invalid Table</div>;

  const getStatusDisplay = (status: Order['status']) => {
    switch (status) {
      case 'placed': return { text: t('Order Received'), icon: <Clock className="text-blue-500" />, bg: 'bg-blue-50 border-blue-200' };
      case 'accepted':
      case 'preparing': return { text: t('Preparing in Kitchen'), icon: <ChefHat className="text-orange-500" />, bg: 'bg-orange-50 border-orange-200' };
      case 'ready': return { text: t('Ready to Serve'), icon: <CheckCircle2 className="text-green-500" />, bg: 'bg-green-50 border-green-200' };
      case 'served': return { text: t('Served'), icon: <CheckCircle2 className="text-gray-500" />, bg: 'bg-gray-50 border-gray-200' };
      default: return { text: status, icon: <Clock />, bg: 'bg-gray-50 border-gray-200' };
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-4 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-6 mt-8 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('Order Status')}</h1>
          <button 
            onClick={() => router.push(`/menu?table=${tableId}`)}
            className="flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <ArrowLeft size={16} /> {t('Add More Items')}
          </button>
        </div>

        {orders.filter(o => o.status !== 'paid' && o.status !== 'closed').length === 0 ? (
          <p className="text-center text-foreground/60">{t('No active orders found.')}</p>
        ) : (
          <div className="space-y-4">
            {orders.filter(o => o.status !== 'paid' && o.status !== 'closed').map(order => {
              const display = getStatusDisplay(order.status);
              return (
                <div key={order.id} className={`p-6 rounded-2xl shadow-sm border flex items-center gap-4 ${display.bg}`}>
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    {display.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{display.text}</h2>
                    <div className="mt-2 space-y-1">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm font-medium text-foreground/70">
                          {item.quantity}x {loc(item, 'menu_item_name')}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-8">
          <button 
            onClick={requestBill}
            className="w-full bg-foreground text-background py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors shadow-lg"
          >
            <ReceiptText size={20} />
            {t('Request Bill & Pay')}
          </button>
        </div>
      </div>
    </div>
  );
}
