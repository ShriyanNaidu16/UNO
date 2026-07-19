import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('key') !== 'secret-seed-key') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Seed Categories
    console.log('Seeding categories...');
    for (const category of store.categories) {
      const { data, error } = await supabase.from('menu_categories').upsert({
        id: category.id,
        name: category.name,
        name_te: category.name_te,
        name_hi: category.name_hi,
        name_kn: category.name_kn,
        display_order: category.display_order,
      }, { onConflict: 'id' });
      
      if (error) console.error('Error seeding category', category.id, error);
    }

    // 2. Seed Items
    console.log('Seeding items...');
    for (const item of store.items) {
      const { data, error } = await supabase.from('menu_items').upsert({
        id: item.id,
        category_id: item.category_id,
        name: item.name,
        name_te: item.name_te,
        name_hi: item.name_hi,
        name_kn: item.name_kn,
        description: item.description,
        description_te: item.description_te,
        description_hi: item.description_hi,
        description_kn: item.description_kn,
        price: item.price,
        image_url: item.image_url,
        is_available: item.is_available,
        veg_nonveg_tag: item.veg_nonveg_tag,
      }, { onConflict: 'id' });
      
      if (error) console.error('Error seeding item', item.id, error);
    }

    // 3. Optional: Seed a table for testing
    // Since tables table doesn't have a unique constraint on table_number in some schemas but ours has UNIQUE
    const { error: tableError } = await supabase.from('tables').upsert({
      id: 'd9b9d3b3-8b7a-4b9b-9c6c-6b3a3d5e2a2c', // Just a dummy UUID
      table_number: 12,
      status: 'idle'
    }, { onConflict: 'table_number' });

    if (tableError) {
      console.log('Table seed error', tableError);
    }

    return NextResponse.json({ success: true, message: 'Seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
