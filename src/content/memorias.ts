import { asArray, asString, firstName } from '../engine/answers'
import type { Answers, Profile, QuizDefinition } from '../types'
import { ageOptions } from './ages'

const problemaLinha: Record<string, string> = {
  pb: 'Fotos em preto e branco que você gostaria de ver coloridas.',
  desbotadas: 'Fotos amareladas, escuras ou desbotadas pelo tempo.',
  manchas: 'Fotos manchadas, rasgadas ou com marcas de dobra.',
  embaçadas: 'Fotos embaçadas, com o rosto sem nitidez.',
}

const problemaCurto: Record<string, string> = {
  pb: 'Colorização',
  desbotadas: 'Cor e brilho',
  manchas: 'Correção de marcas',
  embaçadas: 'Nitidez do rosto',
}

const objetivo: Record<string, string> = {
  pais: 'Homenagem a pais e avós',
  casamento: 'Reviver juventude, casamento e infância',
  filhos: 'Memórias dos filhos e dos momentos em família',
  acervo: 'Preservar o acervo histórico da família',
}

const dificuldade: Record<string, string> = {
  complicado: 'Passo a passo lento, com letras grandes',
  sem_app: 'Sem baixar aplicativo novo',
  passo: 'Mostra exatamente onde apertar',
  rapido: 'O caminho mais curto no WhatsApp',
}

const focoPorQuem: Record<string, string> = {
  pais: 'O guia prioriza a homenagem a pais e avós, para a foto voltar ao grupo da família.',
  casamento: 'O caminho começa pelas fotos de casamento, juventude e infância.',
  filhos: 'O foco são as fotos dos filhos pequenos e dos momentos em família.',
  acervo: 'Você segue um roteiro para organizar e restaurar o acervo inteiro, no seu ritmo.',
}

function buildProfile(answers: Answers): Profile {
  const nome = firstName(answers)
  const quem = asString(answers, 'homenageado')
  const barreira = asString(answers, 'barreira')
  const problemas = asArray(answers, 'problemas')
  const tipos = problemas.map((item) => problemaCurto[item]).filter(Boolean)
  const antes = problemas.map((item) => problemaLinha[item]).filter(Boolean)
  if (antes.length === 0) antes.push('Fotos de família paradas em álbum, caixa ou gaveta.')

  const depois = [
    'Fotos com mais cor, nitidez e detalhe, feitas por você no WhatsApp.',
    'A emoção de enviar a imagem restaurada no grupo da família.',
    quem === 'pais'
      ? 'Homenagear pais e avós com a foto de volta para filhos e netos.'
      : 'Guardar a história da família para filhos e netos.',
  ]

  const peso = asString(answers, 'peso')
  const pesoLinha: Record<string, string> = {
    emocao: 'A primeira foto do guia é a que mais emociona. O passo a passo respeita o seu ritmo.',
    medo: 'O passo a passo começa devagar, para o medo de errar não segurar a foto na gaveta.',
    pressa: 'O caminho mais curto fica no começo do guia, sem etapa extra.',
  }
  const foco = focoPorQuem[quem] ?? 'Um passo a passo para restaurar as fotos no WhatsApp, sem aplicativo novo.'

  return {
    primeiro_nome: nome,
    percentual: 98,
    nivel: dificuldade[barreira] ?? 'Passo a passo simples no WhatsApp',
    desafio: tipos.length > 0 ? tipos.join(', ') : 'Colorização, nitidez e correção de marcas',
    foco,
    leitura: `${foco} O que trava hoje é o estado da foto, não a sua capacidade de aprender o toque certo.`,
    linhaOferta: pesoLinha[peso] ?? foco,
    antes: antes.slice(0, 3),
    depois,
    card: [
      { label: 'Objetivo do resgate', value: objetivo[quem] ?? 'Preservar a história da família' },
      { label: 'Tipo de restauração', value: tipos.length > 0 ? tipos.join(', ') : 'Cor, nitidez e marcas do tempo' },
      { label: 'Dificuldade', value: dificuldade[barreira] ?? 'Feito diretamente pelo WhatsApp' },
      { label: 'Formato', value: 'Guia em PDF e vídeo prático, passo a passo' },
    ],
    loaderLines: [
      'Analisando o perfil do seu acervo de fotos...',
      'Separando o passo a passo de cor e nitidez no WhatsApp...',
      'Preparando o guia prático em letras grandes...',
      'Guia Memórias Vivas gerado!',
    ],
  }
}

export const memorias: QuizDefinition = {
  id: 'memorias',
  path: 'memorias',
  name: 'Memórias Vivas',
  promise: 'Aprender a restaurar fotos antigas da família pelo WhatsApp.',
  buildProfile,
  screens: [
    {
      type: 'single',
      id: 'faixa_etaria',
      title: 'Diagnóstico do Acervo e Memórias de Família',
      subtitle: 'Selecione a sua faixa de idade para adaptarmos as orientações de resgate das fotos.',
      note: 'Ao continuar, você recebe este diagnóstico no seu ritmo.',
      options: ageOptions,
    },
    {
      type: 'single',
      id: 'acervo',
      title: 'Onde estão guardadas as fotos antigas da sua família hoje?',
      subtitle: 'Isso nos ajuda a entender o estado do seu acervo.',
      options: [
        { value: 'albuns', label: 'Guardadas em álbuns de papel antigos.', icon: 'photo' },
        { value: 'caixas', label: 'Guardadas em caixas, gavetas ou envelopes.', icon: 'photo' },
        { value: 'celular', label: 'Algumas já estão no celular, mas ficaram desbotadas ou escuras.', icon: 'phone' },
        { value: 'mistura', label: 'Um pouco de cada.', icon: 'users' },
      ],
    },
    {
      type: 'interstitial',
      id: 'prova_social',
      icon: 'users',
      title: 'Mais de 1.800 famílias já resgataram fotos',
      image: '/memorias/social.jpg',
      paragraphs: [
        'Elas devolveram cor a fotos de casamentos, infância e entes queridos.',
        'A história da sua família merece continuar viva para as próximas gerações.',
      ],
    },
    {
      type: 'multi',
      id: 'problemas',
      title: 'Qual é o maior problema das fotos antigas que você gostaria de recuperar?',
      subtitle: 'Pode selecionar mais de uma opção.',
      options: [
        { value: 'pb', label: 'Fotos em preto e branco que eu gostaria de ver coloridas.' },
        { value: 'desbotadas', label: 'Fotos amareladas, escuras ou desbotadas pelo tempo.' },
        { value: 'manchas', label: 'Fotos manchadas, rasgadas ou com marcas de dobra.' },
        { value: 'embaçadas', label: 'Fotos embaçadas, em que o rosto das pessoas ficou sem nitidez.' },
      ],
    },
    {
      type: 'interstitial',
      id: 'reforco',
      icon: 'spark',
      title: 'Que preciosidade',
      image: '/memorias/reforco.jpg',
      paragraphs: [
        'Mesmo rasgadas ou em preto e branco, essas fotos podem ser trabalhadas num passo a passo do WhatsApp, no seu ritmo, sem baixar aplicativo novo.',
      ],
    },
    {
      type: 'single',
      id: 'homenageado',
      title: 'De quem são as fotos que mais fazem falta na sua vida hoje?',
      options: [
        { value: 'pais', label: 'Dos meus pais ou avós, que já se foram ou estão velhinhos.' },
        { value: 'casamento', label: 'Do meu casamento, da juventude e da infância.' },
        { value: 'filhos', label: 'Dos meus filhos quando eram pequenos e dos momentos em família.' },
        { value: 'acervo', label: 'Quero recuperar todo o acervo histórico da nossa família.' },
      ],
    },
    {
      type: 'interstitial',
      id: 'pilula',
      icon: 'photo',
      kicker: 'Você sabia?',
      title: 'Não precisa de computador',
      image: '/memorias/pilula.jpg',
      paragraphs: [
        'Você não precisa de computador, scanner ou aplicativo caro. Dá para aprender, no próprio WhatsApp, um passo a passo para devolver cor e nitidez a uma foto antiga.',
      ],
    },
    {
      type: 'single',
      id: 'barreira',
      title: 'Quando você pensa em mexer com fotos no celular, o que sente?',
      options: [
        { value: 'complicado', label: 'Acho complicado e tenho medo de não conseguir fazer sozinho.' },
        { value: 'sem_app', label: 'Gostaria de fazer, mas não quero baixar aplicativos novos ou pagos.' },
        { value: 'passo', label: 'Queria um passo a passo bem simples, com letras grandes, mostrando onde apertar.' },
        { value: 'rapido', label: 'Mexo bem, mas quero o jeito mais rápido e prático.' },
      ],
    },
    {
      type: 'meter',
      id: 'medidor',
      title: 'Detectamos que seu acervo familiar possui potencial de restauração de {percentual}%.',
      body: 'Mesmo fotos com mais de 50 anos podem recuperar cor e detalhe com um passo a passo simples.',
      cta: 'Ver meu passo a passo de restauração',
    },
    {
      type: 'profile',
      id: 'perfil',
      image: '/memorias/social.jpg',
      cta: 'Ver o método',
    },
    {
      type: 'method',
      id: 'metodo',
      title: 'Três passos para a foto voltar à família',
      intro: 'Você aprende no WhatsApp. Não há aplicativo novo nem scanner.',
      image: '/memorias/social.jpg',
      steps: [
        { title: 'Escolher a foto', text: 'A primeira é a que mais faz falta: pais, casamento, filhos ou o acervo inteiro.' },
        { title: 'Seguir o toque', text: 'O guia mostra onde apertar, com letra grande, para devolver cor e nitidez.' },
        { title: 'Enviar para a família', text: 'A foto restaurada segue para o grupo, sem perder a história no caminho.' },
      ],
      cta: 'Continuar',
    },
    {
      type: 'name',
      id: 'primeiro_nome',
      title: 'Onde enviamos o seu acesso?',
      subtitle: 'O nome aparece no guia. O passo a passo só chega neste WhatsApp depois do pagamento.',
      cta: 'Gerar guia Memórias Vivas',
    },
    {
      type: 'loader',
      id: 'carregando',
      question: {
        id: 'peso',
        title: 'Quando você pensa em restaurar a primeira foto, o que pesa mais?',
        options: [
          { value: 'emocao', label: 'A emoção de ver de novo quem está na foto.' },
          { value: 'medo', label: 'O medo de errar e estragar a lembrança.' },
          { value: 'pressa', label: 'A pressa de mandar a foto pronta para a família.' },
        ],
      },
    },
    { type: 'gift', id: 'presente' },
    { type: 'offer', id: 'oferta' },
  ],
  compare: {
    title: 'O resgate das suas fotos está traçado',
    nowLabel: 'Agora',
    goalLabel: 'Seu objetivo',
    nowValue: 'Na gaveta',
    goalValue: 'Na família',
    nowDetail: 'Cores apagadas e marcas do tempo',
    goalDetail: 'A mesma foto com cor, nitidez e um lugar no grupo',
    beforeImage: '/memorias/antes.jpg',
    afterImage: '/memorias/depois.jpg',
  },
  offer: {
    diagnosisTitle: 'Seu Guia de Resgate de Memórias Familiares está pronto, {primeiro_nome}!',
    diagnosisSubtitle:
      'Com base no seu perfil, preparamos o caminho para devolver cor, nitidez e presença às fotos mais preciosas da sua história.',
    hojeLabel: 'Hoje',
    depoisLabel: 'Com o método Memórias Vivas',
    highlight: 'Passo a passo no WhatsApp, sem sair de casa',
    offerLead: 'Traga de volta o brilho e as cores da história da sua família',
    offerCopy:
      'Sem mensalidades, sem aplicativo pago e sem precisar entender de tecnologia. Por um valor único de R$ 37,00, no PIX ou no cartão, você aprende a usar a inteligência do próprio WhatsApp para restaurar suas fotos.',
    deliverables: [
      {
        title: 'Guia ilustrado em PDF “Memórias Vivas”',
        text: 'Manual em letras grandes mostrando onde apertar no WhatsApp para trabalhar cor e nitidez.',
      },
      {
        title: 'Vídeo-aula passo a passo',
        text: 'Exemplo gravado na tela do celular, para você acompanhar e repetir com calma.',
      },
      {
        title: 'Bônus: Como criar o álbum digital da família',
        text: 'Um jeito simples de organizar as fotos restauradas e enviar para filhos e netos sem perder qualidade.',
      },
      {
        title: 'Entrega direta no WhatsApp',
        text: 'O conteúdo chega no seu WhatsApp depois da confirmação, sem e-mail e sem senha.',
      },
    ],
    guaranteeTitle: 'Garantia incondicional de 7 dias, lembrança protegida',
    guaranteeText:
      'Adquira o guia e teste com a sua primeira foto antiga. Se você não conseguir seguir o passo a passo, ou se o resultado não te emocionar, mande uma mensagem no WhatsApp. Devolvemos 100% do valor na hora, sem perguntas.',
    rating: '4,9/5,0',
    socialLine: 'Mais de 1.800 famílias já restauraram fotos antigas e reviveram suas melhores lembranças.',
    testimonials: [
      {
        name: 'Helena Souza',
        age: 66,
        text: 'Restaurei a foto do casamento dos meus pais, que já faleceram. Quando coloquei a foto colorida no grupo da família, meus irmãos choraram. Valeu cada centavo.',
      },
      {
        name: 'Lúcia Mendes',
        age: 61,
        text: 'Achei que precisaria pedir para os meus netos fazerem isso. O passo a passo no WhatsApp é tão claro que fiz tudo sozinha, no meu tempo.',
      },
      {
        name: 'Carmem Dutra',
        age: 57,
        text: 'A foto do batizado da minha filha estava amarelada na gaveta. Segui o passo a passo no WhatsApp e mandei no grupo. Meu irmão pediu para fazer a dos nossos pais também.',
      },
    ],
    cta: 'Pagar R$ 37 e começar o resgate',
    ctaSub: 'O material só é liberado depois da confirmação do pagamento.',
  },
}
