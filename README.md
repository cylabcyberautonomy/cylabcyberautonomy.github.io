# cylabcyberautonomy.github.io

Public site for the CyLab Cyber Autonomy Initiative, served by GitHub Pages
from this repo's `master` branch.

Plain static HTML/CSS, no build step, no Jekyll (`.nojekyll` tells Pages to
serve the files as-is instead of running them through Jekyll).

- `index.html` — home page
- `blog/` — blog index + posts (each post is a single self-contained HTML file)
- `assets/site.css` — shared styling for the home/blog-index pages; each post
  carries its own inline styling since it's meant to stand alone

To add a post: drop a new self-contained `.html` file in `blog/`, and link it
from `blog/index.html` and (optionally) `index.html`'s "Latest from the blog"
card.
