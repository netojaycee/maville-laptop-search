import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/admin/AppSidebar'

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/onyami/login')

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#080B11]">
        <AppSidebar userEmail={session.user?.email} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top header bar for mobile toggle */}
          <header className="flex h-14 items-center gap-4 border-b border-[#1E2530] bg-[#0F1318] px-4 md:hidden">
            <SidebarTrigger className="text-[#8B97A8] hover:text-white" />
            <div className="font-display text-sm font-bold text-white">
              Maville<span className="text-[#00D4FF]">Technologies</span>
            </div>
          </header>

          {/* Main content viewport */}
          <main className="flex-1 overflow-auto p-4 sm:p-8 text-white">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
