# Restaurant

A browser mini-game for children practicing English food and drink words. The two menus always show all 31 items. Press **ORDER** for a new random meal with 2–4 different foods and one drink.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173/reast-/`). For a production build, run `npm run build`.

Run `npm test` to verify the exact vocabulary, local artwork, and random-order rules.

The game uses local artwork and works without an internet connection after dependencies are installed. The original bistro backdrop and waiter were generated for this project; the menu illustrations are local SVG artwork.

## GitHub Pages

The `main` branch runs `.github/workflows/deploy.yml`, which tests and builds the game, then publishes `dist` to GitHub Pages. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The site URL is `https://istmvera2092-sys.github.io/reast-/`.
