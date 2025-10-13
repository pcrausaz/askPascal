#!/bin/bash

#
# Start the askPascal Vault to GitHub Sync Service
#

PLIST_PATH="$HOME/Library/LaunchAgents/com.askpascal.vault-sync.plist"
LOG_DIR="$HOME/Library/Logs/askpascal-vault-sync"

echo "Starting askPascal Vault to GitHub Sync Service..."

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Check if plist exists
if [ ! -f "$PLIST_PATH" ]; then
    echo "ERROR: LaunchAgent plist not found at: $PLIST_PATH"
    echo "Please ensure the plist file is installed."
    exit 1
fi

# Unload first (in case it's already loaded)
launchctl unload "$PLIST_PATH" 2>/dev/null

# Load the LaunchAgent
if launchctl load "$PLIST_PATH"; then
    echo "✓ Sync service started successfully"
    echo "  - Syncs every 5 minutes"
    echo "  - Logs: $LOG_DIR/sync.log"
    echo ""
    echo "To check status: ./scripts/check-vault-sync-status.sh"
    echo "To stop: ./scripts/stop-vault-sync.sh"
else
    echo "✗ Failed to start sync service"
    exit 1
fi
