#!/bin/bash

#
# Stop the askPascal Vault to GitHub Sync Service
#

PLIST_PATH="$HOME/Library/LaunchAgents/com.askpascal.vault-sync.plist"

echo "Stopping askPascal Vault to GitHub Sync Service..."

# Check if plist exists
if [ ! -f "$PLIST_PATH" ]; then
    echo "ERROR: LaunchAgent plist not found at: $PLIST_PATH"
    exit 1
fi

# Unload the LaunchAgent
if launchctl unload "$PLIST_PATH" 2>/dev/null; then
    echo "✓ Sync service stopped successfully"
else
    echo "✓ Sync service was not running"
fi

echo ""
echo "To restart: ./scripts/start-vault-sync.sh"
