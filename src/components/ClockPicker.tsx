import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';

interface ClockPickerProps {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  label?: string;
  error?: string | null;
}

const ITEM = 40;
const PAD = 60;
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function parseHour12(h: number, ampm: 'AM' | 'PM') {
  let hh = h % 12;
  if (ampm === 'PM') hh += 12;
  return hh === 24 ? 0 : hh;
}

function Wheel({ items, value, onChange, format }: { items: number[] | string[]; value: number | string; onChange: (v: never) => void; format?: (v: number) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.max(0, (items as (number | string)[]).indexOf(value));
    el.scrollTop = idx * ITEM;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM)));
      onChange(items[idx] as never);
    }, 130);
  };

  return (
    <div className="relative flex-1">
      <div className="pointer-events-none absolute inset-x-1 top-1/2 z-10 h-10 -translate-y-1/2 rounded-xl bg-accent/15" />
      <div ref={ref} onScroll={onScroll} className="relative h-[160px] overflow-y-scroll scroll-smooth snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: PAD, paddingBottom: PAD }}>
        {items.map((it) => {
          const active = it === value;
          return (
            <div key={String(it)} className={`snap-center flex h-10 items-center justify-center font-heading text-3xl font-semibold ${active ? 'text-accent' : 'text-muted/60'}`}>
              {format ? format(it as number) : String(it)}
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-card to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card to-transparent" />
    </div>
  );
}

export default function ClockPicker({ value, onChange, id = 'time', label, error = null }: ClockPickerProps) {
  const [open, setOpen] = useState(false);
  const [h12, setH12] = useState(12);
  const [m, setM] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('PM');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) return;
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
    if (!match) return;
    const hh = Number(match[1]);
    setH12(hh % 12 || 12);
    setM(Number(match[2]));
    setAmpm(hh >= 12 ? 'PM' : 'AM');
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
    onChange(`${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    setOpen(false);
  };

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
        className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border-2 border-line bg-bg2 px-5 font-heading text-4xl font-semibold text-ink transition-transform hover:-translate-y-0.5 focus:border-accent"
      >
        <Clock size={28} className="animate-pulse text-accent" />
        <span className="tracking-widest">{value || '—:—'}</span>
      </button>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-hi">
          {error}
        </p>
      )}
      {open && (
        <div role="dialog" aria-modal="true" className="absolute z-20 mt-3 w-full animate-rise rounded-3xl border-2 border-line bg-card p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <Wheel items={HOURS} value={h12} onChange={setH12 as (v: never) => void} format={(v) => String(v).padStart(2, '0')} />
            <span className="font-heading text-5xl text-accent">:</span>
            <Wheel items={MINUTES} value={m} onChange={setM as (v: never) => void} format={(v) => String(v).padStart(2, '0')} />
            <Wheel items={['AM', 'PM']} value={ampm} onChange={setAmpm as (v: never) => void} />
          </div>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setOpen(false)} className="h-12 flex-1 rounded-full border border-line font-bold text-muted hover:border-accent hover:text-ink">
              Cancel
            </button>
            <button type="button" onClick={commit} className="h-12 flex-1 rounded-full bg-accent font-heading text-lg font-semibold text-onaccent shadow-lg shadow-accent/25 hover:-translate-y-0.5">
              Set time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
