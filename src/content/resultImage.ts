export function resultImage(quizId: string, nivel: string) {
  if (quizId === 'blindagem') {
    if (nivel === 'Iniciante') return '/perfis/blindagem-inicio.jpg'
    if (nivel === 'Busca por praticidade') return '/perfis/blindagem-pratico.jpg'
    return '/perfis/blindagem-meio.jpg'
  }

  if (quizId === 'cerebro') {
    if (nivel === 'Esquecimentos eventuais') return '/perfis/cerebro-eventual.jpg'
    if (nivel === 'Lapsos em tarefas simples') return '/perfis/cerebro-asvezes.jpg'
    return '/perfis/cerebro-frequente.jpg'
  }

  if (nivel === 'O caminho mais curto no WhatsApp') return '/perfis/memorias-rapido.jpg'
  if (nivel === 'Sem baixar aplicativo novo') return '/perfis/memorias-sem-app.jpg'
  return '/perfis/memorias-lento.jpg'
}
