import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('table'); // This is actually table_number (e.g., "12")

    let query = supabase
      .from('orders')
      .select(`
        *,
        tables!inner(table_number),
        order_items(
          *,
          menu_items(name, name_te, name_hi, name_kn)
        )
      `)
      .order('created_at', { ascending: false });

    if (tableId) {
      query = query.eq('tables.table_number', parseInt(tableId));
    }

    const { data: orders, error } = await query;
    if (error) throw error;

    // Transform response to match frontend expectations
    const formattedOrders = orders?.map(order => ({
      ...order,
      table_number: order.tables?.table_number || parseInt(tableId || '12'), // fallback
      items: order.order_items?.map((item: any) => ({
        ...item,
        menu_item_name: item.menu_items?.name,
        menu_item_name_te: item.menu_items?.name_te,
        menu_item_name_hi: item.menu_items?.name_hi,
        menu_item_name_kn: item.menu_items?.name_kn,
      }))
    })) || [];

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tableId, tableNumber, items, customerName } = await request.json();
    const tNum = parseInt(tableNumber || tableId || '12');

    // Get the real UUID for the table
    const { data: tableData, error: tableError } = await supabase
      .from('tables')
      .select('id')
      .eq('table_number', tNum)
      .single();

    if (tableError || !tableData) throw new Error('Table not found');
    const realTableId = tableData.id;

    // Find current round
    const { data: existingOrders, error: roundError } = await supabase
      .from('orders')
      .select('round_number')
      .eq('table_id', realTableId)
      .neq('status', 'closed')
      .order('round_number', { ascending: false })
      .limit(1);

    const nextRound = existingOrders && existingOrders.length > 0 ? existingOrders[0].round_number + 1 : 1;

    // Insert Order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        table_id: realTableId,
        customer_name: customerName || null,
        status: 'placed',
        round_number: nextRound,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert Order Items
    const orderItemsToInsert = items.map((i: any) => ({
      order_id: newOrder.id,
      menu_item_id: i.item.id,
      quantity: i.quantity,
      price_at_order_time: i.item.price,
      special_instructions: null
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) throw itemsError;

    // Fetch the complete order to return
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        tables(table_number),
        order_items(
          *,
          menu_items(name, name_te, name_hi, name_kn)
        )
      `)
      .eq('id', newOrder.id)
      .single();

    if (fetchError) throw fetchError;

    const formattedOrder = {
      ...completeOrder,
      table_number: completeOrder.tables?.table_number || tableNumber || 12,
      items: completeOrder.order_items?.map((item: any) => ({
        ...item,
        menu_item_name: item.menu_items?.name,
        menu_item_name_te: item.menu_items?.name_te,
        menu_item_name_hi: item.menu_items?.name_hi,
        menu_item_name_kn: item.menu_items?.name_kn,
      }))
    };

    return NextResponse.json({ success: true, order: formattedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
