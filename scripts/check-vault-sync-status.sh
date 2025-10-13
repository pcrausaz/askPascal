#!/bin/bash

#
# Check the status of the askPascal Vault to GitHub Sync Service
#

LABEL="com.askpascal.vault-sync"
LOG_FILE="$HOME/Library/Logs/askpascal-vault-sync/sync.log"

echo "askPascal Vault to GitHub Sync Service Status"
echo "=============================================="

# Check if service is loaded
if launchctl list | grep -q "$LABEL"; then
    echo "Status: ✓ RUNNING"
    echo "Service: $LABEL"
    echo "Frequency: Every 5 minutes"
    echo ""

    # Show last few log entries
    if [ -f "$LOG_FILE" ]; then
        echo "Recent activity (last 10 lines):"
        echo "---"
        tail -n 10 "$LOG_FILE"
    else
        echo "No log file found yet. Service may not have run."
    fi
else
    echo "Status: ✗ NOT RUNNING"
    echo ""
    echo "To start: ./scripts/start-vault-sync.sh"
fi

echo ""
echo "Full logs: $LOG_FILE"
