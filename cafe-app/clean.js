const fs = require('fs');
const lines = fs.readFileSync('src/lib/store.ts', 'utf8').split('\n');
const result = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Skip categories c1 to c7
  if (line.includes("{ id: 'c1',") || line.includes("{ id: 'c2',") || line.includes("{ id: 'c3',") || line.includes("{ id: 'c4',") || line.includes("{ id: 'c5',") || line.includes("{ id: 'c6',") || line.includes("{ id: 'c7',")) {
    continue;
  }
  
  // Skip items m1 to m15
  if (line.match(/{\s*id:\s*'m[1-9]',/) || line.match(/{\s*id:\s*'m1[0-5]',/)) {
    continue;
  }
  
  // Remove old comments
  if (line.includes('// Andhra Specials') || line.includes('// Telangana Specials') || line.includes('// Maharashtrian Delights') || line.includes('// Godavari Ruchulu')) {
    continue;
  }
  
  result.push(line);
}

fs.writeFileSync('src/lib/store.ts', result.join('\n'));
console.log('done');
