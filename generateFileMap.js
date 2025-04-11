const fs = require('fs');
const path = require('path');

const basePath = './code/assets/schoolData';

const outputFile = './code/utils/fileMap.ts';

// Make sure output folder exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

let mapContent = `// Auto-generated file map\nexport const fileMap: Record<string, any> = {\n`;

fs.readdirSync(basePath).forEach(schoolType => {
  const typePath = path.join(basePath, schoolType);
  if (!fs.lstatSync(typePath).isDirectory()) return;

  fs.readdirSync(typePath).forEach(file => {
    const match = file.match(/^([A-Z]{2})_(\w+)\.txt$/); // e.g., TN_College.txt
    if (match) {
      const [_, state] = match;
      const key = `${state}_${schoolType}`;

      // ✅ Hardcoded static require path (DO NOT use variables in require)
      const relPath = `../assets/schoolData/${schoolType}/${file}`;

      mapContent += `  '${key}': require('${relPath}'),\n`;
    }
  });
});

mapContent += `};\n`;

fs.writeFileSync(outputFile, mapContent);
console.log(`✅ fileMap.ts generated with all available CSV files.`);
