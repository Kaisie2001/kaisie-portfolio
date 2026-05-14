export function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-stone-200/90">
      <div className="mx-auto max-w-4xl px-6 py-3 text-center sm:py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">
          © {new Date().getFullYear()} Cassy
        </p>
      </div>
    </footer>
  );
}
