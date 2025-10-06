# Computer Graphics - Line Algorithms

This is a small React + Vite project for the university task: draw lines on a 2D coordinate grid (-10..10) using several algorithms.

Features

- Clickable 21x21 grid representing coordinates from -10 to 10 on both axes.
- Click two cells to select points A and B.
- Sidebar controls: choose algorithm, set coordinates manually, color pickers for line and background, Generate Line and Reset.
- Implemented algorithms: Slope Intercept (basic), Slope Intercept (modified), DDA, Bresenham (float), Bresenham (integer).

Install & Run (PowerShell)

```powershell
npm install
npm run dev
```

If you encounter an ERESOLVE dependency conflict on install (depends on your npm version), retry with one of these fallbacks:

```powershell
npm install --legacy-peer-deps
# or, if necessary
npm install --force
```

Open the dev server URL shown by Vite (usually http://localhost:5173).

Notes

- The grid maps integer coordinates to cells. The origin (0,0) is centered.
- The algorithm implementations live in `src/utils/algorithms.js`.
