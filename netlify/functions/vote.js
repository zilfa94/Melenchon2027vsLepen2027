const crypto = require('crypto')

// ── Config ────────────────────────────────────────────────────────────────────

const SITE_ORIGIN      = process.env.SITE_URL || 'https://tangerine-chaja-996f5a.netlify.app'
const MAX_BODY_LEN     = 512
const VALID_CANDIDATES = new Set(['lfi', 'rn'])
const EMAIL_REGEX      = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSalt() {
  if (!process.env.IP_SALT) {
    console.warn('[vote] IP_SALT env var is not set — using insecure fallback.')
  }
  return process.env.IP_SALT || 'duel2027-fallback-change-me'
}

function hashIP(ip) {
  return crypto.createHash('sha256').update(getSalt() + 'ip:' + ip).digest('hex').slice(0, 40)
}

function hashEmail(email) {
  // Normaliser l'email avant de hasher : minuscules, trim
  return crypto.createHash('sha256').update(getSalt() + 'email:' + email.toLowerCase().trim()).digest('hex').slice(0, 40)
}

async function sb(path, options = {}) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(`${url}/rest/v1${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    const text = await res.text()
    return { status: res.status, headers: res.headers, data: text ? JSON.parse(text) : null }
  } finally {
    clearTimeout(timer)
  }
}

function parseCount(res) {
  const range = res.headers.get('content-range') || ''
  const match = range.match(/\/(\d+)$/)
  return match ? parseInt(match[1], 10) : 0
}

async function getCounts() {
  const [lfiRes, rnRes] = await Promise.all([
    sb('/votes?candidate=eq.lfi&select=id', { headers: { Prefer: 'count=exact' } }),
    sb('/votes?candidate=eq.rn&select=id',  { headers: { Prefer: 'count=exact' } }),
  ])
  return { lfi: parseCount(lfiRes), rn: parseCount(rnRes) }
}

// Identifie quelle contrainte UNIQUE a été violée (ip_hash ou email_hash)
function getDuplicateReason(supabaseError) {
  const msg = (supabaseError?.message || '') + (supabaseError?.details || '')
  if (msg.includes('email_hash')) return 'email'
  return 'ip'
}

// ── CORS ──────────────────────────────────────────────────────────────────────

function getCorsHeaders(origin) {
  const allowed = [SITE_ORIGIN, 'http://localhost:5173', 'http://localhost:8888']
  const allow   = allowed.includes(origin) ? origin : SITE_ORIGIN
  return {
    'Access-Control-Allow-Origin':  allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
    'Content-Type':                 'application/json',
    'Vary':                         'Origin',
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  const origin = event.headers['origin'] || ''
  const CORS   = getCorsHeaders(origin)

  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' }
  }

  // ── GET : compteurs ────────────────────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    try {
      const counts = await getCounts()
      return {
        statusCode: 200,
        headers: { ...CORS, 'Cache-Control': 'no-store' },
        body: JSON.stringify(counts),
      }
    } catch (e) {
      console.error('[vote GET]', e.message)
      return { statusCode: 503, headers: CORS, body: JSON.stringify({ error: 'Service temporairement indisponible' }) }
    }
  }

  // ── POST : voter ───────────────────────────────────────────────────────────
  if (event.httpMethod === 'POST') {

    // 1. Taille du corps
    const rawBody = event.body || ''
    if (rawBody.length > MAX_BODY_LEN) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Requête invalide' }) }
    }

    // 2. Parse JSON
    let body
    try { body = JSON.parse(rawBody) }
    catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'JSON invalide' }) } }

    // 3. Valider le candidat
    const { candidate, email } = body
    if (typeof candidate !== 'string' || !VALID_CANDIDATES.has(candidate)) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Candidat invalide' }) }
    }

    // 4. Valider l'email (requis)
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Adresse email invalide' }) }
    }

    // 5. Hasher IP et email (jamais stockés en clair)
    const rawIP =
      event.headers['x-nf-client-connection-ip'] ||
      (event.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      'unknown'
    const ipHash    = hashIP(rawIP)
    const emailHash = hashEmail(email)

    try {
      // 6. Vérifier si l'IP a déjà voté
      const ipCheck = await sb(`/votes?ip_hash=eq.${ipHash}&select=candidate`)
      if (ipCheck.data && ipCheck.data.length > 0) {
        const votedFor = ipCheck.data[0].candidate
        const counts   = await getCounts()
        return {
          statusCode: 409,
          headers: { ...CORS, 'Cache-Control': 'no-store' },
          body: JSON.stringify({ error: 'already_voted', reason: 'ip', votedFor, ...counts }),
        }
      }

      // 7. Vérifier si l'email a déjà voté
      const emailCheck = await sb(`/votes?email_hash=eq.${emailHash}&select=candidate`)
      if (emailCheck.data && emailCheck.data.length > 0) {
        const votedFor = emailCheck.data[0].candidate
        const counts   = await getCounts()
        return {
          statusCode: 409,
          headers: { ...CORS, 'Cache-Control': 'no-store' },
          body: JSON.stringify({ error: 'already_voted', reason: 'email', votedFor, ...counts }),
        }
      }

      // 8. Insertion avec ip_hash ET email_hash
      const insert = await sb('/votes', {
        method:  'POST',
        headers: { Prefer: 'return=minimal' },
        body:    JSON.stringify({ ip_hash: ipHash, email_hash: emailHash, candidate }),
      })

      // 409 residuel (race condition très rare entre deux requêtes simultanées)
      if (insert.status === 409) {
        const reason   = getDuplicateReason(insert.data)
        const prev     = await sb(`/votes?${reason === 'email' ? 'email_hash' : 'ip_hash'}=eq.${reason === 'email' ? emailHash : ipHash}&select=candidate`)
        const votedFor = prev.data?.[0]?.candidate || candidate
        const counts   = await getCounts()
        return {
          statusCode: 409,
          headers: { ...CORS, 'Cache-Control': 'no-store' },
          body: JSON.stringify({ error: 'already_voted', reason, votedFor, ...counts }),
        }
      }

      if (insert.status >= 300) {
        console.error('[vote POST] Insert failed', insert.status, insert.data)
        return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Erreur serveur' }) }
      }

      const counts = await getCounts()
      return {
        statusCode: 200,
        headers: { ...CORS, 'Cache-Control': 'no-store' },
        body: JSON.stringify({ success: true, ...counts }),
      }

    } catch (e) {
      console.error('[vote POST]', e.message)
      return { statusCode: 503, headers: CORS, body: JSON.stringify({ error: 'Service temporairement indisponible' }) }
    }
  }

  return { statusCode: 405, headers: { ...CORS, Allow: 'GET, POST, OPTIONS' }, body: JSON.stringify({ error: 'Méthode non autorisée' }) }
}
