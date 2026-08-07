# Motion Site — Multi-Attraction Landing Pages

A React + Vite motion site that presents several product "attractions" from one
app, switchable from the top nav: **Gym**, **Kiosk Only**, **Theme Park**, and
**Mostar City** (a standalone cinematic demo).

## Stack
- React 18 + Vite 6
- Tailwind CSS v4
- Framer Motion (scroll animations, respects reduced-motion)
- lucide-react icons

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Folder structure

```
Assets/                  Original source uploads — not served, kept for reference
├── gym/                 Source clips behind the Gym attraction's videos
├── themepark/           Source clip behind the old Theme Park hero (superseded)
└── kiosk-hardware-source/  Original kiosk part renders before background removal

public/                  Everything actually served to the browser
├── video/
│   ├── gym/             Hero, kiosk showcase, swing barrier, QSentry clips
│   └── themepark/       Hero + the 4 ticketing-channel clips
├── images/
│   └── kiosk/           The 6 cut-out kiosk module renders + the assembled shot
└── mostar/               Self-contained vanilla site (index.html/css/js), embedded via iframe

src/
├── attractions.jsx       The list of attractions + which nav links/branding each uses
├── App.jsx                Picks which site to render based on the active attraction
├── sites/                 One top-level page per attraction (GymSite, KioskSite, ThemeParkSite, MostarSite)
└── components/            Section-level building blocks used by the sites above
```

## Adding a new attraction
1. Add an entry to `ATTRACTIONS` in `src/attractions.jsx` (brand, nav links).
2. Create `src/sites/<Name>Site.jsx` and lazy-load it in `src/App.jsx`.
3. Put its videos/images under `public/video/<name>/` and `public/images/<name>/`
   so assets stay grouped by attraction, matching the pattern above.
