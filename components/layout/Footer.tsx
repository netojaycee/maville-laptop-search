import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] py-10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="font-display text-lg font-bold text-[var(--foreground)]">
            Maville<span className="text-[var(--primary)]">Technologies</span>
          </Link>
          <div className="flex gap-6 text-sm text-[var(--muted-foreground)]">
            <Link href="/laptops" className="hover:text-[var(--foreground)] transition-colors">Browse</Link>
            <Link href="/compare" className="hover:text-[var(--foreground)] transition-colors">Compare</Link>
            <Link href="/saved" className="hover:text-[var(--foreground)] transition-colors">Saved</Link>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Built by{' '}
            <a
              href="https://johnedeh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:underline"
            >
              John C. Edeh
            </a>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} Maville Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
