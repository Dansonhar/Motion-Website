import { CinematicVideo } from './SolutionMedia.jsx'
import { Reveal } from './SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   Section 9 — the close.

   A consultative invitation, not a checkout. No trial, no pricing, no demo —
   the ask is a conversation about the business.
   --------------------------------------------------------------------------- */
export default function ConsultationCTA() {
  return (
    <section
      id="consultation"
      aria-label="Discuss your business"
      className="relative min-h-[92svh] w-full overflow-hidden border-t border-white/10"
    >
      <CinematicVideo
        ratio="fill"
        overlay={0.62}
        label="Closing Film"
        caption="Wide, quiet, end of trade"
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />

      <div className="relative flex min-h-[92svh] items-center px-6 py-28 sm:px-10">
        <div className="mx-auto w-full max-w-[1500px]">
          <Reveal>
            <h2 className="max-w-[15ch] text-[clamp(2.2rem,5.6vw,5.2rem)] leading-[1.02] font-bold tracking-tight text-white">
              Tell us where you want to take your business.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-10 max-w-2xl text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-white/75">
              Whatever the sector — whether you&rsquo;re opening your first
              location, improving an established operation or preparing to
              expand across several — we&rsquo;ll start by understanding the
              business you want to build.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <a
                href="#consultation"
                className="rounded-full bg-accent-500 px-8 py-4 text-center text-base font-semibold text-ink-950 shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5"
              >
                Discuss Your Business
              </a>
              <a
                href="#consultation"
                className="text-base font-medium text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Start a Private Consultation
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
