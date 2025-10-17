# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Quartz v4** static site generator project that publishes a digital garden/personal website. The site is called "askPascal" and is built from markdown files in the `content/` directory into static HTML in the `public/` directory.

Quartz is a framework that converts Obsidian-flavored markdown into a website with features like:
- Full-text search
- Graph visualization
- Wiki-style links
- Tag pages
- Table of contents
- Dark mode
- Single-page application (SPA) navigation

## Reference Documentation

**Official Quartz 4 Documentation**: https://quartz.jzhao.xyz/

Key documentation pages:
- **Configuration Guide**: https://quartz.jzhao.xyz/configuration - Details on `quartz.config.ts` options
- **Plugin List**: https://quartz.jzhao.xyz/plugins - All 27+ built-in plugins (transformers, emitters, filters)
- **Making Custom Plugins**: https://quartz.jzhao.xyz/advanced/making-plugins - Guide for creating custom plugins (essential for understanding this project's custom plugins)
- **Layout Configuration**: Documentation on configuring `quartz.layout.ts` and components


## Common Commands

### Building and Development
```bash
# Build the site (output to public/)
npm run quartz build

# Build and serve with live preview (default port 8080)
npm run quartz build -- --serve

# Build and watch for changes with live reload
npm run quartz build -- --serve --watch

# Build with verbose logging
npm run quartz build -- --verbose

# Specify custom content directory
npm run quartz build -- -d path/to/content

# Specify custom output directory
npm run quartz build -- -o path/to/output
```

### Code Quality
```bash
# Type check without emitting files
npm run check

# Format code with Prettier
npm run format

# Run tests
npm test
```

### Other Quartz Commands
```bash
# Create a new Quartz project
npm run quartz create

# Update Quartz to latest version
npm run quartz update

# Sync to GitHub
npm run quartz sync
```

## Architecture

### Plugin System
Quartz uses a three-stage plugin architecture:

1. **Transformers** (`quartz/plugins/transformers/`): Process markdown content during parsing
   - Parse frontmatter, transform links, add syntax highlighting, generate table of contents, etc.
   - Custom transformer example: `custom-directives.ts` handles container directives (e.g., `:::div{.class}`)

2. **Filters** (`quartz/plugins/filters/`): Decide which content to include
   - Remove drafts, explicit filters, etc.

3. **Emitters** (`quartz/plugins/emitters/`): Generate output files
   - Generate HTML pages, assets, sitemap, RSS feed, OG images, etc.
   - Custom emitter: `ogImage.tsx` generates social media preview images (exported as `CustomOgImages`)

### Configuration Files

- **`quartz.config.ts`**: Main configuration file
  - Site metadata (title, base URL, locale)
  - Theme settings (colors, fonts)
  - Plugin configuration
  - Analytics setup
  - Ignore patterns for content processing

- **`quartz.layout.ts`**: Layout configuration
  - Defines components for page header, footer, sidebar (left/right)
  - Separate layouts for content pages vs. list pages (tags, folders)
  - Component positioning and visibility (desktop/mobile)

### Build Process

The build process flows through three main stages:

1. **Parse** (`quartz/processors/parse.ts`):
   - Reads markdown files from content directory
   - Applies transformer plugins to process content
   - Generates abstract syntax trees (AST)

2. **Filter** (`quartz/processors/filter.ts`):
   - Applies filter plugins to decide what content to include

3. **Emit** (`quartz/processors/emit.ts`):
   - Applies emitter plugins to generate output files
   - Supports incremental builds with `partialEmit` for changed files only

### Component System

Components (`quartz/components/`) are Preact/TSX components that render parts of the page:
- Page structure: `PageTitle`, `ArticleTitle`, `Body`, `Header`, `Footer`
- Navigation: `Breadcrumbs`, `Explorer`, `TableOfContents`, `Backlinks`
- Interactive: `Search`, `Graph`, `Darkmode`, `ReaderMode`
- Layout utilities: `Flex`, `MobileOnly`, `DesktopOnly`, `ConditionalRender`

### Content Organization

- **Content source**: `content/` directory (markdown files)
- **Build output**: `public/` directory (static HTML, CSS, JS, images)
- **Ignore patterns**: Configured in `quartz.config.ts` (default: `private`, `templates`, `.obsidian`)

### Custom Modifications

This project has custom modifications from stock Quartz:

1. **Custom Directives Plugin** (`quartz/plugins/transformers/custom-directives.ts`):
   - Transforms container directives like `:::div{.class}` into HTML div elements
   - Allows using markdown directive syntax for custom layouts

2. **Custom OG Images** (`quartz/plugins/emitters/ogImage.tsx`):
   - Generates social media preview images (`.webp` format) for each page
   - Export named `CustomOgImages` (not the standard Quartz name)
   - Can be commented out in `quartz.config.ts` to speed up builds during development

## File Structure Overview

```
.
├── content/                    # Markdown content files
├── public/                     # Generated static site (gitignored)
├── quartz/                     # Quartz framework code
│   ├── components/            # UI components (Preact/TSX)
│   ├── plugins/               # Plugin system
│   │   ├── transformers/     # Content transformation
│   │   ├── filters/          # Content filtering
│   │   └── emitters/         # Output generation
│   ├── processors/            # Build pipeline stages
│   ├── util/                  # Utilities
│   ├── bootstrap-cli.mjs      # CLI entry point
│   ├── build.ts              # Main build orchestration
│   └── cfg.ts                # Configuration types
├── quartz.config.ts           # Site configuration
├── quartz.layout.ts           # Layout configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Development Notes

- **TypeScript**: Strict mode enabled, using ES modules
- **JSX**: Uses Preact (via `jsxImportSource: "preact"`)
- **Node version**: Requires Node.js >= 22
- **npm version**: Requires npm >= 10.9.2
- **Watch mode**: Supports incremental rebuilds with file watching (uses chokidar)
- **Testing**: Uses tsx test runner (test files: `*.test.ts`)

## Important Patterns

### Adding a New Transformer Plugin

1. Create a new file in `quartz/plugins/transformers/`
2. Export a function that returns a `QuartzTransformerPlugin` object
3. Add it to the transformers array in `quartz.config.ts`

### Adding a New Emitter Plugin

1. Create a new file in `quartz/plugins/emitters/`
2. Export a function that returns a `QuartzEmitterPlugin` object
3. Implement `emit()` for full builds and optionally `partialEmit()` for incremental builds
4. Add it to the emitters array in `quartz.config.ts`

### Modifying Layout

Edit `quartz.layout.ts` to:
- Change which components appear on pages
- Reposition components (left sidebar, right sidebar, before/after content)
- Configure different layouts for content pages vs. list pages

### Custom Styling

- Theme colors and fonts are configured in `quartz.config.ts` under `theme`
- Custom CSS can be added via component styles or static files
- Quartz uses SCSS for component styling

## Performance Considerations

- **OG Image Generation**: The `CustomOgImages` emitter can slow down builds significantly. Comment it out in `quartz.config.ts` during development if not needed.
- **Concurrency**: Build can use multiple threads for parsing notes (use `--concurrency` flag)
- **Incremental Builds**: Watch mode uses incremental builds with `partialEmit` when available

## Automated Vault Synchronization

This project uses an automated sync system to keep the Obsidian vault in sync with the GitHub repository.

### Architecture

The sync system consists of three components:

1. **Sync Script** (`scripts/sync-vault-to-github.sh`):
   - Core sync logic that uses `rsync` to sync from Obsidian vault to local repo
   - Source: `/Users/pascal/Library/Mobile Documents/iCloud~md~obsidian/Documents/askpascal/`
   - Destination: `/Users/pascal/Documents/Sources/askPascal/content/`
   - Automatically detects changes (including new untracked files) and commits them
   - Attempts to push to GitHub (fails gracefully if offline)
   - Logs to: `~/Library/Logs/askpascal-vault-sync/sync.log`

2. **VaultSync.app**:
   - macOS application bundle that wraps the sync script
   - Purpose: Solves permission/access issues when running via LaunchAgent
   - Location: `VaultSync.app/Contents/MacOS/VaultSync`
   - **Note**: This is just a compiled launcher for the script - all sync logic is in the shell script itself
   - No source code in this repo (compiled Mach-O binary)

3. **LaunchAgent** (`~/Library/LaunchAgents/com.askpascal.vault-sync.plist`):
   - Runs VaultSync.app every 5 minutes (300 seconds)
   - Automatically starts on login
   - Logs to: `~/Library/Logs/askpascal-vault-sync/launchd-stdout.log` and `launchd-stderr.log`

### Management Scripts

Located in `scripts/`:
- `start-vault-sync.sh` - Start the automated sync service
- `stop-vault-sync.sh` - Stop the automated sync service
- `check-vault-sync-status.sh` - Check if the service is running
- `manual-sync.sh` - Manually trigger a sync
- `sync-vault-to-github.sh` - The core sync script (called by VaultSync.app)

### Sync Behavior

The sync script:
- Uses `rsync --delete` to mirror vault content (removes deleted files)
- Excludes: `.obsidian/`, `.DS_Store`, `.git/`
- Only commits changes in the `content/` directory
- Creates commits with message: `Auto-sync from Obsidian vault - [timestamp]`
- Detects: modified files, new files, and deleted files
- Stages with: `git add content/`
- Pushes to: `origin/main`

### Troubleshooting

- **Check if running**: `./scripts/check-vault-sync-status.sh`
- **View logs**: `tail -f ~/Library/Logs/askpascal-vault-sync/sync.log`
- **Manual sync**: `./scripts/manual-sync.sh` or run `scripts/sync-vault-to-github.sh` directly
- **Restart service**: `./scripts/stop-vault-sync.sh && ./scripts/start-vault-sync.sh`
