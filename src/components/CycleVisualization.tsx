import { CYCLE_COUNTS } from '../lib/sleep-calculator';
export default function CycleVisualization({ cycles }: { cycles: number }) {
  const max = Math.max(...CYCLE_COUNTS);
  return (
    <div className="flex gap-1.5" role="img" aria-label={`${cycles} of ${max} cycles`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-2.5 flex-1 rounded-full ${i < cycles ? (cycles >= 5 ? 'bg-accent' : 'bg-accent2/70') : 'bg-line'}`} />
      ))}
    </div>
  );
}
