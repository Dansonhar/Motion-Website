# GymAccess — Connected Gym Entrance Landing Page

Modern React landing page for a connected gym entrance system (self-service kiosk + MT119-LED tripod turnstile).

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

## Hero video
The uploaded clip is copied to `public/video/gym-hero.mp4` and used as the autoplay, muted, looping, inline background video with an SVG dark-gradient poster fallback. To add a smaller WebM, drop `public/video/gym-hero.webm` and add a matching `<source>` in `src/components/Hero.jsx`.

## Components
Navbar, Hero, ProcessSteps, FeatureGrid, HardwareSection, Benefits, CallToAction, Footer — all below-the-fold sections are lazy-loaded via React.lazy.
