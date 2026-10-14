import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Footer from './components/Footer';
import Header, { type Theme } from './components/Header';
import Hero from './components/Hero';
import ModeSelector from './components/ModeSelector';
import SleepOnsetSlider from './components/SleepOnsetSlider';
import SleepResults from './components/SleepResults';
import TimeInput from './components/TimeInput';
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
        {view === 'input' && <Hero />}
        {view === 'results' && mode ? (
          <SleepResults mode={mode} time={time} buffer={fallAsleepMinutes} results={results} onCopy={copy} onReset={() => setView('input')} />
        ) : (
          <>
            <ModeSelector mode={mode} onSelect={(m: CalculatorMode) => { update({ mode: m }); setError(null); }} />
            {mode && (
              <section className="animate-rise mt-6 space-y-6 rounded-[28px] border border-line bg-card p-6 sm:p-8" aria-label="Calculator settings">
                <p className="font-heading text-xl text-accent2">Let's do some sleep math.</p>
                <TimeInput id="time" label={mode === 'wake' ? 'What time do you need to wake up?' : 'What time will you go to bed?'} value={time} error={error} onChange={(v) => { update({ time: v }); setError(null); }} />
                <SleepOnsetSlider value={fallAsleepMinutes} onChange={(v) => update({ fallAsleepMinutes: v })} />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={calculate} className="min-h-14 flex-1 rounded-full bg-accent px-8 font-heading text-xl font-semibold text-onaccent shadow-lg shadow-accent/25 hover:-translate-y-0.5 active:scale-95">
                    Ready to meet your {mode === 'wake' ? 'bedtime' : 'wake-up time'}?
                  </button>
                  <button type="button" onClick={() => { update({ mode: null }); setError(null); }} className="min-h-14 rounded-full border border-line px-6 font-bold text-muted hover:border-accent hover:text-ink">Change mode</button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
      <Toast message={toast} />
    </div>
  );
}
