# KORHYEAN — 나의 한국어 선생님

A Korean language learning Progressive Web App (PWA) with:
- Flashcard decks (Verbs, Expressions, Days, Colors, etc.)
- B1 class review cards
- B2 vocabulary (weather, mood, negation, date/time)
- Grammar quiz (shuffled)
- Word of the Day
- AI Chat Tutor (powered by Claude)

## Live URL
> Replace this line with your GitHub Pages URL after deploying:
> `https://YOUR-USERNAME.github.io/korhyean`

## Deploy to GitHub Pages

1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click **+** → **New repository**
3. Name it `korhyean` (or anything you like)
4. Leave it **Public**, click **Create repository**
5. Click **uploading an existing file** and upload all 4 files:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `README.md`
6. Click **Commit changes**
7. Go to **Settings** → **Pages**
8. Under *Source*, select **Deploy from a branch** → branch: `main`, folder: `/ (root)`
9. Click **Save**
10. Wait ~60 seconds, then visit `https://YOUR-USERNAME.github.io/korhyean`

## Install on your phone (Add to Home Screen)

**iPhone (Safari):**
1. Open the URL in Safari
2. Tap the Share button (box with arrow)
3. Tap **Add to Home Screen**
4. Tap **Add** — it appears as an app icon

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap the 3-dot menu
3. Tap **Add to Home screen**
4. Tap **Add**

Once installed, the app works **fully offline** after the first load.

## API Key for Chat Tutor
The Chat tab uses the Anthropic API. The API key is handled by Claude.ai's proxy
when running inside Claude projects. For standalone use, you would need to add
your own Anthropic API key — see the `sendMessage` function in `index.html`.
