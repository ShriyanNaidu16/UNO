import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Check if it's the expected event
    if (payload.event === 'payment.captured' && payload.payload?.payment?.entity) {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      let method = paymentEntity.method; // 'card', 'upi', 'wallet', 'netbanking' etc
      
      if (method === 'wallet') {
        method = 'upi';
      }
      
      if (!['upi', 'card', 'cash'].includes(method)) {
        // Fallback for unexpected methods to still process the bill
        method = 'card';
      }

      // Update the bill in Supabase
      const { error } = await supabase
        .from('bills')
        .update({
          payment_status: 'paid',
          payment_method: method,
          payment_date: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpayOrderId);
        
      if (error) {
        console.error('Error updating bill from webhook:', error);
        return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // Ignore other events
    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
