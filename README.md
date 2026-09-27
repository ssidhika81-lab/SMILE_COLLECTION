# SMILE COLLECTION

React + Vite shopping website configured for GitHub Pages at:
https://ssidhika81-lab.github.io/SMILE_COLLECTION/

## Run locally
```bash
npm install
npm run dev
```

## Build for GitHub Pages
```bash
npm run build
```
The production files are created in `dist/`.

## GitHub Pages
For a repository named `SMILE_COLLECTION`, the Vite base path is already configured as `/SMILE_COLLECTION/`.
Use a GitHub Pages deployment that runs `npm install` and `npm run build`, then publishes the `dist` folder.

If using GitHub Actions, the repository can deploy the Vite build automatically.


## PWA / App-like mode
This project is configured as an installable Progressive Web App.
- Open the published GitHub Pages URL on a supported mobile browser.
- Use the browser menu and choose "Install app" or "Add to Home Screen".
- The app opens in standalone mode with the Smile Collection icon.
- The GitHub Pages deployment workflow is already included.
