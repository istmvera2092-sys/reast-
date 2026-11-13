# Restaurant

A browser mini-game for children practicing English food and drink words. Press **ORDER** to reveal a random meal from the selected items. With the default selection, an order contains 2–4 different foods and one drink. Only the current order is shown.

The game stage is capped at a 4:3 aspect ratio for standard projectors. On widescreen displays it stays centered with side margins; on phones the order card stacks vertically.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173/reast-/`). For a production build, run `npm run build`.

Run `npm test` to verify the exact vocabulary, local artwork, and random-order rules.

The game uses local artwork and works without an internet connection after dependencies are installed. The classic WebP atlas is preloaded when the game opens; each added section has a small atlas loaded when its button is selected. Pressing ORDER does not fetch separate food images. Optimized WebPs are in `public/assets/`; source PNGs for the classic, Halloween, and Thanksgiving art are in `artwork/source/`. The Fantastic Beasts and Chinese New Year artwork came from the supplied archives. Run `npm run optimize:images` to regenerate the WebPs from source PNGs and rebuild all atlases.

The basic vocabulary is split into three selectable groups: **FOOD 1 · A–L** (11 foods), **FOOD 2 · M–Z** (12 foods), and **DRINKS** (8 drinks). All three start selected. Click a group to select or deselect it, or open **Choose individual items** below it to pick specific foods or drinks. **CLEAR ALL** lets you start with one item. ORDER works with any nonempty selection, including a single food or drink.

The **MENU** and **THEMES** arrows open blue panels in the side margins on wide screens, keeping YOUR ORDER and ORDER visible. Point at an arrow to reveal its panel; on touch screens, tap it. On narrower screens, the panels remain accessible from the screen edges.

Select **HALLOWEEN** to add melon, bacon, peas, toast, peach, and red juice to the random orders. When Halloween items are selected alongside other foods, each order includes at least one of its new items. The juice is labeled simply `juice`. Toast shares its existing illustration and is never duplicated in the order pool. Selection changes clear the current order; press ORDER to draw from the new selection.

The other buttons add **THANKSGIVING DAY** (9 foods), **FANTASTIC BEASTS** (9 foods), and **CHINESE NEW YEAR** (15 foods). Chinese New Year pictures appear without visible item names. Its fish, noodles, and lettuce illustrations replace the matching classic ones while that section is selected. Multiple sections can be selected together.

## GitHub Pages

The `main` branch runs `.github/workflows/deploy.yml`, which tests and builds the game, then publishes `dist` to GitHub Pages. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The site URL is `https://istmvera2092-sys.github.io/reast-/`.
