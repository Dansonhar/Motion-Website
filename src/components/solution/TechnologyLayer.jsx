import { Display, Eyebrow, Lede, Reveal, SectionShell } from './SolutionPrimitives.jsx'

/* ---------------------------------------------------------------------------
   Section 7 — the technology layer.

   Deliberately the *seventh* thing the visitor meets, not the first. Products
   are not built yet, so each slot is an empty frame.

   TO FILL A SLOT: give it a `name` (and optionally `body` / `href`). Anything
   with a name renders as a real entry; anything without stays a placeholder.
   The grid, numbering and motion do not change either way, so these can be
   filled one at a time — POS, Kiosk, Webstore, Mobile ordering, Payments, CRM,
   Loyalty, Backoffice, Analytics, Access systems.
   --------------------------------------------------------------------------- */
const SYSTEMS = [
  { id: 's1', name: null },
  { id: 's2', name: null },
  { id: 's3', name: null },
  { id: 's4', name: null },
  { id: 's5', name: null },
  { id: 's6', name: null },
]

export default function TechnologyLayer() {
  return (
    <SectionShell label="The technology behind the operation" className="bg-ink-900">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>Underneath</Eyebrow>
            <Display className="mt-7 max-w-[16ch]">
              The technology behind the operation.
            </Display>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <Reveal delay={0.12}>
            <Lede>
              The right technology should disappear into the business, whatever
              that business sells — connecting the customer experience, staff
              operations and management without creating more complexity.
            </Lede>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:mt-28 sm:grid-cols-2 lg:grid-cols-3">
        {SYSTEMS.map((system, i) => (
          <SystemSlot key={system.id} system={system} index={i} />
        ))}
      </div>
    </SectionShell>
  )
}

function SystemSlot({ system, index }) {
  const filled = Boolean(system.name)
  return (
    <Reveal delay={(index % 3) * 0.07} className="bg-ink-950">
      <div className="group flex min-h-[220px] flex-col justify-between p-8 transition-colors duration-500 hover:bg-ink-900 sm:min-h-[260px] sm:p-10">
        <span className="text-sm font-semibold tracking-widest text-accent-400">
          {String(index + 1).padStart(2, '0')}
        </span>

        {filled ? (
          <div>
            <h3 className="text-[clamp(1.25rem,1.8vw,1.7rem)] font-bold tracking-tight text-white">
              {system.name}
            </h3>
            {system.body && <Lede className="mt-4 text-[0.95rem]">{system.body}</Lede>}
          </div>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-widest text-white/55">
            [ System Placeholder ]
          </span>
        )}
      </div>
    </Reveal>
  )
}
