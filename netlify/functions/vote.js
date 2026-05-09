const crypto = require('crypto')

// ── Config ────────────────────────────────────────────────────────────────────

const SITE_ORIGIN  = process.env.SITE_URL || 'https://tangerine-chaja-996f5a.netlify.app'
const MAX_BODY_LEN = 256          // octets — interdit les corps géants
const VALID_CANDIDATES = new Set(['lfi', 'rn'])

// ── Helpers ───────────────────────────────────────────────────────────────────

function hashIP(ip) {
  if (!process.env.IP_SALT) {
    console.warn('[vote] IP_SALT env var is not set — using insecure fallback. Set it in Netlify environment variables.')
  }
  const salt = process.env.IP_SALT || 'duel2027-fallback-change-me'
  return crypto.createHash('sha256').update(salt + ip).digest('hex').slice(0, 40)
}

async function sb(path, options = {}) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)   // timeout 8 s

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

// ── CORS ──────────────────────────────────────────────────────────────────────
// On accepte les appels depuis le site officiel ET localhost en dev

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
    const { candidate } = body
    if (typeof candidate !== 'string' || !VALID_CANDIDATES.has(candidate)) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Candidat invalide' }) }
    }

    // 4. Extraire et hasher l'IP (jamais stockée en clair)
    const rawIP =
      event.headers['x-nf-client-connection-ip'] ||
      (event.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      'unknown'
    const ipHash = hashIP(rawIP)

    try {
      // 5. Insertion — la contrainte UNIQUE sur ip_hash bloque les doublons
      const insert = await sb('/votes', {
        method:  'POST',
        headers: { Prefer: 'return=minimal' },
        body:    JSON.stringify({ ip_hash: ipHash, candidate }),
      })

      // 409 = déjà voté
      if (insert.status === 409) {
        const prev      = await sb(`/votes?ip_hash=eq.${ipHash}&select=candidate`)
        const votedFor  = prev.data?.[0]?.candidate || candidate
        const counts    = await getCounts()
        return {
          statusCode: 409,
          headers: { ...CORS, 'Cache-Control': 'no-store' },
          body: JSON.stringify({ error: 'already_voted', votedFor, ...counts }),
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
      // Ne pas exposer les détails d'erreur internes
      console.error('[vote POST]', e.message)
      return { statusCode: 503, headers: CORS, body: JSON.stringify({ error: 'Service temporairement indisponible' }) }
    }
  }

  return { statusCode: 405, headers: { ...CORS, Allow: 'GET, POST, OPTIONS' }, body: JSON.stringify({ error: 'Méthode non autorisée' }) }
}
