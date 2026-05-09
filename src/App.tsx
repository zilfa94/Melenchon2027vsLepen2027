import HeroDuel            from './components/HeroDuel'
import Scoreboard          from './components/Scoreboard'
import KeyFigures          from './components/KeyFigures'
import SpendingRound       from './components/SpendingRound'
import RevenueRound        from './components/RevenueRound'
import TaxVsRedistribution from './components/TaxVsRedistribution'
import WealthSharingGrid   from './components/WealthSharingGrid'
import GeopoliticsSection  from './components/GeopoliticsSection'
import PollSection         from './components/PollSection'
import FinalVerdict        from './components/FinalVerdict'
import MiniSources         from './components/MiniSources'

// Note : le code splitting sur les vendors (react, recharts, lucide) est géré
// par vite.config.ts → manualChunks. Les imports dynamiques + Suspense sont
// incompatibles avec l'hydration react-snap (Suspense boundaries en "pending"
// ne matchent pas le HTML pré-rendu qui contient déjà le contenu complet).

function App() {
  return (
    <div className="bg-bg-deep text-white min-h-screen font-body overflow-x-hidden">
      <HeroDuel />
      <Scoreboard />
      <KeyFigures />
      <SpendingRound />
      <RevenueRound />
      <TaxVsRedistribution />
      <WealthSharingGrid />
      <GeopoliticsSection />
      <PollSection />
      <FinalVerdict />
      <MiniSources />
    </div>
  )
}

export default App
