# Obsidian Vault to GitHub Auto-Sync

Automatic synchronization system that syncs your Obsidian vault (stored on iCloud) to your GitHub repository every 5 minutes.

## How It Works

**Sync Direction:** One-way (Vault → GitHub)
- Your Obsidian vault on iCloud is the **source of truth**
- Changes are automatically synced to your local GitHub repository
- Changes are committed and pushed to GitHub
- Runs every 5 minutes via macOS LaunchAgent

**Components:**
1. **VaultSync.app** - Background agent with Full Disk Access for iCloud
2. **Main sync script** (`scripts/sync-vault-to-github.sh`) - Performs the actual sync
3. **LaunchAgent** (`~/Library/LaunchAgents/com.askpascal.vault-sync.plist`) - Runs sync on schedule
4. **Control scripts** (`scripts/`) - Start, stop, and monitor the service

## Initial Setup

### Step 1: Grant Full Disk Access (Required)

Because your Obsidian vault is stored on iCloud Drive, macOS requires explicit permission for background processes to access it.

**IMPORTANT:** We grant this permission to `VaultSync.app` (not bash) for security. This means only this specific app can access iCloud, not all bash scripts on your system.

**To grant Full Disk Access:**

1. Open **System Settings** → **Privacy & Security** → **Full Disk Access**

2. Click the **Lock icon** (bottom left) to unlock and make changes

3. Click the **"+"** button to add an application

4. Navigate to:
   ```
   /Users/pascal/Documents/Sources/askPascal/VaultSync.app
   ```
   (You can press **Cmd+Shift+G** and paste this path)

5. Select **VaultSync.app** and click **Open**

6. Ensure the checkbox next to **VaultSync** is **enabled** ✓

7. Click the **Lock icon** again to prevent further changes

### Step 2: Start the Sync Service

```bash
# From the askPascal directory
./scripts/start-vault-sync.sh
```

That's it! The sync service is now running and will:
- Sync every 5 minutes automatically
- Start automatically when you log in
- Run completely in the background (no UI, no dock icon)

## Usage

### Start the Sync Service

```bash
./scripts/start-vault-sync.sh
```

Starts automatic syncing. The service will run every 5 minutes and start automatically at login.

### Stop the Sync Service

```bash
./scripts/stop-vault-sync.sh
```

Stops automatic syncing. Use this if you want to temporarily disable syncing.

### Check Service Status

```bash
./scripts/check-vault-sync-status.sh
```

Shows:
- Whether the service is running
- Recent sync activity
- Log file location

### Manual Sync (One-Time)

```bash
./scripts/manual-sync.sh
```

Runs a sync immediately without waiting for the scheduled interval. Useful for:
- Testing the sync setup
- Forcing an immediate sync
- Verifying everything works

## Logs

All sync activity is logged for troubleshooting:

**Primary log:**
```
~/Library/Logs/askpascal-vault-sync/sync.log
```

**LaunchAgent logs:**
```
~/Library/Logs/askpascal-vault-sync/launchd-stdout.log
~/Library/Logs/askpascal-vault-sync/launchd-stderr.log
```

**View recent activity:**
```bash
tail -f ~/Library/Logs/askpascal-vault-sync/sync.log
```

## Changing Sync Frequency

The default frequency is **5 minutes**. To change it:

1. **Stop the service:**
   ```bash
   ./scripts/stop-vault-sync.sh
   ```

2. **Edit the LaunchAgent plist:**
   ```bash
   nano ~/Library/LaunchAgents/com.askpascal.vault-sync.plist
   ```

3. **Find and modify the `StartInterval` value** (in seconds):
   ```xml
   <key>StartInterval</key>
   <integer>300</integer>  <!-- 5 minutes -->
   ```

   Common intervals:
   - `60` = 1 minute
   - `300` = 5 minutes (default)
   - `600` = 10 minutes
   - `900` = 15 minutes
   - `1800` = 30 minutes
   - `3600` = 1 hour

4. **Save and restart the service:**
   ```bash
   ./scripts/start-vault-sync.sh
   ```

## Enabling Bidirectional Sync (GitHub → Vault)

**WARNING:** Bidirectional sync can cause conflicts if you edit files in both locations.

By default, the sync is **one-way (Vault → GitHub)**. To enable bidirectional sync:

### Option 1: Pull Before Sync (Safest)

Modify `scripts/sync-vault-to-github.sh` to pull changes before syncing:

```bash
# Add these lines after line 52 (after "cd $REPO_PATH")
log "Pulling latest changes from GitHub..."
if git pull origin main >> "$LOG_FILE" 2>&1; then
    log "Successfully pulled from GitHub"

    # Sync GitHub changes back to vault
    log "Syncing GitHub changes to vault..."
    rsync -av --delete \
        --exclude='.obsidian' \
        --exclude='.DS_Store' \
        --exclude='.git' \
        "$CONTENT_PATH/" "$VAULT_PATH/" >> "$LOG_FILE" 2>&1
else
    log "WARNING: Pull failed (possibly offline or conflicts)"
fi
```

### Option 2: Separate Sync Script

Create a separate bidirectional sync script that:
1. Pulls from GitHub → Vault
2. Syncs Vault → GitHub
3. Handles merge conflicts

**Recommendation:** Stick with one-way sync unless you have a specific need for bidirectional sync.

## Offline Behavior

The sync system handles offline situations gracefully:

**When offline:**
- ✓ Vault → Repository sync continues (local copy)
- ✓ Changes are committed locally
- ✗ Push to GitHub fails (silently logged)
- ✓ Changes will be pushed on next successful sync when online

**When back online:**
- All pending commits are pushed automatically
- No data loss occurs

**In the logs, you'll see:**
```
WARNING: Push failed (possibly offline). Changes are committed locally
and will be pushed on next successful sync.
```

This is expected and normal when offline.

## Troubleshooting

### Permission Errors

If you see errors like "Operation not permitted" or "cannot access parent directories":

**Solution:** Grant Full Disk Access to VaultSync.app (see Initial Setup → Step 1)

```bash
# Check for permission errors in logs
cat ~/Library/Logs/askpascal-vault-sync/launchd-stderr.log
```

Common error messages indicating missing Full Disk Access:
- `Operation not permitted`
- `cannot access parent directories`
- `Permission denied`

### Sync service won't start

```bash
# Check if plist exists
ls -la ~/Library/LaunchAgents/com.askpascal.vault-sync.plist

# Check for errors in logs
cat ~/Library/Logs/askpascal-vault-sync/launchd-stderr.log
```

### Changes aren't syncing

```bash
# Check service status
./scripts/check-vault-sync-status.sh

# Run manual sync to see errors
./scripts/manual-sync.sh

# Check logs
tail -n 50 ~/Library/Logs/askpascal-vault-sync/sync.log
```

### Git conflicts

If you edit files directly in the GitHub repo AND in Obsidian:

```bash
# Stop sync
./scripts/stop-vault-sync.sh

# Resolve conflicts manually in the repo
cd /Users/pascal/Documents/Sources/askPascal
git status
# Resolve any conflicts, then:
git add .
git commit -m "Resolved conflicts"
git push

# Restart sync
./scripts/start-vault-sync.sh
```

### Reset everything

If something goes wrong and you want to start fresh:

```bash
# Stop the service
./scripts/stop-vault-sync.sh

# Remove logs
rm -rf ~/Library/Logs/askpascal-vault-sync/

# Restart
./scripts/start-vault-sync.sh
```

## Technical Details

**Vault Path:**
```
/Users/pascal/Library/Mobile Documents/iCloud~md~obsidian/Documents/askpascal
```

**Repository Path:**
```
/Users/pascal/Documents/Sources/askPascal/content/
```

**Excluded from Sync:**
- `.obsidian/` - Obsidian configuration
- `.DS_Store` - macOS metadata
- `.git/` - Git repository files

**Sync Method:**
- Uses `rsync` with `--delete` flag (mirrors vault to repo)
- Preserves file permissions and timestamps
- Only copies changed files (efficient)

## Uninstalling

To completely remove the sync system:

```bash
# Stop the service
./scripts/stop-vault-sync.sh

# Remove LaunchAgent
rm ~/Library/LaunchAgents/com.askpascal.vault-sync.plist

# Remove logs (optional)
rm -rf ~/Library/Logs/askpascal-vault-sync/

# Remove scripts (if desired)
rm scripts/sync-vault-to-github.sh
rm scripts/start-vault-sync.sh
rm scripts/stop-vault-sync.sh
rm scripts/manual-sync.sh
rm scripts/check-vault-sync-status.sh
```

## FAQ

**Q: Why do I need to grant Full Disk Access? Is it safe?**
A: Your Obsidian vault is stored on iCloud Drive, which has special protections in macOS. Background processes need explicit Full Disk Access to read from iCloud. We created `VaultSync.app` as a dedicated wrapper so only THIS app has access, not all bash scripts. This is much more secure than granting bash Full Disk Access.

**Q: What is VaultSync.app?**
A: It's a lightweight background agent (no UI, no dock icon) that wraps the sync script. It runs silently and invisibly. You'll never see it - it just provides the security boundary for Full Disk Access.

**Q: Will this sync my Obsidian settings?**
A: No, `.obsidian/` is excluded from sync. Only your content (markdown files and attachments) is synced.

**Q: What happens if I'm editing a file while sync runs?**
A: The sync will capture the file state at that moment. Obsidian saves frequently, so your changes should be captured.

**Q: Can I sync to multiple repositories?**
A: Not with this setup. You'd need to modify the script to push to multiple remotes.

**Q: Does this work with GitHub private repositories?**
A: Yes, as long as your git credentials are configured for the repository.

**Q: Will this drain my battery?**
A: Minimal impact. Sync runs every 5 minutes for a few seconds. Total CPU usage is negligible.

**Q: Can I sync on-demand instead of scheduled?**
A: Yes! Use `./scripts/manual-sync.sh` anytime. You can also stop the automatic service.

---

## Quick Reference

```bash
# Start automatic sync
./scripts/start-vault-sync.sh

# Stop automatic sync
./scripts/stop-vault-sync.sh

# Check status
./scripts/check-vault-sync-status.sh

# Manual sync
./scripts/manual-sync.sh

# View logs
tail -f ~/Library/Logs/askpascal-vault-sync/sync.log
```
