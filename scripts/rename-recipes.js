#!/usr/bin/env node
/**
 * Rename recipe files and update all references
 * Step 1: Update all wikilink references in content files
 * Step 2: Rename all recipe files
 */

import { readdir, readFile, writeFile, rename } from 'fs/promises';
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

function shouldRename(filename) {
  const nameWithoutExt = filename.replace(/\.md$/, '');
  const hasHyphens = nameWithoutExt.includes('-');
  const startsWithLowercase = /^[a-z]/.test(nameWithoutExt);
  return hasHyphens || startsWithLowercase;
}

function generateNewName(filename) {
  const nameWithoutExt = filename.replace(/\.md$/, '');
  const newName = toTitleCase(nameWithoutExt);
  return newName + '.md';
}

// Build rename map
async function buildRenameMap() {
  const recipesDir = './content/Recipes';
  const entries = await readdir(recipesDir);
  const renameMap = new Map();

  for (const filename of entries) {
    if (!filename.endsWith('.md')) continue;
    if (shouldRename(filename)) {
      const oldNameWithoutExt = filename.replace(/\.md$/, '');
      const newName = generateNewName(filename);
      const newNameWithoutExt = newName.replace(/\.md$/, '');

      renameMap.set(oldNameWithoutExt, newNameWithoutExt);
    }
  }

  return renameMap;
}

// Update wikilinks in a file
async function updateReferencesInFile(filePath, renameMap) {
  let content = await readFile(filePath, 'utf-8');
  let updated = false;

  // Replace all wikilink references
  // Matches: [[filename]], [[filename.md]], [[filename|text]], [[filename.md|text]]
  content = content.replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, (match, linkTarget, displayText) => {
    // Remove .md extension if present
    const cleanTarget = linkTarget.replace(/\.md$/, '');

    // Check if this file needs to be renamed
    if (renameMap.has(cleanTarget)) {
      updated = true;
      const newTarget = renameMap.get(cleanTarget);
      return displayText ? `[[${newTarget}${displayText}]]` : `[[${newTarget}]]`;
    }

    return match;
  });

  if (updated) {
    await writeFile(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// Recursively process all markdown files
async function processDirectory(dir, renameMap) {
  const entries = await readdir(dir, { withFileTypes: true });
  let updatedCount = 0;

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      updatedCount += await processDirectory(fullPath, renameMap);
    } else if (entry.name.endsWith('.md')) {
      const wasUpdated = await updateReferencesInFile(fullPath, renameMap);
      if (wasUpdated) {
        updatedCount++;
        console.log(`  Updated references in: ${fullPath}`);
      }
    }
  }

  return updatedCount;
}

// Rename files
async function renameFiles(renameMap) {
  const recipesDir = './content/Recipes';
  const entries = await readdir(recipesDir);
  let renamedCount = 0;

  for (const filename of entries) {
    if (!filename.endsWith('.md')) continue;

    const nameWithoutExt = filename.replace(/\.md$/, '');
    if (renameMap.has(nameWithoutExt)) {
      const newNameWithoutExt = renameMap.get(nameWithoutExt);
      const newFilename = newNameWithoutExt + '.md';

      const oldPath = join(recipesDir, filename);
      const newPath = join(recipesDir, newFilename);

      await rename(oldPath, newPath);
      renamedCount++;
      console.log(`  ✓ "${filename}" → "${newFilename}"`);
    }
  }

  return renamedCount;
}

// Main execution
console.log('Building rename map...');
const renameMap = await buildRenameMap();
console.log(`Found ${renameMap.size} files to rename\n`);

console.log('Step 1: Updating references in all content files...');
const updatedFiles = await processDirectory('./content', renameMap);
console.log(`✓ Updated references in ${updatedFiles} files\n`);

console.log('Step 2: Renaming recipe files...');
const renamedFiles = await renameFiles(renameMap);
console.log(`\n✓ Successfully renamed ${renamedFiles} recipe files`);

console.log('\n✅ All done! Your recipe files have been renamed and all references updated.');
