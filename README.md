# Restaurant

A browser mini-game for children practicing English food and drink words. Press **ORDER** to reveal a new random meal with 2–4 different foods and one drink. The 31 classic vocabulary items remain in the order pool; only the current order is shown.

The game stage is capped at a 4:3 aspect ratio for standard projectors. On widescreen displays it stays centered with side margins; on phones the order card stacks vertically.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173/reast-/`). For a production build, run `npm run build`.

Run `npm test` to verify the exact vocabulary, local artwork, and random-order rules.

The game uses local artwork and works without an internet connection after dependencies are installed. The bistro backdrop and all order illustrations were generated for this project. A compact WebP atlas is preloaded when the game opens, so pressing ORDER does not fetch separate food images. Small individual WebPs are also kept in `public/assets/`, and the full-resolution PNG originals are in `artwork/source/`. Run `npm run optimize:images` to regenerate the WebPs and atlas after changing the originals. The original SVG menu art remains in the repository as editable source artwork.

Select **HALLOWEEN** to add melon, bacon, peas, toast, peach, and red juice to the random orders. Each Halloween order includes at least one new item from that section. The juice is labeled simply `juice`. Toast shares its existing illustration and is never duplicated in the order pool. Select the button again to use the classic menu only; the choice applies to the next ORDER press.

## GitHub Pages

The `main` branch runs `.github/workflows/deploy.yml`, which tests and builds the game, then publishes `dist` to GitHub Pages. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The site URL is `https://istmvera2092-sys.github.io/reast-/`.
