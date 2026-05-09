import React from 'react'
import { lfiSpending, rnSpending } from '../data/onePage'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { iconMap } from './IconMap'

const SpendingRound: React.FC = () => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="depenses" className="py-20 px-4 bg-bg-deep">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-14 max-w-5xl mx-auto" />
      <div ref={ref} className="max-w-5xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.09] rounded-full px-3 py-1 mb-4">
            <span className="font-heading text-white/40 text-xs font-semibold tracking-widest uppercase">Round Dépenses</span>
          </div>
          <h2 className="text-white tracking-wider" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(1.8rem,6vw,3.5rem)' }}>
            QUI DÉPENSE QUOI ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LFI */}
          <div
            className="transition-all duration-700"
            style={{ transitionDelay: isVisible ? '150ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-32px)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-5 rounded-full bg-lfi-red" />
              <span className="text-white tracking-wider" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.2rem' }}>LFI — Mélenchon</span>
            </div>
            <div className="space-y-2.5">
              {lfiSpending.map((item) => {
                const Icon = iconMap[item.iconName]
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 hover:border-lfi-red/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-lfi-red/[0.14] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {Icon && <Icon size={15} className="text-lfi-red" />}
                    </div>
                    <div>
                      <div className="font-heading text-white/85 font-semibold text-sm">{item.label}</div>
                      <div className="font-body text-white/38 text-xs mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RN */}
          <div
            className="transition-all duration-700"
            style={{ transitionDelay: isVisible ? '200ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(32px)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-5 rounded-full bg-rn-blue" />
              <span className="text-white tracking-wider" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.2rem' }}>RN — Marine Le Pen</span>
            </div>
            <div className="space-y-2.5">
              {rnSpending.map((item) => {
                const Icon = iconMap[item.iconName]
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 hover:border-rn-blue/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rn-blue/[0.14] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {Icon && <Icon size={15} className="text-rn-blue" />}
                    </div>
                    <div>
                      <div className="font-heading text-white/85 font-semibold text-sm">{item.label}</div>
                      <div className="font-body text-white/38 text-xs mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpendingRound
