# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Quartz 5** static site project publishing askpascal.com — a personal site (recipes, articles/references, photo galleries) built from an Obsidian vault. Markdown in `content/` is built into static HTML in `public/`.

The site was migrated from Quartz v4 in August 2026. The last v4 state is tagged `v4-final` (rollback: `git checkout v4-final`).

**Official Quartz docs**: https://quartz.jzhao.xyz/ (configuration, plugins, layout).

## Common Commands

Requires Node >= 22 (`export PATH="$HOME/.nvm/versions/node/v22.20.0/bin:$PATH"` — the default shell has Node 20).

```bash
npx quartz build                       # build site into public/
npx quartz build --serve --port 8081   # build + live preview (add --wsPort 3002 if 3001 is busy)
npx quartz plugin install --from-config # install/link plugins from quartz.config.yaml
node scripts/optimize-images.mjs public # post-build image compression (CI runs this)
npm run check                          # type check
npm test                               # tests
```

Note: `quartz build --serve` does NOT watch `quartz.config.yaml` — restart the server after config changes.

## Architecture (Quartz 5)

- **`quartz.config.yaml`** is the single config file (site metadata, theme colors/fonts, and the full plugin list with per-plugin `layout` positions). There is no `quartz.config.ts` or `quartz.layout.ts` anymore.
- **Plugins** are npm packages (`@quartz-community/*`) or local paths, declared in the config and installed via `npx quartz plugin install --from-config` (lockfile: `quartz.lock.json`, cache: `.quartz/plugins/`).
- **Local custom plugin**: `plugins/custom-directives/` (plain ESM JS, no build step):
  - Transforms `:::two-columns`/`:::three-columns`/`:::two-columns-split` (+`-white`/`-plain` variants) container directives into responsive column layouts, splitting at headings (h1–h3) or `---`. Used by ~250 recipes.
  - Injects per-section `cssclasses` (`section-recipes`, `section-articles`) based on folder, applied to `<article>`.
- **Custom styles**: `quartz/styles/custom.scss` — column grids (container-based `auto-fit`, no viewport media queries), landing-page cards (`article.landing`), gallery grid (`article.gallery` flattens markdown image tables), section accents. This file is the safe customization surface (upstream keeps it nearly empty).
- **Theme**: stock Quartz palette. `@quartz-themes/core` is configured but `enabled: false`; flipping it on + `npm install @quartz-themes/<name>` applies any of 860 ported Obsidian themes (previews: quartz-themes.github.io/<name>).
- **URLs are lowercased/hyphenated** in v5. The `alias-redirects` plugin emits redirect stubs at the old mixed-case URLs (only visible on case-sensitive filesystems — macOS collapses them locally).

## Content conventions

- 295+ notes have **no frontmatter**: titles from filenames, tags as inline hashtags on line 1, dates from git history.
- Wikilinks everywhere; inside markdown tables pipes must be escaped (`![[img\|200]]`).
- `Home.md` is the landing page (`cssclasses: landing`, alias `index`; do NOT add a `home` alias — it collides with the page's own slug and breaks the homepage).
- `askPascal/Photo Album.md` uses `cssclasses: gallery` — its image tables render as a responsive grid.

## Deployment

`.github/workflows/deploy.yml` on push to `main`: checkout (fetch-depth 0 for git dates) → Node 22 → `npm ci` → plugin install → `npx quartz build` → `node scripts/optimize-images.mjs public` (796→153 MB) → verification gate (case redirects, columns, gallery, CNAME) → GitHub Pages deploy. Custom domain via the `cname` plugin (reads `baseUrl`).

## Automated Vault Synchronization

Unchanged from v4. `scripts/sync-vault-to-github.sh` rsyncs the iCloud Obsidian vault (`/Users/pascal/Library/Mobile Documents/iCloud~md~obsidian/Documents/askpascal/`) into `content/`, commits (`Auto-sync from Obsidian vault - <timestamp>`), and pushes `main` — run by `VaultSync.app` via LaunchAgent every 5 minutes.

- Manage: `scripts/start-vault-sync.sh` / `stop-vault-sync.sh` / `check-vault-sync-status.sh` / `manual-sync.sh`
- Logs: `~/Library/Logs/askpascal-vault-sync/sync.log`
- **The vault is the source of truth** — content fixes must be made in the vault, not `content/` (rsync overwrites it within 5 minutes).
- Stop the service before any git surgery on `main` (`stop-vault-sync.sh`), restart after.

## Gotchas

- Large pushes may need `git -c http.postBuffer=524288000 push`.
- `git ls-files` tracks `content/home.md` lowercase while the filesystem shows `Home.md` (historical case rename; harmless).
- `upstream` remote = `jackyzha0/quartz`; update Quartz by merging `upstream/v5`. Pass `-R pcrausaz/askPascal` to `gh` (it otherwise resolves the upstream repo).
- **Dependabot**: do NOT merge major-version bumps of Quartz's own npm dependencies (typescript, esbuild, sharp, remark/rehype, etc.) — they break the build; those arrive safely via `git merge upstream/v5`. Patch/minor and GitHub Actions bumps are fine. The deploy verification gate blocks a broken build from reaching production (PR #3 was reverted for exactly this).
- **Do not cache `.quartz/plugins` in CI**: a cache hit makes `quartz plugin install` skip the local plugin's own `npm install`, the plugin then fails to load, and recipes silently lose their column layout.
- Known-intentional dead links: `[[spring rolls]]`, chocolate-sorbet, and the `test-*` scratch pages under `askPascal/Obsidian Style Recipes/`.
