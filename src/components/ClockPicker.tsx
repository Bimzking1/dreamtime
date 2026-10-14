import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Clock } from 'lucide-react';

interface ClockPickerProps {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  label?: string;
  error?: string | null;
}

function parseHour12(h: number, ampm: 'AM' | 'PM') {
  let hh = h % 12;
  if (ampm === 'PM') hh += 12;
  return hh === 24 ? 0 : hh;
}

export default function ClockPicker({ value, onChange, id = 'time', label, error = null }: ClockPickerProps) {
  const [open, setOpen] = useState(false);
  const [h12, setH12] = useState(12);
  const [m, setM] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('PM');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) return;
    const mval = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
    if (!mval) return;
    let hh = Number(mval[1]);
    const mm = Number(mval[2]);
    const ap = hh >= 12 ? 'PM' : 'AM';
    const hh12v = hh % 12 || 12;
    setH12(hh12v);
    setM(mm);
    setAmpm(ap);
  }, [value]);

  const display = useMemo(() => {
    if (!value) return '—:—';
    return value;
  }, [value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const commit = () => {
    const hh = parseHour12(h12, ampm);
    const v = `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    onChange(v);
    setOpen(false);
  };

  const incH = () => setH12((x) => (x % 12) + 1);
  const decH = () => setH12((x) => (x - 2 + 12) % 12 + 1);
  const incM = () => setM((x) => (x + 5) % 60);
  const decM = () => setM((x) => (x - 5 + 60) % 60);
  const toggleA = () => setAmpm((a) => (a === 'AM' ? 'PM' : 'AM'));

  return (
    <div ref={ref} className="relative">
      {label && (
        <label htmlFor={id} className="mb-2 block font-heading text-lg font-medium">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={error !== null}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => setOpen((o) => !o)}
        className="h-16 w-full rounded-2xl border-2 border-line bg-bg2 px-5 font-heading text-4xl font-semibold text-ink focus:border-accent flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-transform"
      >
        <Clock size={28} className="text-accent animate-pulse" />
        <span className="tracking-widest">{display}</span>
      </button>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-hi">
          {error}
        </p>
      )}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute z-20 mt-3 w-full rounded-3xl border-2 border-line bg-card p-6 shadow-2xl animate-rise"
        >
          <div className="grid grid-cols-3 gap-4 items-center text-center">
            <div className="flex flex-col items-center gap-2">
              <button type="button" onClick={incH} className="h-10 w-10 rounded-full bg-accent/15 text-accent hover:bg-accent hover:text-onaccent">
                <ChevronUpIcon />
              </button>
              <div className="text-5xl font-heading font-bold">{String(h12).padStart(2, '0')}</div>
              <button type="button" onClick={decH} className="h-10 w-10 rounded-full bg-accent/15 text-accent hover:bg-accent hover:text-onaccent">
                <ChevronDownIcon />
              </button>
            </div>
            <div className="text-6xl font-heading text-accent">:</div>
            <div className="flex flex-col items-center gap-2">
              <button type="button" onClick={incM} className="h-10 w-10 rounded-full bg-accent/15 text-accent hover:bg-accent hover:text-onaccent">
                <ChevronUpIcon />
              </button>
              <div className="text-5xl font-heading font-bold">{String(m).padStart(2, '0')}</div>
              <button type="button" onClick={decM} className="h-10 w-10 rounded-full bg-accent/15 text-accent hover:bg-accent hover:text-onaccent">
                <ChevronDownIcon />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button type="button" onClick={toggleA} className="px-6 py-2 rounded-full font-heading text-lg bg-accent/15 text-accent hover:bg-accent hover:text-onaccent">
              {ampm}
            </button>
          </div>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 h-12 rounded-full border border-line font-bold text-muted hover:border-accent hover:text-ink">
              Cancel
            </button>
            <button type="button" onClick={commit} className="flex-1 h-12 rounded-full bg-accent font-heading text-lg font-semibold text-onaccent shadow-lg shadow-accent/25 hover:-translate-y-0.5">
              Set time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronUpIcon() {
  return <ChevronRight size={18} style={{ transform: 'rotate(-90deg)', margin: 'auto' }} />;
}
function ChevronDownIcon() {
  return <ChevronRight size={18} style={{ transform: 'rotate(90deg)', margin: 'auto' }} />;
}
