import { createClient } from '@supabase/supabase-js'

export type LeadPayload = {
  produto: string
  produto_nome: string
  primeiro_nome: string
  whatsapp: string
  respostas: Record<string, string | string[]>
  perfil: {
    percentual: number
    nivel: string
    desafio: string
    foco: string
    antes: string[]
    depois: string[]
    card: { label: string; value: string }[]
  }
  criado_em: string
}

export async function submitLead(payload: LeadPayload): Promise<'sent' | 'local' | 'error'> {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.info('[lista de espera]', payload)
    return 'local'
  }

  const supabase = createClient(url, key)
  const { error } = await supabase.from('leads').insert(payload)
  if (error) {
    console.info('[lista de espera]', payload, error)
    return 'error'
  }
  return 'sent'
}
