const stars = [[8, 20, 3], [88, 12, 2], [20, 70, 2], [78, 66, 3], [50, 4, 2], [95, 55, 2]];
export default function Hero() {
  return (
    <section className="relative px-5 pb-8 pt-4 text-center">
      {stars.map(([x, y, s], i) => (
        <span key={i} aria-hidden="true" className="absolute animate-twinkle rounded-full bg-hi" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, opacity: 'calc(var(--star) * .8)', animationDelay: `${i * 0.7}s` }} />
      ))}
      <svg className="mx-auto mb-5 animate-float drop-shadow-[0_0_28px_rgb(var(--glow)/.45)]" width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="A smiling crescent moon">
        <path d="M82 94A44 44 0 0 1 48 16a44 44 0 1 0 58 58 44 44 0 0 1-24 20Z" className="fill-accent" />
        <circle cx="52" cy="62" r="9" className="fill-onaccent/10" /><circle cx="44" cy="82" r="5" className="fill-onaccent/10" />
        <path d="M60 58q4 5 8 0M72 70q4 5 8 0" className="stroke-onaccent/60" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="28" r="3" className="fill-hi" /><circle cx="26" cy="30" r="2" className="fill-accent2" />
      </svg>
      <h1 className="font-heading text-4xl font-bold leading-tight sm:text-6xl">Sleep better.<br /><span className="text-accent">Wake up happier.</span></h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-muted">Find your bedtime or wake-up time with a little help from the moon.</p>
    </section>
  );
}
