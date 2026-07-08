const fs = require('fs');
const path = './src/lib/i18n/translations.ts';
let content = fs.readFileSync(path, 'utf8');

const newEn = {
    'Godavari Style': 'Godavari Style',
    'Telugu Kitchen': 'Telugu Kitchen',
    'Tradition on a Plate, Memories for a Lifetime': 'Tradition on a Plate, Memories for a Lifetime',
    'Search Authentic Telugu Delicacies...': 'Search Authentic Telugu Delicacies...',
    'Pairs perfectly with': 'Pairs perfectly with',
    'Comforting traditional starters': 'Comforting traditional starters',
    'Delightful bites to begin your journey': 'Delightful bites to begin your journey',
    'Wholesome meals full of tradition and flavor': 'Wholesome meals full of tradition and flavor',
    'Rich, aromatic curries cooked to perfection': 'Rich, aromatic curries cooked to perfection',
    'Freshly made breads to complement': 'Freshly made breads to complement',
    'Flavorful noodles and rice creations': 'Flavorful noodles and rice creations',
    'Sweet endings to a perfect meal': 'Sweet endings to a perfect meal',
    'Soft and fluffy traditional idlys': 'Soft and fluffy traditional idlys',
    'Crispy dosas with flavorful chutneys': 'Crispy dosas with flavorful chutneys',
    'Crispy fried traditional evening snacks': 'Crispy fried traditional evening snacks',
    'Refreshing drinks to quench your thirst': 'Refreshing drinks to quench your thirst',
    'Our exclusive signature delicacies': 'Our exclusive signature delicacies',
    'Quick, healthy and traditional favorites': 'Quick, healthy and traditional favorites',
    'GST (5%)': 'GST (5%)',
    'Service Charge (5%)': 'Service Charge (5%)',
};

const newTe = {
    'Godavari Style': 'గోదావరి స్టైల్',
    'Telugu Kitchen': 'తెలుగు కిచెన్',
    'Tradition on a Plate, Memories for a Lifetime': 'ప్లేట్‌లో సంప్రదాయం, జీవితకాల జ్ఞాపకాలు',
    'Search Authentic Telugu Delicacies...': 'అసలైన తెలుగు వంటల కోసం వెతకండి...',
    'Pairs perfectly with': 'దీనితో అద్భుతంగా సరిపోతుంది',
    'Comforting traditional starters': 'హాయినిచ్చే సంప్రదాయ స్టార్టర్స్',
    'Delightful bites to begin your journey': 'మీ భోజనాన్ని ప్రారంభించడానికి రుచికరమైన బైట్స్',
    'Wholesome meals full of tradition and flavor': 'సంప్రదాయం, రుచితో కూడిన సంపూర్ణ భోజనం',
    'Rich, aromatic curries cooked to perfection': 'అద్భుతంగా వండిన సువాసనగల కర్రీస్',
    'Freshly made breads to complement': 'వేడి వేడి రొట్టెలు',
    'Flavorful noodles and rice creations': 'రుచికరమైన నూడుల్స్ మరియు రైస్',
    'Sweet endings to a perfect meal': 'అద్భుతమైన భోజనానికి తీపి ముగింపు',
    'Soft and fluffy traditional idlys': 'మృదువైన సంప్రదాయ ఇడ్లీలు',
    'Crispy dosas with flavorful chutneys': 'క్రిస్పీ దోశలు మరియు రుచికరమైన చట్నీలు',
    'Crispy fried traditional evening snacks': 'క్రిస్పీగా వేయించిన సంప్రదాయ సాయంత్రం స్నాక్స్',
    'Refreshing drinks to quench your thirst': 'మీ దాహాన్ని తీర్చే రిఫ్రెషింగ్ పానీయాలు',
    'Our exclusive signature delicacies': 'మా ప్రత్యేక సిగ్నేచర్ వంటకాలు',
    'Quick, healthy and traditional favorites': 'వేగవంతమైన, ఆరోగ్యకరమైన మరియు సంప్రదాయ వంటకాలు',
    'GST (5%)': 'GST (5%)',
    'Service Charge (5%)': 'సర్వీస్ ఛార్జ్ (5%)',
};

const newHi = {
    'Godavari Style': 'गोदावरी स्टाइल',
    'Telugu Kitchen': 'तेलुगु किचन',
    'Tradition on a Plate, Memories for a Lifetime': 'एक प्लेट में परंपरा, जीवन भर की यादें',
    'Search Authentic Telugu Delicacies...': 'प्रामाणिक तेलुगु व्यंजनों की खोज करें...',
    'Pairs perfectly with': 'इसके साथ बेहतरीन लगता है',
    'Comforting traditional starters': 'आरामदायक पारंपरिक स्टार्टर्स',
    'Delightful bites to begin your journey': 'आपकी यात्रा शुरू करने के लिए स्वादिष्ट व्यंजन',
    'Wholesome meals full of tradition and flavor': 'परंपरा और स्वाद से भरपूर पौष्टिक भोजन',
    'Rich, aromatic curries cooked to perfection': 'शानदार, सुगंधित करी',
    'Freshly made breads to complement': 'ताजी बनी रोटियां',
    'Flavorful noodles and rice creations': 'स्वादिष्ट नूडल्स और चावल',
    'Sweet endings to a perfect meal': 'एक संपूर्ण भोजन का मीठा अंत',
    'Soft and fluffy traditional idlys': 'नरम और फूली हुई पारंपरिक इडली',
    'Crispy dosas with flavorful chutneys': 'स्वादिष्ट चटनी के साथ क्रिस्पी डोसा',
    'Crispy fried traditional evening snacks': 'क्रिस्पी तले हुए पारंपरिक शाम के स्नैक्स',
    'Refreshing drinks to quench your thirst': 'आपकी प्यास बुझाने के लिए ताज़ा पेय',
    'Our exclusive signature delicacies': 'हमारे विशेष सिग्नेचर व्यंजन',
    'Quick, healthy and traditional favorites': 'जल्दी, स्वस्थ और पारंपरिक पसंदीदा',
    'GST (5%)': 'GST (5%)',
    'Service Charge (5%)': 'सर्विस चार्ज (5%)',
};

const newKn = {
    'Godavari Style': 'ಗೋದಾವರಿ ಸ್ಟೈಲ್',
    'Telugu Kitchen': 'ತೆಲುಗು ಕಿಚನ್',
    'Tradition on a Plate, Memories for a Lifetime': 'ಪ್ಲೇಟ್‌ನಲ್ಲಿ ಸಂಪ್ರದಾಯ, ಜೀವಿತಾವಧಿಯ ನೆನಪುಗಳು',
    'Search Authentic Telugu Delicacies...': 'ಅಪ್ಪಟ ತೆಲುಗು ಭಕ್ಷ್ಯಗಳನ್ನು ಹುಡುಕಿ...',
    'Pairs perfectly with': 'ಇದರೊಂದಿಗೆ ಅದ್ಭುತವಾಗಿ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ',
    'Comforting traditional starters': 'ಸಮಾಧಾನಕರ ಸಾಂಪ್ರದಾಯಿಕ ಸ್ಟಾರ್ಟರ್ಸ್',
    'Delightful bites to begin your journey': 'ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಲು ರುಚಿಕರವಾದ ಬೈಟ್ಸ್',
    'Wholesome meals full of tradition and flavor': 'ಸಂಪ್ರದಾಯ ಮತ್ತು ರುಚಿಯಿಂದ ಕೂಡಿದ ಆರೋಗ್ಯಕರ ಊಟ',
    'Rich, aromatic curries cooked to perfection': 'ಪರಿಪೂರ್ಣವಾಗಿ ಬೇಯಿಸಿದ ಸುವಾಸನೆಯುಕ್ತ ಕರಿಗಳು',
    'Freshly made breads to complement': 'ತಾಜಾ ಮಾಡಿದ ರೊಟ್ಟಿಗಳು',
    'Flavorful noodles and rice creations': 'ರುಚಿಕರವಾದ ನೂಡಲ್ಸ್ ಮತ್ತು ಅನ್ನ',
    'Sweet endings to a perfect meal': 'ಉತ್ತಮ ಊಟಕ್ಕೆ ಸಿಹಿ ಅಂತ್ಯ',
    'Soft and fluffy traditional idlys': 'ಮೃದುವಾದ ಸಾಂಪ್ರದಾಯಿಕ ಇಡ್ಲಿಗಳು',
    'Crispy dosas with flavorful chutneys': 'ರುಚಿಕರವಾದ ಚಟ್ನಿಯೊಂದಿಗೆ ಗರಿಗರಿಯಾದ ದೋಸೆ',
    'Crispy fried traditional evening snacks': 'ಗರಿಗರಿಯಾಗಿ ಹುರಿದ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಜೆ ಸ್ನ್ಯಾಕ್ಸ್',
    'Refreshing drinks to quench your thirst': 'ನಿಮ್ಮ ಬಾಯಾರಿಕೆಯನ್ನು ತಣಿಸಲು ರಿಫ್ರೆಶ್ ಪಾನೀಯಗಳು',
    'Our exclusive signature delicacies': 'ನಮ್ಮ ವಿಶೇಷ ಸಿಗ್ನೇಚರ್ ಭಕ್ಷ್ಯಗಳು',
    'Quick, healthy and traditional favorites': 'ವೇಗವಾದ, ಆರೋಗ್ಯಕರ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಮೆಚ್ಚಿನವುಗಳು',
    'GST (5%)': 'GST (5%)',
    'Service Charge (5%)': 'ಸೇವಾ ಶುಲ್ಕ (5%)',
};

const insertIntoDict = (content, lang, dict) => {
    const lines = content.split('\n');
    let inLang = false;
    let insertIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`  ${lang}: {`)) {
            inLang = true;
        } else if (inLang && lines[i].trim() === '},') {
            insertIndex = i;
            break;
        } else if (inLang && lines[i].trim() === '}') {
            insertIndex = i;
            break;
        }
    }
    
    if (insertIndex > -1) {
        // add a comma to previous line if missing
        if (!lines[insertIndex - 1].trim().endsWith(',')) {
            lines[insertIndex - 1] = lines[insertIndex - 1] + ',';
        }
        const insertLines = Object.entries(dict).map(([k, v]) => `    '${k}': '${v}',`);
        lines.splice(insertIndex, 0, ...insertLines);
    }
    return lines.join('\n');
};

content = insertIntoDict(content, 'en', newEn);
content = insertIntoDict(content, 'te', newTe);
content = insertIntoDict(content, 'hi', newHi);
content = insertIntoDict(content, 'kn', newKn);

fs.writeFileSync(path, content);
console.log('Translations updated successfully.');
