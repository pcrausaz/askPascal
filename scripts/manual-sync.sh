#!/bin/bash

#
# Manually trigger a one-time vault sync
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYNC_SCRIPT="$SCRIPT_DIR/sync-vault-to-github.sh"

echo "Running manual vault sync..."
echo "========================================"

# Run the sync script
if [ -f "$SYNC_SCRIPT" ]; then
    "$SYNC_SCRIPT"
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo ""
        echo "✓ Manual sync completed successfully"
    else
        echo ""
        echo "✗ Manual sync failed with exit code: $exit_code"
        echo "Check logs: ~/Library/Logs/askpascal-vault-sync/sync.log"
        exit $exit_code
    fi
else
    echo "ERROR: Sync script not found: $SYNC_SCRIPT"
    exit 1
fi
