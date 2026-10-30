# Personal Portfolio Website

This is a lightweight static portfolio website designed to be hosted on GitHub Pages.

## Quick start

1. Replace the placeholder text in `index.html` with your real name, bio, project details, and contact information.
2. Update the links in the contact section and the socials in the page.
3. Commit your changes and push to GitHub.
4. Enable GitHub Pages in the repository settings.

## GitHub Pages deployment

Because this is a static site, GitHub Pages can serve it directly from the repository root.

Recommended setup:

- Repository branch: `main`
- GitHub Pages source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

## Local preview

Open `index.html` in a browser, or run a small local server from the project folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files

- `index.html` — structure and content of the site
- `styles.css` — styling and layout
- `script.js` — small scripts for page behavior
- `.nojekyll` — prevents GitHub Pages from processing with Jekyll
