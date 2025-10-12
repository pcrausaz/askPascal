import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_DIR = path.join(__dirname, 'content', 'Recipes');

function convertImageFormat(content) {
  // Convert standard markdown images to Obsidian format with size 200
  // Match: ![any text or empty](filename.ext)
  // Replace with: ![[filename.ext|200]]
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, altText, filename) => {
    // Extract just the filename if it's a path
    const cleanFilename = filename.split('/').pop();
    return `![[${cleanFilename}|200]]`;
  });
}

function processRecipeFiles() {
  const files = fs.readdirSync(RECIPES_DIR)
    .filter(f => f.endsWith('.md'))
    .filter(f => !f.startsWith('.'));

  let updatedCount = 0;
  let errorCount = 0;

  console.log('Converting image formats to Obsidian style with size 200...\n');

  files.forEach(filename => {
    const filePath = path.join(RECIPES_DIR, filename);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const converted = convertImageFormat(content);

      if (converted !== content) {
        fs.writeFileSync(filePath, converted, 'utf-8');
        updatedCount++;
        console.log(`✓ ${filename}`);
      }
    } catch (error) {
      console.error(`✗ Error processing ${filename}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('IMAGE FORMAT CONVERSION COMPLETE');
  console.log('='.repeat(80));
  console.log(`✓ Files updated: ${updatedCount}`);
  console.log(`✗ Errors: ${errorCount}`);
}

processRecipeFiles();
