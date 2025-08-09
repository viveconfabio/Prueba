import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getDictionary, type Locale } from "@/lib/i18n"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  const dict = await getDictionary(params.locale || "en")
  return (
    <SidebarProvider>
      <AppSidebar locale={params.locale} />
      <SidebarInset>
        <div className="p-4">
          <header className="mb-4">
            <h1 className="text-xl font-semibold">{dict.app.title}</h1>
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
