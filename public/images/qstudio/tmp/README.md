# TEMPORARY placeholder art — replace before launch

> **Most of this set is gone.** Real QStudio photography now covers the hero,
> the four sectors and the two door options — see `../studio/README.md`. The
> frames left here brief sections that have not been built yet, so they are
> **not referenced by any code**. Nothing in this folder ships.

Generated locally (Chrome, no AI service), not final art. Every frame is
watermarked TEMP and carries a `PLACEHOLDER` chip, so nothing here can ship
unnoticed. Delete this whole folder once real assets land.

## Why they look like this

Built to the First 50 campaign's own production rules, not around them:

- **One meaningful lime moment per frame** — the hairline under the title.
  `#CCFF00` means confirmed / connected / permitted, so it is never decoration.
- **The frame reads without sound or context** — the title *is* the idea.
- **No invented product UI, no invented QR codes, no invented faces.** The study
  is explicit that real screens, QRs and typography get composited afterwards
  from approved product material, so these are typographic and diagrammatic and
  instead *state* what the real shot has to contain.
- Palette is the campaign's: ink `#0B0D0C`, warm white `#F7F7F3`,
  soft steel `#B8C0BC`, lime `#CCFF00`.

Note the page itself is monochrome by design (`src/index.css` — `accent`
resolves to white and greys). Lime lives in the campaign assets, not in the
page chrome. Keep that split when the real art arrives.

## Claim limits baked into the briefs

- `face-entry` — face identifies **who**; membership/ticket/access rules decide
  **whether**. A match alone never grants entry.
- `qsentry` — may only say monitor / detect / record / alert, and only where the
  capability is supported and enabled. Never "prevents".
- `offline` — "keeps working", never "never fails".

## Replacing them

Same filenames, same dimensions, then re-check. Encode profile and poster
extraction for any film are in `public/video/qstudio/README.md`. Reference paths
as `${import.meta.env.BASE_URL}images/qstudio/<name>.jpg` — a bare `/images/...`
404s under the site's sub-path base.
