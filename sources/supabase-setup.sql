-- ══════════════════════════════════════════════════════════════════
-- SETUP SUPABASE — Duel des programmes 2027
-- Coller dans : Supabase Dashboard → SQL Editor → New query
-- ══════════════════════════════════════════════════════════════════

-- 1. Table des votes
CREATE TABLE IF NOT EXISTS votes (
  id          BIGSERIAL    PRIMARY KEY,
  ip_hash     TEXT         NOT NULL UNIQUE,   -- SHA-256 de l'IP (jamais l'IP brute)
  candidate   TEXT         NOT NULL CHECK (candidate IN ('lfi', 'rn')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 2. Index pour les comptages rapides
CREATE INDEX IF NOT EXISTS votes_candidate_idx ON votes (candidate);

-- 3. Row Level Security — autoriser uniquement les lectures/insertions via l'API
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Lecture publique (pour compter les votes)
CREATE POLICY "allow_select" ON votes
  FOR SELECT USING (true);

-- Insertion publique (un vote = une ligne)
CREATE POLICY "allow_insert" ON votes
  FOR INSERT WITH CHECK (true);

-- Pas de UPDATE ni DELETE via l'API publique
-- (seul le dashboard Supabase peut modifier/supprimer)
