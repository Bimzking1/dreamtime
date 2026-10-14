import { Moon, Sun } from 'lucide-react';
import type { Theme } from './Header';
export default function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button type="button" onClick={onToggle} title={`Switch to ${next} mode`} aria-label={`Switch to ${next} mode`}
      className="flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-semibold hover:-translate-y-0.5 hover:border-accent active:translate-y-0">
      {theme === 'dark' ? <Moon size={18} className="text-accent" /> : <Sun size={18} className="text-accent" />}
      <span className="hidden sm:inline text-muted">{theme === 'dark' ? 'Night' : 'Morning'}</span>
    </button>
  );
}
