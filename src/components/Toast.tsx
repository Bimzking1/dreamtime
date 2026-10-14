export default function Toast({ message }: { message: string | null }) {
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center px-4">
      {message && <p className="animate-rise rounded-full bg-elev px-5 py-3 text-sm font-bold text-ink shadow-xl ring-1 ring-accent/40">{message}</p>}
    </div>
  );
}
