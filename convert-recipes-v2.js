#!/usr/bin/env node
/**
 * Convert all recipe files to proper template format - IMPROVED VERSION
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Files to exclude from conversion
const EXCLUDE_FILES = [
  'Sous Vide Lab.md',
  'Sous Vide Temperature Charts.md',
  'All Recipes by Name.md'
];

// Special case categorizations
const SPECIAL_CASES = {
  'Butter Croissant Croissant au Beurre.md': { type: 'traditional', tags: ['dessert', 'traditional', 'recipe'] },
  'Pan Ultimate Pizza Dough.md': { type: 'traditional', tags: ['meal', 'traditional', 'recipe'] },
  'Perfect Yolk.md': { type: 'sous-vide', tags: ['side', 'appetizer', 'sous-vide', 'recipe'] },
  'Raspberry Coulis.md': { type: 'traditional', tags: ['side', 'traditional', 'recipe'] },
  'Clarified Butter.md': { type: 'traditional', tags: ['side', 'traditional', 'recipe'] },
  'Festin de Noel.md': { type: 'traditional', tags: ['meal', 'traditional', 'recipe'] }
};

function isSousVide(filename, content) {
  if (SPECIAL_CASES[filename]) {
    return SPECIAL_CASES[filename].type === 'sous-vide';
  }

  const contentLower = content.toLowerCase();
  return contentLower.includes('sous-vide') ||
         contentLower.includes('sous vide') ||
         contentLower.includes('water bath') ||
         filename.toLowerCase().includes('sous-vide') ||
         filename.toLowerCase().includes('sous vide');
}

function isDrink(filename) {
  const lower = filename.toLowerCase();
  return lower.includes('drink') || lower.includes('cocktail') ||
         lower.includes('mojito') || lower.includes('daiquiri') ||
         lower.includes('tai') || lower.includes('lemonade') ||
         lower.includes('limoncello') || lower.includes('margarita') ||
         lower.includes('margatini') || lower.includes('blast') ||
         lower.includes('wallaby') || lower.includes('pascalito');
}

function determineTags(filename, content, isSousVide) {
  if (SPECIAL_CASES[filename]) {
    return SPECIAL_CASES[filename].tags;
  }

  const tags = [];
  const filenameLower = filename.toLowerCase();

  // Determine category
  if (isDrink(filename)) {
    tags.push('drink');
  } else if (filenameLower.includes('dessert') || filenameLower.includes('cake') ||
             filenameLower.includes('pie') || filenameLower.includes('tart') ||
             filenameLower.includes('cookie') || filenameLower.includes('sweet') ||
             filenameLower.includes('chocolate') || filenameLower.includes('cream') ||
             filenameLower.includes('ice cream') || filenameLower.includes('mousse') ||
             filenameLower.includes('flan') || filenameLower.includes('tiramisu') ||
             filenameLower.includes('cheesecake') || filenameLower.includes('brownie') ||
             filenameLower.includes('madeleine') || filenameLower.includes('croissant') ||
             filenameLower.includes('brioche') || filenameLower.includes('nougat') ||
             filenameLower.includes('truffle') || filenameLower.includes('meringue') ||
             filenameLower.includes('clafoutis') || filenameLower.includes('sorbet') ||
             filenameLower.includes('puff') || filenameLower.includes('palmier') ||
             filenameLower.includes('opera') || filenameLower.includes('fondant') ||
             filenameLower.includes('babka') || filenameLower.includes('roll') ||
             filenameLower.includes('pastry') || filenameLower.includes('baba') ||
             filenameLower.includes('nata') || filenameLower.includes('vacherin')) {
    tags.push('dessert');
  } else if (filenameLower.includes('appetizer') || filenameLower.includes('dip') ||
             filenameLower.includes('hummus') || filenameLower.includes('tapenade') ||
             filenameLower.includes('terrine') || filenameLower.includes('tartare') ||
             filenameLower.includes('ceviche') || (filenameLower.includes('cocktail') && !isDrink(filename))) {
    tags.push('appetizer');
  } else if (filenameLower.includes('sauce') || filenameLower.includes('butter') ||
             filenameLower.includes('coulis') || filenameLower.includes('dressing') ||
             filenameLower.includes('salsa') || filenameLower.includes('harissa')) {
    tags.push('side');
    if (filenameLower.includes('sauce') || filenameLower.includes('coulis')) {
      tags.push('sauce');
    }
  } else if (filenameLower.includes('salad') || filenameLower.includes('potato') ||
             filenameLower.includes('carrot') || filenameLower.includes('sprout') ||
             filenameLower.includes('endive') || filenameLower.includes('vegetable') ||
             filenameLower.includes('yolk') || (filenameLower.includes('egg') && !filenameLower.includes('eggplant'))) {
    tags.push('side');
  } else {
    tags.push('meal');
  }

  if (isSousVide) {
    tags.push('sous-vide');
  } else {
    tags.push('traditional');
  }

  tags.push('recipe');

  return tags;
}

function extractInfoCallout(content) {
  const match = content.match(/>\s*\[!(INFO|NOTE)\]\s*>\s*(.+?)(?=\n[^>]|\n\n|$)/s);
  if (match) {
    return match[2].trim();
  }

  // Look for first descriptive text after title
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#') && !line.startsWith('>') &&
        !line.startsWith('|') && !line.startsWith('-') &&
        !line.match(/^\d+\./) && line.length > 15 && !line.startsWith('::')) {
      return line;
    }
  }

  return '...';
}

function extractContent(content) {
  const result = {
    ingredientsBlocks: [],
    methodsBlocks: [],
    tableData: {},
    images: [],
    closingComment: null
  };

  const lines = content.split('\n');
  let i = 0;

  // Skip title and callout
  while (i < lines.length && (lines[i].startsWith('#') || lines[i].includes('[!') || lines[i].startsWith('>'))) {
    i++;
  }

  let currentSection = null;
  let currentBlock = [];

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect images
    if (trimmed.match(/^!\[\[.+\]\]/) || trimmed.match(/^!\[\]\(.+\)/)) {
      result.images.push(trimmed);
      i++;
      continue;
    }

    // Detect table
    if (trimmed.startsWith('| ') && !trimmed.startsWith('| Item')) {
      // Parse table for data
      const tableLines = [];
      while (i < lines.length && (lines[i].trim().startsWith('|') || lines[i].trim().match(/^[|-]+$/))) {
        tableLines.push(lines[i]);
        i++;
      }

      // Extract table data
      for (const tline of tableLines) {
        if (tline.includes('|') && !tline.match(/^[|-]+$/)) {
          const cells = tline.split('|').map(c => c.trim()).filter(c => c);
          if (cells.length >= 2) {
            const key = cells[0].toLowerCase();
            const value = cells[1];
            if (key.includes('serve')) result.tableData.serve = value;
            if (key.includes('preparation')) result.tableData.prep = value;
            if (key.includes('cooking') && key.includes('sous')) result.tableData.cookSV = value;
            if (key.includes('cooking') && !key.includes('sous')) result.tableData.cookTrad = value;
            if (key.includes('temperature')) result.tableData.temp = value;
            if (key.includes('author')) result.tableData.authors = value;
            if (key.includes('special') || key.includes('hardware')) result.tableData.special = value;
          }
        }
      }
      continue;
    }

    // Section headers
    if (trimmed.match(/^##\s+Ingredients?/i)) {
      if (currentSection && currentBlock.length > 0) {
        if (currentSection === 'ingredients') result.ingredientsBlocks.push(currentBlock.join('\n'));
        if (currentSection === 'method') result.methodsBlocks.push(currentBlock.join('\n'));
      }
      currentSection = 'ingredients';
      currentBlock = [line];
      i++;
      continue;
    }

    if (trimmed.match(/^##\s+Method/i)) {
      if (currentSection && currentBlock.length > 0) {
        if (currentSection === 'ingredients') result.ingredientsBlocks.push(currentBlock.join('\n'));
        if (currentSection === 'method') result.methodsBlocks.push(currentBlock.join('\n'));
      }
      currentSection = 'method';
      currentBlock = [line];
      i++;
      continue;
    }

    // Collect content for current section
    if (currentSection) {
      currentBlock.push(line);
    }

    i++;
  }

  // Save last section
  if (currentSection && currentBlock.length > 0) {
    if (currentSection === 'ingredients') result.ingredientsBlocks.push(currentBlock.join('\n'));
    if (currentSection === 'method') result.methodsBlocks.push(currentBlock.join('\n'));
  }

  return result;
}

function formatImages(images) {
  return images.map(img => {
    if (img.startsWith('![[')) {
      const match = img.match(/!\[\[([^\]|]+)(?:\|\d+)?\]\]/);
      if (match) return `![[${match[1]}|200]]`;
    }
    return img;
  }).join('\n');
}

function buildConvertedRecipe(filename, content, tags, isSousVide, infoCallout, extracted) {
  const title = filename.replace(/\.md$/, '');
  const tagString = tags.map(t => `#${t}`).join(' ');

  let output = `${tagString}\n\n`;
  output += `> [!INFO]\n> ${infoCallout}\n\n`;
  output += `:::two-columns-plain\n\n`;
  output += `### Details\n`;

  // Add ingredients
  if (extracted.ingredientsBlocks.length > 0) {
    for (const block of extracted.ingredientsBlocks) {
      output += block + '\n\n';
    }
  } else {
    output += '**Ingredients**\n- ...\n\n';
  }

  // Add methods
  if (extracted.methodsBlocks.length > 0) {
    for (const block of extracted.methodsBlocks) {
      output += block + '\n\n';
    }
  } else {
    output += '**Method**\n1. ...\n\n';
  }

  // Add closing comment if exists
  if (extracted.closingComment) {
    output += extracted.closingComment + '\n\n';
  }

  output += '\n### Quick View\n';

  // Build table
  const td = extracted.tableData;
  if (isSousVide) {
    output += `| Sous-Vide                  |                                                |\n`;
    output += `| -------------------------- | ---------------------------------------------- |\n`;
    output += `| Serve                      | ${(td.serve || '').padEnd(46)} |\n`;
    output += `| Preparation Time           | ${(td.prep || '').padEnd(46)} |\n`;
    output += `| Cooking Time (sous-vide)   | ${(td.cookSV || '').padEnd(46)} |\n`;
    output += `| Cooking Time (traditional) | ${(td.cookTrad || '').padEnd(46)} |\n`;
    output += `| Temperature                | ${(td.temp || '').padEnd(46)} |\n`;
    output += `| Authors                    | ${(td.authors || '[Pascal Crausaz](mailto:pascal@askpascal.com )').padEnd(46)} |\n`;
    output += `| Special                    | ${(td.special || '').padEnd(46)} |\n`;
  } else {
    output += `| Traditional      |                                                |\n`;
    output += `| ---------------- | ---------------------------------------------- |\n`;
    output += `| Serve            | ${(td.serve || '').padEnd(46)} |\n`;
    output += `| Preparation Time | ${(td.prep || '').padEnd(46)} |\n`;
    output += `| Cooking Time     | ${((td.cookTrad || td.cookSV) || '').padEnd(46)} |\n`;
    output += `| Temperature      | ${(td.temp || '').padEnd(46)} |\n`;
    output += `| Authors          | ${(td.authors || '[Pascal Crausaz](mailto:pascal@askpascal.com )').padEnd(46)} |\n`;
    output += `| Special          | ${(td.special || '').padEnd(46)} |\n`;
  }

  output += '\n';

  // Add images
  if (extracted.images.length > 0) {
    output += formatImages(extracted.images) + '\n\n';
  }

  output += ':::\n\n';

  return output;
}

async function convertRecipe(filePath, filename) {
  const content = await readFile(filePath, 'utf-8');

  const isSV = isSousVide(filename, content);
  const tags = determineTags(filename, content, isSV);
  const infoCallout = extractInfoCallout(content);
  const extracted = extractContent(content);

  const converted = buildConvertedRecipe(filename, content, tags, isSV, infoCallout, extracted);

  await writeFile(filePath, converted, 'utf-8');
}

async function convertAllRecipes() {
  const recipesDir = './content/Recipes';
  const entries = await readdir(recipesDir);

  let converted = 0;
  let excluded = 0;
  let errors = 0;

  for (const filename of entries.sort()) {
    if (!filename.endsWith('.md') || filename === 'attachments') continue;

    if (EXCLUDE_FILES.includes(filename)) {
      console.log(`⊘ Excluded: ${filename}`);
      excluded++;
      continue;
    }

    try {
      const filePath = join(recipesDir, filename);
      await convertRecipe(filePath, filename);
      console.log(`✓ Converted: ${filename}`);
      converted++;
    } catch (error) {
      console.error(`✗ Error converting ${filename}:`, error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('CONVERSION COMPLETE');
  console.log('='.repeat(80));
  console.log(`✓ Successfully converted: ${converted} recipes`);
  console.log(`⊘ Excluded: ${excluded} files`);
  console.log(`✗ Errors: ${errors}`);
}

console.log('Starting recipe conversion (v2)...\n');
await convertAllRecipes();
