import React from 'react'
import { ChevronDown } from 'lucide-react'
import { candidates } from '../data/candidates'

const HeroDuel: React.FC = () => {
  const lfi = candidates.find(c => c.id === 'lfi')!
  const rn = candidates.find(c => c.id === 'rn')!

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-deep"
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-lfi-red/[0.12] via-lfi-red/[0.04] to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-rn-blue/[0.12] via-rn-blue/[0.04] to-transparent" />
        {/* Center hairline */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
        {/* Noise */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <filter id="hero-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-noise)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-10 flex flex-col items-center">

        {/* Badge */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 bg-gold/[0.10] border border-gold/25 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-glow" />
            <span className="font-heading text-gold text-xs font-semibold tracking-widest uppercase">
              Analyse des programmes
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h1
            className="text-white leading-[0.88] tracking-wider"
            style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(2.8rem,10vw,7rem)' }}
          >
            DUEL DES
            <br />
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, #d42b3a 0%, #d4af37 50%, #4477ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              PROGRAMMES
            </span>
            <br />
            2027
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="font-body text-white/45 text-center max-w-xl mb-8 text-sm leading-relaxed animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          Mélenchon / LFI face à Marine Le Pen / RN :{' '}
          <span className="text-white/70">dépenses, recettes et partage réel des richesses.</span>
        </p>

        {/* ── Main illustration ── */}
        <div className="w-full max-w-2xl relative">
          {/* Dual glow behind image */}
          <div className="absolute -inset-4 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(to right, rgba(212,43,58,0.18) 0%, transparent 50%, rgba(68,119,238,0.18) 100%)',
                filter: 'blur(24px)',
              }}
            />
          </div>

          {/* Image frame */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 32px 64px rgba(0,0,0,0.5), -8px 0 40px rgba(212,43,58,0.15), 8px 0 40px rgba(68,119,238,0.15)',
            }}
          >
            <picture>
              <source srcSet="/images/candidates/presidentiel2027.webp" type="image/webp" />
              <img
                src="/images/candidates/presidentiel2027.png"
                alt="Duel caricatural Mélenchon (LFI) vs Marine Le Pen (RN) — Présidentiel 2027"
                className="w-full h-auto block"
                width="800" height="600"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </picture>
            {/* Subtle bottom fade to blend with page */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-deep/60 to-transparent" />
          </div>
        </div>

        {/* ── Score cards ── */}
        <div
          className="w-full max-w-2xl grid grid-cols-2 gap-3 mt-5 animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          {/* LFI scores */}
          <div className="group bg-white/[0.04] backdrop-blur-sm border border-lfi-red/25 rounded-2xl p-4 hover:border-lfi-red/50 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-4 rounded-full bg-lfi-red" />
              <div>
                <div className="font-heading text-white font-semibold text-sm leading-tight" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', letterSpacing: '0.05em' }}>
                  {lfi.name}
                </div>
                <div className="font-heading text-lfi-red text-[10px] uppercase tracking-widest">{lfi.party}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-lfi-red/[0.12] border border-lfi-red/20 rounded-xl px-2 py-1.5 text-center">
                <div style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.6rem' }} className="text-white leading-none">{lfi.scores.budgetCredibility}</div>
                <div className="text-white/35 text-[9px] font-body mt-0.5">Budget /10</div>
              </div>
              <div className="flex-1 bg-lfi-red/[0.12] border border-lfi-red/20 rounded-xl px-2 py-1.5 text-center">
                <div style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.6rem' }} className="text-white leading-none">{lfi.scores.wealthSharing}</div>
                <div className="text-white/35 text-[9px] font-body mt-0.5">Redistrib. /10</div>
              </div>
            </div>
          </div>

          {/* RN scores */}
          <div className="group bg-white/[0.04] backdrop-blur-sm border border-rn-blue/25 rounded-2xl p-4 hover:border-rn-blue/50 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-4 rounded-full bg-rn-blue" />
              <div>
                <div className="font-heading text-white font-semibold text-sm leading-tight" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', letterSpacing: '0.05em' }}>
                  {rn.name}
                </div>
                <div className="font-heading text-rn-blue text-[10px] uppercase tracking-widest">{rn.party}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-rn-blue/[0.12] border border-rn-blue/20 rounded-xl px-2 py-1.5 text-center">
                <div style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.6rem' }} className="text-white leading-none">{rn.scores.budgetCredibility}</div>
                <div className="text-white/35 text-[9px] font-body mt-0.5">Budget /10</div>
              </div>
              <div className="flex-1 bg-rn-blue/[0.12] border border-rn-blue/20 rounded-xl px-2 py-1.5 text-center">
                <div style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.6rem' }} className="text-white leading-none">{rn.scores.wealthSharing}</div>
                <div className="text-white/35 text-[9px] font-body mt-0.5">Redistrib. /10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p
          className="mt-6 font-body text-white/22 text-xs italic text-center max-w-lg animate-fade-in"
          style={{ animationDelay: '0.9s' }}
        >
          Cette page compare les programmes et chiffrages disponibles. Elle ne préjuge pas des candidatures définitives.
        </p>

        {/* Scroll indicator */}
        <div className="mt-8 flex flex-col items-center gap-2 text-white/18 animate-fade-in" style={{ animationDelay: '1.1s' }}>
          <span className="font-body text-xs tracking-widest uppercase">Défiler pour l'analyse</span>
          <ChevronDown size={15} className="animate-bounce" />
        </div>
      </div>
    </section>
  )
}

export default HeroDuel
