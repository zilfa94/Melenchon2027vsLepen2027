import React, { useEffect, useRef, useState } from 'react'
import { Vote, Lock, CheckCircle, Users, TrendingUp, Mail, X } from 'lucide-react'
import { candidates } from '../data/candidates'
import { useScrollReveal } from '../hooks/useScrollReveal'
import CandidateAvatar from './CandidateAvatar'

const API    = '/api/vote'
const LS_KEY = 'duel2027_vote'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface Counts { lfi: number; rn: number }
type VoteState  = 'idle' | 'loading' | 'voted' | 'error'
type LoadingFor = 'lfi' | 'rn' | null

const pct = (val: number, total: number) =>
  total === 0 ? 50 : Math.round((val / total) * 100)

// ── Modal de saisie email ──────────────────────────────────────────────────────

interface EmailModalProps {
  candidate: 'lfi' | 'rn'
  loading: boolean
  onConfirm: (email: string) => void
  onCancel: () => void
}

const EmailModal: React.FC<EmailModalProps> = ({ candidate, loading, onConfirm, onCancel }) => {
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState('')
  const inputRef              = useRef<HTMLInputElement>(null)
  const color = candidate === 'lfi' ? '#d42b3a' : '#1a40cc'
  const label = candidate === 'lfi' ? 'LFI — Mélenchon' : 'RN — Marine Le Pen'

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Adresse email invalide')
      return
    }
    setError('')
    onConfirm(trimmed)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(6,8,15,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border bg-bg-card p-6"
        style={{ borderColor: color + '40', boxShadow: `0 0 40px ${color}20` }}
      >
        {/* Fermer */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Annuler"
        >
          <X size={16} />
        </button>

        {/* Titre */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-heading text-white text-sm font-semibold" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', letterSpacing: '0.06em' }}>
            VOTER POUR
          </span>
          <span className="font-heading text-sm font-semibold" style={{ color, fontFamily: '"Bebas Neue", Impact, sans-serif', letterSpacing: '0.06em' }}>
            {label}
          </span>
        </div>

        <p className="font-body text-white/40 text-xs mb-5">
          Entrez votre email pour valider votre vote. Il sera hashé et jamais affiché.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Input email */}
          <div className="relative mb-3">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="votre@email.com"
              autoComplete="email"
              disabled={loading}
              className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm font-body placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Erreur */}
          {error && (
            <p className="font-body text-amber-400/70 text-xs mb-3">{error}</p>
          )}

          {/* Bouton confirmer */}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-2.5 rounded-xl text-white font-heading text-sm font-semibold tracking-wider transition-all duration-200 disabled:opacity-40"
            style={{
              fontFamily: '"Bebas Neue", Impact, sans-serif',
              backgroundColor: color,
              letterSpacing: '0.08em',
            }}
          >
            {loading ? 'VALIDATION…' : 'CONFIRMER MON VOTE'}
          </button>
        </form>

        <p className="font-body text-white/18 text-[10px] text-center mt-3">
          1 vote par email · 1 vote par adresse IP
        </p>
      </div>
    </div>
  )
}

// ── Composant principal ────────────────────────────────────────────────────────

const PollSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal()
  const lfi = candidates.find(c => c.id === 'lfi')!
  const rn  = candidates.find(c => c.id === 'rn')!

  const [counts, setCounts]             = useState<Counts>({ lfi: 0, rn: 0 })
  const [voteState, setVote]            = useState<VoteState>('idle')
  const [votedFor, setVotedFor]         = useState<'lfi' | 'rn' | null>(null)
  const [loadingFor, setLoadingFor]     = useState<LoadingFor>(null)
  const [animate, setAnimate]           = useState(false)
  const [pendingCandidate, setPending]  = useState<'lfi' | 'rn' | null>(null)

  // Charger les compteurs + vérifier le cache local
  useEffect(() => {
    const cached = localStorage.getItem(LS_KEY)
    if (cached) {
      try {
        const { candidate } = JSON.parse(cached)
        setVotedFor(candidate)
        setVote('voted')
      } catch { localStorage.removeItem(LS_KEY) }
    }
    fetch(API)
      .then(r => r.json())
      .then((data: Counts) => {
        setCounts(data)
        setTimeout(() => setAnimate(true), 300)
      })
      .catch(() => {})
  }, [])

  // Ouvrir la modal email
  const handleVoteClick = (candidate: 'lfi' | 'rn') => {
    if (voteState !== 'idle') return
    setPending(candidate)
  }

  // Annuler la modal
  const handleCancel = () => {
    setPending(null)
  }

  // Soumettre le vote avec l'email
  const castVote = async (email: string) => {
    if (!pendingCandidate || voteState !== 'idle') return
    const candidate = pendingCandidate
    setPending(null)
    setVote('loading')
    setLoadingFor(candidate)
    setAnimate(false)

    try {
      const res  = await fetch(API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ candidate, email }),
      })
      const data = await res.json()

      if (res.status === 409) {
        // Déjà voté (IP ou email)
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
        setAnimate(true)
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
    <>
      {/* Modal email — rendu en dehors du flux pour se positionner en plein écran */}
      {pendingCandidate && (
        <EmailModal
          candidate={pendingCandidate}
          loading={voteState === 'loading'}
          onConfirm={castVote}
          onCancel={handleCancel}
        />
      )}

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
              onClick={() => handleVoteClick('lfi')}
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
                    <div className="h-full bg-lfi-red rounded-full transition-all duration-1000 ease-out" style={{ width: animate ? `${lfiPct}%` : '0%' }} />
                  </div>
                  <div className="font-body text-white/25 text-[10px] mt-1">{counts.lfi.toLocaleString('fr-FR')} vote{counts.lfi > 1 ? 's' : ''}</div>
                </div>
              )}
            </button>

            {/* RN */}
            <button
              onClick={() => handleVoteClick('rn')}
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
                    <div className="h-full bg-rn-blue rounded-full transition-all duration-1000 ease-out" style={{ width: animate ? `${rnPct}%` : '0%' }} />
                  </div>
                  <div className="font-body text-white/25 text-[10px] mt-1">{counts.rn.toLocaleString('fr-FR')} vote{counts.rn > 1 ? 's' : ''}</div>
                </div>
              )}
            </button>
          </div>

          {/* Résultats en direct — toujours visibles */}
          <div
            className={`rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: isVisible ? '250ms' : '0ms' }}
          >
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

            <div className="h-3 rounded-full overflow-hidden flex mb-2">
              <div className="h-full bg-lfi-red transition-all duration-1000 ease-out" style={{ width: animate ? `${lfiPct}%` : '50%' }} />
              <div className="h-full bg-rn-blue flex-1" />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lfi-red text-xl leading-none" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>{lfiPct}%</span>
                <span className="font-body text-white/30 text-xs">LFI · {counts.lfi.toLocaleString('fr-FR')} vote{counts.lfi > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-white/30 text-xs">RN · {counts.rn.toLocaleString('fr-FR')} vote{counts.rn > 1 ? 's' : ''}</span>
                <span className="font-heading text-rn-blue text-xl leading-none" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>{rnPct}%</span>
              </div>
            </div>

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
              <span className="font-body text-[10px]">1 vote par email · 1 vote par IP · Données hashées, jamais stockées en clair</span>
            </div>
            {voteState === 'error' && (
              <p className="font-body text-amber-400/60 text-xs">Impossible de voter pour le moment. Réessayez plus tard.</p>
            )}
          </div>

        </div>
      </section>
    </>
  )
}

export default PollSection
