#!/usr/bin/env node
/**
 * Strip CSS source map comments from HTML files
 * This removes the inline source maps that contain absolute paths
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function stripSourceMapsFromHTML(filePath) {
  const content = await readFile(filePath, 'utf-8');

  // Remove CSS source map comments
  const cleaned = content.replace(/\/\*# sourceMappingURL=data:application\/json[^*]+\*\//g, '');

  if (content !== cleaned) {
    await writeFile(filePath, cleaned, 'utf-8');
    return true;
  }
  return false;
}

async function processDirectory(dir) {
  let processedCount = 0;

  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith('.html')) {
        const wasModified = await stripSourceMapsFromHTML(fullPath);
        if (wasModified) {
          processedCount++;
        }
      }
    }
  }

  await walk(dir);
  return processedCount;
}

const publicDir = './public';
console.log('Stripping source maps from HTML files...');
const count = await processDirectory(publicDir);
console.log(`Processed ${count} HTML files`);
