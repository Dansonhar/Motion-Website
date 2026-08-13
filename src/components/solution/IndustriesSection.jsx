import { Display, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   Section 8 — the industries, then the engagements.

   The sector list comes first and does the positioning work: this is not a
   restaurant practice, it is one operating model applied across customer-facing
   businesses. Each line names the sector and the one thing that makes its
   operation different, so the breadth reads as range rather than as a
   catch-all.

   The case studies below are engagements, not products. Every one carries the
   same four slots so they read as a consistent body of work.

   ⚠ THE COPY IN `challenge`, `solution` AND `result` IS A DRAFT WRITTEN FROM
   THE SECTOR, NOT FROM THE ENGAGEMENT RECORD. It was requested that way and is
   deliberately free of numbers, percentages and durations, because an invented
   metric on a consultancy site is the one thing that would undo the whole
   positioning. Every line still needs checking against what was actually
   delivered before this page goes public — particularly `result`, which is the
   only slot that asserts an outcome. `business` is factual from the marks.

   A card renders only once it has a `logo` or a `business`, so an entry with
   neither can sit in the list without leaving an empty shell on the page. */
const SECTORS = [
  {
    n: '01',
    name: 'Restaurants & F&B',
    body: 'Service speed, order accuracy and turning covers without losing the room.',
  },
  {
    n: '02',
    name: 'Retail & Concept Stores',
    body: 'Stock, checkout and a shop floor that has to sell as well as display.',
  },
  {
    n: '03',
    name: 'Fitness & Wellness',
    body: 'Memberships, class capacity and unattended access at every hour.',
  },
  {
    n: '04',
    name: 'Attractions & Leisure',
    body: 'Ticketing, admission and crowd flow across a whole site.',
  },
  {
    n: '05',
    name: 'Hotels & Hospitality',
    body: 'Arrival, in-stay spend and every department reporting into one picture.',
  },
  {
    n: '06',
    name: 'Clinics & Appointment Services',
    body: 'Scheduling, practitioner time and records that follow the client.',
  },
  {
    n: '07',
    name: 'Entertainment & Events',
    body: 'Sessions, capacity and demand that arrives in peaks, not evenly.',
  },
  {
    n: '08',
    name: 'Multi-Site Groups & Franchises',
    body: 'One standard, many locations, and control that survives the distance.',
  },
]

/* `sector` names the entry in the SECTORS list above that this engagement
   belongs to, so the case studies visibly answer the sector list rather than
   sitting under it as unrelated logos. */
const CASE_STUDIES = [
  {
    id: 'mks',
    name: 'MKS',
    // No mark and no engagement copy supplied yet, so this one does not render.
    // Adding either brings the card back with no other change.
    logo: null,
    business: null,
  },
  {
    id: 'owg',
    // The mark reads OWG / ONLY WORLD GROUP — the list previously said "OWGH".
    name: 'Only World Group',
    logo: 'owg.png',
    // Tall stacked lockup (aspect 0.97) — takes the full height of the plate.
    logoClass: 'max-h-full',
    sector: 'Attractions & Leisure · Multi-site group',
    business:
      'A Malaysian leisure and entertainment group running attractions, waterparks, dining and retail across several sites under one brand.',
    challenge:
      'Admission, food and retail each sold through their own system, so one visitor became three separate customers in an afternoon and no site’s full day could be seen until it was reconciled by hand.',
    solution:
      'One platform across ticketing, food and retail — online and self-service sales writing to the same records as the counters — with group-level reporting sitting over every site.',
    result:
      'A visitor is one account from the gate to their last purchase, and every site reports into the same set of numbers on the same day.',
  },
  {
    id: 'jadioc',
    // The mark reads JADIOC — the list previously said "JadiAOC".
    name: 'Jadioc Barbershop',
    logo: 'jadioc.png',
    /* Wide horizontal lockup (aspect 1.71) at 41% ink density against OWG's
       28%. Matched to the full height of the plate it would carry roughly
       2.6x OWG's ink and swamp it, so it is held to a share of the height —
       which still makes it the WIDER of the two, and about a third larger on
       screen than before. Height alone is a bad proxy for how big a mark
       looks; this is set by ink area, then checked by eye. */
    logoClass: 'max-h-[68%]',
    sector: 'Appointment services · Grooming',
    business:
      'A barbershop trading since 2018 on booked appointments, walk-ins and retail of grooming product, with clients who return to a particular barber.',
    challenge:
      'Bookings arriving by phone and social messages against no shared diary, walk-ins competing with booked chairs, and each barber’s clients and takings sitting apart from the till.',
    solution:
      'Booking tied to the individual barber and chair, a counter that sells the service and the product on one ticket, and a single client record that carries history and preference between visits.',
    result:
      'The diary, the till and the client record are one system, so a returning client’s barber, history and spend are known before the chair is filled.',
  },
]

const SLOTS = [
  ['The Business', 'business'],
  ['The Challenge', 'challenge'],
  ['The Solution', 'solution'],
  ['The Result', 'result'],
]

const SHOWN = CASE_STUDIES.filter((cs) => cs.logo || cs.business)

export default function IndustriesSection() {
  return (
    <SectionShell id="industries" label="Industries and experience">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Industries</Eyebrow>
            <Display className="mt-7 max-w-[14ch]">
              Different sectors.
              <br />
              Different operations.
              <br />
              Different solutions.
            </Display>
          </Reveal>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-6">
          <Reveal delay={0.12}>
            {/* Present tense on purpose. This read "none of them were given the
                same system" — a claim about past clients, made directly above
                three case-study cards that are still empty. Say what is true of
                the method, not what the page cannot yet show. */}
            <Lede>
              We work across customer-facing businesses, not one industry. None
              of these operations run the same way, so none of them get the same
              system.
            </Lede>
          </Reveal>
        </div>
      </div>

      {/* The sector list — the breadth stated plainly, before any case study */}
      <div className="mt-12 grid grid-cols-1 border-t border-white/10 sm:mt-16 md:grid-cols-2">
        {SECTORS.map((s, i) => (
          <Reveal
            key={s.n}
            delay={(i % 2) * 0.08}
            className={`border-b border-white/10 py-10 sm:py-12 ${
              i % 2 === 0 ? 'md:pr-16' : 'md:border-l md:pl-16'
            }`}
          >
            <div className="flex items-baseline gap-6">
              <span className="text-sm font-semibold tracking-widest text-accent-400">{s.n}</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <h3 className="mt-6 text-[clamp(1.3rem,2vw,1.9rem)] leading-[1.15] font-bold tracking-tight text-white">
              {s.name}
            </h3>
            <Lede className="mt-4 max-w-md">{s.body}</Lede>
          </Reveal>
        ))}
      </div>

      {/* Kept larger than the offsets above it — this is the seam between the
          sector list and the case studies, the one real break inside the
          section, so it has to out-space the gaps it separates. */}
      <div className="mt-16 sm:mt-20">
        <Reveal>
          <Eyebrow>Experience</Eyebrow>
          <Display className="mt-7 max-w-[20ch]">Selected engagements.</Display>
        </Reveal>
      </div>

      {/* Only entries with something real to show. A card with neither a mark
          nor a line of copy is an empty shell that reads as an unfinished page,
          which is worse than one fewer case study. */}
      <div
        id="work"
        className={`mt-10 grid grid-cols-1 gap-10 scroll-mt-28 sm:mt-12 md:gap-8 ${
          SHOWN.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
        }`}
      >
        {SHOWN.map((cs, i) => (
          <Reveal key={cs.id} delay={i * 0.1}>
            <article className="group">
              {/* A light plate, not the dark card. OWG's "ONLY WORLD GROUP"
                  wordmark is near-black and would vanish on ink-950 — and a
                  client's registered mark is not ours to recolour, so the
                  background moves instead of the logo. `object-contain` with
                  the height capped keeps both marks optically similar in
                  weight despite one being square and one being wide. */}
              <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-8 transition-opacity duration-700 group-hover:opacity-90 sm:p-12">
                <img
                  src={`${import.meta.env.BASE_URL}images/solution/clients/${cs.logo}`}
                  alt={`${cs.name} logo`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  /* Both files are trimmed to their ink, so these caps act on
                     the mark itself rather than on baked-in transparent
                     padding — which is what made one look half the size of the
                     other despite both filling the same 512px canvas. */
                  className={`w-auto max-w-full select-none object-contain [-webkit-user-drag:none] ${
                    cs.logoClass || 'max-h-full'
                  }`}
                />
              </div>

              {cs.sector && (
                <p className="mt-8 text-[11px] font-semibold uppercase tracking-widest text-accent-400">
                  {cs.sector}
                </p>
              )}
              <h3 className="mt-3 text-[clamp(1.35rem,2vw,1.9rem)] font-bold tracking-tight text-white">
                {cs.name}
              </h3>
              <dl className="mt-6 border-t border-white/10">
                {SLOTS.map(([label, key]) => (
                  <div key={key} className="border-b border-white/10 py-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-widest text-white/55">
                      {label}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white">
                      {cs[key] || (
                        <span
                          className="block h-px w-10 bg-white/10"
                          aria-label="To be added"
                        />
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
