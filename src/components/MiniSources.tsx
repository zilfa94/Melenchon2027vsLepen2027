import React from 'react'
import { ExternalLink } from 'lucide-react'
import { sources } from '../data/onePage'
import { candidates } from '../data/candidates'

const MiniSources: React.FC = () => (
  <section id="sources" className="py-16 px-4 bg-bg-deep border-t border-white/[0.05]">
    <div className="max-w-4xl mx-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Sources */}
        <div>
          <h3 className="text-white tracking-wider mb-5" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.5rem' }}>
            SOURCES PRINCIPALES
          </h3>
          <ul className="space-y-3">
            {sources.map(src => (
              <li key={src.label} className="flex items-start gap-3">
                <span className="text-gold/45 mt-1 flex-shrink-0 text-xs">●</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-white/65 text-sm font-medium">{src.label}</span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/22 hover:text-white/50 transition-colors"
                        aria-label={`Visiter ${src.label}`}
                      >
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  <div className="font-body text-white/30 text-xs mt-0.5">{src.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Image credits */}
        <div>
          <h3 className="text-white tracking-wider mb-5" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: '1.5rem' }}>
            CRÉDITS PORTRAITS
          </h3>
          <ul className="space-y-3">
            {candidates.map(c => (
              <li key={c.id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                <div className="font-heading text-white/65 text-sm font-medium mb-1">
                  {c.name} — {c.party}
                </div>
                <div className="font-body text-white/30 text-xs">{c.imageCredit}</div>
                {c.imageSource && (
                  <div className="font-body text-white/20 text-[10px] mt-0.5">
                    Source : {c.imageSource} · {c.license}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Editorial disclaimer */}
          <div className="mt-5 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
            <p className="font-body text-white/28 text-xs leading-relaxed italic">
              Cette page compare les programmes et chiffrages disponibles au moment de sa publication.
              Les notes attribuées constituent une grille d'analyse, pas un jugement définitif.
              Elle ne préjuge pas des candidatures définitives pour 2027.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-5 border-t border-white/[0.05] text-center space-y-2">
        <p className="font-body text-white/18 text-xs">
          Analyse data-journalisme — Programmes comparés sur la base des documents publics disponibles
        </p>
        <p className="font-body text-white/25 text-xs">
          Contact :{' '}
          <a
            href="mailto:presidentiel.2027.fr@gmail.com"
            className="text-gold/50 hover:text-gold/80 transition-colors underline underline-offset-2"
          >
            presidentiel.2027.fr@gmail.com
          </a>
        </p>
      </div>
    </div>
  </section>
)

export default MiniSources
