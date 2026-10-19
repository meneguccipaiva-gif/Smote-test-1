import { useEffect, useMemo, useState } from 'react'
import { asString } from '../engine/answers'
import { submitLead } from '../engine/leads'
import { quizEventParams, trackQuiz } from '../engine/pixel'
import { PRICE } from '../content/price'
import { resultImage } from '../content/resultImage'
import { loadSession, saveSession } from '../engine/session'
import type { QuizDefinition, SessionState } from '../types'
import { GiftReveal } from './GiftReveal'
import { Interstitial } from './Interstitial'
import { Loader } from './Loader'
import { MethodScreen } from './MethodScreen'
import { MultiChoice } from './MultiChoice'
import { NameCapture } from './NameCapture'
import { OfferPage } from './OfferPage'
import { ProfileCard } from './ProfileCard'
import { ProgressHeader } from './ProgressHeader'
import { ResultMeter } from './ResultMeter'
import { SingleChoice } from './SingleChoice'
import { Waitlist } from './Waitlist'

const questionTypes = new Set(['single', 'multi', 'name'])
const RING_MS = 1400

type Props = {
  quiz: QuizDefinition
}

export function QuizRunner({ quiz }: Props) {
  const [state, setState] = useState<SessionState>(() => loadSession(quiz.id, quiz.screens.length))
  const [ringFor, setRingFor] = useState<string | null>(null)

  useEffect(() => {
    saveSession(quiz.id, state)
  }, [quiz.id, state])

  const screen = quiz.screens[state.step]
  const profile = useMemo(() => quiz.buildProfile(state.answers), [quiz, state.answers])
  const questionTotal = quiz.screens.filter((item) => questionTypes.has(item.type)).length
  const completed = quiz.screens
    .slice(0, state.step)
    .filter((item) => questionTypes.has(item.type)).length
  const progress = questionTotal === 0 ? 0 : Math.round((completed / questionTotal) * 100)
  const showBar =
    !state.waitlist && state.step > 0 && (screen.type === 'single' || screen.type === 'multi')
  const faixa = asString(state.answers, 'faixa_etaria')

  useEffect(() => {
    const params = quizEventParams(quiz, faixa || undefined)
    trackQuiz(quiz.id, 'ViewContent', params)
    if (progress >= 50) trackQuiz(quiz.id, 'QuizMeio', params, { custom: true })
    if (screen.type === 'profile') trackQuiz(quiz.id, 'QuizConcluido', params, { custom: true })
    if (state.giftOpen) trackQuiz(quiz.id, 'PresenteAberto', params, { custom: true })
    if (screen.type === 'offer' && !state.waitlist) trackQuiz(quiz.id, 'OfertaVista', params, { custom: true })
  }, [faixa, progress, quiz, screen.type, state.giftOpen, state.waitlist])

  useEffect(() => {
    if (!ringFor) return
    const timer = window.setTimeout(() => setRingFor(null), RING_MS)
    return () => window.clearTimeout(timer)
  }, [ringFor])

  function goNext() {
    const next = quiz.screens[Math.min(state.step + 1, quiz.screens.length - 1)]
    setRingFor(next?.type === 'meter' ? next.id : null)
    setState((current) => ({
      ...current,
      step: Math.min(current.step + 1, quiz.screens.length - 1),
    }))
  }

  function goBack() {
    setRingFor(null)
    setState((current) => {
      if (current.waitlist) return { ...current, waitlist: false }
      return { ...current, step: Math.max(0, current.step - 1) }
    })
  }

  function setAnswer(id: string, value: string | string[]) {
    setState((current) => ({
      ...current,
      answers: { ...current.answers, [id]: value },
    }))
  }

  async function sendLead(nome: string, whatsapp: string) {
    const result = await submitLead({
      produto: quiz.id,
      produto_nome: quiz.name,
      primeiro_nome: nome,
      whatsapp,
      respostas: { ...state.answers, primeiro_nome: nome },
      perfil: {
        percentual: profile.percentual,
        nivel: profile.nivel,
        desafio: profile.desafio,
        foco: profile.foco,
        antes: profile.antes,
        depois: profile.depois,
        card: profile.card,
      },
      criado_em: new Date().toISOString(),
    })
    if (result === 'error') return false
    trackQuiz(quiz.id, 'Lead', quizEventParams(quiz, asString(state.answers, 'faixa_etaria') || undefined))
    setState((current) => ({
      ...current,
      submitted: true,
      answers: { ...current.answers, primeiro_nome: nome },
    }))
    return true
  }

  return (
    <div className="frame">
      <div className="column">
        <ProgressHeader
          canBack={state.step > 0 || state.waitlist}
          onBack={goBack}
          progress={showBar ? progress : null}
        />
        <div className="stage" key={state.waitlist ? 'lista' : screen.id}>
          {state.waitlist ? (
            <Waitlist
              name={profile.primeiro_nome}
              phone={asString(state.answers, 'whatsapp')}
              submitted={state.submitted}
              onSubmit={sendLead}
            />
          ) : (
            renderScreen()
          )}
        </div>
      </div>
    </div>
  )

  function renderScreen() {
    if (screen.type === 'single') {
      const saved = asString(state.answers, screen.id)
      return (
        <SingleChoice
          title={screen.title}
          emphasis={screen.emphasis}
          subtitle={screen.subtitle}
          note={screen.note}
          options={screen.options}
          value={saved || undefined}
          onSelect={(value) => setAnswer(screen.id, value)}
          onNext={goNext}
        />
      )
    }

    if (screen.type === 'multi') {
      const saved = state.answers[screen.id]
      return (
        <MultiChoice
          title={screen.title}
          emphasis={screen.emphasis}
          subtitle={screen.subtitle}
          layout={screen.layout}
          skipLabel={screen.skipLabel}
          options={screen.options}
          initial={screen.initial}
          value={Array.isArray(saved) ? saved : undefined}
          onContinue={(value) => {
            setAnswer(screen.id, value)
            goNext()
          }}
        />
      )
    }

    if (screen.type === 'interstitial') {
      return (
        <Interstitial
          icon={screen.icon}
          kicker={screen.kicker}
          title={screen.title}
          emphasis={screen.emphasis}
          paragraphs={screen.paragraphs}
          image={screen.image}
          onNext={goNext}
        />
      )
    }

    if (screen.type === 'meter' && ringFor === screen.id) {
      const line = profile.loaderLines[0]?.replace(/\.\.\.$/, '...') ?? 'Analisando as suas respostas...'
      return (
        <section className="screen">
          <div className="screen-body loader-intro">
            <div className="ring" aria-hidden="true" />
            <h1>{line}</h1>
          </div>
        </section>
      )
    }

    if (screen.type === 'meter') {
      return (
        <ResultMeter
          title={screen.title}
          emphasis={screen.emphasis}
          body={screen.body}
          cta={screen.cta}
          image={resultImage(quiz.id, profile.nivel)}
          profile={profile}
          onNext={goNext}
        />
      )
    }

    if (screen.type === 'profile') {
      return (
        <ProfileCard
          image={resultImage(quiz.id, profile.nivel)}
          cta={screen.cta}
          profile={profile}
          onNext={goNext}
        />
      )
    }

    if (screen.type === 'method') {
      return (
        <MethodScreen
          title={screen.title}
          emphasis={screen.emphasis}
          intro={screen.intro}
          image={screen.image}
          steps={screen.steps}
          cta={screen.cta}
          onNext={goNext}
        />
      )
    }

    if (screen.type === 'name') {
      return (
        <NameCapture
          title={screen.title}
          emphasis={screen.emphasis}
          subtitle={screen.subtitle}
          cta={screen.cta}
          name={asString(state.answers, 'primeiro_nome')}
          phone={asString(state.answers, 'whatsapp')}
          onContinue={(nome, whatsapp) => {
            trackQuiz(
              quiz.id,
              'CompleteRegistration',
              quizEventParams(quiz, asString(state.answers, 'faixa_etaria') || undefined),
            )
            setState((current) => ({
              ...current,
              step: Math.min(current.step + 1, quiz.screens.length - 1),
              answers: { ...current.answers, primeiro_nome: nome, whatsapp },
            }))
          }}
        />
      )
    }

    if (screen.type === 'loader') {
      return (
        <Loader
          lines={profile.loaderLines}
          question={screen.question}
          answer={asString(state.answers, screen.question.id)}
          proof={
            quiz.offer.testimonials[0]
              ? {
                  name: `${quiz.offer.testimonials[0].name}, ${quiz.offer.testimonials[0].age} anos`,
                  text: quiz.offer.testimonials[0].text,
                }
              : undefined
          }
          onAnswer={(value) => setAnswer(screen.question.id, value)}
          onDone={goNext}
        />
      )
    }

    if (screen.type === 'gift') {
      return (
        <GiftReveal
          open={state.giftOpen}
          onOpen={() => setState((current) => ({ ...current, giftOpen: true }))}
          onNext={goNext}
        />
      )
    }

    return (
      <OfferPage
        compare={quiz.compare}
        offer={quiz.offer}
        profile={profile}
        answers={state.answers}
        onBuy={() => {
          trackQuiz(quiz.id, 'InitiateCheckout', {
            ...quizEventParams(quiz, faixa || undefined),
            value: PRICE.to,
            currency: 'BRL',
          })
          setState((current) => ({ ...current, waitlist: true }))
        }}
      />
    )
  }
}
