'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Laptop,
  PlusCircle,
  BarChart3,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { SignOutButton } from '@/components/admin/SignOutButton'

interface AppSidebarProps {
  userEmail?: string | null
}

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const pathname = usePathname()

  const navLinks = [
    { href: '/onyami', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/onyami/inventory', label: 'Inventory', icon: Laptop },
    { href: '/onyami/inventory/new', label: 'Add Laptop', icon: PlusCircle },
    { href: '/onyami/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <Sidebar className="border-r border-[#1E2530] bg-[#0F1318]" collapsible="icon">
      <SidebarHeader className="p-5 border-b border-[#1E2530]">
        <Link href="/onyami" className="flex items-center gap-2 font-display text-lg font-bold text-white group-data-[collapsible=icon]:hidden">
          Maville<span className="text-[#00D4FF]">Technologies</span>
          <span className="ml-1 text-[10px] font-normal text-[#8B97A8]">Admin</span>
        </Link>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center font-bold text-[#00D4FF] text-xl">
          M
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-1">
        <SidebarMenu>
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = pathname === link.href

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  isActive={active}
                  tooltip={link.label}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-[#161B23] text-[#00D4FF] font-semibold'
                      : 'text-[#8B97A8] hover:bg-[#161B23] hover:text-white'
                  }`}
                  render={<Link href={link.href} />}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#1E2530] p-4 space-y-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        <p className="truncate text-xs text-[#8B97A8] group-data-[collapsible=icon]:hidden">{userEmail}</p>
        <div className="w-full group-data-[collapsible=icon]:hidden">
          <SignOutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
