import { BUFFER_STEP, MAX_BUFFER, MIN_BUFFER } from '../lib/sleep-calculator';
export default function SleepOnsetSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label htmlFor="onset" className="mb-2 flex items-baseline justify-between gap-3 font-heading text-lg font-medium">
        <span>How long do you usually take to drift off?</span><span className="text-accent2">{value} min</span>
      </label>
      <input id="onset" type="range" min={MIN_BUFFER} max={MAX_BUFFER} step={BUFFER_STEP} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-8 w-full cursor-pointer" />
      <div className="flex justify-between text-xs text-muted" aria-hidden="true"><span>{MIN_BUFFER} min</span><span>{MAX_BUFFER} min</span></div>
    </div>
  );
}
