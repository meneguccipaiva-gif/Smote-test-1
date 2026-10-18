export function onlyDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 11)
}

export function maskPhone(value: string) {
  const digits = onlyDigits(value)
  if (digits.length === 0) return ''
  if (digits.length < 3) return `(${digits}`
  if (digits.length < 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length < 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function isValidPhone(value: string) {
  const digits = onlyDigits(value)
  return digits.length === 10 || digits.length === 11
}
