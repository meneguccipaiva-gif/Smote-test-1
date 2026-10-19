type Props = {
  text: string
  emphasis?: string
}

export function Title({ text, emphasis }: Props) {
  if (!emphasis) return <h1>{text}</h1>
  const index = text.indexOf(emphasis)
  if (index < 0) return <h1>{text}</h1>
  return (
    <h1>
      {text.slice(0, index)}
      <span className="emphasis">{emphasis}</span>
      {text.slice(index + emphasis.length)}
    </h1>
  )
}
