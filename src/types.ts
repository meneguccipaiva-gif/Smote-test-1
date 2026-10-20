export type IconName =
  | 'shield'
  | 'check'
  | 'phone'
  | 'brain'
  | 'lamp'
  | 'photo'
  | 'gift'
  | 'alert'
  | 'users'
  | 'spark'
  | 'android'
  | 'apple'
  | 'help'
  | 'lock'
  | 'bolt'
  | 'star'

export type Option = {
  value: string
  label: string
  icon?: IconName
  image?: string
}

export type MethodStep = {
  title: string
  text: string
}

export type Screen =
  | {
      type: 'cover'
      id: string
      promise: string
      emphasis?: string
      cta: string
      video: string
      poster?: string
      kicker?: string
      subtitle?: string
      fine?: string
      seals?: { icon: IconName; label: string }[]
    }
  | {
      type: 'single'
      id: string
      title: string
      emphasis?: string
      subtitle?: string
      note?: string
      layout?: 'stack' | 'devices'
      options: Option[]
    }
  | {
      type: 'multi'
      id: string
      title: string
      emphasis?: string
      subtitle?: string
      subtitleMark?: string
      layout?: 'rows' | 'chips' | 'tiles'
      skipLabel?: string
      selectAllLabel?: string
      options: Option[]
      initial?: string[]
    }
  | {
      type: 'interstitial'
      id: string
      icon: IconName
      kicker?: string
      title?: string
      emphasis?: string
      paragraphs: string[]
      image?: string
    }
  | {
      type: 'meter'
      id: string
      title: string
      emphasis?: string
      body: string
      cta: string
      image?: string
    }
  | {
      type: 'profile'
      id: string
      image: string
      cta: string
    }
  | {
      type: 'method'
      id: string
      title: string
      emphasis?: string
      kicker?: string
      intro: string
      image?: string
      steps: MethodStep[]
      cta: string
    }
  | {
      type: 'name'
      id: string
      title: string
      emphasis?: string
      subtitle: string
      cta: string
      fields?: 'name' | 'phone' | 'both'
    }
  | {
      type: 'loader'
      id: string
      question: {
        id: string
        title: string
        options: Option[]
      }
    }
  | {
      type: 'gift'
      id: string
      video?: string
      poster?: string
      productTitle?: string
      productBody?: string
      cta?: string
    }
  | { type: 'offer'; id: string }

export type CompareContent = {
  title: string
  nowLabel: string
  goalLabel: string
  nowValue: string
  goalValue: string
  nowDetail: string
  goalDetail: string
  beforeImage: string
  afterImage: string
}

export type Answers = Record<string, string | string[]>

export type CardRow = {
  label: string
  value: string
  highlight?: boolean
}

export type Testimonial = {
  name: string
  age: number
  text: string
}

export type Deliverable = {
  title: string
  text: string
}

export type OfferContent = {
  diagnosisTitle: string
  diagnosisSubtitle: string
  hojeLabel: string
  depoisLabel: string
  highlight: string
  offerLead: string
  offerCopy: string
  deliverables: Deliverable[]
  guaranteeTitle: string
  guaranteeText: string
  rating: string
  socialLine: string
  testimonials: Testimonial[]
  cta: string
  ctaSub: string
}

export type Profile = {
  primeiro_nome: string
  percentual: number
  nivel: string
  desafio: string
  foco: string
  leitura: string
  linhaOferta: string
  antes: string[]
  depois: string[]
  card: CardRow[]
  loaderLines: string[]
}

export type QuizDefinition = {
  id: string
  path: string
  name: string
  promise: string
  screens: Screen[]
  compare: CompareContent
  offer: OfferContent
  buildProfile: (answers: Answers) => Profile
}

export type SessionState = {
  step: number
  answers: Answers
  waitlist: boolean
  giftOpen: boolean
  submitted: boolean
}
