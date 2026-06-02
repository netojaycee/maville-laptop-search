import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/admin/SignOutButton'

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const navLinks = [
    { href: '/admin', label: '📊 Dashboard' },
    { href: '/admin/inventory', label: '💻 Inventory' },
    { href: '/admin/inventory/new', label: '+ Add Laptop' },
    { href: '/admin/analytics', label: '📈 Analytics' },
  ]

  return (
    <div className="flex min-h-screen bg-[#080B11]">
      {/* Sidebar */}
      <aside className="relative w-56 flex-shrink-0 border-r border-[#1E2530] bg-[#0F1318]">
        <div className="p-5">
          <Link href="/admin" className="font-display text-lg font-bold text-white">
            Maville<span className="text-[#00D4FF]">Technologies</span>
            <span className="ml-2 text-xs font-normal text-[#8B97A8]">Admin</span>
          </Link>
        </div>

        <nav className="mt-2 px-3 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm text-[#8B97A8] transition-colors hover:bg-[#161B23] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 w-56 border-t border-[#1E2530] px-5 pt-4">
          <p className="truncate text-xs text-[#8B97A8]">{session.user?.email}</p>
          <SignOutButton />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
