const fs = require('fs');
const path = './src/lib/store.ts';

let content = fs.readFileSync(path, 'utf8');

const getImageUrl = (name) => {
  const n = name.toLowerCase();
  if (n.includes('soup') || n.includes('shurba') || n.includes('manchow')) return "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop";
  if (n.includes('paneer') || n.includes('curry') || n.includes('kofta') || n.includes('masala')) return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop";
  if (n.includes('mushroom')) return "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=400&auto=format&fit=crop";
  if (n.includes('thali') || n.includes('rice') || n.includes('pulao') || n.includes('annam') || n.includes('biryani') || n.includes('bisi')) return "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=400&auto=format&fit=crop";
  if (n.includes('naan') || n.includes('roti') || n.includes('kulcha') || n.includes('paratha') || n.includes('bread')) return "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&auto=format&fit=crop";
  if (n.includes('noodle') || n.includes('chowmein')) return "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop";
  if (n.includes('sweet') || n.includes('dessert') || n.includes('jamun') || n.includes('halwa') || n.includes('kheer')) return "https://images.unsplash.com/photo-1589110486892-db82143bc310?q=80&w=400&auto=format&fit=crop";
  if (n.includes('dosa') || n.includes('uttapam')) return "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=400&auto=format&fit=crop";
  if (n.includes('idly') || n.includes('idli')) return "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=400&auto=format&fit=crop";
  if (n.includes('vada') || n.includes('bajji') || n.includes('bonda')) return "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=400&auto=format&fit=crop";
  if (n.includes('coffee') || n.includes('tea') || n.includes('milk') || n.includes('lassi') || n.includes('drink')) return "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=400&auto=format&fit=crop";
  if (n.includes('corn') || n.includes('kabab') || n.includes('tikka') || n.includes('65') || n.includes('chilly') || n.includes('veg')) return "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop";
  // fallback for dishes
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop";
};

// We will find each item definition and replace the image_url.
// Item definition looks like: { id: 'm16', ... name: 'Sweet Corn', ... image_url: '...', ... }

content = content.replace(/({[^}]*name:\s*'([^']+)'[^}]*image_url:\s*')([^']+)('[^}]*})/g, (match, p1, name, p3, p4) => {
  return p1 + getImageUrl(name) + p4;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Updated store.ts with relevant images.');
