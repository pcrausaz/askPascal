#!/usr/bin/env node
// Post-build image optimization for the emitted site.
// Recompresses jpg/jpeg/png in place (same filenames, so no HTML rewrites):
//   - resizes anything wider than MAX_WIDTH down to MAX_WIDTH
//   - jpeg: mozjpeg q78, EXIF orientation baked in
//   - png: palette quantization (drawings/screenshots tolerate this well)
// A file is only replaced when the result is smaller than the original.
// Usage: node scripts/optimize-images.mjs [outputDir=public]
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const ROOT = process.argv[2] ?? "public"
const MAX_WIDTH = 1600
const CONCURRENCY = 8

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else yield p
  }
}

const isTarget = (p) => /\.(jpe?g|png)$/i.test(p)

let before = 0
let after = 0
let optimized = 0
let skipped = 0
let failed = 0

async function optimize(p) {
  try {
    const orig = await fs.readFile(p)
    const img = sharp(orig, { failOn: "none" }).rotate()
    const meta = await sharp(orig).metadata()
    const resized =
      (meta.width ?? 0) > MAX_WIDTH ? img.resize({ width: MAX_WIDTH, withoutEnlargement: true }) : img

    const out = /\.png$/i.test(p)
      ? await resized.png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer()
      : await resized.jpeg({ mozjpeg: true, quality: 78 }).toBuffer()

    before += orig.length
    if (out.length < orig.length) {
      await fs.writeFile(p, out)
      after += out.length
      optimized++
    } else {
      after += orig.length
      skipped++
    }
  } catch (err) {
    failed++
    console.error(`  ! ${p}: ${err.message}`)
  }
}

const files = []
for await (const p of walk(ROOT)) if (isTarget(p)) files.push(p)

console.log(`Optimizing ${files.length} images in ${ROOT}/ ...`)
for (let i = 0; i < files.length; i += CONCURRENCY) {
  await Promise.all(files.slice(i, i + CONCURRENCY).map(optimize))
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB"
console.log(
  `Done: ${optimized} optimized, ${skipped} kept (already small), ${failed} failed.\n` +
    `Total: ${mb(before)} -> ${mb(after)} (${((1 - after / before) * 100).toFixed(0)}% smaller)`,
)
