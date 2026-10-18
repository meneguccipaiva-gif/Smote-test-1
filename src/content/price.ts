export const PRICE = {
  from: 147,
  to: 37,
  percent: 75,
  save: 110,
}

export function brl(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
