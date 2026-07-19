import { createClient } from '@supabase/supabase-js';
import { initialCategories, initialItems } from '../old_store';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

if (supabaseUrl === 'https://mock.supabase.co' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('ERROR: Please set real NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const toUuid = (prefix: string, idStr: string) => {
  const num = idStr.replace(/[^0-9]/g, '').padStart(12, '0');
  const p = prefix.repeat(8).slice(0, 8);
  return `${p}-0000-0000-0000-${num}`;
};

async function seed() {
  console.log(`Seeding ${initialCategories.length} categories...`);
  for (const category of initialCategories) {
    const formattedCategory = {
      id: toUuid('c', category.id),
      name: category.name,
      name_te: category.name_te,
      name_hi: category.name_hi,
      name_kn: category.name_kn,
      display_order: category.display_order
    };
    const { error } = await supabase.from('menu_categories').upsert(formattedCategory, { onConflict: 'id' });
    if (error) console.error('Error seeding category', category.id, error.message);
  }

  console.log(`Seeding ${initialItems.length} items...`);
  for (const item of initialItems) {
    const formattedItem = {
      id: toUuid('a', item.id),
      category_id: toUuid('c', item.category_id),
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
      veg_nonveg_tag: item.veg_nonveg_tag
    };
    const { error } = await supabase.from('menu_items').upsert(formattedItem, { onConflict: 'id' });
    if (error) console.error('Error seeding item', item.id, error.message);
  }

  console.log('Seeding complete!');
}

seed();
