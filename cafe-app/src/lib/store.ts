import { MenuItem, MenuCategory, Order, OrderItem, Bill } from './types';

// Global memory store for local testing across Next.js API route calls
type Store = {
  categories: MenuCategory[];
  items: MenuItem[];
  orders: (Order & { table_number: number, items: (OrderItem & { menu_item_name: string })[] })[];
  bills: Bill[];
};

// Use a global variable to persist state in Next.js development server
declare global {
  var __CAFE_STORE__: Store | undefined;
}

const initialCategories: MenuCategory[] = [
  { id: 'c1', name: 'Coffee', name_te: 'కాఫీ', name_hi: 'कॉफी', name_kn: 'ಕಾಫಿ', display_order: 1, created_at: new Date().toISOString() },
  { id: 'c2', name: 'Snacks', name_te: 'స్నాక్స్', name_hi: 'स्नैक्स', name_kn: 'ತಿಂಡಿಗಳು', display_order: 2, created_at: new Date().toISOString() },
  { id: 'c3', name: 'Chinese', name_te: 'చైనీస్', name_hi: 'चाइनीज', name_kn: 'ಚೈನೀಸ್', display_order: 3, created_at: new Date().toISOString() },
  { id: 'c4', name: 'Andhra Specials', name_te: 'ఆంధ్ర స్పెషల్స్', name_hi: 'आंध्र स्पेशल', name_kn: 'ಆಂಧ್ರ ಸ್ಪೆಷಲ್ಸ್', display_order: 4, created_at: new Date().toISOString() },
  { id: 'c5', name: 'Telangana Specials', name_te: 'తెలంగాణ స్పెషల్స్', name_hi: 'तेलंगाना स्पेशल', name_kn: 'ತೆಲಂಗಾಣ ಸ್ಪೆಷಲ್ಸ್', display_order: 5, created_at: new Date().toISOString() },
  { id: 'c6', name: 'Maharashtrian Delights', name_te: 'మహారాష్ట్ర రుచులు', name_hi: 'महाराष्ट्र के व्यंजन', name_kn: 'ಮಹಾರಾಷ್ಟ್ರದ ರುಚಿಗಳು', display_order: 6, created_at: new Date().toISOString() },
  { id: 'c7', name: 'Godavari Ruchulu', name_te: 'గోదావరి రుచులు', name_hi: 'गोदावरी रुकुलु', name_kn: 'ಗೋದಾವರಿ ರುಚುಲು', display_order: 7, created_at: new Date().toISOString() },
];

const initialItems: MenuItem[] = [
  { id: 'm1', category_id: 'c1', name: 'Espresso', name_te: 'ఎస్ప్రెస్సో', name_hi: 'एस्प्रेसो', name_kn: 'ಎಸ್ಪ್ರೆಸೊ', description: 'Strong black coffee', description_te: 'స్ట్రాంగ్ బ్లాక్ కాఫీ', description_hi: 'स्ट्रॉन्ग ब्लैक कॉफी', description_kn: 'ಸ್ಟ್ರಾಂಗ್ ಬ್ಲಾಕ್ ಕಾಫಿ', price: 150, image_url: 'https://images.unsplash.com/photo-1510113110967-0c6798e3b3e6?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
  { id: 'm2', category_id: 'c1', name: 'Cappuccino', name_te: 'కాపుచినో', name_hi: 'कैप्पुकिनो', name_kn: 'ಕ್ಯಾಪುಸಿನೊ', description: 'Espresso with steamed milk', description_te: 'వేడి పాలతో ఎస్ప్రెస్సో', description_hi: 'गर्म दूध के साथ एस्प्रेसो', description_kn: 'ಬಿಸಿ ಹಾಲಿನೊಂದಿಗೆ ಎಸ್ಪ್ರೆಸೊ', price: 200, image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
  { id: 'm3', category_id: 'c2', name: 'Chicken Sandwich', name_te: 'చికెన్ శాండ్‌విచ్', name_hi: 'चिकन सैंडविच', name_kn: 'ಚಿಕನ್ ಸ್ಯಾಂಡ್ವಿಚ್', description: 'Grilled chicken with mayo', description_te: 'మయోతో గ్రిల్ చేసిన చికెన్', description_hi: 'मेयो के साथ ग्रिल्ड चिकन', description_kn: 'ಮಯೋನೊಂದಿಗೆ ಗ್ರಿಲ್ ಮಾಡಿದ ಚಿಕನ್', price: 350, image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
  { id: 'm4', category_id: 'c2', name: 'Fries', name_te: 'ఫ్రైస్', name_hi: 'फ्राइज़', name_kn: 'ಫ್ರೈಸ್', description: 'Crispy potato fries', description_te: 'క్రిస్పీ పొటాటో ఫ్రైస్', description_hi: 'क्रिस्पी आलू फ्राइज़', description_kn: 'ಗರಿಗರಿಯಾದ ಆಲೂಗಡ್ಡೆ ಫ್ರೈಸ್', price: 180, image_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
  { id: 'm5', category_id: 'c3', name: 'Hakka Noodles', name_te: 'హక్కా నూడుల్స్', name_hi: 'हक्का नूडल्स', name_kn: 'ಹಕ್ಕಾ ನೂಡಲ್ಸ್', description: 'Wok-tossed noodles with veggies', description_te: 'కూరగాయలతో వోక్-టాస్ చేసిన నూడుల్స్', description_hi: 'सब्जियों के साथ वोक-टॉस्ड नूडल्स', description_kn: 'ತರಕಾರಿಗಳೊಂದಿಗೆ ವೊಕ್-ಟಾಸ್ ಮಾಡಿದ ನೂಡಲ್ಸ್', price: 250, image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
  { id: 'm6', category_id: 'c3', name: 'Chilli Chicken', name_te: 'చిల్లీ చికెన్', name_hi: 'चिली चिकन', name_kn: 'ಚಿಲ್ಲಿ ಚಿಕನ್', description: 'Spicy wok-tossed chicken chunks', description_te: 'స్పైసీ వోక్-టాస్ చేసిన చికెన్ ముక్కలు', description_hi: 'मसालेदार वोक-टॉस्ड चिकन के टुकड़े', description_kn: 'ಮಸಾಲೆಯುಕ್ತ ವೊಕ್-ಟಾಸ್ ಮಾಡಿದ ಚಿಕನ್ ತುಂಡುಗಳು', price: 320, image_url: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
  
  // Andhra Specials
  { id: 'm7', category_id: 'c4', name: 'Guntur Gongura Mamsam', name_te: 'గుంటూరు గోంగూర మాంసం', name_hi: 'गुंटूर गोंगुरा मटन', name_kn: 'ಗುಂಟೂರು ಗೋಂಗುರ ಮಾಂಸ', description: 'Tender mutton slow-cooked with tangy Gongura (sorrel) leaves, fiery Guntur chilies, and aromatic spices. A rich, sour, and spicy Andhra classic.', description_te: 'లేత మాంసాన్ని పుల్లటి గోంగూర ఆకులు, కారంగా ఉండే గుంటూరు మిరపకాయలు మరియు సుగంధ ద్రవ్యాలతో నెమ్మదిగా ఉడికించిన వంటకం.', description_hi: 'तीखी गोंगुरा पत्तियों और गुंटूर मिर्च के साथ धीमी आंच पर पकाया गया मटन।', description_kn: 'ಹುಳಿ ಗೋಂಗುರ ಎಲೆಗಳು ಮತ್ತು ಗುಂಟೂರು ಮೆಣಸಿನಕಾಯಿಯೊಂದಿಗೆ ನಿಧಾನವಾಗಿ ಬೇಯಿಸಿದ ಮಟನ್.', price: 450, image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
  { id: 'm8', category_id: 'c4', name: 'Andhra Kodi Pulao', name_te: 'ఆంధ్ర కోడి పులావ్', name_hi: 'आंध्रा कोडी पुलाव', name_kn: 'ಆಂಧ್ರ ಕೋಡಿ ಪುಲಾವ್', description: 'Aromatic basmati rice cooked with marinated chicken, green chilies, and roasted ground spices. A uniquely flavorful and fiery one-pot dish.', description_te: 'మసాలాలో నానబెట్టిన చికెన్, పచ్చిమిర్చి మరియు వేయించిన సుగంధ ద్రవ్యాలతో వండిన సువాసనగల బాస్మతి రైస్.', description_hi: 'मैरीनेट किए हुए चिकन, हरी मिर्च और भुने हुए मसालों के साथ पकाया गया सुगंधित बासमती चावल।', description_kn: 'ಮ್ಯಾರಿನೇಟ್ ಮಾಡಿದ ಚಿಕನ್, ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ ಮತ್ತು ಹುರಿದ ಮಸಾಲೆಗಳೊಂದಿಗೆ ಬೇಯಿಸಿದ ಪರಿಮಳಯುಕ್ತ ಬಾಸುಮತಿ ಅಕ್ಕಿ.', price: 380, image_url: 'https://images.unsplash.com/photo-1589302168068-98c2014b9983?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
  
  // Telangana Specials
  { id: 'm9', category_id: 'c5', name: 'Hyderabadi Dum Biryani', name_te: 'హైదరాబాదీ మటన్ దమ్ బిర్యానీ', name_hi: 'हैदराबादी मटन दम बिरयानी', name_kn: 'ಹೈದರಾಬಾದಿ ಮಟನ್ ದಮ್ ಬಿರಿಯಾನಿ', description: 'World-famous biryani made with fragrant basmati rice and tender mutton, marinated in yogurt and secret spices, then sealed and slow-cooked on dum.', description_te: 'పెరుగు మరియు రహస్య మసాలాలతో నానబెట్టిన లేత మటన్ తో దమ్ మీద నెమ్మదిగా ఉడికించిన ప్రసిద్ధ బిర్యానీ.', description_hi: 'दही और गुप्त मसालों में मैरीनेट किए गए मटन के साथ दम पर पकाई गई विश्व प्रसिद्ध बिरयानी।', description_kn: 'ಮೊಸರು ಮತ್ತು ರಹಸ್ಯ ಮಸಾಲೆಗಳಲ್ಲಿ ಮ್ಯಾರಿನೇಟ್ ಮಾಡಿದ ಮಟನ್‌ನೊಂದಿಗೆ ದಮ್‌ನಲ್ಲಿ ಬೇಯಿಸಿದ ವಿಶ್ವಪ್ರಸಿದ್ಧ ಬಿರಿಯಾನಿ.', price: 420, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
  { id: 'm10', category_id: 'c5', name: 'Natu Kodi Pulusu', name_te: 'నాటు కోడి పులుసు', name_hi: 'नाटू कोडी पुलुसु', name_kn: 'ನಾಟು ಕೋಡಿ ಪುಲುಸು', description: 'Authentic country chicken curry simmering in a robust, dark gravy made from roasted coriander, poppy seeds, and fiery red chilies.', description_te: 'వేయించిన ధనియాలు, గసగసాలు మరియు ఎండుమిర్చితో చేసిన ముదురు రంగు గ్రేవీలో ఉడికిన నాటు కోడి కూర.', description_hi: 'भुने हुए धनिया, खसखस ​​और लाल मिर्च की ग्रेवी में पकाई गई प्रामाणिक देसी चिकन करी।', description_kn: 'ಹುರಿದ ಕೊತ್ತಂಬರಿ, ಗಸಗಸೆ ಮತ್ತು ಕೆಂಪು ಮೆಣಸಿನಕಾಯಿಯ ಗ್ರೇವಿಯಲ್ಲಿ ಬೇಯಿಸಿದ ಅಧಿಕೃತ ನಾಟಿ ಕೋಳಿ ಕರಿ.', price: 360, image_url: 'https://images.unsplash.com/photo-1604908177525-45d625bc5a9b?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
  
  // Maharashtrian Delights
  { id: 'm11', category_id: 'c6', name: 'Misal Pav', name_te: 'మిసల్ పావ్', name_hi: 'मिसल पाव', name_kn: 'ಮಿಸಲ್ ಪಾವ್', description: 'A spicy sprouts-based curry topped with crunchy farsan, onions, and lemon, served with soft buttery pav.', description_te: 'మొలకలతో చేసిన స్పైసీ కూరపై కరకరలాడే ఫర్సాన్, ఉల్లిపాయలు చల్లి, వెన్న రాసిన పావ్ తో వడ్డిస్తారు.', description_hi: 'मसालेदार स्प्राउट्स करी, जिसके ऊपर कुरकुरा फरसान और प्याज डाला जाता है, मक्खन वाले पाव के साथ परोसा जाता है।', description_kn: 'ಮಸಾಲೆಯುಕ್ತ ಮೊಳಕೆ ಕಾಳುಗಳ ಕರಿಗೆ ಗರಿಗರಿಯಾದ ಫರ್ಸಾನ್ ಮತ್ತು ಈರುಳ್ಳಿ ಸೇರಿಸಿ, ಬೆಣ್ಣೆ ಹಚ್ಚಿದ ಪಾವ್ ಜೊತೆ ಬಡಿಸಲಾಗುತ್ತದೆ.', price: 150, image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
  { id: 'm12', category_id: 'c6', name: 'Vada Pav', name_te: 'వడ పావ్', name_hi: 'वड़ा पाव', name_kn: 'ವಡಾ ಪಾವ್', description: 'Deep-fried, spiced potato dumplings sandwiched in a soft pav with fiery garlic and sweet tamarind chutneys.', description_te: 'మసాలా ఆలుగడ్డ బోండాలను సాఫ్ట్ పావ్ మధ్యలో ఉంచి, వెల్లుల్లి మరియు చింతపండు చట్నీలతో వడ్డిస్తారు.', description_hi: 'डीप-फ्राइड मसालेदार आलू वड़ा, जिसे लहसुन और इमली की चटनी के साथ नरम पाव में परोसा जाता है।', description_kn: 'ಮಸಾಲೆಯುಕ್ತ ಆಲೂಗಡ್ಡೆ ವಡೆಯನ್ನು ಬೆಳ್ಳುಳ್ಳಿ ಮತ್ತು ಹುಣಸೆಹಣ್ಣಿನ ಚಟ್ನಿಯೊಂದಿಗೆ ಮೃದುವಾದ ಪಾವ್ ಒಳಗೆ ಇಟ್ಟು ಬಡಿಸಲಾಗುತ್ತದೆ.', price: 80, image_url: 'https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },

  // Godavari Ruchulu
  { id: 'm13', category_id: 'c7', name: 'Godavari Chepala Pulusu', name_te: 'గోదావరి చేపల పులుసు', name_hi: 'गोदावरी चेपाला पुलुसु (फिश करी)', name_kn: 'ಗೋದಾವರಿ ಚೇಪಲ ಪುಲುಸು (ಮೀನು ಕರಿ)', description: 'A legendary fish curry from the Godavari region, simmered in a tangy tamarind sauce with onions, green chilies, and a special blend of spices.', description_te: 'గోదావరి జిల్లాలకు చెందిన ప్రసిద్ధ చేపల పులుసు. చింతపండు పులుసు, ఉల్లిపాయలు, పచ్చిమిర్చి మరియు ప్రత్యేక మసాలాలతో అద్భుతంగా వండుతారు.', description_hi: 'गोदावरी क्षेत्र की एक प्रसिद्ध फिश करी, जिसे तीखी इमली की चटनी, प्याज, हरी मिर्च और मसालों के विशेष मिश्रण में पकाया जाता है।', description_kn: 'ಗೋದಾವರಿ ಪ್ರದೇಶದ ಪ್ರಸಿದ್ಧ ಮೀನು ಕರಿ. ಹುಣಸೆಹಣ್ಣಿನ ರಸ, ಈರುಳ್ಳಿ, ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ ಮತ್ತು ವಿಶೇಷ ಮಸಾಲೆಗಳೊಂದಿಗೆ ಕುದಿಸಲಾಗುತ್ತದೆ.', price: 350, image_url: 'https://images.unsplash.com/photo-1626083161405-b049d5921f92?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
  { id: 'm14', category_id: 'c7', name: 'Bhimavaram Royyala Vepudu', name_te: 'భీమవరం రొయ్యల వేపుడు', name_hi: 'भीमावरम प्रॉन्स फ्राई', name_kn: 'ಭೀಮವರಂ ರೊಯ್ಯಲ ವೆಪುಡು', description: 'Spicy and crispy prawn fry from Bhimavaram, tossed with curry leaves, crushed garlic, and a fiery spice mix.', description_te: 'భీమవరం స్పెషల్ కరకరలాడే రొయ్యల వేపుడు. కరివేపాకు, వెల్లుల్లి మరియు కారంగా ఉండే మసాలాలతో అద్భుతంగా వేయిస్తారు.', description_hi: 'भीमावरम से मसालेदार और क्रिस्पी प्रॉन्स फ्राई, करी पत्ते, कुचले हुए लहसुन और तीखे मसालों के मिश्रण के साथ उछाला गया।', description_kn: 'ಭೀಮವರಂನ ಮಸಾಲೆಯುಕ್ತ ಮತ್ತು ಗರಿಗರಿಯಾದ ಸೀಗಡಿ ಫ್ರೈ. ಕರಿಬೇವಿನ ಎಲೆಗಳು, ಜಜ್ಜಿದ ಬೆಳ್ಳುಳ್ಳಿ ಮತ್ತು ಖಾರವಾದ ಮಸಾಲೆಗಳೊಂದಿಗೆ ತಯಾರಿಸಲಾಗುತ್ತದೆ.', price: 380, image_url: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'non-veg', created_at: new Date().toISOString() },
  { id: 'm15', category_id: 'c7', name: 'Pootharekulu', name_te: 'పూతరేకులు', name_hi: 'पूथारेकुलु (स्वीट)', name_kn: 'ಪೂತರೆಕುಲು (ಸಿಹಿ)', description: 'The paper-thin sweet delicacy from Atreyapuram, made of delicate rice starch films layered with ghee and powdered jaggery.', description_te: 'ఆత్రేయపురం స్పెషల్ కాగితం లాంటి పూతరేకులు. బియ్యపు పిండి పొరల మధ్య నెయ్యి మరియు బెల్లం తో తయారు చేస్తారు.', description_hi: 'आत्रेयपुरम से एक कागज-पतली मिठाई, जो घी और पिसी हुई गुड़ की परतों के साथ नाजुक चावल स्टार्च फिल्मों से बनाई जाती है।', description_kn: 'ಆತ್ರೇಯಪುರಂನಿಂದ ಕಾಗದದಷ್ಟು ತೆಳುವಾದ ಸಿಹಿ. ಅಕ್ಕಿ ಹಿಟ್ಟಿನ ಪದರಗಳ ನಡುವೆ ತುಪ್ಪ ಮತ್ತು ಬೆಲ್ಲದೊಂದಿಗೆ ತಯಾರಿಸಲಾಗುತ್ತದೆ.', price: 120, image_url: 'https://images.unsplash.com/photo-1627917462061-689e4719b4ec?auto=format&fit=crop&w=200&q=80', is_available: true, veg_nonveg_tag: 'veg', created_at: new Date().toISOString() },
];

if (!global.__CAFE_STORE__) {
  global.__CAFE_STORE__ = {
    categories: initialCategories,
    items: initialItems,
    orders: [],
    bills: [
      // Add a mock bill to ensure the dashboard has data today
      {
        id: 'mock-bill-1',
        table_id: 'table-12',
        subtotal: 50000,
        gst_amount: 2500,
        service_charge_amount: 2500,
        total_amount: 55000,
        razorpay_order_id: null,
        razorpay_payment_id: null,
        payment_status: 'paid',
        payment_method: 'upi',
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-bill-2',
        table_id: 'table-10',
        subtotal: 80000,
        gst_amount: 4000,
        service_charge_amount: 4000,
        total_amount: 88000,
        razorpay_order_id: null,
        razorpay_payment_id: null,
        payment_status: 'paid',
        payment_method: 'cash',
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ],
  };
} else {
  // Force update items and categories on HMR so we see new translations
  global.__CAFE_STORE__.categories = initialCategories;
  global.__CAFE_STORE__.items = initialItems;
}

export const store = global.__CAFE_STORE__;
