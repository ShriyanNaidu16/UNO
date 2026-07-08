const fs = require('fs');
const path = './src/lib/i18n/translations.ts';
let content = fs.readFileSync(path, 'utf8');

const newEn = {
    'Experience The Taste of Heritage': 'Experience The Taste of Heritage',
    'Authentic Godavari Style Telugu Cuisine': 'Authentic Godavari Style Telugu Cuisine',
};

const newTe = {
    'Experience The Taste of Heritage': 'వారసత్వ రుచిని ఆస్వాదించండి',
    'Authentic Godavari Style Telugu Cuisine': 'అసలైన గోదావరి స్టైల్ తెలుగు వంటకాలు',
};

const newHi = {
    'Experience The Taste of Heritage': 'विरासत के स्वाद का अनुभव करें',
    'Authentic Godavari Style Telugu Cuisine': 'प्रामाणिक गोदावरी स्टाइल तेलुगु व्यंजन',
};

const newKn = {
    'Experience The Taste of Heritage': 'ಪರಂಪರೆಯ ರುಚಿಯನ್ನು ಅನುಭವಿಸಿ',
    'Authentic Godavari Style Telugu Cuisine': 'ಅಪ್ಪಟ ಗೋದಾವರಿ ಸ್ಟೈಲ್ ತೆಲುಗು ಭಕ್ಷ್ಯಗಳು',
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
console.log('Translations updated again successfully.');
