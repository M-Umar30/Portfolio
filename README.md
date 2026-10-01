# Portfolio: Possession

Personal site for Muhammad Umar. One possession, baseline to rim: scrolling moves the ball up a full court through the career, runs each project as a play, and ends on the shot.

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Files

| File | What it holds |
|---|---|
| `index.html` | All the copy: intro, career log, project write-ups, contact |
| `styles.css` | Layout and both themes (tokens at the top, light then dark) |
| `main.js` | Court drawing, scroll logic, play diagrams, theme toggle |
| `favicon.svg` | Tab icon |

## Run locally

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

**GitHub Pages.** Push to a repo, then Settings > Pages > Deploy from a branch > `main` / root. Naming the repo `M-Umar30.github.io` serves it at https://m-umar30.github.io with no path.

**Vercel.** Import the repo. Framework preset "Other", no build command, output directory left empty.

## Editing

- **Copy:** edit `index.html`. Each `<section class="step">` is one scroll stop; `data-chap` is the label shown in the scoreboard.
- **Career stops on the court:** the `stations` array in `main.js`. Keep it the same length as the career list in `index.html`.
- **Play diagrams:** the `plays` array in `main.js`. `nodes` are positions on a 300x250 half court, `edges` are passes, `seq` is the order the ball travels them. A section opts in with `data-play="<index>"`.
- **Colors:** the `:root` blocks at the top of `styles.css`. Change a token in the light block and in both dark blocks.

## Before going live

- Add `og:image` and `og:url` tags once the domain is settled, so link previews show a picture.
- Confirm both linked GitHub repos are public.
