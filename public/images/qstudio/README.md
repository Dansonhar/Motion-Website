# QStudio posters & stills

Poster frames for `public/video/qstudio/`, named `<video-name>-poster.jpg`.
Any still images for the QStudio page live here too.

Reference as `${import.meta.env.BASE_URL}images/qstudio/<name>.jpg` — not a bare
`/images/...` path, which 404s under the `/Motion-Website/` base.

Trim transparent padding off any logo/PNG before use, and check dark ink: this
site is `#060807`, so a near-black mark disappears on it (see
`public/images/solution/clients/owg-dark.png` for the worked example).
