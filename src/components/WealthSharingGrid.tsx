import React from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { trueWealthSharing, fragileWealthSharing } from '../data/onePage'
import { useScrollReveal } from '../hooks/useScrollReveal'

const WealthSharingGrid: React.FC = () => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="partage" className="py-20 px-4 bg-bg-deep">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-14 max-w-5xl mx-auto" />
      <div ref={ref} className="max-w-5xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-white tracking-wider mb-3" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(1.6rem,5.5vw,3.2rem)' }}>
            VRAI PARTAGE{' '}
            <span className="text-white/20">VS</span>{' '}
            PARTAGE FRAGILE
          </h2>
          <p className="font-body text-white/38 text-sm max-w-xl mx-auto">
            Distinguer le partage structurel des richesses du pouvoir d'achat immédiat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* True wealth sharing */}
          <div
            className="transition-all duration-700"
            style={{ transitionDelay: isVisible ? '120ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-28px)' }}
          >
            <div className="bg-emerald-500/[0.05] border border-emerald-500/20 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="font-heading text-emerald-400 font-semibold text-xs uppercase tracking-widest">
                  Vrai partage des richesses
                </span>
              </div>
              <div className="space-y-2.5">
                {trueWealthSharing.map((item, i) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-8px)',
                      transition: `opacity 0.5s ease-out ${i * 55 + 280}ms, transform 0.5s ease-out ${i * 55 + 280}ms`,
                    }}
                  >
                    <CheckCircle2 size={13} className="text-emerald-500/60 flex-shrink-0 mt-0.5" />
                    <span className="font-body text-white/68 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fragile wealth sharing */}
          <div
            className="transition-all duration-700"
            style={{ transitionDelay: isVisible ? '180ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(28px)' }}
          >
            <div className="bg-amber-500/[0.05] border border-amber-500/20 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <AlertTriangle size={18} className="text-amber-400" />
                <span className="font-heading text-amber-400 font-semibold text-xs uppercase tracking-widest">
                  Pouvoir d'achat fragile ou incertain
                </span>
              </div>
              <div className="space-y-2.5">
                {fragileWealthSharing.map((item, i) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(8px)',
                      transition: `opacity 0.5s ease-out ${i * 65 + 320}ms, transform 0.5s ease-out ${i * 65 + 320}ms`,
                    }}
                  >
                    <AlertTriangle size={13} className="text-amber-500/60 flex-shrink-0 mt-0.5" />
                    <span className="font-body text-white/68 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WealthSharingGrid
