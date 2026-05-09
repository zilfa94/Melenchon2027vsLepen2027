import React from 'react'
import { Wallet, ArrowRight, GraduationCap, Heart, Users, Zap } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const services = [
  { label: 'École', Icon: GraduationCap, color: 'text-blue-400/60' },
  { label: 'Hôpital', Icon: Heart, color: 'text-red-400/60' },
  { label: 'Retraites', Icon: Users, color: 'text-amber-400/60' },
  { label: 'Énergie', Icon: Zap, color: 'text-green-400/60' },
]

const TaxVsRedistribution: React.FC = () => {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section id="redistribution" className="py-24 px-4 relative overflow-hidden bg-bg-deep">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[280px] rounded-full bg-gold/[0.025] blur-3xl" />
      </div>

      <div ref={ref} className="max-w-4xl mx-auto text-center">

        {/* Label */}
        <div
          className="transition-all duration-700"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <div className="inline-flex items-center gap-2 bg-gold/[0.09] border border-gold/25 rounded-full px-3 py-1 mb-8">
            <span className="font-heading text-gold text-xs font-semibold tracking-widest uppercase">À retenir</span>
          </div>
        </div>

        {/* Punchline */}
        <div
          className="mb-8 transition-all duration-700"
          style={{ transitionDelay: isVisible ? '120ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <p
            className="text-white leading-tight tracking-wide"
            style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(1.9rem,5.5vw,3.8rem)' }}
          >
            Une baisse de taxe peut soulager{' '}
            <span className="text-gold">immédiatement</span>,
            <br />
            mais elle ne partage pas
            <br />
            forcément les richesses.
          </p>
        </div>

        {/* Visual metaphor */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 md:gap-5 my-10 transition-all duration-700"
          style={{ transitionDelay: isVisible ? '250ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.92)' }}
        >
          {/* Pocket received */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-gold/[0.14] border border-gold/30 flex items-center justify-center">
              <Wallet size={24} className="text-gold" />
            </div>
            <span className="font-body text-white/35 text-[11px]">On te donne</span>
          </div>

          <ArrowRight size={16} className="text-white/15" />

          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.10] flex items-center justify-center">
              <Wallet size={24} className="text-white/30" />
            </div>
            <span className="font-body text-white/35 text-[11px]">Dans ta poche</span>
          </div>

          <span className="text-white/12 font-body text-xl hidden sm:block">→</span>

          <div className="grid grid-cols-2 gap-1.5">
            {services.map(({ label, Icon, color }) => (
              <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <Icon size={11} className={color} />
                <span className={`font-body text-[11px] ${color}`}>{label}</span>
              </div>
            ))}
          </div>

          <span className="text-white/12 font-body text-xl hidden sm:block">→</span>

          {/* Pocket cut */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-red-500/[0.09] border border-red-500/20 flex items-center justify-center relative">
              <Wallet size={24} className="text-red-400/55" />
              <span className="absolute -top-1.5 -right-1.5 text-red-400/75 text-sm leading-none font-bold">✕</span>
            </div>
            <span className="font-body text-white/35 text-[11px]">Repris ailleurs</span>
          </div>
        </div>

        {/* Secondary text */}
        <div
          className="max-w-2xl mx-auto transition-all duration-700"
          style={{ transitionDelay: isVisible ? '380ms' : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(12px)' }}
        >
          <p className="font-body text-white/48 text-base md:text-lg leading-relaxed">
            Ce qu'on te donne dans une poche peut être repris dans l'autre si l'État coupe ensuite dans{' '}
            <span className="text-white/75">l'école, l'hôpital, les transports, les retraites</span>{' '}
            ou les aides sociales.
          </p>
        </div>
      </div>
    </section>
  )
}

export default TaxVsRedistribution
