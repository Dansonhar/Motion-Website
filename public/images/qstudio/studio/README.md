# QStudio photography — the real thing

Pulled from the live site and re-encoded for the web. **Not placeholders.**

Source: `https://qbot.now/qfitimg/studioimg/<file>` (linked from
`https://qbot.now/qstudio`). Originals totalled 9.2MB — several were 4500×3000
JPEGs and two were multi-megabyte PNGs. Re-encoded to 1.9MB total with no
visible loss at the sizes they render at.

| In this folder | Source file | Used by |
|---|---|---|
| `hero.jpg` (2000w) | `02_checkin.jpg` | `StudioHero` background |
| `job-signup.jpg` | `01_membership.jpg` | `SevenJobs` 01 |
| `job-membership.jpg` | `app_membership.jpg` | `SevenJobs` 02 |
| `job-checkin.jpg` | `02_checkin.jpg` | `SevenJobs` 03 |
| `job-booking.jpg` | `03_booking.jpg` | `SevenJobs` 04 |
| `job-rewards.jpg` | `04_rewards.jpeg` | `SevenJobs` 05 |
| `job-report.jpg` | `05_report.jpg` | `SevenJobs` 06 |
| `job-custom.jpg` | `06_customize.png` | `SevenJobs` 07 |
| `sector-gym.jpg` | `for_gym.png` | `WhoSection` — Gyms & Studios |
| `sector-park.jpg` | `for_indoor_theme.jpg` | `WhoSection` — Theme & Indoor Parks |
| `sector-salon.jpg` | `for_spa.jpg` | `WhoSection` — Salons & Spas |
| `sector-club.jpg` | `for_wellness.jpg` | `WhoSection` — Wellness & Members' Clubs |
| `door-lock.jpg` | `type-doorlock.jpg` | `DoorSection` — Door Lock |
| `door-gate.jpg` | `type-faceid.jpg` | `DoorSection` — Auto Gate |

There is **no sign-up photograph** on the live site — `00_signup.jpg` and
friends return the SPA's index.html, not an image. `job-signup.jpg` reuses the
lobby-kiosk shot, which is the closest published frame. Worth shooting properly.

## Re-encode command

```sh
ffmpeg -v error -y -i in.jpg -vf "scale=1200:-2:flags=lanczos" -q:v 4 out.jpg
```

Widths in use: hero 2000, sectors 1500, doors 1400, job cards 1200 — each about
double its rendered CSS width, so it holds up on a 2× display without shipping a
4500px original.

## Composition constraint

In all four `sector-*` shots the kiosk and the people sit centre-to-right of
frame, so `SectorMedia` places its product-device inset **bottom-left** — the
one corner that is floor in every one of them. Re-check that if these are ever
reshot.
