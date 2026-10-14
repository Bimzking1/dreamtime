interface Props { id: string; label: string; value: string; error: string | null; onChange: (v: string) => void }
export default function TimeInput({ id, label, value, error, onChange }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-heading text-lg font-medium">{label}</label>
      <input id={id} type="time" required value={value} onChange={(e) => onChange(e.target.value)}
        aria-invalid={error !== null} aria-describedby={error ? `${id}-error` : undefined}
        className="h-16 w-full rounded-2xl border-2 border-line bg-bg2 px-5 text-center font-heading text-4xl font-semibold text-ink focus:border-accent" />
      {error && <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-hi">{error}</p>}
    </div>
  );
}
