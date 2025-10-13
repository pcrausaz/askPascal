#!/usr/bin/env node
/**
 * Fix Markdown-style links in recipe files after renaming
 * Updates [text](old-filename.md) to [text](New Filename.md)
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

function toTitleCase(str) {
  const lowercase = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'de', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with', 'au', 'aux', 'la', 'le', 'les'];
  const uppercase = ['bbq', 'us', 'diy'];
  const specialCase = {
    'sous-vide': 'Sous-Vide',
    'crème': 'Crème',
    'creme': 'Creme',
  };

  const words = str.split(/[\s-]+/);

  return words.map((word, index) => {
    const lowerWord = word.toLowerCase();
    if (specialCase[lowerWord]) return specialCase[lowerWord];
    if (uppercase.includes(lowerWord)) return word.toUpperCase();
    if (index > 0 && lowercase.includes(lowerWord)) return lowerWord;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

// Build rename map (kebab-case filename without .md → Title Case filename without .md)
function buildRenameMap() {
  const renameMap = new Map();

  // Map old kebab-case names to new Title Case names
  // This is for files that were already renamed
  const patterns = [
    'al-pastor-tacos', 'apricot-pastry-feuilletes-aux-abricots', 'apricot-sous-vide',
    'avocado-crab-appetizer', 'butter-brussel-sprouts-sous-vide', 'butter-carrots-sous-vide',
    'beef-tenderloin-sous-vide', 'beef-roulade', 'baked-beans', 'braised-lamb-shanks',
    'braised-endives', 'clarified-butter', 'pheasant-a-la-robuchon', 'cassoulet',
    'duck-confit-sous-vide', 'clafoutis-framboise-raspberry-clafoutis', 'clafoutis-updated',
    'cooked-wine-tart-tarte-au-vin-cuit-tarte-au-raisine', 'sugar-dough-pate-sucree',
    'crab-spaghetti', 'spaghetti-carbonara-originalroman-no-cream',
    'dishooms-chicken-ruby', 'dishooms-makhani-sauce',
    'duck-breast-sous-vide', 'sweet-potatoe-sous-vide',
    'endives-sous-vide', 'garlic-coconut-cream-rabbit', 'sous-vide-temperature-charts',
    'grilled-flat-bread', 'soft-flatbread-no-yeast',
    'harissa', 'couscous', 'honey-glazed-salmon', 'salmon-with-soy-and-ginger',
    'israeli-hummus', 'falafel', 'joes-mom-lebanese-chicken-shawarma',
    'klusky', 'lemon-pie', 'merguez-sous-vide',
    'mussels-with-sofrito', 'gazpacho',
    'nougat-ice-cream-frozen-nougat', 'raspberry-coulis',
    'poached-pears-sous-vide', 'rack-of-lamb-sous-vide',
    'salted-caramel-sauce', 'banana-scallops', 'vanilla-ice-cream',
    'chicken-liver-sous-vide', 'scallops-sous-vide', 'shrimp-sous-vide',
    'tiramisu-mousse', 'turkey-burger', 'palpites',
    'wallaby-darned-original', 'wallaby-darned',
    'vietnamese-pickled-carrots-daikon-chua',
    'banh-mi-tht-nng-grilled-pork-sandwich',
    'bourdaloue-pie-tarte-bourdaloue'
  ];

  for (const pattern of patterns) {
    const titleCase = toTitleCase(pattern);
    renameMap.set(pattern, titleCase);
  }

  return renameMap;
}

// Update Markdown links in a file
async function updateMarkdownLinksInFile(filePath, renameMap) {
  let content = await readFile(filePath, 'utf-8');
  let updated = false;

  // Match Markdown links: [text](filename.md) or [text](filename)
  // Also handle relative paths like (../Recipes/filename.md)
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, linkTarget) => {
    // Extract just the filename without path
    const parts = linkTarget.split('/');
    const filename = parts[parts.length - 1];

    // Remove .md extension if present
    const cleanFilename = filename.replace(/\.md$/, '');

    // Check if this file needs updating
    if (renameMap.has(cleanFilename)) {
      updated = true;
      const newFilename = renameMap.get(cleanFilename);

      // Reconstruct the path
      if (parts.length > 1) {
        parts[parts.length - 1] = newFilename + '.md';
        return `[${linkText}](${parts.join('/')})`;
      } else {
        return `[${linkText}](${newFilename}.md)`;
      }
    }

    return match;
  });

  if (updated) {
    await writeFile(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// Process all markdown files in Recipes directory
async function processRecipesDirectory() {
  const recipesDir = './content/Recipes';
  const entries = await readdir(recipesDir);
  const renameMap = buildRenameMap();
  let updatedCount = 0;

  for (const filename of entries) {
    if (!filename.endsWith('.md')) continue;

    const fullPath = join(recipesDir, filename);
    const wasUpdated = await updateMarkdownLinksInFile(fullPath, renameMap);
    if (wasUpdated) {
      updatedCount++;
      console.log(`  ✓ Updated Markdown links in: ${filename}`);
    }
  }

  return updatedCount;
}

// Main execution
console.log('Fixing Markdown-style links in recipe files...\n');
const updatedFiles = await processRecipesDirectory();
console.log(`\n✅ Updated Markdown links in ${updatedFiles} recipe files`);
