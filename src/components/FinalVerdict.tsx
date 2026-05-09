import React from 'react'
import { Trophy, AlertCircle } from 'lucide-react'
import { verdictItems, lfiRisks, rnRisks } from '../data/onePage'
import { candidates } from '../data/candidates'
import { useScrollReveal } from '../hooks/useScrollReveal'
import CandidateAvatar from './CandidateAvatar'

const winnerCfg = {
  lfi: { bg: 'bg-lfi-red/[0.08]', border: 'border-lfi-red/22', text: 'text-lfi-red' },
  rn: { bg: 'bg-rn-blue/[0.08]', border: 'border-rn-blue/22', text: 'text-rn-blue' },
  both: { bg: 'bg-gold/[0.07]', border: 'border-gold/22', text: 'text-gold' },
}

const FinalVerdict: React.FC = () => {
  const { ref, isVisible } = useScrollReveal()
  const lfi = candidates.find(c => c.id === 'lfi')!
  const rn = candidates.find(c => c.id === 'rn')!

  return (
    <section id="verdict" className="py-20 px-4 bg-bg-deep">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-14 max-w-5xl mx-auto" />
      <div ref={ref} className="max-w-5xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-gold/[0.09] border border-gold/25 rounded-full px-3 py-1 mb-4">
            <Trophy size={11} className="text-gold" />
            <span className="font-heading text-gold text-xs font-semibold tracking-widest uppercase">Verdict final</span>
          </div>
          <h2 className="text-white tracking-wider mb-6" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(2rem,7vw,4rem)' }}>
            LE VERDICT
          </h2>

          {/* Summary statements */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <p className="font-body text-white/60 text-sm md:text-base leading-relaxed bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4 text-left">
              <span className="text-lfi-red font-semibold">LFI</span> présente un risque de tension à court terme sur les marchés obligataires, mais sa logique de fond est solide : la hausse des salaires alimente la demande, les recettes fiscales et la croissance — un effet multiplicateur que l'Espagne de Sánchez a validé en pratique depuis 2018, avec des hausses répétées du SMIC sans dérapage.
            </p>
            <p className="font-body text-white/60 text-sm md:text-base leading-relaxed bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4 text-left">
              Le <span className="text-rn-blue font-semibold">RN</span> propose des mesures de pouvoir d'achat plus simples à vendre politiquement, mais elles reposent surtout sur des baisses de taxes et d'exonérations — ce qui réduit les recettes sans enclencher la même dynamique vertueuse salaires → demande → croissance.
            </p>
          </div>
        </div>

        {/* Verdict cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {verdictItems.map((item, i) => {
            const cfg = winnerCfg[item.winner]
            return (
              <div
                key={item.category}
                className={`${cfg.bg} border ${cfg.border} rounded-2xl p-5 transition-all duration-700`}
                style={{
                  transitionDelay: isVisible ? `${i * 110}ms` : '0ms',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <div className="font-body text-white/35 text-[10px] uppercase tracking-wider mb-2">{item.category}</div>
                <div className={`text-xl tracking-wide mb-1 ${cfg.text}`} style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>{item.label}</div>
                <div className="font-body text-white/45 text-xs leading-relaxed">{item.detail}</div>
              </div>
            )
          })}
        </div>

        {/* Risk columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            className="transition-all duration-700"
            style={{ transitionDelay: isVisible ? '380ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-24px)' }}
          >
            <div className="bg-lfi-red/[0.05] border border-lfi-red/14 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <CandidateAvatar candidate={lfi} size={52} />
                <div>
                  <div className="text-lfi-red font-heading font-semibold text-sm leading-tight">{lfi.name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <AlertCircle size={11} className="text-lfi-red/60" />
                    <span className="font-body text-white/40 text-xs">Risque principal</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {lfiRisks.map(r => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="text-lfi-red/50 flex-shrink-0 text-xs mt-0.5">▸</span>
                    <span className="font-body text-white/52 text-sm">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="transition-all duration-700"
            style={{ transitionDelay: isVisible ? '430ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(24px)' }}
          >
            <div className="bg-rn-blue/[0.05] border border-rn-blue/14 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <CandidateAvatar candidate={rn} size={52} />
                <div>
                  <div className="text-rn-blue font-heading font-semibold text-sm leading-tight">{rn.name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <AlertCircle size={11} className="text-rn-blue/60" />
                    <span className="font-body text-white/40 text-xs">Risque principal</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {rnRisks.map(r => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="text-rn-blue/50 flex-shrink-0 text-xs mt-0.5">▸</span>
                    <span className="font-body text-white/52 text-sm">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalVerdict
