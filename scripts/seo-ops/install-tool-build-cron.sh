#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/Users/sirakinb/Still-Landing}"
MARKER="# Still SEO tool builder"
COMMAND="15 9 * * 1 cd $REPO_DIR && TOOL_CRON_PUSH_MODE=main /bin/bash scripts/seo-ops/run-tool-build-cron.sh $MARKER"

TMP_FILE="$(mktemp)"
crontab -l 2>/dev/null | grep -vF "$MARKER" > "$TMP_FILE" || true
printf '%s\n' "$COMMAND" >> "$TMP_FILE"
crontab "$TMP_FILE"
rm "$TMP_FILE"

echo "Installed weekly cron:"
echo "$COMMAND"
echo
echo "It runs Mondays at 9:15 AM local time, commits directly to main, pushes, and stops after the queue is complete."
