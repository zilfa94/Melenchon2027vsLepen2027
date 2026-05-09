export interface Candidate {
  id: 'lfi' | 'rn'
  name: string
  party: string
  fullLabel: string
  image: string | null
  imageCredit: string
  imageSource: string
  license: string
  colorPrimary: string
  colorSecondary: string
  scores: { budgetCredibility: number; wealthSharing: number }
}

export const candidates: Candidate[] = [
  {
    id: 'lfi',
    name: 'Jean-Luc Mélenchon',
    party: 'LFI',
    fullLabel: 'La France Insoumise',
    // Placer le fichier dans : public/images/candidates/melenchon-portrait.jpg
    image: '/images/candidates/melenchon-portrait.webp',
    imageCredit: 'Portrait officiel LFI — fourni par l\'utilisateur',
    imageSource: 'La France Insoumise',
    license: 'Usage éditorial non commercial — droits à vérifier',
    colorPrimary: '#d42b3a',
    colorSecondary: '#e85530',
    scores: { budgetCredibility: 7.5, wealthSharing: 8.5 },
  },
  {
    id: 'rn',
    name: 'Marine Le Pen',
    party: 'RN',
    fullLabel: 'Rassemblement National',
    // Placer le fichier dans : public/images/candidates/lepen-portrait.jpg
    image: '/images/candidates/lepen-portrait.webp',
    imageCredit: 'Portrait officiel RN — fourni par l\'utilisateur',
    imageSource: 'Rassemblement National',
    license: 'Usage éditorial non commercial — droits à vérifier',
    colorPrimary: '#4477ee',
    colorSecondary: '#1a3a8b',
    scores: { budgetCredibility: 4, wealthSharing: 3 },
  },
]
