import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import { MenuItem } from '@/lib/types';

export async function GET() {
  try {
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from('menu_categories').select('*').order('display_order', { ascending: true }),
      supabase.from('menu_items').select('*')
    ]);

    if (categoriesRes.error) throw categoriesRes.error;
    if (itemsRes.error) throw itemsRes.error;

    return NextResponse.json({
      categories: categoriesRes.data || [],
      items: itemsRes.data || [],
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, category_id, veg_nonveg_tag, image_url } = await request.json();

    const { data, error } = await supabase.from('menu_items').insert({
      category_id,
      name,
      description,
      price: parseFloat(price),
      image_url: image_url || null,
      is_available: true,
      veg_nonveg_tag,
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

