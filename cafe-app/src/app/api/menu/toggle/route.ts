import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  const { itemId, isAvailable } = await request.json();

  const itemIndex = store.items.findIndex(i => i.id === itemId);
  if (itemIndex > -1) {
    store.items[itemIndex].is_available = isAvailable;
    return NextResponse.json({ success: true, item: store.items[itemIndex] });
  }

  return NextResponse.json({ error: 'Item not found' }, { status: 404 });
}
