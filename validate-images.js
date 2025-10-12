import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_DIR = path.join(__dirname, 'content', 'Recipes');
const ATTACHMENTS_DIR = path.join(RECIPES_DIR, 'attachments');

function extractImageReferences(content) {
  const images = [];
  const obsidianRegex = /!\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
  let match;

  while ((match = obsidianRegex.exec(content)) !== null) {
    const imageName = match[1];
    const decoded = decodeURIComponent(imageName);
    if (/\.(jpg|jpeg|png|gif|webp|heic|bmp|svg)$/i.test(decoded)) {
      images.push(decoded);
    }
  }
  return images;
}

const recipeFiles = fs.readdirSync(RECIPES_DIR)
  .filter(f => f.endsWith('.md'))
  .filter(f => !f.startsWith('.'));

const availableImages = new Set(
  fs.readdirSync(ATTACHMENTS_DIR)
    .filter(f => /\.(jpg|jpeg|png|gif|webp|heic|bmp|svg)$/i.test(f))
);

const brokenReferences = [];
let totalRefs = 0;

recipeFiles.forEach(filename => {
  const filePath = path.join(RECIPES_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const images = extractImageReferences(content);
  totalRefs += images.length;

  images.forEach(imageName => {
    if (!availableImages.has(imageName)) {
      brokenReferences.push({ recipe: filename, image: imageName });
    }
  });
});

console.log('='.repeat(80));
console.log('FINAL VALIDATION');
console.log('='.repeat(80));
console.log(`Total image references: ${totalRefs}`);
console.log(`Available images: ${availableImages.size}`);
console.log(`Broken references: ${brokenReferences.length}`);

if (brokenReferences.length === 0) {
  console.log('\n✅ All image references are valid!');
} else {
  console.log('\n❌ Found broken references:');
  brokenReferences.forEach(({ recipe, image }) => {
    console.log(`  ${recipe}: ${image}`);
  });
}
console.log('='.repeat(80));
