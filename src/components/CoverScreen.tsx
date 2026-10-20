type Props = {
  promise: string
  cta: string
  video: string
  poster?: string
  onStart: () => void
}

export function CoverScreen({ promise, cta, video, poster, onStart }: Props) {
  return (
    <section className="screen cover-screen">
      <div className="cover-media" aria-hidden="true">
        <video
          className="cover-video"
          src={video}
          poster={poster}
          muted
          autoPlay
          loop
          playsInline
        />
        <div className="cover-shade" />
      </div>
      <div className="screen-body cover-body">
        <h1 className="cover-promise">{promise}</h1>
      </div>
      <div className="dock cover-dock">
        <button type="button" className="btn btn-cover" onClick={onStart}>
          {cta}
        </button>
        <img className="cover-brand" src="/brand/clube-antenados.png" alt="Clube de Antenados" />
      </div>
    </section>
  )
}
