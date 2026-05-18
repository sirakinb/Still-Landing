#!/usr/bin/env bash
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"

REPO_DIR="${REPO_DIR:-/Users/sirakinb/Still-Landing}"
PUSH_MODE="${TOOL_CRON_PUSH_MODE:-branch}"
LOG_DIR="$REPO_DIR/seo-ops-data/tool-cron/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%dT%H-%M-%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "[$(date -Iseconds)] Starting Still SEO tool cron"
cd "$REPO_DIR"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is dirty. Aborting to avoid mixing scheduled work with local changes."
  git status --short
  exit 1
fi

git checkout main
git pull --ff-only origin main

npx tsx scripts/seo-ops/prepare-tool-build-task.ts
# shellcheck disable=SC1091
source "$REPO_DIR/seo-ops-data/tool-cron/current-task.env"

if [[ "${HAS_TASK:-0}" != "1" ]]; then
  echo "No remaining SEO tool tasks. Exiting."
  exit 0
fi

echo "Building $TITLE at $URL_PATH on $BRANCH"

if [[ "$PUSH_MODE" == "main" ]]; then
  WORK_BRANCH="main"
else
  WORK_BRANCH="$BRANCH"
  git checkout -b "$WORK_BRANCH"
fi

codex exec --dangerously-bypass-approvals-and-sandbox -C "$REPO_DIR" - < "$PROMPT_FILE"

npm run check
npm run build

if [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes produced for $TITLE. Aborting without marking complete."
  exit 1
fi

git add client script scripts package.json package-lock.json still-seo-tools-roadmap.md
git commit -m "Add $TITLE SEO tool"

if [[ "$PUSH_MODE" == "main" ]]; then
  git push origin main
else
  git push -u origin "$WORK_BRANCH"
  if command -v gh >/dev/null 2>&1; then
    gh pr create \
      --base main \
      --head "$WORK_BRANCH" \
      --title "Add $TITLE SEO tool" \
      --body "Automated weekly SEO tool build for $URL_PATH." || true
  fi
fi

npx tsx scripts/seo-ops/prepare-tool-build-task.ts --complete "$SLUG" "$WORK_BRANCH"
echo "[$(date -Iseconds)] Completed $TITLE"
