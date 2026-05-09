# CLONE BLUEPRINT — Duel des Programmes 2027
> Manuel complet pour recréer ce site à l'identique pour n'importe quel duel politique.  
> À lire intégralement avant de commencer une nouvelle session.

---

## 0. RÉPONSE À LA QUESTION SUPABASE

**→ OUI, créer un nouveau projet Supabase par duel.**

Raisons :
- Données de votes isolées (votes LFI/RN ne se mélangent pas avec LFI/Renaissance)
- `IP_SALT` différent par duel = sécurité indépendante
- Archivage/suppression d'un duel sans impact sur les autres
- Le plan gratuit Supabase autorise plusieurs projets

---

## 1. CONCEPT ET TONALITÉ

**Type de site :** Data-journalisme politique one-page  
**Ambiance :** "Political data battle scoreboard" — analytique, crédible, pas partisan  
**Référence esthétique :** Le Monde data viz × scoreboard sportif  
**Audience :** Grand public francophone curieux de politique

**Sections dans l'ordre :**
1. Hero (split-screen avec image duel + scores résumés)
2. Scoreboard (tableau de notes par round avec jauges animées + graphiques)
3. Chiffres clés (grille de KPI par candidat)
4. Round Dépenses (liste des postes de dépenses par candidat)
5. Round Recettes (liste des recettes par candidat)
6. Redistribution des richesses (comparatif visuel)
7. Boussole géopolitique (images illustratives)
8. Sondage interactif (vote avec email + résultats en direct)
9. Verdict final (tableau synthèse + risques)
10. Sources & crédits

---

## 2. TECH STACK (versions exactes)

```
React 19 + Vite 8 + TypeScript
Tailwind CSS v3 (JIT)
Recharts (graphiques — lazy-loadé)
lucide-react (icônes)
@upstash/redis (installé mais non utilisé — prévu pour rate limiting futur)
sharp (dev — compression images)
```

**Backend :**
- Netlify Functions (serverless Node.js) — `/netlify/functions/vote.js`
- Supabase PostgreSQL (votes)

**Déploiement :** Netlify (free tier suffisant)

---

## 3. DESIGN SYSTEM COMPLET

### 3.1 Couleurs — tailwind.config.js

```js
colors: {
  'bg-deep':    '#06080f',   // fond principal (quasi-noir bleuté)
  'bg-card':    '#0c1020',   // fond des cartes
  'lfi-red':    '#d42b3a',   // rouge LFI (gauche)
  'lfi-orange': '#e85530',   // orange LFI secondaire
  'rn-blue':    '#1a40cc',   // bleu RN (droite)
  'rn-dark':    '#0a1a3e',   // marine RN foncé
  'gold':       '#d4af37',   // accent or (scores, badges, titres de section)
  'gold-light': '#f0c040',   // or clair
  'muted':      '#8892a4',   // texte secondaire neutre
}
```

**Règle d'attribution des couleurs :**
- Candidat gauche → utilise `lfi-red` / `lfi-orange` (chaud)
- Candidat droite → utilise `rn-blue` / `rn-dark` (froid)
- Pour un duel différent, remapper ces deux palettes aux couleurs des partis concernés
- `gold` reste toujours l'accent neutre (scores, verdicts, badges)

### 3.2 Typographie

```js
fontFamily: {
  display: ['"Bebas Neue"', 'Impact', 'Haettenschweiler', 'sans-serif'],
  heading:  ['"Outfit"',    'system-ui', 'sans-serif'],
  body:     ['"DM Sans"',   'system-ui', 'sans-serif'],
}
```

**Usages :**
- `font-display` / `fontFamily: '"Bebas Neue"'` en inline → grands titres (H1, H2, chiffres scores)
- `font-heading` (Outfit) → labels, badges, noms de candidats, légendes
- `font-body` (DM Sans) → tout le texte courant, descriptions, notes

**Google Fonts URL (chargement non-bloquant — voir index.html) :**
```
Bebas+Neue&family=Outfit:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap
```

### 3.3 Fond et atmosphère

Le fond est `#06080f` (quasi-noir), jamais blanc. Chaque section utilise :
- `bg-bg-deep` pour le fond principal
- Cartes : `bg-white/[0.03]` avec `border border-white/[0.08]`
- Séparateurs de section : `<div class="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent">`
- Effet de bruit (SVG `feTurbulence`) dans le hero pour la texture

### 3.4 Animations CSS (tailwind.config.js)

```js
animation: {
  'fade-up':    'fadeUp 0.7s ease-out both',
  'fade-in':    'fadeIn 0.6s ease-out both',
  'slide-left': 'slideLeft 0.8s ease-out both',
  'slide-right':'slideRight 0.8s ease-out both',
  'scale-in':   'scaleIn 0.6s ease-out both',
  'glow':       'glowPulse 4s ease-in-out infinite',
  'float':      'float 6s ease-in-out infinite',
}
```

**Règle importante LCP :** Ne JAMAIS mettre `animate-scale-in` ou une animation commençant à `opacity:0` sur l'image hero principale — cela tue le LCP Lighthouse. L'image hero doit être rendue immédiatement visible.

### 3.5 Hook scroll reveal

Toutes les sections sous le fold utilisent `useScrollReveal()` :
```tsx
const { ref, isVisible } = useScrollReveal()
// Sur le container : className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
```

---

## 4. STRUCTURE DES FICHIERS

```
src/
├── App.tsx                    ← Ordre des sections, lazy-load Scoreboard
├── main.tsx                   ← Point d'entrée React StrictMode
├── index.css                  ← Tailwind base + scrollbar + body style
├── components/
│   ├── HeroDuel.tsx           ← Section hero split-screen
│   ├── Scoreboard.tsx         ← Jauges SVG + graphiques Recharts (LAZY)
│   ├── KeyFigures.tsx         ← Grille chiffres clés
│   ├── SpendingRound.tsx      ← Liste des dépenses
│   ├── RevenueRound.tsx       ← Liste des recettes
│   ├── TaxVsRedistribution.tsx← Flux fiscal illustré
│   ├── WealthSharingGrid.tsx  ← Comparatif redistribution
│   ├── GeopoliticsSection.tsx ← Section géopolitique avec images
│   ├── PollSection.tsx        ← Sondage avec modal email
│   ├── FinalVerdict.tsx       ← Tableau verdict + risques
│   ├── MiniSources.tsx        ← Sources + crédits + contact + footer
│   ├── CandidateAvatar.tsx    ← Avatar circulaire avec fallback SVG
│   └── IconMap.tsx            ← Map nom-icône → composant lucide-react
├── data/
│   ├── candidates.ts          ← Définition des 2 candidats (couleurs, scores, images)
│   └── onePage.ts             ← Toutes les données du site (scores, chiffres, etc.)
├── hooks/
│   └── useScrollReveal.ts     ← IntersectionObserver pour animations au scroll
netlify/
└── functions/
    └── vote.js                ← Backend votes (Node.js serverless)
public/
├── images/candidates/
│   ├── [candidat-a]-portrait.webp      ← Avatar candidat A (optimisé 160px)
│   ├── [candidat-b]-portrait.webp      ← Avatar candidat B (optimisé 160px)
│   ├── [candidat-a]_international.webp ← Image section géopolitique A (680px)
│   ├── [candidat-b]_international.webp ← Image section géopolitique B (680px)
│   └── presidentiel2027.webp           ← Image hero duel (800px)
├── favicon.svg
└── site.webmanifest
index.html                     ← Preload image hero, fonts non-bloquantes, SEO
netlify.toml                   ← Build + redirects + headers sécurité + cache
tailwind.config.js
vite.config.ts
```

---

## 5. DATA MODEL — COMMENT REMPLIR LES DONNÉES

### 5.1 `src/data/candidates.ts`

```typescript
export interface Candidate {
  id: 'lfi' | 'rn'        // ← IDs FIXES, ne pas changer (tout le code les référence)
  name: string             // Prénom Nom complet
  party: string            // Sigle court (LFI, RN, RE, REC...)
  fullLabel: string        // Nom complet du parti
  image: string | null     // '/images/candidates/[slug]-portrait.webp'
  imageCredit: string      // Texte crédits photo
  imageSource: string      // Source de l'image
  license: string          // Type de licence
  colorPrimary: string     // Hex — couleur principale du candidat
  colorSecondary: string   // Hex — couleur secondaire
  scores: {
    budgetCredibility: number  // Note /10 pour le round Budget
    wealthSharing: number      // Note /10 pour le round Redistribution
  }
}
```

**IMPORTANT :** Les `id` `'lfi'` et `'rn'` sont hardcodés partout dans le code (Tailwind classes : `bg-lfi-red`, `bg-rn-blue`, etc.). Pour un nouveau duel, garder ces IDs et changer les couleurs dans `tailwind.config.js` :

```js
// Exemple LFI vs Renaissance :
'lfi-red':    '#d42b3a',  // rouge LFI — inchangé
'rn-blue':    '#FF6B35',  // orange/bordeaux Renaissance
'rn-dark':    '#C0392B',  // variante foncée
```

### 5.2 `src/data/onePage.ts` — Interfaces à respecter

**scores[]** — Les "rounds" du scoreboard :
```typescript
{
  id: string              // identifiant unique
  round: string           // Nom du round affiché
  roundNumber: string     // '01', '02', etc.
  lfi: number             // Note /10 candidat gauche
  rn: number              // Note /10 candidat droite
  lfiSummary: string      // Résumé 1-2 phrases
  rnSummary: string       // Résumé 1-2 phrases
  advantage: 'lfi'|'rn'  // Qui gagne ce round
  advantageLabel: string  // 'Avantage LFI', 'Net avantage RN', etc.
  lfiBadge: string        // Badge court : 'Chiffrage structuré'
  rnBadge: string         // Badge court : 'Risque élevé'
}
```

**lfiKeyFigures[] / rnKeyFigures[]** — Chiffres clés :
```typescript
{
  label: string      // Description
  value: string      // Valeur (peut être '≈ −71', '+33', '10–17')
  unit: string       // 'Md€/an', '%', 'emplois', etc.
  note?: string      // Note optionnelle entre parenthèses
  source: string     // Source courte
  positive?: boolean // true = recette/gain, false = dépense/coût
}
```

**lfiSpending[] / rnSpending[]** — Postes de dépenses :
```typescript
{
  iconName: string  // Nom exact d'une icône lucide-react (voir IconMap.tsx)
  label: string     // Nom du poste
  detail: string    // Explication courte
}
```

**lfiRevenue[] / rnRevenue[]** — Sources de recettes :
```typescript
{
  iconName: string      // Icône lucide-react
  label: string         // Libellé
  amount: string        // '+41 Md€/an' ou '−10 à −17 Md€'
  positive: boolean     // true = rentrée d'argent
  contested?: boolean   // true = affiche badge "contesté"
}
```

**verdictItems[]** — Tableau de verdict :
```typescript
{
  category: string          // Thème
  winner: 'lfi'|'rn'|'both'
  label: string             // 'Avantage LFI', 'Match nul', etc.
  detail: string            // Explication 1 ligne
}
```

**lfiRisks[] / rnRisks[]** — Listes de risques : `string[]`

**trueWealthSharing[] / fragileWealthSharing[]** — Listes redistribution : `string[]`

---

## 6. SCHÉMA SUPABASE COMPLET

Créer un nouveau projet Supabase, puis exécuter dans l'éditeur SQL :

```sql
-- Table principale des votes
CREATE TABLE votes (
  id          BIGSERIAL PRIMARY KEY,
  candidate   TEXT NOT NULL CHECK (candidate IN ('lfi', 'rn')),
  ip_hash     TEXT NOT NULL UNIQUE,
  email_hash  TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour accélerer les lookups (déjà créés par UNIQUE mais explicite)
CREATE INDEX IF NOT EXISTS idx_votes_candidate   ON votes(candidate);
CREATE INDEX IF NOT EXISTS idx_votes_ip_hash     ON votes(ip_hash);
CREATE INDEX IF NOT EXISTS idx_votes_email_hash  ON votes(email_hash);

-- RLS : désactiver pour les fonctions serverless (elles utilisent la service key)
-- OU activer et donner accès via la anon key :
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Politique : lecture publique des comptages (pour le GET /api/vote)
CREATE POLICY "allow_select" ON votes FOR SELECT USING (true);

-- Politique : insertion via anon key autorisée (la fonction vote.js utilise anon key)
CREATE POLICY "allow_insert" ON votes FOR INSERT WITH CHECK (true);
```

**Note :** Si les requêtes `GET` retournent 0 malgré des données présentes, vérifier que RLS est bien configuré. En cas de doute, désactiver RLS temporairement pour tester.

---

## 7. `netlify/functions/vote.js` — LOGIQUE COMPLÈTE

### Fonctionnement

```
GET  /api/vote  → retourne { lfi: N, rn: N } (compteurs)
POST /api/vote  → { candidate: 'lfi'|'rn', email: 'user@example.com' }
                → retourne { success: true, lfi: N, rn: N }
                → 409 si ip_hash OU email_hash déjà en base
                → 400 si email invalide ou candidat invalide
```

### Sécurité implémentée
1. **Hash IP** : `SHA256(IP_SALT + 'ip:' + ip)` — jamais stocké en clair
2. **Hash email** : `SHA256(IP_SALT + 'email:' + email.toLowerCase().trim())`
3. **Contrainte UNIQUE** sur `ip_hash` ET `email_hash` dans Supabase
4. **Vérification explicite** avant INSERT (pré-checks pour messages d'erreur clairs)
5. **Whitelist candidats** : Set(['lfi', 'rn'])
6. **Limite taille body** : 512 octets
7. **Validation email** regex serveur
8. **CORS strict** : seulement le domaine de production + localhost dev
9. **Timeout Supabase** : 8 secondes
10. **Cache-Control: no-store** sur toutes les réponses

### Variables d'environnement requises (Netlify → Site settings → Environment variables)

| Variable | Description | Exemple |
|---|---|---|
| `SUPABASE_URL` | URL de ton projet Supabase | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Clé publique anon Supabase | `eyJhbGci...` |
| `IP_SALT` | Secret aléatoire pour hasher les IPs et emails | `k9xmP2vLq8nRt7!dZ` |

**⚠️ `IP_SALT` est critique.** Sans lui, les hashes sont prévisibles. Utiliser une chaîne aléatoire longue (20+ caractères, lettres + chiffres + symboles). Ne jamais la committer dans le code.

---

## 8. `index.html` — POINTS CRITIQUES

### Preload image hero (LCP)
```html
<link rel="preload" as="image" href="/images/candidates/presidentiel2027.webp" 
      type="image/webp" fetchpriority="high" />
```
→ Doit pointer vers l'image hero exacte. Critique pour le score LCP Lighthouse.

### Fonts non-bloquantes (performance)
```html
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?..." />
<link href="https://fonts.googleapis.com/css2?..."
      rel="stylesheet" media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="..." /></noscript>
```
→ Le `media="print"` trick empêche le blocage du rendu par les fonts Google.

### CSP — à adapter pour chaque nouveau projet Supabase
```
connect-src 'self' https://[VOTRE-ID-SUPABASE].supabase.co;
```
→ Remplacer l'ID Supabase dans `netlify.toml` ligne `Content-Security-Policy`.

---

## 9. `netlify.toml` — CONFIGURATION

Copier tel quel. **Seul changement requis :**  
Dans le header `Content-Security-Policy`, remplacer l'URL Supabase :
```
connect-src 'self' https://[NOUVEL-ID-SUPABASE].supabase.co;
```

---

## 10. `vite.config.ts` — CODE SPLITTING

```typescript
manualChunks(id) {
  if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react'
  if (id.includes('node_modules/recharts'))    return 'vendor-recharts'
  if (id.includes('node_modules/lucide-react')) return 'vendor-lucide'
}
```
→ Recharts (~340KB) est dans son propre chunk. Il ne se charge qu'au scroll vers le Scoreboard car le composant est lazy-loadé dans `App.tsx`.

---

## 11. `App.tsx` — ORDRE ET LAZY LOADING

```tsx
import { lazy, Suspense } from 'react'
// Recharts uniquement chargé au scroll
const Scoreboard = lazy(() => import('./components/Scoreboard'))

function App() {
  return (
    <div className="bg-bg-deep text-white min-h-screen font-body overflow-x-hidden">
      <main>
        <HeroDuel />
        <Suspense fallback={<ScoreboardFallback />}>
          <Scoreboard />
        </Suspense>
        {/* ... autres sections ... */}
      </main>
    </div>
  )
}
```

---

## 12. IMAGES — GUIDELINES

### Types d'images et tailles cibles

| Fichier | Usage | Taille max recommandée | Format |
|---|---|---|---|
| `presidentiel2027.webp` | Image hero principale | 800px large, ~40KB | WebP q72 |
| `[candidat]-portrait.webp` | Avatar circulaire (36-64px display) | 160px large, ~5KB | WebP q80 |
| `[candidat]_international.webp` | Section géopolitique | 680px large, ~40KB | WebP q72 |

### Compression avec sharp (inclus dans devDependencies)
```js
// Script de compression — adapter les chemins
const sharp = require('sharp')
await sharp('original.png').resize({ width: 160 }).webp({ quality: 80 }).toFile('portrait.webp')
await sharp('original.png').resize({ width: 800 }).webp({ quality: 72 }).toFile('hero.webp')
```

### Dans le code HTML/React
- **Image hero** : `fetchPriority="high"` + `loading="eager"` + `decoding="sync"`
- **Toutes les autres** : `loading="lazy"` + `decoding="async"`
- Toujours inclure `width` et `height` pour éviter le CLS

---

## 13. PERFORMANCES OBTENUES (référence)

| Métrique | Mobile | Desktop |
|---|---|---|
| Performance | 90 | 99 |
| Accessibilité | 93 | 93 |
| Bonnes pratiques | 100 | 100 |
| SEO | 100 | 100 |
| LCP | ~3.3s | 0.8s |
| TBT | 0ms | 0ms |
| CLS | 0 | 0 |

**Clés de ces scores :**
- Image hero visible immédiatement (pas d'animation opacity:0)
- Recharts lazy-loadé (~344KB évités au chargement initial)
- Fonts Google non-bloquantes (media print trick)
- Images recompressées en WebP (portraits : -97%, hero : -79%)
- `loading="lazy"` sur tous les avatars et images below-fold

---

## 14. SONDAGE — LOGIQUE COMPLÈTE

### État du composant PollSection
```
idle        → affiche boutons "VOTER"
↓ clic VOTER
modal ouverte → saisie email
↓ confirmation
loading     → spinner sur le bouton cliqué
↓ réponse API
voted       → affiche résultats détaillés par candidat
error       → message d'erreur, retour idle après 4s
```

### Double protection anti-doublon
1. **IP hash** : même connexion = même hash = rejeté
2. **Email hash** : même email (normalisé minuscules+trim) = rejeté

### localStorage
Clé `duel2027_vote` stocke `{ candidate: 'lfi'|'rn' }`.  
→ Permet de restaurer l'état "déjà voté" sans requête API au rechargement.  
→ Le hash de l'email n'est JAMAIS stocké côté client.

### Résultats en direct
Toujours visibles (avant et après vote) via un bloc dédié sous les cartes.  
Barre de partage LFI/RN avec animation au scroll.

---

## 15. GUIDE CLONE ÉTAPE PAR ÉTAPE

### Étape 1 — Copier le projet
```bash
cp -r Melenchon2027vsLepen2027 NouveauDuel2027
cd NouveauDuel2027
rm -rf .git
git init && git add -A && git commit -m "init: clone from LFI vs RN blueprint"
```

### Étape 2 — Nouveau projet Supabase
1. Aller sur supabase.com → New project
2. Exécuter le SQL de la section 6 (schéma complet)
3. Récupérer : `Project URL` et `anon public key`

### Étape 3 — Nouveau projet Netlify
1. Netlify → Add new site → Deploy manually (ou connecter GitHub)
2. Site settings → Environment variables → Ajouter :
   - `SUPABASE_URL` = URL du nouveau projet
   - `SUPABASE_ANON_KEY` = clé anon du nouveau projet
   - `IP_SALT` = nouvelle chaîne aléatoire secrète (DIFFÉRENTE de l'autre duel)
3. Récupérer le domaine Netlify (ex: `mon-nouveau-duel.netlify.app`)

### Étape 4 — Adapter les couleurs des partis
Dans `tailwind.config.js`, remapper `rn-blue` et `rn-dark` aux couleurs du 2e candidat :
```js
// Exemple LFI vs Renaissance (RE)
'rn-blue': '#FF6B35',   // couleur principale Renaissance
'rn-dark': '#C0392B',   // variante foncée
```

### Étape 5 — Préparer les images
1. Rassembler les images : portrait A, portrait B, image géopolitique A, image géopolitique B, image hero
2. Compresser avec sharp (voir section 12)
3. Placer dans `public/images/candidates/`
4. Mettre à jour les chemins dans `src/data/candidates.ts`

### Étape 6 — Adapter les données
Modifier `src/data/candidates.ts` :
- Noms, partis, couleurs, images, scores initiaux

Modifier `src/data/onePage.ts` :
- Rounds de scores (intitulés + notes + résumés)
- Chiffres clés des deux candidats
- Dépenses, recettes, redistribution, verdict, risques, sources

### Étape 7 — Mettre à jour index.html
- `<title>` et toutes les meta (description, og:title, og:image, JSON-LD...)
- `<link rel="canonical">` → nouveau domaine Netlify
- og:image → URL de la nouvelle image hero
- `<link rel="preload">` → chemin de la nouvelle image hero

### Étape 8 — Mettre à jour netlify.toml
- `Content-Security-Policy` → remplacer l'ID Supabase
- Optionnel : adapter les domaines dans CORS de vote.js

### Étape 9 — Mettre à jour vote.js
Ligne `SITE_ORIGIN` :
```js
const SITE_ORIGIN = process.env.SITE_URL || 'https://mon-nouveau-duel.netlify.app'
```

### Étape 10 — Build et déploiement
```bash
npm install
npm run build          # vérifier 0 erreur TypeScript
netlify deploy --prod --dir=dist
```

### Étape 11 — Vérifier les performances
Tester sur PageSpeed Insights après déploiement :
- Score mobile > 85, desktop > 95
- LCP identifié (pas "NO_LCP")
- TBT = 0ms
- CLS = 0

---

## 16. CHECKLIST AVANT MISE EN LIGNE

- [ ] `IP_SALT` configuré dans Netlify (valeur secrète unique)
- [ ] `SUPABASE_URL` et `SUPABASE_ANON_KEY` corrects
- [ ] Schéma Supabase créé (table `votes` avec colonnes `ip_hash` UNIQUE, `email_hash` UNIQUE)
- [ ] Image hero preloadée dans `index.html` avec bon chemin
- [ ] `<link rel="canonical">` pointe vers le bon domaine
- [ ] CSP dans `netlify.toml` contient le bon ID Supabase
- [ ] `SITE_ORIGIN` dans `vote.js` correspond au domaine de production
- [ ] Toutes les images compressées en WebP (voir tailles section 12)
- [ ] Test manuel du vote : soumission, email déjà utilisé (409), IP déjà utilisée (409)
- [ ] PageSpeed Insights > 85 mobile / > 95 desktop
- [ ] Email de contact mis à jour dans `MiniSources.tsx`

---

## 17. FICHIERS À NE PAS MODIFIER (logique centrale)

Ces fichiers contiennent de la logique solide qui ne doit pas être réécrite :
- `useScrollReveal.ts` — hook d'animation scroll (parfait tel quel)
- `CandidateAvatar.tsx` — avatar avec fallback SVG (robuste)
- `netlify/functions/vote.js` — sécurité vote (éprouvée)
- `vite.config.ts` — code splitting optimisé
- `netlify.toml` — headers sécurité (ne changer que la CSP Supabase)

---

## 18. PIÈGES À ÉVITER

1. **Ne pas animer l'image hero avec opacity:0** → détruit le score LCP
2. **Ne pas oublier IP_SALT** → votes hackables par rainbow table sur les IPs
3. **Ne pas importer Recharts directement dans App.tsx** → 344KB bloquent le chargement
4. **Ne pas changer les IDs `'lfi'` et `'rn'`** → ils sont hardcodés dans les classes Tailwind CSS
5. **Ne pas utiliser `decoding="async"` sur l'image hero** → retarde le LCP
6. **Toujours inclure width/height sur les `<img>`** → prévient le CLS
7. **Vérifier RLS Supabase** si le GET retourne des compteurs à 0 malgré des votes enregistrés
