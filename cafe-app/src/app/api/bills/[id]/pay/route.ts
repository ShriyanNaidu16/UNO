import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request, context: any) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const { payment_method } = body; // 'cash', 'card', 'upi'

    if (!payment_method || !['cash', 'card', 'upi'].includes(payment_method)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    const { data: responseBill, error } = await supabase
      .from('bills')
      .update({
        payment_status: 'paid',
        payment_method,
        payment_date: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update failed:', error);
      return NextResponse.json({ error: 'Bill not found or could not be updated' }, { status: 404 });
    }

    return NextResponse.json({ success: true, bill: responseBill });
  } catch (error) {
    console.error('Error in manual pay endpoint:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
