const fs = require('fs');

const qsrCategories = [
  { id: 'c15', name: 'QSR - Idly Specials', display_order: 15 },
  { id: 'c16', name: 'QSR - Classic Dosas', display_order: 16 },
  { id: 'c17', name: 'QSR - Signature', display_order: 17 },
  { id: 'c18', name: 'QSR - Vada & Bajji', display_order: 18 },
  { id: 'c19', name: 'QSR - Godavari Specials', display_order: 19 },
  { id: 'c20', name: 'QSR - Godavari Sweets', display_order: 20 },
  { id: 'c21', name: 'QSR - Thali & Rice', display_order: 21 },
  { id: 'c22', name: 'QSR - Beverages', display_order: 22 },
  { id: 'c23', name: 'QSR - Evening Snacks', display_order: 23 },
];

const qsrItemsData = [
  // c15: Idly Specials
  ['c15', 'Idli (2pcs)', 55],
  ['c15', 'Idli (3pcs)', 70],
  ['c15', 'Sambar Idli', 70],
  ['c15', 'Button Idli', 70],
  ['c15', 'Ravva Idli', 70],
  ['c15', 'Ghee Dip Idli', 75],
  ['c15', 'Ghee Podi Idli', 70],
  ['c15', 'Ghee Karam Idli', 85],
  ['c15', 'Idli + Vada Combo', 65],
  ['c15', 'Idli + Mysore Bajji Combo', 85],

  // c16: Classic Dosas
  ['c16', 'Plain Dosa', 70],
  ['c16', 'Onion Dosa', 80],
  ['c16', 'Masala Dosa', 85],
  ['c16', 'Ghee Dosa', 80],
  ['c16', 'Paper Dosa', 80],
  ['c16', 'Ravva Dosa', 80],
  ['c16', 'Ravva Onion Dosa', 90],
  ['c16', 'Masala Ravva Dosa', 95],

  // c17: Signature
  ['c17', 'Poori', 70],
  ['c17', 'Rainbow Poori', 65],
  ['c17', 'Perugu Avada', 65],
  ['c17', 'Bellam Pakam Gaari', 65],
  ['c17', 'Ghee Podi Dosa', 80],
  ['c17', 'Ghee Podi Masala Dosa', 90],
  ['c17', 'Ghee Podi Onion Dosa', 80],
  ['c17', 'Ghee Karam Dosa', 85],
  ['c17', 'Uthappam', 90],
  ['c17', 'Onion Uthappam', 100],
  ['c17', 'Kara Bath', 55],
  ['c17', 'Pesarattu', 80],
  ['c17', 'Upma Pesarattu', 100],

  // c18: Vada & Bajji
  ['c18', 'Vada (2pcs)', 70],
  ['c18', 'Vada (3pcs)', 65],
  ['c18', 'Sambar Vada', 60],
  ['c18', 'Mysore Bajji', 80],
  ['c18', 'Ulli Bajji', 70],

  // c19: Godavari Specials
  ['c19', '60 MM Dosa', 50],
  ['c19', '70 MM Dosa', 65],
  ['c19', 'Mysore Dosa', 65],
  ['c19', 'Paneer Cheese Dosa', 65],
  ['c19', 'Cheese Masala Dosa', 70],
  ['c19', 'Godavari Spcl Dosa', 75],
  ['c19', 'Godavari Spcl Ravva Dosa', 80],
  ['c19', 'Chapati', 80],
  ['c19', 'Parota', 80],
  ['c19', 'Chole Bature', 80],

  // c20: Godavari Sweets
  ['c20', 'Annavaram Prasadam', 50],
  ['c20', 'Carrot Halwa', 65],
  ['c20', 'Gumidikai Halwa', 65],
  ['c20', 'Kesari Bath', 65],
  ['c20', 'Ravva Kesari', 85],
  ['c20', 'Bread Halwa', 85],
  ['c20', 'Semiya Payasam', 45],
  ['c20', 'Gulab Jamun', 50],

  // c21: Thali & Rice
  ['c21', 'Andhra Thali', 50],
  ['c21', 'Sambar Rice', 65],
  ['c21', 'Gongura Rice', 65],
  ['c21', 'Mudha Pappu Avakai', 65],
  ['c21', 'Kothimeera Rice', 70],
  ['c21', 'Pulihora', 75],
  ['c21', 'Curd Rice', 80],
  ['c21', 'Fruit Curd Rice', 80],

  // c22: Beverages
  ['c22', 'Tea', 20],
  ['c22', 'Masala Tea', 25],
  ['c22', 'Ginger Tea', 20],
  ['c22', 'Lemon Tea', 20],
  ['c22', 'Green Tea', 25],
  ['c22', 'Coffee', 25],
  ['c22', 'Black Coffee', 25],
  ['c22', 'Milk', 20],
  ['c22', 'Boost/Horlicks', 25],
  ['c22', 'Badam Milk', 30],
  ['c22', 'Godavari Spcl Rose Milk', 100],

  // c23: Evening Snacks
  ['c23', 'Mirapakai Bajji Plain (2 pcs)', 40],
  ['c23', 'Onion Pakoda', 40],
  ['c23', 'Samosa (2 pcs)', 40],
  ['c23', 'Masala Vada (2 pcs)', 30],
  ['c23', 'Challa Punugulu', 40],
  ['c23', 'Cornflakes Mixture', 40],
  ['c23', 'Cut Mirchi Bajji', 40],
  ['c23', 'Stuffed Bajji', 60]
];

let itemsStr = "";
let startIdx = 114;
for (const [cat, name, price] of qsrItemsData) {
  itemsStr += `  { id: 'm${startIdx++}', category_id: '${cat}', name: '${name}', name_te: '${name}', name_hi: '${name}', name_kn: '${name}', description: 'Delicious ${name}', description_te: 'Delicious ${name}', description_hi: 'Delicious ${name}', description_kn: 'Delicious ${name}', price: ${price}, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },\n`;
}

let catStr = "";
for (const c of qsrCategories) {
  catStr += `  { id: '${c.id}', name: '${c.name}', name_te: '${c.name}', name_hi: '${c.name}', name_kn: '${c.name}', display_order: ${c.display_order}, created_at: new Date().toISOString() },\n`;
}

let storeData = fs.readFileSync('src/lib/store.ts', 'utf8');

// Insert new categories at the end of initialCategories
storeData = storeData.replace(
  "  { id: 'c14', name: 'Desserts', name_te: 'Desserts', name_hi: 'Desserts', name_kn: 'Desserts', display_order: 14, created_at: new Date().toISOString() },\n];",
  "  { id: 'c14', name: 'Desserts', name_te: 'Desserts', name_hi: 'Desserts', name_kn: 'Desserts', display_order: 14, created_at: new Date().toISOString() },\n" + catStr + "];"
);

// Insert new items at the end of initialItems
storeData = storeData.replace(
  "  { id: 'm113', category_id: 'c14', name: 'Ice Cream Delight', name_te: 'Ice Cream Delight', name_hi: 'Ice Cream Delight', name_kn: 'Ice Cream Delight', description: 'A refreshing creamy dessert served with delightful sweet flavors.', description_te: 'A refreshing creamy dessert served with delightful sweet flavors.', description_hi: 'A refreshing creamy dessert served with delightful sweet flavors.', description_kn: 'A refreshing creamy dessert served with delightful sweet flavors.', price: 199, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },\n];",
  "  { id: 'm113', category_id: 'c14', name: 'Ice Cream Delight', name_te: 'Ice Cream Delight', name_hi: 'Ice Cream Delight', name_kn: 'Ice Cream Delight', description: 'A refreshing creamy dessert served with delightful sweet flavors.', description_te: 'A refreshing creamy dessert served with delightful sweet flavors.', description_hi: 'A refreshing creamy dessert served with delightful sweet flavors.', description_kn: 'A refreshing creamy dessert served with delightful sweet flavors.', price: 199, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },\n" + itemsStr + "];"
);

fs.writeFileSync('src/lib/store.ts', storeData);
console.log('done');
