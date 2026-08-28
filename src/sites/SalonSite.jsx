import { motion } from 'framer-motion'
import { ArrowLeft, Scissors } from 'lucide-react'
import { useAttraction } from '../attractions.jsx'
import { Display, EASE, Eyebrow, Lede, Reveal } from '../components/solution/SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   Salons & Spa — the third industry door, and the only one whose site has not
   been built yet.

   This page exists so that door is not a lie. It is reached from the industry
   chooser on the Solution page, and its whole job is to say "we are building
   this, here is exactly what for" without pretending to be a finished vertical.

   WHAT IT DELIBERATELY DOES NOT DO: no fake feature tour, no invented salon
   client, no screenshot of an interface that does not exist. A holding page
   that oversells is worse than one that is honest, because the next
   conversation starts by walking it back.

   WHAT IT DOES DO: it still qualifies. The three lines under "What it will
   run" are the real brief for this sector — the same three the chooser panel
   shows — so an operator can tell within ten seconds whether we understand
   their trade. And the one action is a conversation, not a waitlist form,
   because at this stage the useful thing is to hear how they run.

   Chrome: shared navbar and footer on the monochrome tokens, because this is
   a destination of the Solution flow rather than a standalone vertical. It has
   to look like the page the visitor just left.
   --------------------------------------------------------------------------- */

const WILL_RUN = [
  {
    n: '01',
    title: 'The diary, protected',
    body: 'Bookings held against the stylist or therapist by name, with the gaps, the doubles and the walk-ins handled the way the floor actually works.',
  },
  {
    n: '02',
    title: 'The client, remembered',
    body: 'History, preferences, packages and prepaid balances that follow the client between visits and between branches.',
  },
  {
    n: '03',
    title: 'The takings, split',
    body: 'Commission, tips and retail settled at close of day, per person, without anyone rebuilding it in a spreadsheet.',
  },
]

// Same line as QStudioSite. If it ever changes it has to change in both.
const WA_NUMBER = '60126909189'
const WA_TEXT =
  'Hi Q Studio — I run a salon/spa and I would like to talk about the system you are building for this sector.'

export default function SalonSite() {
  const { setAttraction } = useAttraction()

  return (
    <div className="min-h-[100svh] w-full bg-ink-950">
      <main>
        <section
          id="top"
          aria-label="Salons and Spa — in development"
          className="relative flex min-h-[92svh] items-center px-6 py-24 sm:px-10"
        >
          {/* A single soft bloom behind the type. This is the only decoration
              on the page — a holding page with a busy background reads as
              filler, and one large, slow gradient reads as intent. Kept white
              to match the monochrome Solution page this door opens from. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_18%_20%,rgba(255,255,255,0.07),transparent_70%)]"
          />
          <div className="mx-auto w-full max-w-[1500px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Reveal>
                  <span className="inline-flex items-center gap-3 rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-400">
                    <Scissors className="size-4" strokeWidth={1.8} />
                    In development
                  </span>
                  <Display className="mt-8 max-w-[16ch]">
                    Salons &amp; Spa is being built.
                  </Display>
                </Reveal>
                <Reveal delay={0.12}>
                  <Lede className="mt-8 max-w-xl">
                    We are designing this one now. Until it is ready we would
                    rather show you nothing than show you a version of another
                    industry with the words swapped — which is the entire reason
                    the other two exist as separate sites.
                  </Lede>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-accent-500 px-8 py-4 text-center text-base font-semibold text-ink-950 transition-transform duration-300 hover:scale-[1.02]"
                    >
                      Tell us how your salon runs
                    </a>
                    {/* Back to where they came from. A holding page with no way
                        out but the browser button loses the visit. */}
                    <button
                      type="button"
                      onClick={() => setAttraction('solution')}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 text-base font-semibold text-white/80 transition-colors hover:border-white/35 hover:text-white"
                    >
                      <ArrowLeft className="size-4" strokeWidth={2} />
                      Back to the other industries
                    </button>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-4 lg:col-start-9">
                <Reveal delay={0.28}>
                  <Eyebrow>What it will run</Eyebrow>
                </Reveal>
                <ol className="mt-8">
                  {WILL_RUN.map((item, i) => (
                    <motion.li
                      key={item.n}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-15% 0px' }}
                      transition={{ duration: 0.9, delay: 0.32 + i * 0.1, ease: EASE }}
                      className="border-t border-white/10 py-6"
                    >
                      <span className="text-xs font-semibold tracking-widest text-accent-400">
                        {item.n}
                      </span>
                      <h2 className="mt-3 text-[1.15rem] font-bold tracking-tight text-white">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-white/60">
                        {item.body}
                      </p>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
