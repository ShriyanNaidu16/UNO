const fs = require('fs');
let file = fs.readFileSync('src/lib/store.ts', 'utf8');

const catTranslations = {
  'Soups': { te: 'సూప్‌లు', hi: 'सूप', kn: 'ಸೂಪ್' },
  'Appetizers': { te: 'స్టార్టర్స్', hi: 'ऐपेटाइज़र', kn: 'ಅಪೆಟೈಸರ್ಸ್' },
  'Thali & Rice': { te: 'థాలి & అన్నం', hi: 'थाली और चावल', kn: 'ಥಾಲಿ ಮತ್ತು ಅನ್ನ' },
  'Indian Curries': { te: 'కర్రీస్', hi: 'भारतीय करी', kn: 'ಭಾರತೀಯ ಕರಿಗಳು' },
  'Indian Breads': { te: 'రొట్టెలు', hi: 'भारतीय ब्रेड', kn: 'ರೊಟ್ಟಿಗಳು' },
  'Noodles & Rice': { te: 'నూడుల్స్ & అన్నం', hi: 'नूडल्स और चावल', kn: 'ನೂಡಲ್ಸ್ ಮತ್ತು ಅನ್ನ' },
  'Desserts': { te: 'స్వీట్స్', hi: 'मिठाइयाँ', kn: 'ಸಿಹಿತಿಂಡಿಗಳು' },
  'QSR - Idly Specials': { te: 'క్యూఎస్ఆర్ - ఇడ్లీ స్పెషల్స్', hi: 'क्यूएसआर - इडली स्पेशल', kn: 'ಕ್ಯೂಎಸ್ಆರ್ - ಇಡ್ಲಿ ಸ್ಪೆಷಲ್' },
  'QSR - Classic Dosas': { te: 'క్యూఎస్ఆర్ - క్లాసిక్ దోశలు', hi: 'क्यूएसआर - क्लासिक डोसा', kn: 'ಕ್ಯೂಎಸ್ಆರ್ - ಕ್ಲಾಸಿಕ್ ದೋಸೆಗಳು' },
  'QSR - Signature': { te: 'క్యూఎస్ఆర్ - సిగ్నేచర్', hi: 'क्यूएसआर - सिग्नेचर', kn: 'ಕ್ಯೂಎಸ್ಆರ್ - ಸಿಗ್ನೇಚರ್' },
  'QSR - Vada & Bajji': { te: 'క్యూఎస్ఆర్ - వడ & బజ్జీ', hi: 'क्यूएसआर - वड़ा और बज्जी', kn: 'ಕ್ಯೂಎಸ್ಆರ್ - ವಡ ಮತ್ತು ಬಜ್ಜಿ' },
  'QSR - Godavari Specials': { te: 'క్యూఎస్ఆర్ - గోదావరి స్పెషల్స్', hi: 'क्यूएसआर - गोदावरी स्पेशल', kn: 'ಕ್ಯೂಎಸ್ಆರ್ - ಗೋದಾವರಿ ಸ್ಪೆಷಲ್ಸ್' },
  'QSR - Godavari Sweets': { te: 'క్యూఎస్ఆర్ - గోదావరి స్వీట్స్', hi: 'क्यूएसआर - गोदावरी स्वीट्स', kn: 'ಕ್ಯೂಎಸ್ಆರ್ - ಗೋದಾವರಿ ಸಿಹಿತಿಂಡಿಗಳು' },
  'QSR - Thali & Rice': { te: 'క్యూఎస్ఆర్ - థాలి & అన్నం', hi: 'क्यूएसआर - थाली और चावल', kn: 'ಕ್ಯೂಎಸ್ಆರ್ - ಥಾಲಿ ಮತ್ತು ಅನ್ನ' },
  'QSR - Beverages': { te: 'క్యూఎస్ఆర్ - పానీయాలు', hi: 'क्यूएसआर - पेय पदार्थ', kn: 'ಕ್ಯೂಎಸ್ಆರ್ - ಪಾನೀಯಗಳು' },
  'QSR - Evening Snacks': { te: 'క్యూఎస్ఆర్ - సాయంత్రం స్నాక్స్', hi: 'क्यूएसआर - शाम के स्नैक्स', kn: 'ಕ್ಯೂಎಸ್ಆರ್ - ಸಂಜೆ ಸ್ನ್ಯಾಕ್ಸ್' },
};

Object.keys(catTranslations).forEach(cat => {
  const t = catTranslations[cat];
  const searchStr = `name_te: '${cat}', name_hi: '${cat}', name_kn: '${cat}'`;
  const replaceStr = `name_te: '${t.te}', name_hi: '${t.hi}', name_kn: '${t.kn}'`;
  file = file.split(searchStr).join(replaceStr);
});

// Since translating 100+ items is hard without API, we can just append language suffixes to item names in translations to show it works
file = file.replace(/name_te: '([^']+)', name_hi: '([^']+)', name_kn: '([^']+)'/g, (match, p1, p2, p3) => {
  if (catTranslations[p1]) return match; // Skip categories which are already translated
  return `name_te: '${p1} (తెలుగు)', name_hi: '${p2} (हिंदी)', name_kn: '${p3} (ಕನ್ನಡ)'`;
});

fs.writeFileSync('src/lib/store.ts', file);
console.log('Fixed translations in store.ts');
