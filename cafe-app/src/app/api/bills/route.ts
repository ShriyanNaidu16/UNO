import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, subtotal, gst_amount, service_charge_amount, total_amount, payment_method } = body;

    if (!tableId || !total_amount || !payment_method) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: tableData, error: tableError } = await supabase
      .from('tables')
      .select('id')
      .eq('table_number', parseInt(tableId))
      .single();
    if (tableError || !tableData) throw new Error('Table not found');
    const realTableId = tableData.id;

    const { data: newBill, error: billError } = await supabase
      .from('bills')
      .insert({
        table_id: realTableId,
        subtotal,
        gst_amount,
        service_charge_amount,
        total_amount,
        razorpay_order_id: null,
        razorpay_payment_id: null,
        payment_status: 'paid',
        payment_method: payment_method as 'upi' | 'card' | 'cash',
        payment_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (billError) throw billError;

    // Mark active orders for this table as paid
    const { error: orderError } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('table_id', realTableId)
      .neq('status', 'closed')
      .neq('status', 'paid');

    if (orderError) throw orderError;

    return NextResponse.json({ success: true, bill: newBill });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
