import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { lfiRevenue, rnRevenue } from '../data/onePage'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { iconMap } from './IconMap'

const RevenueRound: React.FC = () => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="recettes" className="py-20 px-4 bg-bg-deep">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-14 max-w-5xl mx-auto" />
      <div ref={ref} className="max-w-5xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.09] rounded-full px-3 py-1 mb-4">
            <span className="font-heading text-white/40 text-xs font-semibold tracking-widest uppercase">Round Recettes</span>
          </div>
          <h2 className="text-white tracking-wider" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(1.8rem,6vw,3.5rem)' }}>
            QUI FINANCE COMMENT ?
          </h2>
        </div>

        {/* Logic cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            className="bg-lfi-red/[0.07] border border-lfi-red/20 rounded-xl p-4 transition-all duration-700"
            style={{ transitionDelay: isVisible ? '100ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-24px)' }}
          >
            <div className="text-lfi-red text-lg tracking-wide mb-2" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>Machine LFI</div>
            <p className="font-body text-white/55 text-sm leading-relaxed">
              Taxer davantage capital, hauts revenus, patrimoine et fraude fiscale. Réorienter les aides publiques.
            </p>
          </div>
          <div
            className="bg-rn-blue/[0.07] border border-rn-blue/20 rounded-xl p-4 transition-all duration-700"
            style={{ transitionDelay: isVisible ? '150ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(24px)' }}
          >
            <div className="text-rn-blue text-lg tracking-wide mb-2" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>Machine RN</div>
            <p className="font-body text-white/55 text-sm leading-relaxed">
              Baisser les taxes, faire des économies ciblées, taxer certaines rentes et réduire certaines dépenses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LFI revenue */}
          <div
            className="space-y-2.5 transition-all duration-700"
            style={{ transitionDelay: isVisible ? '200ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-24px)' }}
          >
            {lfiRevenue.map((item) => {
              const Icon = iconMap[item.iconName]
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 hover:border-lfi-red/25 transition-colors duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-lfi-red/[0.14] flex items-center justify-center flex-shrink-0">
                    {Icon && <Icon size={14} className="text-lfi-red" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-heading text-white/75 text-sm">{item.label}</div>
                  </div>
                  <div className={`text-base leading-none flex-shrink-0 ${item.positive ? 'text-emerald-400' : 'text-red-400'}`}
                    style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>
                    {item.amount}
                  </div>
                </div>
              )
            })}
          </div>

          {/* RN revenue */}
          <div
            className="space-y-2.5 transition-all duration-700"
            style={{ transitionDelay: isVisible ? '250ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(24px)' }}
          >
            {rnRevenue.map((item) => {
              const Icon = iconMap[item.iconName]
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 hover:border-rn-blue/25 transition-colors duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-rn-blue/[0.14] flex items-center justify-center flex-shrink-0">
                    {Icon && <Icon size={14} className="text-rn-blue" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-heading text-white/75 text-sm">{item.label}</div>
                    {item.contested && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <AlertTriangle size={9} className="text-amber-400" />
                        <span className="font-body text-amber-400/65 text-[10px]">Faisabilité contestée</span>
                      </div>
                    )}
                  </div>
                  <div className={`text-base leading-none flex-shrink-0 ${item.positive ? 'text-emerald-400' : 'text-red-400'}`}
                    style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>
                    {item.amount}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RevenueRound
