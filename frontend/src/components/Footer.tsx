export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-paper-2)] mt-auto py-8">
      <div className="max-w-[var(--page-width)] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[var(--text-sm)] text-[var(--color-ink-3)]">
        <div>
          &copy; 2026 EnergiKita Inc. All rights reserved.
        </div>
        <div className="flex gap-6 mt-4 md:mt-0 font-medium">
          <a href="#" className="hover:text-[var(--color-ink-2)] transition-colors">Support</a>
          <a href="#" className="hover:text-[var(--color-ink-2)] transition-colors">API Status</a>
          <a href="#" className="hover:text-[var(--color-ink-2)] transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
