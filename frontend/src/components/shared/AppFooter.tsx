export function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 rounded-full border border-border/40 bg-surface/70 px-6 py-5 text-center text-sm text-muted shadow-soft backdrop-blur-2xl">
      <div className="flex flex-col items-center justify-between gap-3 text-xs uppercase tracking-[0.32em] text-muted md:flex-row">
        <span>© {year} {" "}Assets Platform</span>
        <span className="text-muted">crafted for resilient asset health</span>
      </div>
    </footer>
  );
}
