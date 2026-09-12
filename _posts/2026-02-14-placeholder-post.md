---
title: Placeholder blog post
authors: [marko-morrison, lesley-zhou]
description: A placeholder entry showing how a post looks. This sentence is the description shown on the Blog index; everything below only appears on the post's own page. Delete me.
---

This is placeholder body content. It appears **only** on the post's own page — the Blog index shows
just the `description` field from the front matter.

### How this file is structured

The front matter carries the metadata; everything after the closing `---` is the body. Authors are
given as keys into `_data/people.yml`, so the byline links to each person automatically:

- `title` — shown on both the index card and this page
- `date` — taken from the filename for posts, or set explicitly for datasets
- `authors` — a list of ids, resolved to linked names
- `description` — the short text on the index card

### Writing posts

Add a file to `_posts/` named `YYYY-MM-DD-slug.md`. The date in the filename sets the publication
date and the URL. Markdown works here: *italics*, **bold**, [links](/people/), inline `code`, and
lists like the one above.

Posts are grouped by year on the [Blog index](/blogposts/) and appear in the homepage sidebar
alongside datasets and publications, newest first.
