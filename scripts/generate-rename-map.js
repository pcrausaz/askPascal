#!/usr/bin/env node
/**
 * Generate rename mapping for recipe files
 * Converts kebab-case to Title Case
 */

import { readdir } from 'fs/promises';
import { join } from 'path';

function toTitleCase(str) {
  // Special words that should remain lowercase (unless at start)
  const lowercase = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'de', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with', 'au', 'aux', 'la', 'le', 'les'];

  // Special words/abbreviations that should be uppercase
  const uppercase = ['bbq', 'us', 'diy'];

  // Words that need special casing
  const specialCase = {
    'sous-vide': 'Sous-Vide',
    'crème': 'Crème',
    'creme': 'Creme',
  };

  const words = str.split(/[\s-]+/);

  return words.map((word, index) => {
    const lowerWord = word.toLowerCase();

    // Check special cases first
    if (specialCase[lowerWord]) {
      return specialCase[lowerWord];
    }

    // Check if should be uppercase
    if (uppercase.includes(lowerWord)) {
      return word.toUpperCase();
    }

    // Check if should be lowercase (but not if first word)
    if (index > 0 && lowercase.includes(lowerWord)) {
      return lowerWord;
    }

    // Regular title case
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function shouldRename(filename) {
  // Remove .md extension
  const nameWithoutExt = filename.replace(/\.md$/, '');

  // Check if filename contains hyphens (kebab-case)
  const hasHyphens = nameWithoutExt.includes('-');

  // Check if filename starts with lowercase (needs capitalization)
  const startsWithLowercase = /^[a-z]/.test(nameWithoutExt);

  return hasHyphens || startsWithLowercase;
}

function generateNewName(filename) {
  const nameWithoutExt = filename.replace(/\.md$/, '');
  const newName = toTitleCase(nameWithoutExt);
  return newName + '.md';
}

const recipesDir = './content/Recipes';
const entries = await readdir(recipesDir);

const renames = [];

for (const filename of entries.sort()) {
  if (!filename.endsWith('.md')) continue;

  if (shouldRename(filename)) {
    const newName = generateNewName(filename);
    renames.push({
      old: filename,
      new: newName,
      oldPath: `content/Recipes/${filename}`,
      newPath: `content/Recipes/${newName}`
    });
  }
}

console.log('Files to rename:');
console.log('================\n');

for (const rename of renames) {
  console.log(`"${rename.old}"`);
  console.log(`  → "${rename.new}"\n`);
}

console.log(`\nTotal files to rename: ${renames.length}`);
