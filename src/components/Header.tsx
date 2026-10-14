import ThemeToggle from './ThemeToggle';
export type Theme = 'dark' | 'light';
export default function Header({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
      <a href="/" className="flex items-center gap-2.5 rounded-xl" aria-label="dreamtime home">
        <img src="/dreamtime-logo.png" alt="" aria-hidden="true" width="34" height="34" className="rounded-full object-contain" />
        <span className="font-heading text-2xl font-semibold tracking-tight">dreamtime</span>
      </a>
      <ThemeToggle theme={theme} onToggle={onToggle} />
    </header>
  );
}
