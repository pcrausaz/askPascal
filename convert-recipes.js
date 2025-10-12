#!/usr/bin/env node
/**
 * Convert all recipe files to proper template format
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
  // Check special cases first
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
  // Check for special cases first
  if (SPECIAL_CASES[filename]) {
    return SPECIAL_CASES[filename].tags;
  }

  const tags = [];
  const contentLower = content.toLowerCase();
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
             filenameLower.includes('pastry') || filenameLower.includes('baba')) {
    tags.push('dessert');
  } else if (filenameLower.includes('appetizer') || filenameLower.includes('dip') ||
             filenameLower.includes('hummus') || filenameLower.includes('tapenade') ||
             filenameLower.includes('terrine') || filenameLower.includes('tartare') ||
             filenameLower.includes('ceviche') || filenameLower.includes('cocktail') && !isDrink(filename)) {
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
             filenameLower.includes('yolk') || filenameLower.includes('egg') && !filenameLower.includes('eggplant')) {
    tags.push('side');
  } else {
    // Default to meal
    tags.push('meal');
  }

  // Add cooking method tag
  if (isSousVide) {
    tags.push('sous-vide');
  } else {
    tags.push('traditional');
  }

  // Always add recipe tag
  tags.push('recipe');

  return tags;
}

function extractInfoCallout(content) {
  const match = content.match(/>\s*\[!(INFO|NOTE)\]\s*>\s*(.+?)(?=\n[^>]|\n\n|$)/s);
  if (match) {
    return match[2].trim();
  }

  // Try to find first descriptive paragraph
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#') && !line.startsWith('>') &&
        !line.startsWith('|') && !line.startsWith('-') &&
        !line.match(/^\d+\./) && line.length > 20) {
      return line;
    }
  }

  return '...';
}

function extractSections(content) {
  const sections = {
    ingredients: [],
    methods: [],
    tables: [],
    images: [],
    closingComment: null
  };

  const lines = content.split('\n');
  let currentSection = null;
  let currentContent = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect images
    if (trimmed.match(/^!\[\[.+\]\]/) || trimmed.match(/^!\[\]\(.+\)/)) {
      sections.images.push(trimmed);
      continue;
    }

    // Detect table start
    if (trimmed.startsWith('| ') && !inTable) {
      inTable = true;
      currentContent = [line];
      continue;
    }

    // In table
    if (inTable) {
      if (trimmed.startsWith('|') || trimmed.match(/^[|-]+$/)) {
        currentContent.push(line);
      } else {
        // End of table
        sections.tables.push(currentContent.join('\n'));
        currentContent = [];
        inTable = false;
      }
      continue;
    }

    // Detect section headers
    if (trimmed.match(/^##\s+(Ingredients?|Method)/i)) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        if (currentSection === 'ingredients') {
          sections.ingredients.push(currentContent.join('\n').trim());
        } else if (currentSection === 'method') {
          sections.methods.push(currentContent.join('\n').trim());
        }
      }

      // Start new section
      if (trimmed.match(/^##\s+Ingredients?/i)) {
        currentSection = 'ingredients';
        currentContent = [line];
      } else if (trimmed.match(/^##\s+Method/i)) {
        currentSection = 'method';
        currentContent = [line];
      }
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection && currentContent.length > 0) {
    if (currentSection === 'ingredients') {
      sections.ingredients.push(currentContent.join('\n').trim());
    } else if (currentSection === 'method') {
      sections.methods.push(currentContent.join('\n').trim());
    }
  }

  // Look for closing comments (text after the table)
  if (sections.tables.length > 0) {
    const tableIndex = content.indexOf(sections.tables[sections.tables.length - 1]);
    const afterTable = content.substring(tableIndex + sections.tables[sections.tables.length - 1].length);
    const commentMatch = afterTable.match(/\n\n([^\n!#|]+?)(?=\n!|\n#|\n\||$)/s);
    if (commentMatch && commentMatch[1].trim().length > 10) {
      sections.closingComment = commentMatch[1].trim();
    }
  }

  return sections;
}

function formatImages(images) {
  return images.map(img => {
    // Handle both [[image|size]] and ![](image) formats
    if (img.startsWith('![[')) {
      const match = img.match(/!\[\[([^\]|]+)(?:\|\d+)?\]\]/);
      if (match) {
        return `![[${match[1]}|200]]`;
      }
    } else if (img.startsWith('![](')) {
      const match = img.match(/!\[\]\(([^)]+)\)/);
      if (match) {
        return `![](${match[1]})`;
      }
    }
    return img;
  }).join('\n');
}

function buildConvertedContent(filename, sections, tags, isSousVide, infoCallout) {
  const title = filename.replace(/\.md$/, '');
  const tagString = tags.map(t => `#${t}`).join(' ');

  let output = `${tagString}\n\n`;
  output += `> [!INFO]\n> ${infoCallout}\n\n`;
  output += `:::two-columns-plain\n\n`;
  output += `### Details\n`;

  // Add ingredients
  if (sections.ingredients.length > 0) {
    for (const ingredientBlock of sections.ingredients) {
      output += ingredientBlock + '\n\n';
    }
  } else {
    output += '**Ingredients**\n- ...\n\n';
  }

  // Add methods
  if (sections.methods.length > 0) {
    for (const methodBlock of sections.methods) {
      output += methodBlock + '\n\n';
    }
  } else {
    output += '**Method**\n1. ...\n\n';
  }

  // Add closing comment if exists
  if (sections.closingComment) {
    output += sections.closingComment + '\n\n';
  }

  output += '\n### Quick View\n';

  // Build table
  if (isSousVide) {
    output += '| Sous-Vide                  |                                                |\n';
    output += '| -------------------------- | ---------------------------------------------- |\n';
    output += '| Serve                      |                                                |\n';
    output += '| Preparation Time           |                                                |\n';
    output += '| Cooking Time (sous-vide)   |                                                |\n';
    output += '| Cooking Time (traditional) |                                                |\n';
    output += '| Temperature                |                                                |\n';
    output += '| Authors                    | [Pascal Crausaz](mailto:pascal@askpascal.com ) |\n';
    output += '| Special                    |                                                |\n';
  } else {
    output += '| Traditional      |                                                |\n';
    output += '| ---------------- | ---------------------------------------------- |\n';
    output += '| Serve            |                                                |\n';
    output += '| Preparation Time |                                                |\n';
    output += '| Cooking Time     |                                                |\n';
    output += '| Temperature      |                                                |\n';
    output += '| Authors          | [Pascal Crausaz](mailto:pascal@askpascal.com ) |\n';
    output += '| Special          |                                                |\n';
  }

  // Try to extract data from existing tables to populate
  if (sections.tables.length > 0) {
    const existingTable = sections.tables[0];
    // Extract values from existing table
    const extractValue = (key) => {
      const regex = new RegExp(`\\|\\s*${key}[^|]*\\|\\s*([^|]+)\\|`, 'i');
      const match = existingTable.match(regex);
      return match ? match[1].trim() : '';
    };

    const serve = extractValue('Serve');
    const prep = extractValue('Preparation Time');
    const cookSV = extractValue('Cooking Time.*sous-vide');
    const cookTrad = extractValue('Cooking Time.*traditional') || extractValue('Cooking Time(?!.*sous)');
    const temp = extractValue('Temperature');
    const authors = extractValue('Authors');
    const special = extractValue('Special|Hardware');

    // Rebuild table with extracted values
    if (serve || prep || temp) {
      output = output.replace(/\| Serve\s+\|[^|]*\|/, `| Serve                      | ${serve.padEnd(46)} |`);
      output = output.replace(/\| Preparation Time\s+\|[^|]*\|/, `| Preparation Time           | ${prep.padEnd(46)} |`);
      if (isSousVide) {
        output = output.replace(/\| Cooking Time \(sous-vide\)\s+\|[^|]*\|/, `| Cooking Time (sous-vide)   | ${cookSV.padEnd(46)} |`);
        output = output.replace(/\| Cooking Time \(traditional\)\s+\|[^|]*\|/, `| Cooking Time (traditional) | ${cookTrad.padEnd(46)} |`);
      } else {
        output = output.replace(/\| Cooking Time\s+\|[^|]*\|/, `| Cooking Time     | ${(cookTrad || cookSV).padEnd(46)} |`);
      }
      output = output.replace(/\| Temperature\s+\|[^|]*\|/, `| Temperature                | ${temp.padEnd(46)} |`);
      if (authors) {
        output = output.replace(/\| Authors\s+\|[^|]*\|/, `| Authors                    | ${authors.padEnd(46)} |`);
      }
      if (special) {
        output = output.replace(/\| Special\s+\|[^|]*\|/, `| Special                    | ${special.padEnd(46)} |`);
      }
    }
  }

  output += '\n';

  // Add images
  if (sections.images.length > 0) {
    output += formatImages(sections.images) + '\n\n';
  }

  output += ':::\n\n';

  return output;
}

async function convertRecipe(filePath, filename) {
  const content = await readFile(filePath, 'utf-8');

  // Determine type and tags
  const isSV = isSousVide(filename, content);
  const tags = determineTags(filename, content, isSV);
  const infoCallout = extractInfoCallout(content);
  const sections = extractSections(content);

  // Build converted content
  const converted = buildConvertedContent(filename, sections, tags, isSV, infoCallout);

  // Write back
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

    // Check exclusions
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

// Execute
console.log('Starting recipe conversion...\n');
await convertAllRecipes();
