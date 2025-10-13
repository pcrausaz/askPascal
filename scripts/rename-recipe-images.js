import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_DIR = path.join(__dirname, 'content', 'Recipes');
const ATTACHMENTS_DIR = path.join(RECIPES_DIR, 'attachments');

// Convert recipe filename to base name for image naming
function toImageName(recipeFilename) {
  // Remove .md extension
  const baseName = recipeFilename.replace(/\.md$/, '');
  // Replace spaces with underscores
  return baseName.replace(/\s+/g, '_');
}

// Extract all image references from a markdown file
function extractImageReferences(content) {
  const images = [];

  // Match Obsidian-style images: ![[filename.ext|size]] or ![[filename.ext]]
  const obsidianRegex = /!\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
  let match;

  while ((match = obsidianRegex.exec(content)) !== null) {
    const imageName = match[1];
    // Decode URL-encoded names like %20 for spaces
    const decoded = decodeURIComponent(imageName);

    // Check if it's an image file
    if (/\.(jpg|jpeg|png|gif|webp|heic|bmp|svg)$/i.test(decoded)) {
      images.push(decoded);
    }
  }

  return images;
}

// Phase 1: Analyze all recipes and build image-to-recipes mapping
function analyzeRecipes() {
  console.log('Phase 1: Analyzing recipe files...\n');

  const recipeFiles = fs.readdirSync(RECIPES_DIR)
    .filter(f => f.endsWith('.md'))
    .filter(f => !f.startsWith('.'))
    .sort(); // Sort for consistent processing

  const imageToRecipes = new Map(); // imageName -> [recipe filenames]
  const recipeToImages = new Map(); // recipe filename -> [image names in order]

  let totalImages = 0;

  recipeFiles.forEach(filename => {
    const filePath = path.join(RECIPES_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const images = extractImageReferences(content);

    if (images.length > 0) {
      recipeToImages.set(filename, images);
      totalImages += images.length;

      images.forEach(imageName => {
        if (!imageToRecipes.has(imageName)) {
          imageToRecipes.set(imageName, []);
        }
        imageToRecipes.get(imageName).push(filename);
      });

      console.log(`✓ ${filename}: ${images.length} image(s)`);
    }
  });

  console.log(`\nTotal: ${recipeToImages.size} recipes with images`);
  console.log(`Total image references: ${totalImages}`);
  console.log(`Unique images: ${imageToRecipes.size}\n`);

  return { imageToRecipes, recipeToImages };
}

// Phase 2: Generate rename mapping
function generateRenameMapping(imageToRecipes, recipeToImages) {
  console.log('Phase 2: Generating rename mapping...\n');

  const renameMap = new Map(); // oldName -> newName
  const sharedImages = [];

  // Track which images have been processed to handle duplicates
  const processedImages = new Set();

  // Process each recipe's images
  for (const [recipeFilename, images] of recipeToImages.entries()) {
    const baseName = toImageName(recipeFilename);

    images.forEach((imageName, index) => {
      // Skip if already processed (shared image case)
      if (processedImages.has(imageName)) {
        return;
      }

      const recipes = imageToRecipes.get(imageName);
      let newBaseName = baseName;

      // If image is shared by multiple recipes, use alphabetically first recipe
      if (recipes.length > 1) {
        const sortedRecipes = [...recipes].sort();
        newBaseName = toImageName(sortedRecipes[0]);
        sharedImages.push({
          oldName: imageName,
          recipes: recipes,
          selectedRecipe: sortedRecipes[0]
        });
      }

      processedImages.add(imageName);
    });
  }

  // Now build final rename map with proper numbering per recipe
  for (const [recipeFilename, images] of recipeToImages.entries()) {
    const baseName = toImageName(recipeFilename);

    // Get unique images for this recipe (considering shared images)
    const recipeImages = [];
    for (const imageName of images) {
      const recipes = imageToRecipes.get(imageName);
      if (recipes.length === 1 || recipes.sort()[0] === recipeFilename) {
        recipeImages.push(imageName);
      }
    }

    // Generate new names with numbering
    recipeImages.forEach((imageName, index) => {
      const ext = path.extname(imageName);
      let newName;

      if (recipeImages.length === 1) {
        // Single image: no number suffix
        newName = `${baseName}${ext}`;
      } else {
        // Multiple images: add number
        newName = `${baseName}_${index + 1}${ext}`;
      }

      renameMap.set(imageName, newName);
    });
  }

  console.log(`Generated ${renameMap.size} rename mappings`);

  if (sharedImages.length > 0) {
    console.log(`\n⚠ Found ${sharedImages.length} shared image(s):`);
    sharedImages.forEach(({ oldName, recipes, selectedRecipe }) => {
      console.log(`  ${oldName}`);
      console.log(`    Used by: ${recipes.join(', ')}`);
      console.log(`    → Using: ${selectedRecipe}`);
    });
  }

  console.log();
  return renameMap;
}

// Phase 3: Update markdown references
function updateMarkdownReferences(renameMap) {
  console.log('Phase 3: Updating markdown references...\n');

  const recipeFiles = fs.readdirSync(RECIPES_DIR)
    .filter(f => f.endsWith('.md'))
    .filter(f => !f.startsWith('.'));

  let updatedFiles = 0;
  let updatedReferences = 0;

  recipeFiles.forEach(filename => {
    const filePath = path.join(RECIPES_DIR, filename);
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // Update Obsidian-style image references
    content = content.replace(/!\[\[([^\]|]+?)(\|[^\]]+)?\]\]/g, (match, imageName, sizePart) => {
      const decoded = decodeURIComponent(imageName);

      if (renameMap.has(decoded)) {
        changed = true;
        updatedReferences++;
        const newName = renameMap.get(decoded);
        return sizePart ? `![[${newName}${sizePart}]]` : `![[${newName}]]`;
      }

      return match;
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      updatedFiles++;
      console.log(`✓ ${filename}`);
    }
  });

  console.log(`\nUpdated ${updatedReferences} reference(s) in ${updatedFiles} file(s)\n`);
  return { updatedFiles, updatedReferences };
}

// Phase 4: Rename physical files
function renamePhysicalFiles(renameMap) {
  console.log('Phase 4: Renaming physical image files...\n');

  let renamedCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const [oldName, newName] of renameMap.entries()) {
    const oldPath = path.join(ATTACHMENTS_DIR, oldName);
    const newPath = path.join(ATTACHMENTS_DIR, newName);

    try {
      // Check if source file exists
      if (!fs.existsSync(oldPath)) {
        errors.push(`Source file not found: ${oldName}`);
        errorCount++;
        continue;
      }

      // Check if destination already exists
      if (fs.existsSync(newPath) && oldPath !== newPath) {
        errors.push(`Destination already exists: ${newName}`);
        errorCount++;
        continue;
      }

      // Skip if same name (shouldn't happen but safety check)
      if (oldName === newName) {
        continue;
      }

      fs.renameSync(oldPath, newPath);
      renamedCount++;
      console.log(`✓ ${oldName} → ${newName}`);
    } catch (error) {
      errors.push(`Error renaming ${oldName}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n✓ Renamed ${renamedCount} file(s)`);

  if (errorCount > 0) {
    console.log(`✗ Errors: ${errorCount}`);
    errors.forEach(err => console.log(`  ${err}`));
  }

  return { renamedCount, errorCount, errors };
}

// Phase 5: Validation
function validateReferences() {
  console.log('\nPhase 5: Validating references...\n');

  const recipeFiles = fs.readdirSync(RECIPES_DIR)
    .filter(f => f.endsWith('.md'))
    .filter(f => !f.startsWith('.'));

  const availableImages = new Set(
    fs.readdirSync(ATTACHMENTS_DIR)
      .filter(f => /\.(jpg|jpeg|png|gif|webp|heic|bmp|svg)$/i.test(f))
  );

  const brokenReferences = [];

  recipeFiles.forEach(filename => {
    const filePath = path.join(RECIPES_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const images = extractImageReferences(content);

    images.forEach(imageName => {
      if (!availableImages.has(imageName)) {
        brokenReferences.push({ recipe: filename, image: imageName });
      }
    });
  });

  if (brokenReferences.length === 0) {
    console.log('✓ All image references are valid!');
  } else {
    console.log(`✗ Found ${brokenReferences.length} broken reference(s):`);
    brokenReferences.forEach(({ recipe, image }) => {
      console.log(`  ${recipe}: ${image}`);
    });
  }

  return brokenReferences;
}

// Main execution
function main() {
  console.log('='.repeat(80));
  console.log('RECIPE IMAGE RENAMING');
  console.log('='.repeat(80));
  console.log();

  try {
    // Phase 1: Analyze
    const { imageToRecipes, recipeToImages } = analyzeRecipes();

    // Phase 2: Generate rename mapping
    const renameMap = generateRenameMapping(imageToRecipes, recipeToImages);

    // Save rename map for reference
    const renameMapPath = path.join(__dirname, 'image-rename-map.json');
    const renameMapData = {};
    for (const [oldName, newName] of renameMap.entries()) {
      renameMapData[oldName] = newName;
    }
    fs.writeFileSync(renameMapPath, JSON.stringify(renameMapData, null, 2));
    console.log(`Saved rename map to: image-rename-map.json\n`);

    // Phase 3: Update markdown references
    const { updatedFiles, updatedReferences } = updateMarkdownReferences(renameMap);

    // Phase 4: Rename files
    const { renamedCount, errorCount, errors } = renamePhysicalFiles(renameMap);

    // Phase 5: Validate
    const brokenReferences = validateReferences();

    // Final summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Images analyzed: ${imageToRecipes.size}`);
    console.log(`Recipes with images: ${recipeToImages.size}`);
    console.log(`Rename mappings generated: ${renameMap.size}`);
    console.log(`Markdown files updated: ${updatedFiles}`);
    console.log(`References updated: ${updatedReferences}`);
    console.log(`Physical files renamed: ${renamedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Broken references: ${brokenReferences.length}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
