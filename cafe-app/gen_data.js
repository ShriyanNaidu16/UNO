const fs = require('fs');
const newCategories = [
  { id: 'c8', name: 'Soups', display_order: 8 },
  { id: 'c9', name: 'Appetizers', display_order: 9 },
  { id: 'c10', name: 'Thali & Rice', display_order: 10 },
  { id: 'c11', name: 'Indian Curries', display_order: 11 },
  { id: 'c12', name: 'Indian Breads', display_order: 12 },
  { id: 'c13', name: 'Noodles & Rice', display_order: 13 },
  { id: 'c14', name: 'Desserts', display_order: 14 }
];

const newItemsData = [
  ['c8', 'Sweet Corn', 'A comforting blend of sweet corn kernels simmered in a light flavourful broth.', 199, 'veg'],
  ['c8', 'Veg Manchow', 'Mixed vegetables cooked in spicy Indo-Chinese flavours with rich seasonings.', 199, 'veg'],
  ['c8', 'Hot & Sour', 'A bold combination of tangy and spicy flavor with fresh vegetables.', 199, 'veg'],
  ['c8', 'Lemon Coriander', 'A refreshing broth infused with zesty lemon and aromatic coriander.', 199, 'veg'],
  ['c8', 'Potato Scallion', 'Creamy potato soup enchanced with fresh scallions and mild seasonings.', 199, 'veg'],
  ['c8', 'Tomato Dhaniya Shurba', 'Tangy tomato broth infused with fresh coriander and aromatic spices.', 199, 'veg'],
  ['c8', 'Cream of Mushroom', 'A rich and creamy soup made with your choice of mushroom or tomato.', 199, 'veg'],

  ['c9', 'Konaseema Paneer', 'Soft paneer cubes cooked in a rich blend of aromatic flavors and a coastal touch.', 199, 'veg'],
  ['c9', 'Paneer Ghee Roast', 'Paneer cubes tossed in aromatic ghee & roasted spices.', 199, 'veg'],
  ['c9', 'Paneer Manchurian', 'Soft paneer cubes tossed in spicy Indo-Chinese sauces and fresh aromatics.', 199, 'veg'],
  ['c9', 'Chilly Mushroom', 'Juicy mushrooms stir-fried with peppers, onions, and spicy chili flavors.', 199, 'veg'],
  ['c9', 'Mushroom Manchurian', 'Crispy mushrooms coated in tangy Manchurian sauce with bold seasonings.', 199, 'veg'],
  ['c9', 'Crispy Corn', 'Golden fried sweet corn tossed with spices and crunchy seasonings.', 199, 'veg'],
  ['c9', 'Kaju Seek Kabab', 'Rich cashew and spice blend shaped into smoky seek kebabs.', 199, 'veg'],
  ['c9', 'Tandoori Malai Broccoli', 'Fresh broccoli florets marinated in creamy malai, aromatic spices & roasted to perfection in tandoor.', 199, 'veg'],
  ['c9', 'Paneer Tikka', 'Paneer cubes marinated with aromatic spices and grilled to perfection.', 199, 'veg'],
  ['c9', 'Kaju Tikki', 'Crispy cashew patties blended with flavorful herbs and spices.', 199, 'veg'],
  ['c9', 'Hariyali Paneer Tikka', 'Paneer marinated in fresh green herbs and grilled with smoky flavors.', 199, 'veg'],
  ['c9', 'Malai Cheese', 'Soft cheese marinated in creamy malai and mildly spiced seasonings.', 199, 'veg'],
  ['c9', 'Babycorn 65', 'Crispy baby corn tossed with spicy South Indian style seasonings.', 199, 'veg'],
  ['c9', 'Mushroom 65', 'Fried mushrooms coated with fiery spices and aromatic curry flavors.', 199, 'veg'],
  ['c9', 'Tandoori Mushroom', 'Mushrooms marinated with tandoori spices and char-grilled to perfection.', 199, 'veg'],
  ['c9', 'Paneer Seek Kabab', 'Minced paneer blended with spices and grilled in seek style.', 199, 'veg'],
  ['c9', 'Corn Seek Kabab', 'Sweet corn mixed with herbs and spices, grilled into seek kebabs.', 199, 'veg'],

  ['c10', 'Andhra Thali', 'A wholesome platter featuring authentic Andhra delicacies, flavorful curries, rice, accompaniments & traditional tastes.', 199, 'veg'],
  ['c10', 'Maharastra Thali', 'A traditional platter featuring authentic Maharashtrian delicacies with flavorful curries, breads, rice & regional specialties.', 199, 'veg'],
  ['c10', 'Pappu Avakai Annam', 'Steamed rice mixed with comforting dal and spicy avakai pickle for a flavorful traditional Andhra taste.', 199, 'veg'],
  ['c10', 'Vegetable Pulao', 'Fragrant rice cooked with fresh vegetables and aromatic whole spices.', 199, 'veg'],
  ['c10', 'Pachi Mirchi Pulao', 'Flavorful rice infused with green chilies and aromatic spice notes.', 199, 'veg'],
  ['c10', 'Pulihora', 'Traditional tangy tamarind purry tempered with white rice.', 199, 'veg'],
  ['c10', 'Tomato Rice', 'Rice cooked with juicy tomatoes and flavorful South Indian spices.', 199, 'veg'],
  ['c10', 'Gongura Rice', 'Tangy sorrel leaves blended with rice and authentic regional spices.', 199, 'veg'],
  ['c10', 'Sambar Rice', 'Comforting rice cooked with lentils, vegetables, and flavorful sambar spices.', 199, 'veg'],
  ['c10', 'Jeera Rice', 'Fragrant basmati rice tempered with aromatic cumin and mild spices.', 199, 'veg'],
  ['c10', 'Rasam Rice', 'Steamed rice mixed with spicy and tangy South Indian rasam flavors.', 199, 'veg'],
  ['c10', 'Curd Rice', 'Creamy yogurt rice tempered with traditional spices for a refreshing taste.', 199, 'veg'],
  ['c10', 'Fruit Curd Rice', 'Classic curd rice enhanced with fresh fruits and subtle sweet flavors.', 199, 'veg'],

  ['c11', 'Paneer Butter Masala', 'Soft paneer cubes simmered in a rich buttery tomato gravy.', 199, 'veg'],
  ['c11', 'Paneer Tikka Masala', 'Grilled paneer cooked in a smoky and flavorful spiced gravy.', 199, 'veg'],
  ['c11', 'Paneer Kolhapuri', 'Paneer cooked in a spicy and aromatic Kolhapuri-style masala.', 199, 'veg'],
  ['c11', 'Paneer Methi Chaman', 'Paneer simmered with fresh fenugreek leaves in a creamy gravy.', 199, 'veg'],
  ['c11', 'Kadai Paneer', 'Paneer cooked with bell peppers and freshly ground kadai spices.', 199, 'veg'],
  ['c11', 'Palak Paneer', 'Soft paneer cubes blended with creamy spinach and aromatic seasonings.', 199, 'veg'],
  ['c11', 'Paneer Do Pyaz', 'Paneer cooked with generous onions and rich flavorful spices.', 199, 'veg'],
  ['c11', 'Paneer Pasanti', 'Stuffed paneer delicacies cooked in a rich creamy gravy.', 199, 'veg'],
  ['c11', 'Malai Kofta', 'Soft vegetable and paneer dumplings served in a creamy rich gravy.', 199, 'veg'],
  ['c11', 'Mushroom Butter Masala', 'Mushrooms simmered in a rich buttery tomato-based gravy.', 199, 'veg'],
  ['c11', 'Kadai Mushroom', 'Mushrooms cooked with bell peppers and bold kadai spices.', 199, 'veg'],
  ['c11', 'Mushroom Tikka Masala', 'Grilled mushrooms cooked in a smoky and flavorful masala gravy.', 199, 'veg'],
  ['c11', 'Palak Mushroom', 'Fresh mushrooms blended with creamy spinach and aromatic spices.', 199, 'veg'],
  ['c11', 'Mattar Mushroom', 'Mushrooms and green peas cooked in a flavorful spiced gravy.', 199, 'veg'],
  ['c11', 'Mixed Veg Curry', 'Seasonal vegetables cooked together in a rich aromatic gravy.', 199, 'veg'],
  ['c11', 'Kadai Veg', 'Fresh vegetables tossed in bold kadai spices and rich flavors.', 199, 'veg'],
  ['c11', 'Aloo Mattar', 'Potatoes and green peas cooked in a homestyle spiced gravy.', 199, 'veg'],
  ['c11', 'Aloo Zeera', 'Potatoes sautéed with aromatic cumin and traditional Indian spices.', 199, 'veg'],
  ['c11', 'Bendi Do Pyaz', 'Fresh okra cooked with onions and flavorful spice blends.', 199, 'veg'],
  ['c11', 'Dal Fry', 'Lentils tempered with spices and cooked to comforting perfection.', 199, 'veg'],
  ['c11', 'Dal Thadka', 'Yellow lentils finished with a flavorful tempering of spices and herbs.', 199, 'veg'],
  ['c11', 'Dal Makhani', 'Slow-cooked black lentils in a rich creamy buttery preparation.', 199, 'veg'],
  ['c11', 'Palak Dal', 'Lentils cooked with fresh spinach and mild aromatic seasonings.', 199, 'veg'],
  ['c11', 'Methi Dal', 'Lentils simmered with fresh fenugreek leaves and traditional spices.', 199, 'veg'],
  ['c11', 'Ghee Dal Thadka', 'Lentils tempered in aromatic ghee with rich traditional flavors.', 199, 'veg'],

  ['c12', 'Tandoori Roti', 'Whole wheat flatbread baked fresh in a traditional tandoor.', 199, 'veg'],
  ['c12', 'Garlic Roti', 'Tandoori roti topped with aromatic garlic and fresh herbs.', 199, 'veg'],
  ['c12', 'Butter Roti', 'Soft whole wheat bread brushed with rich melted butter.', 199, 'veg'],
  ['c12', 'Ghee Roti', 'Freshly baked roti finished with aromatic pure ghee.', 199, 'veg'],
  ['c12', 'Pulka', 'Soft and light whole wheat bread cooked to fluffy perfection.', 199, 'veg'],
  ['c12', 'Butter Pulka', 'Fluffy wheat bread brushed generously with rich melted butter.', 199, 'veg'],
  ['c12', 'Butter Naan', 'Soft tandoor-baked naan finished with a layer of butter.', 199, 'veg'],
  ['c12', 'Plain Naan', 'Traditional soft and fluffy naan baked fresh in the tandoor.', 199, 'veg'],
  ['c12', 'Garlic Naan', 'Soft naan topped with flavourful garlic and fresh herbs.', 199, 'veg'],
  ['c12', 'Cheese Naan', 'Soft naan stuffed with rich melted cheese filling.', 199, 'veg'],
  ['c12', 'Kashmiri Naan', 'Sweet and flavorful naan filled with nuts and dried fruits.', 199, 'veg'],
  ['c12', 'Aloo Paratha', 'Whole wheat flatbread stuffed with spiced potato filling.', 199, 'veg'],
  ['c12', 'Stuffed Kulcha', 'Soft tandoor-baked bread filled with flavorful spiced stuffing.', 199, 'veg'],
  ['c12', 'Cheese Stuffed Kulcha', 'Soft kulcha generously stuffed with rich melted cheese.', 199, 'veg'],
  ['c12', 'Kaju Cheese Stuffed Kulcha', 'Kulcha filled with rich cashews and creamy cheese stuffing.', 199, 'veg'],
  ['c12', 'Paneer Stuffed Kulcha', 'Soft kulcha stuffed with flavorful paneer and aromatic spices.', 199, 'veg'],
  ['c12', 'Tandoori Chapati', 'Traditional wheat flatbread baked fresh in a tandoor oven.', 199, 'veg'],

  ['c13', 'Chilly Garlic Noodles', 'Stir-fried noodles tossed with spicy chilies and aromatic garlic.', 199, 'veg'],
  ['c13', 'Singapore Noodles', 'Flavorful noodles tossed with vegetables and signature Singapore-style spices.', 199, 'veg'],
  ['c13', 'Burn Garlic Noodles', 'Noodles infused with smoky roasted garlic and bold flavors.', 199, 'veg'],
  ['c13', 'Schezhwan Noodles', 'Stir-fried noodles coated in fiery Schezwan sauce and vegetables.', 199, 'veg'],
  ['c13', 'Malaysian Noodles', 'Noodles tossed with vegetables in rich Malaysian-inspired flavors.', 199, 'veg'],
  ['c13', 'Hong Kong Noodles', 'Classic stir-fried noodles with vegetables and savory Asian seasonings.', 199, 'veg'],
  ['c13', 'Chilly Basil Noodles', 'Noodles tossed with spicy chilies and fragrant basil flavors.', 199, 'veg'],
  ['c13', 'Five Spicy Noodles', 'Flavor-packed noodles infused with five layers of spicy seasonings.', 199, 'veg'],
  ['c13', 'Veg Fried Rice', 'Fragrant rice stir-fried with fresh vegetables and savory flavours.', 199, 'veg'],
  ['c13', 'Cottage Cheese & Mushroom Fried Rice', 'Fried rice tossed with paneer, mushrooms, and flavorful seasonings.', 199, 'veg'],
  ['c13', 'Soya Chilly Veg Fried Rice', 'Vegetable fried rice enhanced with soy and spicy chili flavors.', 199, 'veg'],
  ['c13', 'Five Spicy Veg Fried Rice', 'Stir-fried rice infused with bold layers of spicy flavors.', 199, 'veg'],
  ['c13', 'Kaju Fried Rice', 'Fragrant fried rice tossed with crunchy cashews and aromatic seasonings.', 199, 'veg'],

  ['c14', 'Semiya payasam', 'Traditional vermicelli pudding simmered with milk and delicate sweetness.', 199, 'veg'],
  ['c14', 'Bread Halwa', 'Rich and indulgent bread pudding cooked with ghee and dry fruits.', 199, 'veg'],
  ['c14', 'Carrot Halwa', 'Slow-cooked grated carrots blended with milk, ghee, and sweetness.', 199, 'veg'],
  ['c14', 'Apricot Delight', 'A luscious dessert layered with apricot flavors and creamy richness.', 199, 'veg'],
  ['c14', 'Annavaram Prasadam', 'A traditional sweet delicacy prepared with rich flavors and devotion-inspired taste.', 199, 'veg'],
  ['c14', 'Ice Cream Delight', 'A refreshing creamy dessert served with delightful sweet flavors.', 199, 'veg']
];

let itemsStr = "";
let startIdx = 16;
for (const [cat, name, desc, price, vegType] of newItemsData) {
  itemsStr += `  { id: 'm${startIdx++}', category_id: '${cat}', name: '${name}', name_te: '${name}', name_hi: '${name}', name_kn: '${name}', description: '${desc.replace(/'/g, "\\'")}', description_te: '${desc.replace(/'/g, "\\'")}', description_hi: '${desc.replace(/'/g, "\\'")}', description_kn: '${desc.replace(/'/g, "\\'")}', price: ${price}, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: '${vegType}', created_at: new Date().toISOString() },\n`;
}

let catStr = "";
for (const c of newCategories) {
  catStr += `  { id: '${c.id}', name: '${c.name}', name_te: '${c.name}', name_hi: '${c.name}', name_kn: '${c.name}', display_order: ${c.display_order}, created_at: new Date().toISOString() },\n`;
}

fs.writeFileSync('generated_data.txt', "// CATEGORIES\n" + catStr + "\n// ITEMS\n" + itemsStr);
console.log('done');
