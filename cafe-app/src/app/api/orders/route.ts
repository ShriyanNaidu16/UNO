import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { Order, OrderItem } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tableId = searchParams.get('table');

  if (tableId) {
    // Return orders for specific table
    const tableOrders = store.orders.filter(o => o.table_id === tableId);
    return NextResponse.json({ orders: tableOrders });
  }

  // Return all active orders (for kitchen)
  return NextResponse.json({ orders: store.orders });
}

export async function POST(request: Request) {
  const { tableId, tableNumber, items, customerName } = await request.json();

  const newOrderId = `o${Date.now()}`;
  
  // Find current round
  const existingOrders = store.orders.filter(o => o.table_id === tableId && o.status !== 'closed');
  const nextRound = existingOrders.length > 0 ? existingOrders[existingOrders.length - 1].round_number + 1 : 1;

  const newOrder: Order & { table_number: number, items: (OrderItem & { menu_item_name: string })[] } = {
    id: newOrderId,
    table_id: tableId,
    table_number: tableNumber || 12,
    customer_name: customerName || null,
    status: 'placed',
    round_number: nextRound,
    created_at: new Date().toISOString(),
    items: items.map((i: any, index: number) => ({
      id: `oi${Date.now()}${index}`,
      order_id: newOrderId,
      menu_item_id: i.item.id,
      menu_item_name: i.item.name,
      menu_item_name_te: i.item.name_te,
      menu_item_name_hi: i.item.name_hi,
      menu_item_name_kn: i.item.name_kn,
      quantity: i.quantity,
      price_at_order_time: i.item.price,
      special_instructions: null,
      created_at: new Date().toISOString()
    }))
  };

  store.orders.push(newOrder);

  return NextResponse.json({ success: true, order: newOrder });
}
