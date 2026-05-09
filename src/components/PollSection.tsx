import React, { useEffect, useState } from 'react'
import { Vote, Lock, CheckCircle, Users, TrendingUp } from 'lucide-react'
import { candidates } from '../data/candidates'
import { useScrollReveal } from '../hooks/useScrollReveal'
import CandidateAvatar from './CandidateAvatar'

const API = '/api/vote'
const LS_KEY = 'duel2027_vote'

interface Counts { lfi: number; rn: number }
type VoteState = 'idle' | 'loading' | 'voted' | 'error'
type LoadingFor = 'lfi' | 'rn' | null

const pct = (val: number, total: number) =>
  total === 0 ? 50 : Math.round((val / total) * 100)

const PollSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal()
  const lfi = candidates.find(c => c.id === 'lfi')!
  const rn  = candidates.find(c => c.id === 'rn')!

  const [counts, setCounts]         = useState<Counts>({ lfi: 0, rn: 0 })
  const [voteState, setVote]        = useState<VoteState>('idle')
  const [votedFor, setVotedFor]     = useState<'lfi' | 'rn' | null>(null)
  const [loadingFor, setLoadingFor] = useState<LoadingFor>(null)
  const [animate, setAnimate]       = useState(false)

  // Charger les compteurs + vérifier le cache local
  useEffect(() => {
    const cached = localStorage.getItem(LS_KEY)
    if (cached) {
      const { candidate } = JSON.parse(cached)
      setVotedFor(candidate)
      setVote('voted')
    }
    fetch(API)
      .then(r => r.json())
      .then((data: Counts) => {
        setCounts(data)
        setTimeout(() => setAnimate(true), 300)
      })
      .catch(() => {})
  }, [])

  const castVote = async (candidate: 'lfi' | 'rn') => {
    if (voteState !== 'idle') return
    setVote('loading')
    setLoadingFor(candidate)
    // Reset animation so bars re-animate avec les nouvelles valeurs
    setAnimate(false)
    try {
      const res  = await fetch(API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ candidate }),
      })
      const data = await res.json()

      if (res.status === 409) {
        setVotedFor(data.votedFor)
        setCounts({ lfi: data.lfi, rn: data.rn })
        setVote('voted')
        localStorage.setItem(LS_KEY, JSON.stringify({ candidate: data.votedFor }))
        setTimeout(() => setAnimate(true), 100)
      } else if (res.ok) {
        setVotedFor(candidate)
        setCounts({ lfi: data.lfi, rn: data.rn })
        setVote('voted')
        localStorage.setItem(LS_KEY, JSON.stringify({ candidate }))
        setTimeout(() => setAnimate(true), 100)
      } else {
        setVote('error')
        setLoadingFor(null)
        setAnimate(true) // restore animation state
        setTimeout(() => setVote('idle'), 4000)
      }
    } catch {
      setVote('error')
      setLoadingFor(null)
      setAnimate(true)
      setTimeout(() => setVote('idle'), 4000)
    }
  }

  const total    = counts.lfi + counts.rn
  const lfiPct   = pct(counts.lfi, total)
  const rnPct    = pct(counts.rn, total)
  const hasVoted = voteState === 'voted'

  return (
    <section id="sondage" className="py-20 px-4 bg-bg-deep">
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-14 max-w-5xl mx-auto" />
      <div ref={ref} className="max-w-3xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-gold/[0.09] border border-gold/25 rounded-full px-3 py-1 mb-4">
            <Vote size={11} className="text-gold" />
            <span className="font-heading text-gold text-xs font-semibold tracking-widest uppercase">Sondage interactif</span>
          </div>
          <h2 className="text-white tracking-wider mb-3" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(2rem,7vw,4rem)' }}>
            VOTRE CHOIX
          </h2>
          <p className="font-body text-white/35 text-sm">
            Si le second tour opposait ces deux candidats, pour qui voteriez-vous ?
          </p>
        </div>

        {/* Vote cards */}
        <div
          className={`grid grid-cols-2 gap-4 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
        >
          {/* LFI */}
          <button
            onClick={() => castVote('lfi')}
            disabled={hasVoted || voteState === 'loading'}
            className={`relative group rounded-2xl border p-5 text-left transition-all duration-300 ${
              hasVoted && votedFor !== 'lfi'
                ? 'bg-white/[0.02] border-white/[0.06] opacity-40 cursor-default'
                : hasVoted && votedFor === 'lfi'
                ? 'bg-lfi-red/[0.10] border-lfi-red/40 cursor-default'
                : 'bg-lfi-red/[0.06] border-lfi-red/25 hover:bg-lfi-red/[0.12] hover:border-lfi-red/50 hover:-translate-y-1 cursor-pointer'
            }`}
          >
            {votedFor === 'lfi' && (
              <div className="absolute top-3 right-3">
                <CheckCircle size={18} className="text-lfi-red" />
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <CandidateAvatar candidate={lfi} size={48} />
              <div>
                <div className="font-heading text-white text-sm font-semibold leading-tight" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', letterSpacing: '0.05em' }}>
                  {lfi.name}
                </div>
                <div className="font-heading text-lfi-red text-[10px] uppercase tracking-widest">{lfi.party}</div>
              </div>
            </div>
            {!hasVoted ? (
              <div className="w-full bg-lfi-red text-white font-heading text-xs font-semibold py-2 rounded-xl text-center tracking-wider group-hover:bg-lfi-red/90 transition-colors">
                {loadingFor === 'lfi' ? '…' : 'VOTER'}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-body text-white/40 text-xs">LFI</span>
                  <span className="font-heading text-lfi-red text-lg leading-none" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>{lfiPct}%</span>
                </div>
                <div className="h-2 bg-white/[0.07] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lfi-red rounded-full transition-all duration-1000 ease-out"
                    style={{ width: animate ? `${lfiPct}%` : '0%' }}
                  />
                </div>
                <div className="font-body text-white/25 text-[10px] mt-1">{counts.lfi.toLocaleString('fr-FR')} vote{counts.lfi > 1 ? 's' : ''}</div>
              </div>
            )}
          </button>

          {/* RN */}
          <button
            onClick={() => castVote('rn')}
            disabled={hasVoted || voteState === 'loading'}
            className={`relative group rounded-2xl border p-5 text-left transition-all duration-300 ${
              hasVoted && votedFor !== 'rn'
                ? 'bg-white/[0.02] border-white/[0.06] opacity-40 cursor-default'
                : hasVoted && votedFor === 'rn'
                ? 'bg-rn-blue/[0.10] border-rn-blue/40 cursor-default'
                : 'bg-rn-blue/[0.06] border-rn-blue/25 hover:bg-rn-blue/[0.12] hover:border-rn-blue/50 hover:-translate-y-1 cursor-pointer'
            }`}
          >
            {votedFor === 'rn' && (
              <div className="absolute top-3 right-3">
                <CheckCircle size={18} className="text-rn-blue" />
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <CandidateAvatar candidate={rn} size={48} />
              <div>
                <div className="font-heading text-white text-sm font-semibold leading-tight" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', letterSpacing: '0.05em' }}>
                  {rn.name}
                </div>
                <div className="font-heading text-rn-blue text-[10px] uppercase tracking-widest">{rn.party}</div>
              </div>
            </div>
            {!hasVoted ? (
              <div className="w-full bg-rn-blue text-white font-heading text-xs font-semibold py-2 rounded-xl text-center tracking-wider group-hover:bg-rn-blue/90 transition-colors">
                {loadingFor === 'rn' ? '…' : 'VOTER'}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-body text-white/40 text-xs">RN</span>
                  <span className="font-heading text-rn-blue text-lg leading-none" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>{rnPct}%</span>
                </div>
                <div className="h-2 bg-white/[0.07] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rn-blue rounded-full transition-all duration-1000 ease-out"
                    style={{ width: animate ? `${rnPct}%` : '0%' }}
                  />
                </div>
                <div className="font-body text-white/25 text-[10px] mt-1">{counts.rn.toLocaleString('fr-FR')} vote{counts.rn > 1 ? 's' : ''}</div>
              </div>
            )}
          </button>
        </div>

        {/* ── Résultats en direct — toujours visibles ── */}
        <div
          className={`rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: isVisible ? '250ms' : '0ms' }}
        >
          {/* Label */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-gold/70" />
              <span className="font-heading text-gold/70 text-[10px] font-semibold uppercase tracking-widest">Résultats en direct</span>
            </div>
            {total > 0 && (
              <div className="flex items-center gap-1.5 text-white/30">
                <Users size={11} />
                <span className="font-body text-[11px]">{total.toLocaleString('fr-FR')} participant{total > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Barre de partage LFI / RN */}
          <div className="h-3 rounded-full overflow-hidden flex mb-2">
            <div
              className="h-full bg-lfi-red transition-all duration-1000 ease-out"
              style={{ width: animate ? `${lfiPct}%` : '50%' }}
            />
            <div
              className="h-full bg-rn-blue transition-all duration-1000 ease-out flex-1"
            />
          </div>

          {/* Pourcentages */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lfi-red text-xl leading-none" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>
                {lfiPct}%
              </span>
              <span className="font-body text-white/30 text-xs">LFI · {counts.lfi.toLocaleString('fr-FR')} vote{counts.lfi > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-white/30 text-xs">RN · {counts.rn.toLocaleString('fr-FR')} vote{counts.rn > 1 ? 's' : ''}</span>
              <span className="font-heading text-rn-blue text-xl leading-none" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>
                {rnPct}%
              </span>
            </div>
          </div>

          {/* Invite à voter si pas encore voté */}
          {!hasVoted && total > 0 && (
            <p className="font-body text-white/20 text-[10px] text-center mt-3 italic">
              Votez pour voir le détail par candidat ↑
            </p>
          )}
        </div>

        {/* Sécurité + erreur */}
        <div
          className={`flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: isVisible ? '350ms' : '0ms' }}
        >
          <div className="flex items-center gap-1.5 text-white/18">
            <Lock size={10} />
            <span className="font-body text-[10px]">1 vote par adresse IP · Adresses hashées, jamais stockées en clair</span>
          </div>
          {voteState === 'error' && (
            <p className="font-body text-amber-400/60 text-xs">Impossible de voter pour le moment. Réessayez plus tard.</p>
          )}
        </div>

      </div>
    </section>
  )
}

export default PollSection
