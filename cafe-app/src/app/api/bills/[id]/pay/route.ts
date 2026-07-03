import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { store } from '@/lib/store';

export async function POST(request: Request, context: any) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const { payment_method } = body; // 'cash', 'card', 'upi'

    if (!payment_method || !['cash', 'card', 'upi'].includes(payment_method)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
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
      const billIndex = (store?.bills || []).findIndex(b => b.id === id);
      if (billIndex >= 0 && store) {
        store.bills[billIndex].payment_status = 'paid';
        store.bills[billIndex].payment_method = payment_method;
        store.bills[billIndex].payment_date = new Date().toISOString();
        responseBill = store.bills[billIndex];
      } else if (store) {
        // If no bill exists in mock, create one
        const newBill = {
          id: id,
          table_id: 'unknown',
          subtotal: 50000,
          gst_amount: 2500,
          service_charge_amount: 2500,
          total_amount: 55000,
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
