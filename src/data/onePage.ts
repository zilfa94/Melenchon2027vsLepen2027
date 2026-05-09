export interface KeyFigure {
  label: string
  value: string
  unit: string
  note?: string
  source: string
  positive?: boolean
}

export interface SpendingItem {
  iconName: string
  label: string
  detail: string
}

export interface RevenueItem {
  iconName: string
  label: string
  amount: string
  positive: boolean
  contested?: boolean
}

export interface VerdictItem {
  category: string
  winner: 'lfi' | 'rn' | 'both'
  label: string
  detail: string
}

export interface SourceItem {
  label: string
  detail: string
  url?: string
}

// ——————————————————————————————————————————————
// SCORES
// Notes d'analyse — pas une vérité absolue
// ——————————————————————————————————————————————

export const scores = [
  {
    id: 'budget',
    round: 'Crédibilité budgétaire',
    roundNumber: '01',
    lfi: 7.5,
    rn: 4,
    lfiSummary: 'Chiffrage structuré avec effet multiplicateur intégré : la hausse des salaires stimule la demande et les recettes fiscales — modèle validé par l\'expérience espagnole post-2018',
    rnSummary: 'Chiffrage fragmentaire, déficit estimé élevé (≈ −71 Md€/an selon Institut Montaigne)',
    advantage: 'lfi' as const,
    advantageLabel: 'Avantage LFI',
    lfiBadge: 'Chiffrage structuré',
    rnBadge: 'Risque élevé',
  },
  {
    id: 'redistribution',
    round: 'Partage des richesses',
    roundNumber: '02',
    lfi: 8.5,
    rn: 3,
    lfiSummary: 'Fiscalité progressive, services publics renforcés, hausse des salaires et minima sociaux',
    rnSummary: "Pouvoir d'achat immédiat via baisses de taxes, partage structurel des richesses limité",
    advantage: 'lfi' as const,
    advantageLabel: 'Net avantage LFI',
    lfiBadge: 'Redistribution forte',
    rnBadge: 'Chiffrage plus fragile',
  },
]

// ——————————————————————————————————————————————
// LFI — CHIFFRES CLÉS
// Sources : Contre-budgets LFI, L'Avenir en commun
// ——————————————————————————————————————————————

export const lfiKeyFigures: KeyFigure[] = [
  {
    label: 'Dépenses courantes supplémentaires',
    value: '173',
    unit: 'Md€/an',
    source: 'Contre-budget LFI 2018–2022',
    positive: false,
  },
  {
    label: 'Plan d\'investissement public',
    value: '100',
    unit: 'Md€',
    note: 'Plan d\'investissement écologique et social',
    source: 'Contre-budget LFI 2018–2022, L\'Avenir en commun',
    positive: false,
  },
  {
    label: 'Nouvelles recettes fiscales',
    value: '+33',
    unit: 'Md€',
    source: "L'Avenir en commun",
    positive: true,
  },
  {
    label: 'Recettes sociales supplémentaires',
    value: '+9',
    unit: 'Md€',
    source: "L'Avenir en commun",
    positive: true,
  },
  {
    label: 'Effet de relance estimé',
    value: '+55',
    unit: 'Md€',
    source: 'Chiffrage LFI',
    positive: true,
  },
  {
    label: 'Anti-fraude & évasion fiscale',
    value: '+40',
    unit: 'Md€',
    source: 'Chiffrage LFI',
    positive: true,
  },
  {
    label: 'Récupération CICE / pacte resp.',
    value: '+41',
    unit: 'Md€/an',
    source: 'Programme LFI 2020',
    positive: true,
  },
]

// ——————————————————————————————————————————————
// RN — CHIFFRES CLÉS
// ——————————————————————————————————————————————

export const rnKeyFigures: KeyFigure[] = [
  {
    label: 'TVA énergie — coût estimé',
    value: '10–17',
    unit: 'Md€/an',
    note: 'Coût pour les finances publiques',
    source: 'OFCE, Institut Montaigne',
    positive: false,
  },
  {
    label: 'TVA produits essentiels — coût',
    value: '6–7',
    unit: 'Md€/an',
    source: 'Estimations externes',
    positive: false,
  },
  {
    label: 'Retraites — estimation RN',
    value: '13',
    unit: 'Md€',
    source: 'Programme RN',
    positive: false,
  },
  {
    label: 'Retraites — estimations externes',
    value: '33,6',
    unit: 'Md€',
    note: 'Selon Institut Montaigne',
    source: 'Institut Montaigne',
    positive: false,
  },
  {
    label: 'Mesures en faveur des entrepreneurs',
    value: '−5,35',
    unit: 'Md€',
    source: 'Programme RN 2024',
    positive: false,
  },
  {
    label: 'Taxes rachats d\'actions',
    value: '+8,8',
    unit: 'Md€',
    source: 'Programme RN 2024',
    positive: true,
  },
  {
    label: 'Économies immigration (estimé)',
    value: '+4,1',
    unit: 'Md€',
    source: 'Programme RN 2024',
    positive: true,
  },
  {
    label: 'Contribution UE (contestée)',
    value: '+5',
    unit: 'Md€',
    note: 'Faisabilité juridiquement contestée',
    source: 'Programme RN 2024',
    positive: true,
  },
  {
    label: 'Solde global estimé',
    value: '≈ −71',
    unit: 'Md€/an',
    note: 'Estimation Institut Montaigne',
    source: 'Institut Montaigne, analyse programme 2024',
    positive: false,
  },
]

// ——————————————————————————————————————————————
// DÉPENSES
// ——————————————————————————————————————————————

export const lfiSpending: SpendingItem[] = [
  { iconName: 'GraduationCap', label: 'Éducation', detail: 'Recrutements & revalorisation enseignants' },
  { iconName: 'Heart', label: 'Santé publique', detail: 'Hôpital public, EHPAD, médecine de ville' },
  { iconName: 'Users', label: 'Retraites & Minima', detail: 'SMIC à 1 500 €, retraite minimum garantie' },
  { iconName: 'Leaf', label: 'Écologie', detail: 'Investissement vert massif, bifurcation énergétique' },
  { iconName: 'Home', label: 'Logement', detail: 'Construction sociale, encadrement des loyers' },
  { iconName: 'Zap', label: 'Énergie publique', detail: 'Contrôle des prix, renationalisations' },
]

export const rnSpending: SpendingItem[] = [
  { iconName: 'Zap', label: 'Baisse TVA énergie', detail: '5,5 % sur électricité et gaz' },
  { iconName: 'ShoppingCart', label: 'Baisse TVA essentiels', detail: '0 % sur les produits de base' },
  { iconName: 'Users', label: 'Retraites', detail: 'Retraite à 60 ans sous conditions' },
  { iconName: 'Briefcase', label: 'Allègements entrepreneurs', detail: 'Exonérations et mesures fiscales ciblées' },
  { iconName: 'Shield', label: 'Immigration & sécurité', detail: 'Économies ciblées estimées' },
]

// ——————————————————————————————————————————————
// RECETTES
// ——————————————————————————————————————————————

export const lfiRevenue: RevenueItem[] = [
  { iconName: 'TrendingDown', label: 'Fin des aides entreprises (CICE)', amount: '+41 Md€/an', positive: true },
  { iconName: 'Landmark', label: 'Impôts capital & patrimoine', amount: '+33 Md€', positive: true },
  { iconName: 'Search', label: 'Lutte contre la fraude fiscale', amount: '+40 Md€', positive: true },
  { iconName: 'Users', label: 'Cotisations sociales suppl.', amount: '+9 Md€', positive: true },
  { iconName: 'TrendingUp', label: 'Effet de relance économique', amount: '+55 Md€', positive: true },
]

export const rnRevenue: RevenueItem[] = [
  { iconName: 'BarChart2', label: "Taxes rachats d'actions", amount: '+8,8 Md€', positive: true },
  { iconName: 'Globe', label: 'Réduction contribution UE', amount: '+5 Md€', positive: true, contested: true },
  { iconName: 'UserMinus', label: 'Économies immigration', amount: '+4,1 Md€', positive: true },
  { iconName: 'Zap', label: 'Coût TVA énergie', amount: '−10 à −17 Md€', positive: false },
  { iconName: 'ShoppingCart', label: 'Coût TVA essentiels', amount: '−6 à −7 Md€', positive: false },
]

// ——————————————————————————————————————————————
// PARTAGE DES RICHESSES
// ——————————————————————————————————————————————

export const trueWealthSharing: string[] = [
  'Hausse des salaires et du SMIC',
  'Hausse des pensions de retraite',
  'Hausse des minima sociaux',
  'Impôt progressif sur le revenu',
  'Taxation du capital et des dividendes',
  'Taxation du patrimoine',
  'Services publics renforcés',
  'Limitation des écarts de rémunération',
]

export const fragileWealthSharing: string[] = [
  'Baisse de TVA généralisée (non ciblée sur les plus modestes)',
  "Baisse d'impôts non progressive",
  'Baisse de cotisations non compensée',
  'Cadeaux fiscaux sans contrepartie sociale',
  'Économies dans les services publics',
]

// ——————————————————————————————————————————————
// VERDICT
// ——————————————————————————————————————————————

export const verdictItems: VerdictItem[] = [
  {
    category: 'Budget',
    winner: 'lfi',
    label: 'Avantage LFI',
    detail: 'Chiffrage plus structuré malgré les ambitions',
  },
  {
    category: 'Partage des richesses',
    winner: 'lfi',
    label: 'Net avantage LFI',
    detail: 'Fiscalité progressive et services publics renforcés',
  },
  {
    category: "Pouvoir d'achat immédiat",
    winner: 'both',
    label: 'Les deux promettent',
    detail: 'Logiques très différentes : redistribution vs baisses de taxes',
  },
]

export const lfiRisks: string[] = [
  'Recettes fiscales très ambitieuses (fraude, capital)',
  'Effet de relance incertain à court terme',
  'Faisabilité politique des réformes structurelles',
]

export const rnRisks: string[] = [
  'Baisses de taxes très coûteuses pour les finances publiques',
  'Économies estimées fragiles ou juridiquement contestées',
  'Solde global estimé à ≈ −71 Md€/an (Institut Montaigne)',
]

// ——————————————————————————————————————————————
// SOURCES
// ——————————————————————————————————————————————

export const sources: SourceItem[] = [
  {
    label: "L'Avenir en commun",
    detail: 'Programme de La France Insoumise',
    url: 'https://laec.fr',
  },
  {
    label: 'Contre-budget LFI 2018–2022',
    detail: 'Chiffrage des propositions budgétaires LFI (ancienne version)',
  },
  {
    label: 'Contre-budget LFI 2022',
    detail: 'Mise à jour du chiffrage LFI 2022',
  },
  {
    label: 'Contre-budget RN 2025',
    detail: 'Propositions budgétaires RN',
  },
  {
    label: 'Institut Montaigne',
    detail: 'Analyse et chiffrage des programmes des partis politiques',
    url: 'https://www.institutmontaigne.org',
  },
  {
    label: 'OFCE',
    detail: 'Observatoire Français des Conjonctures Économiques',
    url: 'https://www.ofce.sciences-po.fr',
  },
]
