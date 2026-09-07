// The QStudio wordmark.
//
// THE MIXED-CASE LOCKUP, and that is not what the brand .ai file holds. This is
// the mark supplied as `qstudiologo-socmed.png` — "QStudio", set in a geometric
// rounded sans with a lowercase "tudio". The previous version of this file
// carried the ALL-CAPS "QSTUDIO" traced out of `qstudio-logo-280826.ai`, which
// is a single-page PDF 1.6 container and holds only that one lockup, on its
// dark rounded app-icon tile. The two are different marks, not two renderings
// of one, so there was nothing to re-trace: the vector source does not contain
// this lockup. `images/qstudio/qstudio-wordmark.svg` is that older traced
// all-caps mark, kept on disk and referenced by nothing.
//
// RENDERED AS A CSS MASK, NOT AN <img>. The supplied file is a 1000x1000 social
// tile — lime ink on a flat #222222 ground, no alpha — so the ground was keyed
// off (it is perfectly uniform, zero variance, so coverage recovers exactly as
// distance/250) and the result trimmed to its ink: 852x168, white ink, real
// anti-aliasing, 8kB.
//
// The mask is what keeps this file theme-driven. ONE <Logo /> serves every
// attraction — Gym, Theme Park and Solution all render it in the navbar and
// footer and must stay monochrome, while QStudio wants brand lime. A coloured
// PNG can only be one of those. Masking with the alpha and painting the box in
// `currentColor` means the mark takes whatever colour is in scope, so
// `text-accent-500` below resolves to #ffffff by default and to #ccff00 under
// `.theme-lime` (see index.css) with no second file, no variant class and no
// per-page branching. It also unifies the mark with the rest of the accent:
// the supplied ink is #cadb2b, slightly duller than the brand #ccff00 the page
// uses everywhere else, and the mask discards it.
//
// Two things to know. A mask image is fetched as a resource and is subject to
// CORS, so this only works served over http(s) — it is silently blank from a
// `file://` page, which is worth remembering when testing a build by opening
// the HTML directly. And if the file ever fails to load there is no mask, which
// paints the box as a solid rectangle rather than showing nothing.
//
// Sized by HEIGHT: the trimmed mark is a fixed 5.0714:1, so width follows and
// callers never compute it.
const RATIO = 5.0714

export default function Logo({ className = '', height = 22 }) {
  const src = `${import.meta.env.BASE_URL}images/qstudio/qstudio-wordmark.png`
  const mask = `url("${src}") no-repeat center / contain`

  return (
    <span className={`inline-flex items-center text-accent-500 ${className}`}>
      <span
        role="img"
        aria-label="QStudio"
        className="block bg-current"
        style={{
          height,
          width: height * RATIO,
          WebkitMask: mask,
          mask,
        }}
      />
    </span>
  )
}
