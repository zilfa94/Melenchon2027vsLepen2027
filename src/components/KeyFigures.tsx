import React from 'react'
import { Info } from 'lucide-react'
import { lfiKeyFigures, rnKeyFigures } from '../data/onePage'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { KeyFigure } from '../data/onePage'

interface CardProps extends KeyFigure {
  color: string
  delay: number
  visible: boolean
}

const FigureCard: React.FC<CardProps> = ({ label, value, unit, note, source, color, delay, visible }) => (
  <div
    className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(14px)',
      transition: `opacity 0.55s ease-out ${delay}ms, transform 0.55s ease-out ${delay}ms, border-color 0.2s, box-shadow 0.2s`,
    }}
  >
    <div className="font-body text-white/40 text-[11px] leading-tight mb-2">{label}</div>
    <div className="flex items-baseline gap-1.5 mb-1">
      <span className="leading-none" style={{ color, fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.75rem' }}>{value}</span>
      <span className="font-heading text-white/45 text-xs font-medium">{unit}</span>
    </div>
    {note && (
      <div className="flex items-center gap-1 mb-1">
        <Info size={10} className="text-white/25 flex-shrink-0" />
        <span className="font-body text-white/28 text-[10px] italic">{note}</span>
      </div>
    )}
    <div className="font-body text-white/18 text-[9px] uppercase tracking-wider mt-1 truncate">{source}</div>
  </div>
)

const KeyFigures: React.FC = () => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="chiffres" className="py-20 px-4 bg-bg-deep">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-14 max-w-5xl mx-auto" />
      <div ref={ref} className="max-w-5xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-white tracking-wider mb-4" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(1.8rem,6vw,3.5rem)' }}>
            LES CHIFFRES QUI COMPTENT
          </h2>
          <div className="flex items-start gap-2 justify-center max-w-2xl mx-auto bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3">
            <Info size={13} className="text-gold/55 flex-shrink-0 mt-0.5" />
            <p className="font-body text-white/32 text-xs text-left leading-relaxed">
              Certains chiffres viennent de documents de nature différente : programme complet, contre-budget, amendements budgétaires ou chiffrages externes. Ils ne sont pas tous strictement comparables.
            </p>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LFI */}
          <div>
            <div className={`flex items-center gap-3 mb-5 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="w-2 h-6 rounded-full bg-lfi-red" />
              <span className="text-white tracking-wider" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.4rem' }}>LFI</span>
              <span className="text-white/28 font-body text-sm">— Mélenchon</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {lfiKeyFigures.map((fig, i) => (
                <FigureCard key={fig.label} {...fig} color="#d42b3a" delay={i * 55} visible={isVisible} />
              ))}
            </div>
          </div>

          {/* RN */}
          <div>
            <div
              className={`flex items-center gap-3 mb-5 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
              style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
            >
              <div className="w-2 h-6 rounded-full bg-rn-blue" />
              <span className="text-white tracking-wider" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.4rem' }}>RN</span>
              <span className="text-white/28 font-body text-sm">— Marine Le Pen</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {rnKeyFigures.map((fig, i) => (
                <FigureCard key={fig.label} {...fig} color="#4477ee" delay={80 + i * 55} visible={isVisible} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default KeyFigures
