import SolutionHero from '../components/solution/SolutionHero.jsx'
import ProblemSection from '../components/solution/ProblemSection.jsx'
import SolutionAreas from '../components/solution/SolutionAreas.jsx'
import ApproachSection from '../components/solution/ApproachSection.jsx'
import OutcomesSection from '../components/solution/OutcomesSection.jsx'
import TechnologyLayer from '../components/solution/TechnologyLayer.jsx'
import IndustriesSection from '../components/solution/IndustriesSection.jsx'
import ConsultationCTA from '../components/solution/ConsultationCTA.jsx'

/* ---------------------------------------------------------------------------
   Solution — business & operations solutions across sectors.

   Not a restaurant practice. The argument is that one operating model applies
   to any customer-facing business, so the copy stays sector-neutral and the
   breadth is named explicitly in IndustriesSection rather than implied.

   The order of the page is the argument: the business first, the problem, what
   we solve, how we work — and only then, seventh, the technology. Moving the
   technology section higher would turn this back into a product site.

   Chrome (navbar, footer, Q Studio logo, palette and type) is the shared
   site chrome — this vertical is styled to sit alongside Gym and Theme Park,
   not apart from them.

   NOTE: no `overflow-*` on this wrapper. `overflow-x: hidden` computes
   `overflow-y: auto`, which makes it a scroll container and would break any
   `position: sticky` a section below relies on.
   --------------------------------------------------------------------------- */
export default function SolutionSite() {
  return (
    <div className="min-h-[100svh] w-full bg-ink-950">
      <main>
        <SolutionHero />
        <ProblemSection />
        <SolutionAreas />
        <ApproachSection />
        <OutcomesSection />
        <TechnologyLayer />
        <IndustriesSection />
        <ConsultationCTA />
      </main>
    </div>
  )
}
