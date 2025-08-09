"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Calendar, Users, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = (locale: string) => [
  { title: "Dashboard", url: `/${locale}/dashboard`, icon: LayoutDashboard },
  { title: "Reservations", url: `/${locale}/reservations`, icon: Calendar },
  { title: "Calendar", url: `/${locale}/reservations/calendar`, icon: Calendar },
  { title: "Customers", url: `/${locale}/customers`, icon: Users },
]

export function AppSidebar({ locale = "en" }: { locale?: string }) {
  const pathname = usePathname()
  const list = items(locale)
  return (
    <Sidebar>
      <SidebarHeader className="px-2 py-3">
        <div className="flex items-center gap-2 px-2">
          <div className="font-semibold">Resto Admin</div>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {list.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname?.startsWith(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              {/* Optional: wire to NextAuth signout when you add auth */}
              <a href="/api/auth/signout?callbackUrl=/">
                <LogOut />
                <span>Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
