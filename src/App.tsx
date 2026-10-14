import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Footer from './components/Footer';
import Header, { type Theme } from './components/Header';
import Hero from './components/Hero';
import ModeSelector from './components/ModeSelector';
import SleepOnsetSlider from './components/SleepOnsetSlider';
import SleepResults from './components/SleepResults';
import ClockPicker from './components/ClockPicker';
import Toast from './components/Toast';
import { calculateSleepTimes, clampBuffer, DEFAULT_BUFFER, parseTime, type CalculatorMode, type CalculatorSettings } from './lib/sleep-calculator';
import { readStorage, writeStorage } from './lib/storage';

const SETTINGS_KEY = 'dreamtime:settings';
const THEME_KEY = 'dreamtime:theme';
const defaults: CalculatorSettings = { mode: null, time: '', fallAsleepMinutes: DEFAULT_BUFFER };

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => (readStorage<string>(THEME_KEY, 'dark') === 'light' ? 'light' : 'dark'));
  const [settings, setSettings] = useState<CalculatorSettings>(() => {
    const s = readStorage<CalculatorSettings>(SETTINGS_KEY, defaults);
    return { mode: s.mode === 'wake' || s.mode === 'sleep' ? s.mode : null, time: typeof s.time === 'string' ? s.time : '', fallAsleepMinutes: clampBuffer(s.fallAsleepMinutes) };
  });
  const [view, setView] = useState<'input' | 'results'>('input');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();

  useEffect(() => { document.documentElement.dataset.theme = theme; writeStorage(THEME_KEY, theme); }, [theme]);
  useEffect(() => { writeStorage(SETTINGS_KEY, settings); }, [settings]);

  const { mode, time, fallAsleepMinutes } = settings;
  const results = useMemo(() => (mode ? calculateSleepTimes(mode, time, fallAsleepMinutes) : []), [mode, time, fallAsleepMinutes]);
  const update = (patch: Partial<CalculatorSettings>) => setSettings((s) => ({ ...s, ...patch }));

  const showToast = useCallback((msg: string) => {
    setToast(msg); window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const copy = useCallback(async (t: string) => {
    try { await navigator.clipboard.writeText(t); showToast(`Copied ${t} ✨`); }
    catch { showToast("Couldn't copy — select the time manually"); }
  }, [showToast]);

  const calculate = () => {
    if (parseTime(time) === null) { setError(time ? 'That time looks invalid — try again.' : 'Pick a time to get started.'); return; }
    setError(null); setView('results');
  };

  return (
    <div className="min-h-screen">
      <Header theme={theme} onToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      <main className="mx-auto max-w-3xl px-5 pb-6">
         {view === 'input' && !mode && <Hero />}
         {view === 'results' && mode ? (
           <SleepResults mode={mode} time={time} buffer={fallAsleepMinutes} results={results} onCopy={copy} onReset={() => setView('input')} />
         ) : mode ? (
           <section className="animate-rise space-y-6 rounded-[28px] border border-line bg-card p-6 sm:p-8 relative" aria-label="Calculator settings">
             <button type="button" onClick={() => { update({ mode: null }); setError(null); }} className="absolute left-4 top-4 h-10 rounded-full border border-line px-4 font-bold text-muted hover:border-accent hover:text-ink">← Back</button>
             <p className="font-heading text-xl text-accent2 pt-10 sm:pt-0 sm:pl-20">Let's do some sleep math.</p>
             <ClockPicker id="time" label={mode === 'wake' ? 'What time do you need to wake up?' : 'What time will you go to bed?'} value={time} error={error} onChange={(v) => { update({ time: v }); setError(null); }} />
             <SleepOnsetSlider value={fallAsleepMinutes} onChange={(v) => update({ fallAsleepMinutes: v })} />
             <div className="flex flex-col gap-3 sm:flex-row">
               <button type="button" onClick={calculate} className="min-h-14 flex-1 rounded-full bg-accent px-8 font-heading text-xl font-semibold text-onaccent shadow-lg shadow-accent/25 hover:-translate-y-0.5 active:scale-95">
                 Ready to meet your {mode === 'wake' ? 'bedtime' : 'wake-up time'}?
               </button>
             </div>
           </section>
         ) : (
           <ModeSelector mode={mode} onSelect={(m: CalculatorMode) => { update({ mode: m }); setError(null); }} />
         )}
      </main>
      <Footer />
      <Toast message={toast} />
    </div>
  );
}
