import { Copy } from 'lucide-react';
import { dayLabel, formatDuration, formatTime12, type CycleResult } from '../lib/sleep-calculator';
import CycleVisualization from './CycleVisualization';
interface Props { result: CycleResult; featured?: boolean; onCopy: (time: string) => void }
export default function SleepResultCard({ result, featured = false, onCopy }: Props) {
  const time = formatTime12(result.time);
  return (
    <article className={`relative rounded-[26px] border-2 p-6 ${featured ? 'border-accent bg-gradient-to-br from-accent/25 via-card to-card shadow-xl shadow-accent/10' : 'border-line bg-card'}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold">
        {featured && <span className="rounded-full bg-hi px-3 py-1 text-[rgb(39_36_58)]">★ Top pick</span>}
        {result.recommended && <span className="rounded-full bg-accent/20 px-3 py-1 text-accent">Recommended</span>}
        <span className="rounded-full border border-line px-3 py-1 text-muted">{dayLabel(result.dayOffset)}</span>
      </div>
      <p className={`font-heading font-bold leading-none ${featured ? 'text-6xl' : 'text-5xl'}`}>{time}</p>
      <p className="mt-3 font-semibold">{result.cycles} cycles · about {formatDuration(result.durationMinutes)} of sleep</p>
      <p className={`text-sm ${result.recommended ? 'text-accent2' : 'text-muted'}`}>{result.recommended ? 'More sleep time' : 'Shorter sleep opportunity'}</p>
      <div className="my-4"><CycleVisualization cycles={result.cycles} /></div>
      <button type="button" onClick={() => onCopy(time)} aria-label={`Copy ${time}`}
        className="flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-bold hover:border-accent hover:text-accent active:scale-95">
        <Copy size={16} />Copy time
      </button>
    </article>
  );
}
