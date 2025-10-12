import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_DIR = path.join(__dirname, 'content', 'Recipes');

// These are the files with broken emoji references that need to be cleaned up
const fixes = [
  {
    file: 'Apricot Pastry Feuilletes aux Abricots.md',
    from: 'Sprinkle with a little bit of powdered sugar before serving (not like the picture ![[Apricot_Pastry_Feuilletes_aux_Abricots_1.png|200]]\n\n ) ',
    to: 'Sprinkle with a little bit of powdered sugar before serving (not like the picture 😊) '
  },
  {
    file: 'Cheese Fondue.md',
    search: /!\[\[Apricot_Pastry_Feuilletes_aux_Abricots_1\.png\|200\]\]/g,
    to: '😊'
  },
  {
    file: 'Fish and Chips.md',
    search: /!\[\[Apricot_Pastry_Feuilletes_aux_Abricots_1\.png\|200\]\]/g,
    to: '😊'
  },
  {
    file: 'Pan Ultimate Pizza Dough.md',
    search: /!\[\[Apricot_Pastry_Feuilletes_aux_Abricots_1\.png\|200\]\]/g,
    to: '😊'
  },
  {
    file: 'Petit Chou Tout Chou Lovely Little Cabbage.md',
    search: /!\[\[Apricot_Pastry_Feuilletes_aux_Abricots_1\.png\|200\]\]/g,
    to: '😊'
  },
  {
    file: 'Fruit Sorbet Raspberries Strawberries Mango Blackberry Lemon Etc.md',
    from: 'The following is the same recipe but [pacotized](https://pacojet.com/) (using a [Creami](https://www.ninjakitchen.com/exclusive-offer/NC301WBKT/ninja-creami-7-in-1-ice-cream-maker/) ![[Fruit_Sorbet_Raspberries_Strawberries_Mango_Blackberry_Lemon_Etc_1.png|200]]\n\n ), the only variation on the recipe is the 0.5% addition',
    to: 'The following is the same recipe but [pacotized](https://pacojet.com/) (using a [Creami](https://www.ninjakitchen.com/exclusive-offer/NC301WBKT/ninja-creami-7-in-1-ice-cream-maker/) 😉), the only variation on the recipe is the 0.5% addition'
  }
];

console.log('Fixing broken emoji image references...\n');

let fixed = 0;
let errors = 0;

fixes.forEach(({ file, from, to, search }) => {
  const filePath = path.join(RECIPES_DIR, file);

  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    if (search) {
      // Regex replacement
      if (content.match(search)) {
        content = content.replace(search, to);
        fs.writeFileSync(filePath, content, 'utf-8');
        fixed++;
        console.log(`✓ ${file}`);
      } else {
        console.log(`⚠ ${file} - pattern not found`);
      }
    } else {
      // String replacement
      if (content.includes(from)) {
        content = content.replace(from, to);
        fs.writeFileSync(filePath, content, 'utf-8');
        fixed++;
        console.log(`✓ ${file}`);
      } else {
        console.log(`⚠ ${file} - text not found`);
      }
    }
  } catch (error) {
    console.error(`✗ ${file}:`, error.message);
    errors++;
  }
});

console.log(`\n✓ Fixed: ${fixed}`);
console.log(`✗ Errors: ${errors}`);
