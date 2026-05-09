import React, { useEffect, useState } from 'react'
import { scores } from '../data/onePage'
import { candidates } from '../data/candidates'
import { useScrollReveal } from '../hooks/useScrollReveal'
import CandidateAvatar from './CandidateAvatar'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface GaugeProps {
  value: number
  color: string
  animate: boolean
  size?: number
}

const ScoreGauge: React.FC<GaugeProps> = ({ value, color, animate, size = 130 }) => {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - value / 10)
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setOffset(targetOffset), 250)
      return () => clearTimeout(t)
    }
  }, [animate, targetOffset])

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full absolute inset-0"
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden
      >
        {/* Glow track */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="14" strokeOpacity="0.08"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.34,1.56,0.64,1)', filter: 'blur(3px)' }}
        />
        {/* Background track */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        {/* Score arc */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white leading-none" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: size * 0.24 }}>
          {value}
        </span>
        <span className="text-white/35 font-body" style={{ fontSize: size * 0.10 }}>/10</span>
      </div>
    </div>
  )
}

const chartData = scores.map(s => ({ name: s.round.split(' ')[0], LFI: s.lfi, RN: s.rn }))

const Scoreboard: React.FC = () => {
  const { ref, isVisible } = useScrollReveal()
  const lfi = candidates.find(c => c.id === 'lfi')!
  const rn = candidates.find(c => c.id === 'rn')!


  return (
    <section id="scoreboard" className="py-20 px-4 bg-bg-deep">
      <div ref={ref} className="max-w-5xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-gold/[0.10] border border-gold/25 rounded-full px-3 py-1 mb-4">
            <span className="font-heading text-gold text-xs font-semibold tracking-widest uppercase">Scores d'analyse</span>
          </div>
          <h2 className="text-white tracking-wider mb-3" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 'clamp(2rem,7vw,4rem)' }}>
            LE TABLEAU DE BORD
          </h2>
          <p className="font-body text-white/35 text-sm">
            Ces notes sont une grille d'analyse, pas une vérité absolue.
          </p>
        </div>

        {/* Score rounds */}
        <div className="space-y-5">
          {scores.map((score, idx) => (
            <div
              key={score.id}
              className="transition-all duration-700"
              style={{
                transitionDelay: isVisible ? `${idx * 150}ms` : '0ms',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              }}
            >
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 md:p-7">
                {/* Round header */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="font-heading text-white/[0.12] text-5xl leading-none select-none">{score.roundNumber}</span>
                  <div>
                    <div className="font-heading text-white/35 text-[10px] uppercase tracking-widest">Round</div>
                    <div className="font-heading text-white text-lg md:text-xl font-semibold">{score.round}</div>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-gold/[0.13] border border-gold/30 text-gold font-heading text-xs font-semibold px-3 py-1 rounded-full">
                      {score.advantageLabel}
                    </span>
                  </div>
                </div>

                {/* Score display */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_1fr] gap-6 items-center">

                  {/* LFI */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <ScoreGauge value={score.lfi} color="#d42b3a" animate={isVisible} size={120} />
                    <div className="text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                        <CandidateAvatar candidate={lfi} size={36} />
                        <div className="text-lfi-red text-xl tracking-wide leading-none" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>
                          {lfi.name.split(' ')[0]}<br />
                          <span className="text-sm">{lfi.name.split(' ').slice(1).join(' ')}</span>
                        </div>
                      </div>
                      <div className="font-body text-white/45 text-xs leading-relaxed max-w-[200px]">{score.lfiSummary}</div>
                      <span className="inline-block mt-2 bg-lfi-red/[0.13] border border-lfi-red/25 text-lfi-red font-heading text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {score.lfiBadge}
                      </span>
                    </div>
                  </div>

                  {/* Mini bar chart */}
                  <div className="hidden md:block h-28">
                    {isVisible && (
                      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                        <BarChart
                          data={[{ name: score.round, LFI: score.lfi, RN: score.rn }]}
                          barCategoryGap="20%"
                          margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
                        >
                          <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <YAxis domain={[0, 10]} hide />
                          <XAxis dataKey="name" hide />
                          <Tooltip
                            contentStyle={{ background: '#0c1020', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontFamily: 'DM Sans', fontSize: 12 }}
                            labelStyle={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                          />
                          <Bar dataKey="LFI" fill="#d42b3a" radius={[4, 4, 0, 0]} name="LFI" />
                          <Bar dataKey="RN" fill="#4477ee" radius={[4, 4, 0, 0]} name="RN" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* RN */}
                  <div className="flex flex-col sm:flex-row-reverse items-center gap-4">
                    <ScoreGauge value={score.rn} color="#4477ee" animate={isVisible} size={120} />
                    <div className="text-center sm:text-right">
                      <div className="flex items-center gap-2 justify-center sm:justify-end mb-1">
                        <div className="text-rn-blue text-xl tracking-wide leading-none" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>
                          {rn.name.split(' ').slice(0, 2).join(' ')}<br />
                          <span className="text-sm">{rn.name.split(' ').slice(2).join(' ')}</span>
                        </div>
                        <CandidateAvatar candidate={rn} size={36} />
                      </div>
                      <div className="font-body text-white/45 text-xs leading-relaxed max-w-[200px]">{score.rnSummary}</div>
                      <span className="inline-block mt-2 bg-rn-blue/[0.13] border border-rn-blue/25 text-rn-blue font-heading text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {score.rnBadge}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overview chart */}
        <div
          className="mt-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 transition-all duration-700"
          style={{
            transitionDelay: isVisible ? '350ms' : '0ms',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <div className="font-heading text-white/45 text-xs text-center mb-4 uppercase tracking-widest">Vue globale des scores</div>
          {isVisible && (
            <ResponsiveContainer width="100%" height={180} minWidth={1} minHeight={1}>
              <BarChart data={chartData} barCategoryGap="35%" barGap={5} margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
                <CartesianGrid strokeDasharray="2 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#8892a4', fontFamily: 'DM Sans', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fill: '#8892a4', fontFamily: 'DM Sans', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0c1020', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 13 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.45)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="LFI" fill="#d42b3a" radius={[6, 6, 0, 0]} name="LFI" />
                <Bar dataKey="RN" fill="#4477ee" radius={[6, 6, 0, 0]} name="RN" />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="flex justify-center gap-6 mt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-lfi-red inline-block" />
              <span className="text-white/45 text-xs font-body">LFI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-rn-blue inline-block" />
              <span className="text-white/45 text-xs font-body">RN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Scoreboard
