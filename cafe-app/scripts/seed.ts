import { createClient } from '@supabase/supabase-js';

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

const initialCategories = [
  { id: toUuid('c', "c8"), name: "Soups", display_order: 8 },
  { id: toUuid('c', "c9"), name: "Appetizers", display_order: 9 },
  { id: toUuid('c', "c10"), name: "Thali & Rice", display_order: 10 },
  { id: toUuid('c', "c11"), name: "Indian Curries", display_order: 11 },
  { id: toUuid('c', "c12"), name: "Indian Breads", display_order: 12 },
  { id: toUuid('c', "c13"), name: "Noodles & Rice", display_order: 13 },
  { id: toUuid('c', "c14"), name: "Desserts", display_order: 14 },
  { id: toUuid('c', "c15"), name: "QSR - Idly Specials", display_order: 15 },
  { id: toUuid('c', "c16"), name: "QSR - Classic Dosas", display_order: 16 },
  { id: toUuid('c', "c17"), name: "QSR - Signature", display_order: 17 },
  { id: toUuid('c', "c18"), name: "QSR - Vada & Bajji", display_order: 18 },
  { id: toUuid('c', "c19"), name: "QSR - Godavari Specials", display_order: 19 },
  { id: toUuid('c', "c20"), name: "QSR - Godavari Sweets", display_order: 20 },
  { id: toUuid('c', "c21"), name: "QSR - Thali & Rice", display_order: 21 },
  { id: toUuid('c', "c22"), name: "QSR - Beverages", display_order: 22 },
  { id: toUuid('c', "c23"), name: "QSR - Evening Snacks", display_order: 23 },
];

const initialItems = [
  { id: toUuid('a', "m16"), category_id: toUuid('c', "c8"), name: "Sweet Corn", description: "A comforting blend of sweet corn kernels simmered in a light flavourful broth.", price: 199, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop", is_available: true, veg_nonveg_tag: "veg" },
  { id: toUuid('a', "m17"), category_id: toUuid('c', "c8"), name: "Veg Manchow", description: "Mixed vegetables cooked in spicy Indo-Chinese flavours with rich seasonings.", price: 199, image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop", is_available: true, veg_nonveg_tag: "veg" },
  { id: toUuid('a', "m18"), category_id: toUuid('c', "c8"), name: "Hot & Sour", description: "A bold combination of tangy and spicy flavor with fresh vegetables.", price: 199, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop", is_available: true, veg_nonveg_tag: "veg" },
  { id: toUuid('a', "m23"), category_id: toUuid('c', "c9"), name: "Konaseema Paneer", description: "Soft paneer cubes cooked in a rich blend of aromatic flavors and a coastal touch.", price: 199, image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop", is_available: true, veg_nonveg_tag: "veg" },
  { id: toUuid('a', "m40"), category_id: toUuid('c', "c10"), name: "Andhra Thali", description: "A wholesome platter featuring authentic Andhra delicacies, flavorful curries, rice, accompaniments & traditional tastes.", price: 199, image_url: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=400&auto=format&fit=crop", is_available: true, veg_nonveg_tag: "veg" },
];

async function seed() {
  console.log('Seeding categories...');
  for (const category of initialCategories) {
    const { error } = await supabase.from('menu_categories').upsert(category, { onConflict: 'id' });
    if (error) console.error('Error seeding category', category.id, error.message);
  }

  console.log('Seeding items...');
  for (const item of initialItems) {
    const { error } = await supabase.from('menu_items').upsert(item, { onConflict: 'id' });
    if (error) console.error('Error seeding item', item.id, error.message);
  }

  console.log('Seeding dummy table...');
  const { error: tableError } = await supabase.from('tables').upsert({
    id: 'd9b9d3b3-8b7a-4b9b-9c6c-6b3a3d5e2a2c',
    table_number: 12,
    status: 'idle'
  }, { onConflict: 'table_number' });

  if (tableError) {
    console.error('Table seed error (likely RLS). You can ignore this if you already have tables set up:', tableError.message);
  }

  console.log('Seeding complete!');
}

seed();
