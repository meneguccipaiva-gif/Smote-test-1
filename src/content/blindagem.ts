import { asArray, asString, firstName } from '../engine/answers'
import type { Answers, Profile, QuizDefinition } from '../types'

const aparelhoCurto: Record<string, string> = {
  android: 'Android',
  iphone: 'iPhone',
  incerto: 'que você usa hoje',
}

const aparelhoCard: Record<string, string> = {
  android: 'Android (Samsung, Motorola, Xiaomi)',
  iphone: 'iPhone (Apple)',
  incerto: 'Ainda sem certeza do modelo',
}

function nivelPorHabilidades(total: number) {
  if (total >= 7) return { percentual: 78, nivel: 'Busca por praticidade' }
  if (total >= 5) return { percentual: 63, nivel: 'Autonomia parcial' }
  if (total >= 3) return { percentual: 46, nivel: 'Intermediário' }
  return { percentual: 28, nivel: 'Iniciante' }
}

function buildProfile(answers: Answers): Profile {
  const nome = firstName(answers)
  const habilidades = asArray(answers, 'habilidades')
  const { percentual, nivel } = nivelPorHabilidades(habilidades.length)
  const friccao = asString(answers, 'friccao')
  const golpes = asString(answers, 'golpes')
  const objetivos = asArray(answers, 'objetivos')
  const aparelho = aparelhoCurto[asString(answers, 'sistema_celular')] ?? 'que você usa hoje'

  let desafio = 'Ganhar segurança para resolver o celular sem depender de ninguém'
  let foco = 'O plano segue o seu ritmo, com letra grande e o próximo botão sempre à vista.'

  if (friccao === 'sem_paciencia') {
    desafio = 'Parar de ouvir que já explicaram mil vezes'
    foco = 'Você não vai precisar ouvir de novo que já te explicaram mil vezes.'
  } else if (golpes === 'inseguro' || golpes === 'amigos') {
    desafio = 'Medo de golpes no WhatsApp e nas ligações de banco'
    foco = 'O plano começa pelo que olhar antes de clicar ou atender.'
  } else if (friccao === 'inseguro_banco' || golpes === 'duvida') {
    desafio = 'Insegurança para usar o banco e o PIX'
    foco = 'PIX e aplicativo do banco entram no passo a passo, sem pressa.'
  } else if (friccao === 'nao_pedir') {
    desafio = 'Receio de incomodar filhos e netos'
    foco = 'Dá para resolver a dúvida sozinho, sem esperar a visita de ninguém.'
  } else if (friccao === 'medo_sozinho') {
    desafio = 'Medo de apertar algo errado e desconfigurar o celular'
    foco = 'Cada aula mostra o botão certo, para você apertar com calma.'
  }

  const antes: string[] = []
  if (friccao === 'sem_paciencia') antes.push('Vergonha de pedir ajuda e ouvir: "já te expliquei isso mil vezes".')
  else if (friccao === 'nao_pedir') antes.push('Preferir ficar travado a incomodar filhos e netos.')
  else if (friccao === 'medo_sozinho') antes.push('Medo de apertar o botão errado e apagar algo importante.')
  else if (friccao === 'inseguro_banco') antes.push('Insegurança na hora de abrir o banco ou fazer um PIX.')
  else antes.push('Dúvida na hora de resolver uma tarefa simples no celular.')

  if (golpes === 'inseguro' || golpes === 'amigos') antes.push('Receio de clicar em links e cair em golpe no WhatsApp.')
  else if (golpes === 'duvida') antes.push('Dúvida para saber se a mensagem do banco é verdadeira.')
  else antes.push('Vontade de usar o celular com mais tranquilidade.')

  if (objetivos.includes('mensagens')) antes.push('Travar na hora do áudio, da foto ou da chamada de vídeo.')
  else if (objetivos.includes('limpeza')) antes.push('Celular lento, cheio de arquivo, sem saber o que apagar.')
  else if (objetivos.includes('autonomia')) antes.push('Dependência de alguém para uma dúvida simples.')
  else if (objetivos.includes('pix')) antes.push('Insegurança para fazer um PIX sozinho.')
  else antes.push('Passos do WhatsApp que somem na hora de usar.')

  const depois = [
    'Domínio das funções do dia a dia: PIX, fotos, áudios e chamadas de vídeo.',
    'Saber em quem confiar e no que não clicar.',
    friccao === 'sem_paciencia'
      ? 'Resolver no seu tempo, sem ouvir que já te explicaram mil vezes.'
      : 'Resolver tudo no seu tempo, sem depender de ninguém.',
  ]

  const clima = asString(answers, 'clima')
  const climaLinha: Record<string, string> = {
    tranquilo: 'Você já abre algumas mensagens com calma. O plano mostra o que conferir antes de responder.',
    inseguro: 'O plano começa na mensagem de banco: o que olhar antes de tocar em qualquer link.',
    evito: 'Dá para voltar a abrir a mensagem no seu tempo, sem deixar o medo decidir.',
  }

  return {
    primeiro_nome: nome,
    percentual,
    nivel,
    desafio,
    foco,
    leitura: `Neste momento, o seu celular está no nível ${nivel.toLowerCase()}. ${desafio}. Isso é comum quando o passo a passo ainda não está claro.`,
    linhaOferta: climaLinha[clima] ?? foco,
    antes: antes.slice(0, 3),
    depois,
    card: [
      { label: 'Nível', value: nivel },
      { label: 'Principal desafio', value: desafio },
      { label: 'Aparelho', value: aparelhoCard[asString(answers, 'sistema_celular')] ?? 'Seu celular' },
      { label: 'Formato ideal', value: 'Letras grandes, vídeos curtos e direto no WhatsApp' },
    ],
    loaderLines: [
      'Analisando suas respostas...',
      `Separando o guia de segurança para o celular ${aparelho}...`,
      'Montando o manual de blindagem contra golpes do PIX e WhatsApp...',
      'Plano de Autonomia concluído!',
    ],
  }
}

export const blindagem: QuizDefinition = {
  id: 'blindagem',
  path: 'blindagem',
  name: 'Manual de Blindagem e Autonomia Digital',
  promise: 'Usar o celular com segurança, sem pedir ajuda e sem medo de golpe.',
  buildProfile,
  screens: [
    {
      type: 'single',
      id: 'faixa_etaria',
      title: 'Diagnóstico de Segurança e Autonomia Digital 60+',
      subtitle: 'Selecione a sua faixa de idade para adaptarmos a explicação do seu plano.',
      note: 'Ao continuar, você recebe este diagnóstico no seu ritmo.',
      options: [
        { value: '40-49', label: '40 a 49 anos' },
        { value: '50-59', label: '50 a 59 anos' },
        { value: '60-69', label: '60 a 69 anos' },
        { value: '70+', label: '70 anos ou mais' },
      ],
    },
    {
      type: 'single',
      id: 'sistema_celular',
      title: 'Qual celular você mais utiliza no seu dia a dia?',
      subtitle: 'Isso nos ajuda a separar os tutoriais certos para o seu modelo.',
      layout: 'devices',
      options: [
        { value: 'android', label: 'Android', image: '/phones/android.jpg' },
        { value: 'iphone', label: 'iPhone', image: '/phones/iphone.jpg' },
        { value: 'incerto', label: 'Não sei ao certo', icon: 'help' },
      ],
    },
    {
      type: 'interstitial',
      id: 'prova_social',
      icon: 'users',
      title: 'Junte-se a mais de 2.400 pessoas 60+',
      image: '/blindagem/social.jpg',
      paragraphs: [
        'Elas recuperaram a independência e perderam o medo do celular sem precisar depender de filhos ou netos.',
        'Não existem pessoas “ruins com tecnologia”. Existem explicações complicadas.',
      ],
    },
    {
      type: 'multi',
      id: 'objetivos',
      title: 'Qual é o seu principal objetivo ao mexer no celular hoje?',
      subtitle: 'Pode selecionar mais de uma opção.',
      options: [
        { value: 'pix', label: 'Aprender a fazer PIX e usar o aplicativo do banco com segurança.' },
        { value: 'mensagens', label: 'Mandar áudios, fotos e fazer chamadas de vídeo sem travar.' },
        { value: 'limpeza', label: 'Apagar lixo e fotos antigas para o celular não ficar travando.' },
        { value: 'autonomia', label: 'Resolver dúvidas sem pedir ajuda para netos ou filhos.' },
        { value: 'golpes', label: 'Parar de ter medo de clicar em links e cair em golpes.' },
      ],
    },
    {
      type: 'interstitial',
      id: 'reforco',
      icon: 'shield',
      title: 'Excelente ponto de partida',
      image: '/blindagem/reforco.jpg',
      paragraphs: [
        'Com o método passo a passo, você aprende exatamente o que apertar, no seu tempo e com segurança.',
      ],
    },
    {
      type: 'single',
      id: 'friccao',
      title: 'Quando você precisa de ajuda no celular, o que costuma acontecer?',
      options: [
        { value: 'sem_paciencia', label: 'Peço ajuda aos filhos ou netos, mas eles não têm paciência para explicar.' },
        { value: 'nao_pedir', label: 'Prefiro nem pedir ajuda para não incomodar ou parecer um fardo.' },
        { value: 'medo_sozinho', label: 'Tento mexer sozinho, mas fico com medo de desconfigurar ou apagar algo importante.' },
        { value: 'inseguro_banco', label: 'Consigo mexer em algumas coisas, mas me sinto inseguro no banco e no PIX.' },
      ],
    },
    {
      type: 'interstitial',
      id: 'pilula',
      icon: 'alert',
      kicker: 'Você sabia?',
      title: 'O golpe conta com o susto',
      image: '/blindagem/pilula.jpg',
      paragraphs: [
        'A maioria dos golpes pelo WhatsApp e das chamadas falsas de banco é feita para assustar. Quando você aprende a reconhecer os 3 sinais de um link falso, fica muito mais difícil ser enganado.',
      ],
    },
    {
      type: 'single',
      id: 'golpes',
      title: 'Você já recebeu mensagens suspeitas, ligações de banco ou teve medo de cair em golpe no WhatsApp?',
      options: [
        { value: 'inseguro', label: 'Sim, recebo mensagens estranhas direto e fico muito inseguro.' },
        { value: 'amigos', label: 'Já vi amigos ou parentes caindo e fico com medo de acontecer comigo.' },
        { value: 'duvida', label: 'Não tenho certeza de como identificar se a mensagem é verdadeira ou golpe.' },
        { value: 'seguro', label: 'Não, me sinto bastante seguro.' },
      ],
    },
    {
      type: 'interstitial',
      id: 'empatia',
      icon: 'check',
      title: 'Você não está sozinho',
      image: '/blindagem/empatia.jpg',
      paragraphs: [
        'Milhares de pessoas 60+ sentem a mesma apreensão. O segredo não é ter medo do celular. É ter o conhecimento certo para navegar com tranquilidade.',
      ],
    },
    {
      type: 'multi',
      id: 'habilidades',
      title: 'O que você já consegue fazer sozinho no celular, com certeza?',
      subtitle: 'Marque tudo o que você já sabe fazer sem pedir ajuda.',
      initial: ['ligar'],
      options: [
        { value: 'ligar', label: 'Ligar e atender chamadas normais' },
        { value: 'texto', label: 'Enviar mensagens de texto no WhatsApp' },
        { value: 'audio', label: 'Mandar mensagens de áudio' },
        { value: 'pix', label: 'Fazer PIX no aplicativo do banco' },
        { value: 'apps', label: 'Baixar novos aplicativos' },
        { value: 'video', label: 'Fazer chamadas de vídeo' },
        { value: 'ia', label: 'Usar inteligência artificial' },
      ],
    },
    {
      type: 'meter',
      id: 'medidor',
      title: 'Seu nível atual de autonomia digital é de {percentual}%.',
      body: 'Agora sabemos o roteiro prático para você chegar aos 100% de autonomia e segurança.',
      cta: 'Ver meu diagnóstico completo',
    },
    {
      type: 'profile',
      id: 'perfil',
      image: '/blindagem/social.jpg',
      cta: 'Ver o método',
    },
    {
      type: 'method',
      id: 'metodo',
      title: 'Três passos para usar o celular com calma',
      intro: 'O plano foi organizado para quem quer entender o botão, não decorar termo difícil.',
      image: '/blindagem/social.jpg',
      steps: [
        { title: 'Reconhecer', text: 'Você aprende os sinais de um link falso e de uma ligação que não é do banco.' },
        { title: 'Achar o botão', text: 'Cada aula mostra a tela do seu celular, com letra grande, no ponto certo.' },
        { title: 'Repetir sozinho', text: 'Você pratica no seu tempo, até o PIX e a mensagem saírem sem pedir ajuda.' },
      ],
      cta: 'Continuar',
    },
    {
      type: 'name',
      id: 'primeiro_nome',
      title: 'Onde enviamos o seu acesso?',
      subtitle: 'O nome aparece no diagnóstico. O material só chega neste WhatsApp depois do pagamento.',
      cta: 'Gerar plano de autonomia',
    },
    {
      type: 'loader',
      id: 'carregando',
      question: {
        id: 'clima',
        title: 'Quando chega uma mensagem de banco, o que você costuma fazer?',
        options: [
          { value: 'tranquilo', label: 'Abro e confiro com relativa calma.' },
          { value: 'inseguro', label: 'Fico inseguro e não sei se respondo.' },
          { value: 'evito', label: 'Prefiro não abrir, para não cair em golpe.' },
        ],
      },
    },
    { type: 'gift', id: 'presente' },
    { type: 'offer', id: 'oferta' },
  ],
  compare: {
    title: 'Seu caminho de autonomia está traçado',
    nowLabel: 'Agora',
    goalLabel: 'Seu objetivo',
    nowValue: '{percentual}%',
    goalValue: '100%',
    nowDetail: '{nivel}',
    goalDetail: 'Celular, PIX e WhatsApp sem depender de ninguém',
    beforeImage: '/blindagem/agora.jpg',
    afterImage: '/blindagem/objetivo.jpg',
  },
  offer: {
    diagnosisTitle: 'Seu Diagnóstico de Autonomia Digital está pronto, {primeiro_nome}!',
    diagnosisSubtitle:
      'Com base nas suas respostas, identificamos o que está entre você e um celular usado com paz, independência e segurança.',
    hojeLabel: 'Hoje',
    depoisLabel: 'Em 7 dias, com o Manual de Blindagem',
    highlight: 'Acesso vitalício e atendimento direto no seu WhatsApp',
    offerLead: 'Tudo o que você precisa para dominar o celular sem medo',
    offerCopy:
      'Sem mensalidades, sem cobrança surpresa e sem senha difícil. Você paga uma única vez de R$ 37,00, no PIX ou no cartão, e recebe o material no aplicativo que já usa todos os dias: o WhatsApp.',
    deliverables: [
      {
        title: 'Guia prático ilustrado “Autonomia Digital 60+”',
        text: 'PDF com letras grandes, imagens reais das telas e explicação passo a passo, sem termos difíceis.',
      },
      {
        title: 'Vídeo-aulas curtas',
        text: 'Demonstrações gravadas na tela do celular, para assistir quantas vezes quiser, no seu ritmo.',
      },
      {
        title: 'Bônus: Manual de Proteção Anti-Golpe',
        text: 'O que observar em mensagens falsas no WhatsApp, ligações suspeitas de banco e golpes do PIX.',
      },
      {
        title: 'Suporte pelo WhatsApp',
        text: 'Canal direto para tirar dúvidas do material, sem login, e-mail ou senha.',
      },
    ],
    guaranteeTitle: 'Garantia incondicional de 7 dias, risco zero',
    guaranteeText:
      'Experimente o manual por 7 dias. Se o material não facilitar a sua vida, se você não se sentir mais seguro no celular, ou se simplesmente mudar de ideia, basta mandar uma mensagem no WhatsApp. Devolvemos 100% do seu dinheiro, sem perguntas e sem burocracia.',
    rating: '4,9/5,0',
    socialLine: 'Mais de 2.400 homens e mulheres 60+ já resgataram a independência no celular.',
    testimonials: [
      {
        name: 'Maria Carmo',
        age: 64,
        text: 'Não preciso mais esperar meu filho chegar do trabalho no fim de semana para me ensinar a fazer um PIX. Consegui sozinha na primeira tentativa.',
      },
      {
        name: 'José Roberto',
        age: 68,
        text: 'Estava com medo de usar o aplicativo do banco depois que quase caí num golpe no WhatsApp. O guia me mostrou exatamente o que olhar para não ser enganado.',
      },
      {
        name: 'Conceição Duarte',
        age: 73,
        text: 'Meus netos moram longe e eu tinha vergonha de ligar até para achar uma foto. O manual mostra o botão certo, com letra grande. Fiz minha primeira chamada de vídeo sozinha.',
      },
    ],
    cta: 'Pagar R$ 37 e começar meu plano',
    ctaSub: 'O material só é liberado depois da confirmação do pagamento.',
  },
}
