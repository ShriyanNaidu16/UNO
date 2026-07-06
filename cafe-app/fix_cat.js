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

let catStr = "";
for (const c of qsrCategories) {
  catStr += `  { id: '${c.id}', name: '${c.name}', name_te: '${c.name}', name_hi: '${c.name}', name_kn: '${c.name}', display_order: ${c.display_order}, created_at: new Date().toISOString() },\n`;
}

let storeData = fs.readFileSync('src/lib/store.ts', 'utf8');

// The exact string to replace
const targetStr = `  { id: 'c14', name: 'Desserts', name_te: 'Desserts', name_hi: 'Desserts', name_kn: 'Desserts', display_order: 14, created_at: new Date().toISOString() },\n\n];`;

const newStr = `  { id: 'c14', name: 'Desserts', name_te: 'Desserts', name_hi: 'Desserts', name_kn: 'Desserts', display_order: 14, created_at: new Date().toISOString() },\n` + catStr + `];`;

storeData = storeData.replace(targetStr, newStr);

fs.writeFileSync('src/lib/store.ts', storeData);
console.log('Categories appended');
