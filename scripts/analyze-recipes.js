#!/usr/bin/env node
/**
 * Analyze all recipe files to categorize them and check formatting
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function analyzeRecipe(filePath, filename) {
  const content = await readFile(filePath, 'utf-8');
  const lines = content.split('\n');

  const analysis = {
    filename,
    isSousVide: false,
    hasProperFormat: false,
    hasTags: false,
    hasInfoCallout: false,
    hasTwoColumns: false,
    hasImages: false,
    tags: [],
    temperature: null,
    needsConversion: false
  };

  // Check for sous-vide indicators
  const contentLower = content.toLowerCase();
  if (contentLower.includes('sous-vide') ||
      contentLower.includes('sous vide') ||
      contentLower.includes('water bath') ||
      /\d+\s*°c.*sous/i.test(content) ||
      /temperature.*\d+\s*°c/i.test(content)) {
    analysis.isSousVide = true;
  }

  // Extract temperature if present
  const tempMatch = content.match(/(\d+)\s*°C/i);
  if (tempMatch) {
    analysis.temperature = tempMatch[1] + '°C';
  }

  // Check first few lines for tags
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith('#') && !line.startsWith('# ')) {
      analysis.hasTags = true;
      // Extract individual tags
      const tagMatches = line.match(/#[\w-]+/g);
      if (tagMatches) {
        analysis.tags = tagMatches.map(t => t.substring(1));
      }
    }
  }

  // Check for [!INFO] callout
  if (content.includes('> [!INFO]')) {
    analysis.hasInfoCallout = true;
  }

  // Check for two-column format
  if (content.includes(':::two-columns-plain') ||
      content.includes(':::two-columns-split-plain')) {
    analysis.hasTwoColumns = true;
  }

  // Check for images
  if (content.includes('![[') || content.includes('![](')) {
    analysis.hasImages = true;
  }

  // Determine if has proper format
  // Proper format = has tags + info callout + two columns
  analysis.hasProperFormat = analysis.hasTags &&
                             analysis.hasInfoCallout &&
                             analysis.hasTwoColumns;

  // Needs conversion if missing any formatting element
  analysis.needsConversion = !analysis.hasProperFormat;

  return analysis;
}

async function analyzeAllRecipes() {
  const recipesDir = './content/Recipes';
  const entries = await readdir(recipesDir);

  const results = {
    sousVide: [],
    traditional: [],
    unclear: [],
    needsConversion: [],
    properlyFormatted: [],
    missingTags: []
  };

  for (const filename of entries.sort()) {
    if (!filename.endsWith('.md') || filename === 'attachments') continue;

    const filePath = join(recipesDir, filename);
    const analysis = await analyzeRecipe(filePath, filename);

    // Categorize by type
    if (analysis.isSousVide) {
      results.sousVide.push(analysis);
    } else if (filename.toLowerCase().includes('drink') ||
               filename.toLowerCase().includes('cocktail') ||
               filename.toLowerCase().includes('mojito') ||
               filename.toLowerCase().includes('daiquiri') ||
               filename.toLowerCase().includes('tai') ||
               filename.toLowerCase().includes('lemonade') ||
               filename.toLowerCase().includes('limoncello')) {
      // Drinks are traditional
      results.traditional.push(analysis);
    } else {
      // Assume traditional if no sous-vide indicators
      results.traditional.push(analysis);
    }

    // Track conversion needs
    if (analysis.needsConversion) {
      results.needsConversion.push(analysis);
    } else {
      results.properlyFormatted.push(analysis);
    }

    // Track missing tags
    if (!analysis.hasTags || analysis.tags.length === 0) {
      results.missingTags.push(analysis);
    }
  }

  return results;
}

// Generate report
const results = await analyzeAllRecipes();

console.log('='.repeat(80));
console.log('RECIPE ANALYSIS REPORT');
console.log('='.repeat(80));
console.log();

console.log(`Total Recipes Analyzed: ${results.sousVide.length + results.traditional.length}`);
console.log(`  - Sous-Vide Recipes: ${results.sousVide.length}`);
console.log(`  - Traditional Recipes: ${results.traditional.length}`);
console.log();

console.log(`Formatting Status:`);
console.log(`  - Properly Formatted: ${results.properlyFormatted.length}`);
console.log(`  - Need Conversion: ${results.needsConversion.length}`);
console.log(`  - Missing Tags: ${results.missingTags.length}`);
console.log();

console.log('='.repeat(80));
console.log('SOUS-VIDE RECIPES');
console.log('='.repeat(80));
for (const recipe of results.sousVide) {
  const status = recipe.hasProperFormat ? '✓' : '✗';
  const tags = recipe.tags.length > 0 ? `[${recipe.tags.join(', ')}]` : '[NO TAGS]';
  console.log(`${status} ${recipe.filename}`);
  console.log(`   Tags: ${tags}`);
  console.log(`   Format: ${recipe.hasTwoColumns ? 'Two-Column' : 'Needs Conversion'}`);
  if (recipe.temperature) {
    console.log(`   Temp: ${recipe.temperature}`);
  }
  console.log();
}

console.log('='.repeat(80));
console.log('TRADITIONAL RECIPES (First 30)');
console.log('='.repeat(80));
for (const recipe of results.traditional.slice(0, 30)) {
  const status = recipe.hasProperFormat ? '✓' : '✗';
  const tags = recipe.tags.length > 0 ? `[${recipe.tags.join(', ')}]` : '[NO TAGS]';
  console.log(`${status} ${recipe.filename}`);
  console.log(`   Tags: ${tags}`);
  console.log(`   Format: ${recipe.hasTwoColumns ? 'Two-Column' : 'Needs Conversion'}`);
  console.log();
}

console.log(`... and ${Math.max(0, results.traditional.length - 30)} more traditional recipes`);
console.log();

console.log('='.repeat(80));
console.log('SUMMARY OF RECIPES NEEDING CONVERSION');
console.log('='.repeat(80));
console.log(`Total: ${results.needsConversion.length} recipes need formatting updates`);
console.log();

// Write detailed report to file
import { writeFile } from 'fs/promises';
const reportContent = JSON.stringify(results, null, 2);
await writeFile('./recipe-analysis-report.json', reportContent, 'utf-8');
console.log('✓ Detailed report saved to: recipe-analysis-report.json');
