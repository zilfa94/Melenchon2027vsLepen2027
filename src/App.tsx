import { lazy, Suspense }   from 'react'
import HeroDuel              from './components/HeroDuel'
import KeyFigures            from './components/KeyFigures'
import SpendingRound         from './components/SpendingRound'
import RevenueRound          from './components/RevenueRound'
import TaxVsRedistribution   from './components/TaxVsRedistribution'
import WealthSharingGrid     from './components/WealthSharingGrid'
import GeopoliticsSection    from './components/GeopoliticsSection'
import PollSection           from './components/PollSection'
import FinalVerdict          from './components/FinalVerdict'
import MiniSources           from './components/MiniSources'

// Recharts (~340 KB) chargé uniquement quand Scoreboard entre dans le viewport
const Scoreboard = lazy(() => import('./components/Scoreboard'))

// Fallback léger : hauteur fixe = évite le CLS quand le chunk se charge
const ScoreboardFallback = () => (
  <section id="scoreboard" className="py-20 px-4 bg-bg-deep" aria-busy="true">
    <div className="max-w-5xl mx-auto space-y-5">
      {[0, 1].map(i => (
        <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl h-64 animate-pulse" />
      ))}
    </div>
  </section>
)

function App() {
  return (
    <div className="bg-bg-deep text-white min-h-screen font-body overflow-x-hidden">
      <main>
        <HeroDuel />
        <Suspense fallback={<ScoreboardFallback />}>
          <Scoreboard />
        </Suspense>
        <KeyFigures />
        <SpendingRound />
        <RevenueRound />
        <TaxVsRedistribution />
        <WealthSharingGrid />
        <GeopoliticsSection />
        <PollSection />
        <FinalVerdict />
        <MiniSources />
      </main>
    </div>
  )
}

export default App
