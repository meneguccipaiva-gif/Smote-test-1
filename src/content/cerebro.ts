import { asArray, asString, firstName } from '../engine/answers'
import type { Answers, Profile, QuizDefinition } from '../types'

const frequenciaBase: Record<string, { percentual: number; nivel: string }> = {
  quase_todo_dia: { percentual: 32, nivel: 'Lapsos quase diários' },
  com_frequencia: { percentual: 45, nivel: 'Esquecimentos frequentes' },
  as_vezes: { percentual: 58, nivel: 'Lapsos em tarefas simples' },
  raramente: { percentual: 74, nivel: 'Esquecimentos eventuais' },
}

const lapsoLinha: Record<string, string> = {
  objetos: 'Esquecer onde guardou a chave, os óculos ou o celular.',
  branco: 'Dar um branco no meio da frase ou no nome de alguém conhecido.',
  comodo: 'Entrar num cômodo e esquecer o que ia fazer.',
  remedios: 'Esquecer o remédio no horário ou perder um compromisso.',
}

const focoPorMedo: Record<string, string> = {
  piorar: 'O plano é um treino diário para manter a memória em uso e a mente clara.',
  depender: 'O foco é lembrar compromissos no seu ritmo, sem depender dos filhos.',
  vergonha: 'O treino fortalece nomes, palavras e a segurança na conversa.',
  lenta: 'Quinze minutos por dia para a mente responder com mais agilidade.',
}

const focoCurto: Record<string, string> = {
  piorar: 'Clareza e memória em uso',
  depender: 'Compromissos sem depender dos filhos',
  vergonha: 'Nomes e palavras na conversa',
  lenta: 'Resposta mais ágil no dia a dia',
}

const depoisPorMedo: Record<string, string> = {
  piorar: 'A tranquilidade de estar exercitando a mente todos os dias, com método.',
  depender: 'Lembrar compromissos do dia sem precisar que alguém avise.',
  vergonha: 'Mais firmeza na hora de puxar um nome ou terminar uma frase.',
  lenta: 'Sensação de mente desperta, com respostas mais rápidas no dia a dia.',
}

function buildProfile(answers: Answers): Profile {
  const nome = firstName(answers)
  const freq = asString(answers, 'frequencia')
  const base = frequenciaBase[freq] ?? { percentual: 45, nivel: 'Lapsos a observar' }
  const habitos = asArray(answers, 'habitos')
  const percentual = habitos.includes('nenhuma') ? Math.max(24, base.percentual - 6) : base.percentual
  const medo = asString(answers, 'medo')
  const lapsos = asArray(answers, 'lapsos')
  const foco = focoPorMedo[medo] ?? 'Quinze minutos por dia de treino simples, direto no WhatsApp.'

  const antes = lapsos.map((item) => lapsoLinha[item]).filter(Boolean)
  if (antes.length === 0) antes.push('Pequenos esquecimentos que já incomodam no dia a dia.')

  const depois = [
    'Uma rotina curta, de 15 minutos, fácil de cumprir.',
    'Exercícios ilustrados e áudios para fazer no seu horário.',
    depoisPorMedo[medo] ?? 'Mais clareza para nomes, tarefas e compromissos do dia.',
  ]

  const ritmo = asString(answers, 'ritmo')
  const ritmoLinha: Record<string, string> = {
    calma: 'Seu dia ainda tem folga. O treino de 15 minutos entra nesse espaço, sem pressa.',
    confusa: 'Quando o dia aperta, o plano usa exercícios curtos para a mente não embaralhar.',
    travo: 'O treino começa pequeno, para o dia cheio não travar a memória.',
  }

  return {
    primeiro_nome: nome,
    percentual,
    nivel: base.nivel,
    desafio: lapsos.length > 1 ? 'Vários tipos de lapso no mesmo dia' : 'Lapsos pontuais, pedindo treino dirigido',
    foco,
    leitura: `A sua percepção hoje é de ${base.nivel.toLowerCase()}. ${foco}`,
    linhaOferta: ritmoLinha[ritmo] ?? foco,
    antes: antes.slice(0, 3),
    depois,
    card: [
      { label: 'Percepção cognitiva', value: base.nivel },
      { label: 'Foco do desafio', value: focoCurto[medo] ?? 'Treino de 15 minutos' },
      { label: 'Tempo necessário', value: '15 minutos por dia' },
      { label: 'Canal de entrega', value: 'Exercícios ilustrados e áudios direto no WhatsApp' },
    ],
    loaderLines: [
      'Processando suas respostas...',
      'Selecionando os exercícios para os seus tipos de lapsos...',
      'Montando as pílulas em áudio para o seu WhatsApp...',
      'Plano Cérebro Ativo de 21 dias gerado!',
    ],
  }
}

export const cerebro: QuizDefinition = {
  id: 'cerebro',
  path: 'cerebro',
  name: 'Programa Cérebro Ativo e Treino de Memória',
  promise: 'Quinze minutos por dia para manter a memória afiada e a mente clara.',
  buildProfile,
  screens: [
    {
      type: 'single',
      id: 'faixa_etaria',
      title: 'Avaliação de Vitalidade Cognitiva e Memória 60+',
      subtitle: 'Selecione a sua faixa de idade para calibrarmos os exercícios do seu perfil.',
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
      id: 'frequencia',
      title: 'Com que frequência você sente que a memória falha no dia a dia?',
      subtitle: 'Seja honesto. Isso define o ritmo do treino.',
      options: [
        { value: 'raramente', label: 'Raramente. São apenas pequenos esquecimentos eventuais.' },
        { value: 'as_vezes', label: 'Às vezes. Me atrapalha em algumas tarefas simples.' },
        { value: 'com_frequencia', label: 'Com frequência. Me sinto esquecido mais do que gostaria.' },
        { value: 'quase_todo_dia', label: 'Quase todos os dias fico na dúvida sobre compromissos ou tarefas.' },
      ],
    },
    {
      type: 'interstitial',
      id: 'prova_social',
      icon: 'brain',
      title: 'Mais de 3.100 alunos 60+ no treino',
      image: '/cerebro/social.jpg',
      paragraphs: [
        'Eles recuperaram agilidade mental com 15 minutos diários de treino no WhatsApp.',
        'Esquecer coisas não é uma sentença da idade. O cérebro responde a exercício em qualquer fase da vida.',
      ],
    },
    {
      type: 'multi',
      id: 'lapsos',
      title: 'Quais desses episódios acontecem com você?',
      subtitle: 'Pode selecionar mais de uma opção.',
      options: [
        { value: 'objetos', label: 'Esquecer onde guardou a chave, os óculos ou o celular.' },
        { value: 'branco', label: 'Dar um branco no meio de uma frase ou esquecer o nome de pessoas conhecidas.' },
        { value: 'comodo', label: 'Entrar num cômodo da casa e esquecer o que ia fazer lá.' },
        { value: 'remedios', label: 'Esquecer de tomar remédios na hora certa ou perder compromissos.' },
      ],
    },
    {
      type: 'interstitial',
      id: 'reforco',
      icon: 'lamp',
      title: 'Isso não é perda da memória',
      image: '/cerebro/reforco.jpg',
      paragraphs: [
        'Esses lapsos são comuns depois dos 60 anos. Na maior parte das vezes, faltam estímulos certos no dia a dia.',
      ],
    },
    {
      type: 'single',
      id: 'medo',
      title: 'Qual é o seu maior medo em relação aos lapsos de memória?',
      options: [
        { value: 'piorar', label: 'Medo de que isso piore com o tempo e a mente fique menos clara.' },
        { value: 'depender', label: 'Receio de me tornar dependente de filhos ou parentes no futuro.' },
        { value: 'vergonha', label: 'Vergonha ou frustração ao não lembrar das coisas na frente de outras pessoas.' },
        { value: 'lenta', label: 'Sensação de que a mente está ficando mais lenta.' },
      ],
    },
    {
      type: 'interstitial',
      id: 'pilula',
      icon: 'spark',
      kicker: 'Você sabia?',
      title: 'O cérebro ainda cria caminho novo',
      image: '/cerebro/pilula.jpg',
      paragraphs: [
        'O cérebro segue capaz de criar conexões novas na terceira idade. Isso se chama neuroplasticidade. Um treino diário de 15 minutos ajuda a manter a mente clara e ágil.',
      ],
    },
    {
      type: 'multi',
      id: 'habitos',
      title: 'O que você costuma fazer hoje para exercitar a cabeça?',
      subtitle: 'Marque as atividades que você faz na semana.',
      options: [
        { value: 'palavras', label: 'Palavras cruzadas, caça-palavras ou sudoku' },
        { value: 'leitura', label: 'Leitura de livros, jornais ou Bíblia' },
        { value: 'jogos', label: 'Jogos de mesa: dominó, cartas ou xadrez' },
        { value: 'caminhada', label: 'Caminhadas ou atividades físicas leves' },
        { value: 'nenhuma', label: 'Não tenho uma rotina específica para exercitar a memória' },
      ],
    },
    {
      type: 'meter',
      id: 'medidor',
      title: 'Sua mente está operando a {percentual}% do potencial de retenção de memória.',
      body: 'Identificamos que o seu cérebro pede estímulos diários e dirigidos para chegar a 100% de clareza e agilidade.',
      cta: 'Ver meu plano personalizado de 21 dias',
    },
    {
      type: 'profile',
      id: 'perfil',
      image: '/cerebro/social.jpg',
      cta: 'Ver o método',
    },
    {
      type: 'method',
      id: 'metodo',
      title: 'Três passos para manter a mente em uso',
      intro: 'Quinze minutos, no WhatsApp, sem aplicativo novo e sem promessa de tratamento.',
      image: '/cerebro/social.jpg',
      steps: [
        { title: 'Notar o lapso', text: 'O treino começa pelo tipo de esquecimento que você marcou, não por um teste genérico.' },
        { title: 'Exercitar 15 minutos', text: 'Um áudio curto e uma folha simples, no horário do café ou de uma tarefa da casa.' },
        { title: 'Marcar o dia', text: 'Você acompanha a rotina num papel, para ver a sequência crescer.' },
      ],
      cta: 'Continuar',
    },
    {
      type: 'name',
      id: 'primeiro_nome',
      title: 'Onde enviamos o seu acesso?',
      subtitle: 'O nome aparece no plano. Os exercícios só chegam neste WhatsApp depois do pagamento.',
      cta: 'Gerar plano Cérebro Ativo',
    },
    {
      type: 'loader',
      id: 'carregando',
      question: {
        id: 'ritmo',
        title: 'Quando o dia fica cheio, como a sua mente reage?',
        options: [
          { value: 'calma', label: 'Ainda consigo organizar as tarefas com calma.' },
          { value: 'confusa', label: 'Embaralho nomes, horários e o que ia fazer.' },
          { value: 'travo', label: 'Travo e deixo para depois, com medo de esquecer algo.' },
        ],
      },
    },
    { type: 'gift', id: 'presente' },
    { type: 'offer', id: 'oferta' },
  ],
  compare: {
    title: 'Seu treino de 21 dias está traçado',
    nowLabel: 'Agora',
    goalLabel: 'Seu objetivo',
    nowValue: '{percentual}%',
    goalValue: '100%',
    nowDetail: '{nivel}',
    goalDetail: 'Quinze minutos por dia de clareza e memória em uso',
    beforeImage: '/cerebro/agora.jpg',
    afterImage: '/cerebro/objetivo.jpg',
  },
  offer: {
    diagnosisTitle: 'Seu Plano de Vitalidade Cognitiva está pronto, {primeiro_nome}!',
    diagnosisSubtitle:
      'Analisamos suas respostas e separamos um mapa simples para afiar o raciocínio e manter a clareza mental no dia a dia.',
    hojeLabel: 'Hoje',
    depoisLabel: 'Em 21 dias, com o Cérebro Ativo',
    highlight: 'Desafio prático de 21 dias e acesso direto no seu WhatsApp',
    offerLead: '15 minutos diários para manter a mente clara e em uso',
    offerCopy:
      'Sem mensalidades, sem aplicativo complicado para baixar e sem senha para memorizar. Por uma taxa única de R$ 37,00, no PIX ou no cartão, você recebe exercícios e pílulas de treino no WhatsApp, no horário que for melhor para você.',
    deliverables: [
      {
        title: 'Guia do Desafio 21 Dias “Cérebro Ativo 60+”',
        text: 'Folhas diárias em PDF, ilustradas, com letra grande. Dá para ler na tela ou imprimir.',
      },
      {
        title: 'Pílulas de áudio no WhatsApp',
        text: 'Áudios curtos, em linguagem simples, para ouvir enquanto toma o café ou faz uma tarefa da casa.',
      },
      {
        title: 'Bônus: Guia de nutrição e hábitos para a mente',
        text: 'Alimentos, chás e hábitos de sono que acompanham o treino de memória.',
      },
      {
        title: 'Rastreador de progresso imprimível',
        text: 'Uma folha fácil para marcar os dias feitos e ver a rotina crescer.',
      },
    ],
    guaranteeTitle: 'Garantia incondicional de 7 dias, mente tranquila',
    guaranteeText:
      'Coloque o método em prática por 7 dias. Se você não sentir a mente mais desperta, se não notar diferença no dia a dia, ou se achar que não é para você, mande uma mensagem no WhatsApp. Devolvemos 100% do valor na hora.',
    rating: '4,9/5,0',
    socialLine: 'Mais de 3.100 alunos 60+ treinam a memória todos os dias, com leveza e clareza.',
    testimonials: [
      {
        name: 'Sônia Maria',
        age: 62,
        text: 'Estava muito esquecida e com medo de que isso piorasse. Com os exercícios de 15 minutos pelo WhatsApp, sinto o raciocínio responder mais rápido.',
      },
      {
        name: 'Geraldo Alves',
        age: 69,
        text: 'Diziam que esquecer as coisas era da idade. O programa me deu uma rotina. Hoje lembro dos meus compromissos sem depender dos meus filhos.',
      },
      {
        name: 'Irene Batista',
        age: 71,
        text: 'Eu entrava na cozinha e esquecia o que ia fazer. Os áudios chegam de manhã no WhatsApp. Em duas semanas parei de anotar a mesma tarefa em três papéis.',
      },
    ],
    cta: 'Pagar R$ 37 e começar meu treino',
    ctaSub: 'O material só é liberado depois da confirmação do pagamento.',
  },
}
