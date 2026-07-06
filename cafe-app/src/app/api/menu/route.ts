import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { store } from '@/lib/store';
import { MenuItem } from '@/lib/types';

export async function GET() {
  return NextResponse.json({
    categories: store.categories,
    items: store.items,
  });
}

export async function POST(request: Request) {
  const { name, description, price, category_id, veg_nonveg_tag, image_url } = await request.json();

  const newItem: MenuItem = {
    id: `m${Date.now()}`,
    category_id,
    name,
    description,
    price: parseInt(price),
    image_url: image_url || null,
    is_available: true,
    veg_nonveg_tag,
    created_at: new Date().toISOString(),
  };

  store.items.push(newItem);

  return NextResponse.json({ success: true, item: newItem });
}

