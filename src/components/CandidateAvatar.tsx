import React, { useState } from 'react'
import type { Candidate } from '../data/candidates'

interface Props {
  candidate: Candidate
  size?: number
  className?: string
}

const CandidateAvatar: React.FC<Props> = ({ candidate, size = 48, className = '' }) => {
  const [error, setError] = useState(false)

  return (
    <div
      className={`relative flex-shrink-0 rounded-full overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 0 2px ${candidate.colorPrimary}55, 0 0 16px ${candidate.colorPrimary}30`,
      }}
    >
      {candidate.image && !error ? (
        <img
          src={candidate.image}
          alt={`${candidate.name} — ${candidate.party}`}
          className="w-full h-full object-cover object-top"
          onError={() => setError(true)}
        />
      ) : (
        /* SVG fallback inline */
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
          <defs>
            <radialGradient id={`av-${candidate.id}`} cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor={candidate.colorSecondary} />
              <stop offset="100%" stopColor={candidate.colorPrimary} />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill={`url(#av-${candidate.id})`} />
          <ellipse cx="50" cy="42" rx="18" ry="20" fill="white" fillOpacity="0.15" />
          <path d="M 0 100 C 10 80 30 70 50 68 C 70 70 90 80 100 100 Z" fill="white" fillOpacity="0.12" />
          <text x="50" y="47" textAnchor="middle" dominantBaseline="middle" fill="white" fillOpacity="0.9"
            fontSize="18" fontFamily='"Bebas Neue", Impact, sans-serif' letterSpacing="2">
            {candidate.party}
          </text>
        </svg>
      )}

      {/* Subtle inner shadow for depth */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: 'inset 0 -6px 12px rgba(0,0,0,0.25)' }}
      />
    </div>
  )
}

export default CandidateAvatar
