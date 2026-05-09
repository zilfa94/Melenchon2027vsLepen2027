import React, { useState } from 'react'
import { Globe } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const LFI_IMG     = '/images/candidates/Melenchon2027_international.webp'
const LFI_IMG_FB  = '/images/candidates/Melenchon2027_international.png'
const RN_IMG      = '/images/candidates/LePen2027_international.webp'
const RN_IMG_FB   = '/images/candidates/LePen2027_international.png'

const GeopoliticsSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal()
  const [lfiErr, setLfiErr] = useState(false)
  const [rnErr, setRnErr] = useState(false)

  return (
    <section id="geopolitique" className="py-20 px-4 bg-bg-deep">
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-14 max-w-5xl mx-auto" />
      <div ref={ref} className="max-w-5xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/15 rounded-full px-3 py-1 mb-4">
            <Globe size={11} className="text-white/50" />
            <span className="font-heading text-white/60 text-xs font-semibold tracking-widest uppercase">Politique étrangère</span>
          </div>
          <h2 className="text-white tracking-wider" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(2rem,7vw,4rem)' }}>
            BOUSSOLE GÉOPOLITIQUE
          </h2>
        </div>

        {/* Images */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-700"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transitionDelay: isVisible ? '150ms' : '0ms' }}
        >
          {/* LFI */}
          <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '-4px 0 32px rgba(212,43,58,0.20), 0 0 0 1px rgba(212,43,58,0.18)' }}>
            {!lfiErr ? (
              <picture>
                <source srcSet={LFI_IMG} type="image/webp" />
                <img
                  src={LFI_IMG_FB}
                  alt="Mélenchon — vision internationale LFI"
                  className="w-full h-auto block"
                  width="800" height="600"
                  loading="lazy"
                  decoding="async"
                  onError={() => setLfiErr(true)}
                />
              </picture>
            ) : (
              <div className="w-full h-64 bg-lfi-red/10 flex items-center justify-center">
                <span className="text-lfi-red/40 font-heading text-sm">Image non disponible</span>
              </div>
            )}
          </div>

          {/* RN */}
          <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '4px 0 32px rgba(68,119,238,0.20), 0 0 0 1px rgba(68,119,238,0.18)' }}>
            {!rnErr ? (
              <picture>
                <source srcSet={RN_IMG} type="image/webp" />
                <img
                  src={RN_IMG_FB}
                  alt="Marine Le Pen — vision internationale RN"
                  className="w-full h-auto block"
                  width="800" height="600"
                  loading="lazy"
                  decoding="async"
                  onError={() => setRnErr(true)}
                />
              </picture>
            ) : (
              <div className="w-full h-64 bg-rn-blue/10 flex items-center justify-center">
                <span className="text-rn-blue/40 font-heading text-sm">Image non disponible</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default GeopoliticsSection
