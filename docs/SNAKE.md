# 🐍 Enable the GitHub-contributions snake

The portfolio's `#github` section embeds a snake animation generated from
your GitHub contribution graph. The image is rebuilt every 12 hours by a
GitHub Action and pushed to a branch called `output` in this repo.

This Devin session **could not push the workflow file directly** — Devin's
GitHub OAuth App does not have the `workflow` permission. Adding the file
takes 30 seconds via the GitHub web UI:

## Steps

1. Open <https://github.com/Abhishek-Issac/Abhishek-Issac.github.io>.
2. Click **Add file → Create new file**.
3. Name the file:
   ```
   .github/workflows/snake.yml
   ```
4. Paste the entire contents of [`docs/snake-workflow.yml`](./snake-workflow.yml)
   into the editor.
5. Commit directly to `main`.
6. Open the **Actions** tab → pick **generate github contribution snake**
   → click **Run workflow**.

After about a minute the action will create / update the `output` branch
with `github-snake.svg` and `github-snake-dark.svg`. The portfolio's snake
widget will pick them up automatically — no further changes needed.

If anything goes wrong, the page already has a graceful fallback message
("snake.svg will appear here after the first GitHub Action run"), so the
site still looks correct in the meantime.
