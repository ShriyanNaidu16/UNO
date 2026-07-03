import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, subtotal, gst_amount, service_charge_amount, total_amount, payment_method } = body;

    if (!tableId || !total_amount || !payment_method) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBill = {
      id: `bill-${Date.now()}`,
      table_id: tableId,
      subtotal,
      gst_amount,
      service_charge_amount,
      total_amount,
      razorpay_order_id: null,
      razorpay_payment_id: null,
      payment_status: 'paid' as const,
      payment_method: payment_method as 'upi' | 'card' | 'cash',
      payment_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    store.bills.push(newBill);

    // Mark active orders for this table as paid
    store.orders = store.orders.map(order => {
      if (order.table_id === tableId && order.status !== 'closed' && order.status !== 'paid') {
        return { ...order, status: 'paid' };
      }
      return order;
    });

    return NextResponse.json({ success: true, bill: newBill });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
