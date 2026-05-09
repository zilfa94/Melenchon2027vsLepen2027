import React, { useState } from 'react'
import type { Candidate } from '../data/candidates'

interface Props {
  candidate: Candidate
  className?: string
}

/** SVG fallback when no real photo is available */
const SvgFallback: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  const uid = `p-${candidate.id}`
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden
    >
      <defs>
        <radialGradient id={`rg-${uid}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={candidate.colorSecondary} stopOpacity="0.9" />
          <stop offset="100%" stopColor={candidate.colorPrimary} stopOpacity="1" />
        </radialGradient>
        <radialGradient id={`hl-${uid}`} cx="38%" cy="28%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.22" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`cp-${uid}`}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="none" stroke={candidate.colorPrimary} strokeWidth="1" strokeOpacity="0.35" />
      <circle cx="100" cy="100" r="96" fill={`url(#rg-${uid})`} />
      <circle cx="100" cy="100" r="96" fill={`url(#hl-${uid})`} />
      <g clipPath={`url(#cp-${uid})`}>
        <ellipse cx="100" cy="80" rx="37" ry="42" fill="white" fillOpacity="0.13" />
        <rect x="87" y="118" width="26" height="24" rx="8" fill="white" fillOpacity="0.09" />
        <path d="M -15 220 C 15 172 52 150 77 140 C 88 136 94 133 100 133 C 106 133 112 136 123 140 C 148 150 185 172 215 220 Z" fill="white" fillOpacity="0.10" />
      </g>
      <text x="100" y="87" textAnchor="middle" dominantBaseline="middle" fill="white" fillOpacity="0.90" fontSize="28" fontFamily='"Bebas Neue", Impact, sans-serif' letterSpacing="4">{candidate.party}</text>
      <ellipse cx="80" cy="60" rx="14" ry="8" fill="white" fillOpacity="0.07" />
    </svg>
  )
}

/** Real photo with glow border — falls back to SVG on error */
const AbstractPortrait: React.FC<Props> = ({ candidate, className = '' }) => {
  const [imgError, setImgError] = useState(false)
  const hasPhoto = candidate.image !== null && !imgError

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label={`Portrait de ${candidate.name} (${candidate.party})`}
    >
      {hasPhoto ? (
        <>
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full blur-md opacity-40"
            style={{ background: `radial-gradient(circle, ${candidate.colorPrimary}88 0%, transparent 70%)` }}
          />
          {/* Photo in circular frame */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{
              boxShadow: `0 0 0 2px ${candidate.colorPrimary}55, 0 0 24px ${candidate.colorPrimary}33`,
            }}
          >
            <img
              src={candidate.image!}
              alt={`${candidate.name} — ${candidate.party}`}
              className="w-full h-full object-cover object-center"
              style={{ display: 'block' }}
              onError={() => setImgError(true)}
            />
            {/* Subtle overlay to blend with dark theme */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(180deg, transparent 50%, ${candidate.colorPrimary}22 100%)`,
              }}
            />
          </div>
        </>
      ) : (
        <SvgFallback candidate={candidate} />
      )}
    </div>
  )
}

export default AbstractPortrait
