const fs = require('fs');
const path = './src/lib/i18n/translations.ts';
let content = fs.readFileSync(path, 'utf8');

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

content = insertIntoDict(content, 'en', {'Categories': 'Categories'});
content = insertIntoDict(content, 'te', {'Categories': 'వర్గాలు'});
content = insertIntoDict(content, 'hi', {'Categories': 'श्रेणियाँ'});
content = insertIntoDict(content, 'kn', {'Categories': 'ವರ್ಗಗಳು'});

fs.writeFileSync(path, content);
console.log('Categories translations added');
