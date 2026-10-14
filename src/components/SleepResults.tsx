import { RotateCcw } from 'lucide-react';
import { formatTime12, type CalculatorMode, type CycleResult } from '../lib/sleep-calculator';
import SleepResultCard from './SleepResultCard';
interface Props { mode: CalculatorMode; time: string; buffer: number; results: CycleResult[]; onCopy: (t: string) => void; onReset: () => void }
export default function SleepResults({ mode, time, buffer, results, onCopy, onReset }: Props) {
  const wake = mode === 'wake';
  const featured = results.find((r) => r.cycles === 5);
  const rest = results.filter((r) => r !== featured);
  return (
    <section className="animate-rise" aria-labelledby="results-title">
      <button type="button" onClick={onReset} className="mb-4 flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-bold text-onaccent hover:-translate-y-0.5 active:scale-95 md:hidden">
        <RotateCcw size={18} />Calculate again
      </button>
      <h2 id="results-title" className="font-heading text-3xl font-bold sm:text-4xl">{wake ? 'Your bedtime possibilities' : 'Your estimated wake-up times'}</h2>
      <p className="mt-2 text-muted">{wake ? `To wake up at ${formatTime12(time)}` : `If you head to bed at ${formatTime12(time)}`}, allowing about {buffer} minutes to fall asleep.</p>
      {results.length === 0 ? <p className="mt-6 rounded-2xl border border-line bg-card p-6">Nothing to show yet — pick a time first.</p> : (
        <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3">
          {featured && <div className="md:col-span-3"><SleepResultCard result={featured} featured onCopy={onCopy} /></div>}
          {rest.map((r) => <SleepResultCard key={r.cycles} result={r} onCopy={onCopy} />)}
        </div>
      )}
      <p className="mt-6 rounded-2xl bg-bg2 p-4 text-sm text-muted">These are estimates. Most adults do well with 7–9 hours, and individual needs vary — shorter options mean less sleep, not an equal alternative.</p>
      <button type="button" onClick={onReset} className="mt-6 hidden min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-bold text-onaccent hover:-translate-y-0.5 active:scale-95 md:flex">
        <RotateCcw size={18} />Calculate again
      </button>
    </section>
  );
}
