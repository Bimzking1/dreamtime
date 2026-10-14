import ThemeToggle from './ThemeToggle';
export type Theme = 'dark' | 'light';
export default function Header({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
      <a href="/" className="flex items-center gap-2.5 rounded-xl" aria-label="dreamtime home">
        <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" className="fill-accent/20" /><path d="M21 22.5A8.5 8.5 0 0 1 13.5 8a8.5 8.5 0 1 0 10.9 11.6 8.4 8.4 0 0 1-3.4 2.9Z" className="fill-accent" /><circle cx="22" cy="10" r="1.4" className="fill-hi" /></svg>
        <span className="font-heading text-2xl font-semibold tracking-tight">dreamtime</span>
      </a>
      <ThemeToggle theme={theme} onToggle={onToggle} />
    </header>
  );
}
