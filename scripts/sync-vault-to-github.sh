#!/bin/bash

#
# Obsidian Vault to GitHub Sync Script
# Syncs content from iCloud Obsidian vault to local GitHub repository
#

set -e

# Configuration
VAULT_PATH="/Users/pascal/Library/Mobile Documents/iCloud~md~obsidian/Documents/askpascal"
REPO_PATH="/Users/pascal/Documents/Sources/askPascal"
CONTENT_PATH="$REPO_PATH/content"
LOG_DIR="$HOME/Library/Logs/askpascal-vault-sync"
LOG_FILE="$LOG_DIR/sync.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

log "=========================================="
log "Starting vault sync"

# Verify vault exists
if [ ! -d "$VAULT_PATH" ]; then
    error_exit "Vault directory not found: $VAULT_PATH"
fi

# Verify repo exists
if [ ! -d "$REPO_PATH" ]; then
    error_exit "Repository directory not found: $REPO_PATH"
fi

# Verify git repo
if [ ! -d "$REPO_PATH/.git" ]; then
    error_exit "Not a git repository: $REPO_PATH"
fi

# Sync vault to repo content using rsync
log "Syncing vault to repository..."
rsync -av --delete \
    --exclude='.obsidian' \
    --exclude='.DS_Store' \
    --exclude='.git' \
    "$VAULT_PATH/" "$CONTENT_PATH/" >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
    error_exit "rsync failed"
fi

log "Sync completed successfully"

# Change to repo directory
cd "$REPO_PATH" || error_exit "Failed to change to repo directory"

# Check if there are any changes (including untracked files)
if [ -z "$(git status --porcelain)" ]; then
    log "No changes detected. Nothing to commit."
    log "Sync completed (no changes)"
    exit 0
fi

log "Changes detected. Preparing to commit..."

# Stage all changes
git add content/ >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
    error_exit "git add failed"
fi

# Commit with timestamp
COMMIT_MSG="Auto-sync from Obsidian vault - $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG" >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
    error_exit "git commit failed"
fi

log "Changes committed: $COMMIT_MSG"

# Try to push (will fail gracefully if offline)
log "Attempting to push to remote..."
if git push origin main >> "$LOG_FILE" 2>&1; then
    log "Successfully pushed to GitHub"
else
    log "WARNING: Push failed (possibly offline). Changes are committed locally and will be pushed on next successful sync."
fi

log "Sync completed successfully"
log "=========================================="

exit 0
