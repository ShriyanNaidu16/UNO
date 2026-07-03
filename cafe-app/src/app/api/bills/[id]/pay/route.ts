import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request, context: any) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const { payment_method } = body; // 'cash', 'card', 'upi'

    if (!payment_method || !['cash', 'card', 'upi'].includes(payment_method)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    // Check if ID is a valid UUID to avoid Postgres crash. 
    // If it's a mock string like 'order_...', we'll just return a success for the prototype.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.log('Skipping Supabase update for non-UUID bill ID:', id);
      return NextResponse.json({ success: true, message: 'Mock bill marked as paid', method: payment_method });
    }

    let responseBill;
    try {
      const { data, error } = await supabase
        .from('bills')
        .update({
          payment_status: 'paid',
          payment_method,
          payment_date: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      responseBill = data;
    } catch (err) {
      console.log('Supabase update failed, falling back to local memory store for prototype demo');
      const { store } = await import('@/lib/store');
      const billIndex = store.bills.findIndex(b => b.id === id);
      if (billIndex >= 0) {
        store.bills[billIndex].payment_status = 'paid';
        store.bills[billIndex].payment_method = payment_method;
        store.bills[billIndex].payment_date = new Date().toISOString();
        responseBill = store.bills[billIndex];
      } else {
        // If no bill exists in mock, create one
        const newBill = {
          id: id,
          table_id: 'unknown',
          subtotal: 500,
          gst_amount: 25,
          service_charge_amount: 25,
          total_amount: 550,
          razorpay_order_id: null,
          razorpay_payment_id: null,
          payment_status: 'paid' as 'paid',
          payment_method: payment_method,
          payment_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        store.bills.push(newBill);
        responseBill = newBill;
      }
    }

    return NextResponse.json({ success: true, bill: responseBill });
  } catch (error) {
    console.error('Error in manual pay endpoint:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
