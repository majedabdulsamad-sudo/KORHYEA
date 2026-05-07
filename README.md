# 🇰🇷 KORHYEAN — 나의 한국어 선생님

Your personal Korean language learning hub.

## Features

- **Flashcards** — 250+ vocabulary cards across 10 categories with progress tracking
- **B1 Class Review** — Class slide content (세종실용한국어 1) in 6 topic areas
- **Grammar Quiz** — 20+ multiple-choice grammar questions with explanations
- **Word of the Day** — Daily featured word with etymology, usage tips & examples
- **Chat Tutor** — AI-powered conversation tutor with live feedback panel

## Quick Start

### Option A — Use the standalone HTML file
Open `KORHYEAN.html` directly in any browser. No installation needed.
> Note: The Chat Tutor requires an Anthropic API key. See setup below.

### Option B — Run as a Vite/React app

```bash
# 1. Clone the repo and install
npm install

# 2. Create your env file
echo "VITE_ANTHROPIC_KEY=sk-ant-..." > .env.local

# 3. Run dev server
npm run dev
```

## API Key Setup

The Chat Tutor calls the Anthropic API directly. For the standalone HTML:
1. Open `KORHYEAN.html` in a text editor
2. The fetch call is at the bottom of the `<script>` block
3. Add your API key via a local proxy (recommended for production)

**⚠️ Never expose your API key in public repos or deployed frontends.**
For production, route the API call through a server-side proxy endpoint.

## File Structure

```
korhyean/
├── KORHYEAN.html      ← Standalone, works in any browser
├── index.html         ← Vite entry point
├── src/
│   ├── main.jsx       ← React entry
│   └── App.jsx        ← Main app component (all-in-one)
├── vite.config.js
├── package.json
└── README.md
```

## Deploy to GitHub Pages

```bash
npm run build
# Then push the dist/ folder to gh-pages branch
```

Or use [Vercel](https://vercel.com) / [Netlify](https://netlify.com) for one-click deploy.

---
화이팅! 🎉
