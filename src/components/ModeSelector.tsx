import { AlarmClock, BedDouble } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CalculatorMode } from '../lib/sleep-calculator';
interface Option { mode: CalculatorMode; title: string; desc: string; icon: ReactNode }
const options: Option[] = [
  { mode: 'wake', title: 'I want to wake up at', desc: 'Find your ideal time to hit the pillow.', icon: <AlarmClock size={28} /> },
  { mode: 'sleep', title: 'I want to sleep at', desc: 'Find the best estimated times to wake up.', icon: <BedDouble size={28} /> },
];
export default function ModeSelector({ mode, onSelect }: { mode: CalculatorMode | null; onSelect: (m: CalculatorMode) => void }) {
  return (
    <div role="group" aria-label="Choose what to calculate" className="grid gap-4 sm:grid-cols-2">
      {options.map((o) => {
        const active = mode === o.mode;
        return (
          <button key={o.mode} type="button" aria-pressed={active} onClick={() => onSelect(o.mode)}
            className={`group min-h-[150px] rounded-[26px] border-2 p-6 text-left shadow-lg shadow-black/5 hover:-translate-y-1 ${active ? 'border-accent bg-gradient-to-br from-accent/25 to-card' : 'border-line bg-gradient-to-br from-card to-elev hover:border-accent/60'}`}>
            <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${active ? 'bg-accent text-onaccent' : 'bg-accent/15 text-accent'}`}>{o.icon}</span>
            <span className="block font-heading text-2xl font-semibold">{o.title}</span>
            <span className="mt-1 block text-muted">{o.desc}</span>
            <span className={`mt-3 inline-block text-sm font-bold ${active ? 'text-accent2' : 'text-accent'}`}>{active ? '✓ Selected' : 'Tap to choose →'}</span>
          </button>
        );
      })}
    </div>
  );
}
