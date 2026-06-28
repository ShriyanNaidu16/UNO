import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function PATCH(request: Request) {
  const { orderId, status } = await request.json();

  const orderIndex = store.orders.findIndex(o => o.id === orderId);
  if (orderIndex > -1) {
    store.orders[orderIndex].status = status;
    return NextResponse.json({ success: true, order: store.orders[orderIndex] });
  }

  return NextResponse.json({ error: 'Order not found' }, { status: 404 });
}
