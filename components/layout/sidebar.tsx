"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import {
  LayoutDashboard, Users, BarChart3, Palette, TrendingUp,
  DollarSign, CalendarDays, FileText, Settings, LogOut,
  ChevronLeft, ChevronRight, UserCog, Bell, Menu, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllowedModules, getRoleLabel } from "@/lib/permissions"
import { Button } from "@/components/ui/button"

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", module: "dashboard" },
  { label: "Clients", icon: Users, href: "/clients", module: "clients" },
  { label: "Media Buying", icon: BarChart3, href: "/media-buying", module: "media-buying" },
  { label: "Creative", icon: Palette, href: "/creative", module: "creative" },
  { label: "Sales", icon: TrendingUp, href: "/sales", module: "sales" },
  { label: "Finance", icon: DollarSign, href: "/finance", module: "finance" },
  { label: "Calendar", icon: CalendarDays, href: "/calendar", module: "calendar" },
  { label: "Reports", icon: FileText, href: "/reports", module: "reports" },
  { label: "Team & HR", icon: UserCog, href: "/hr", module: "users" },
  { label: "Notifications", icon: Bell, href: "/notifications", module: "dashboard" },
  { label: "Settings", icon: Settings, href: "/settings", module: "settings" },
]

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = session?.user?.role as string
  const allowedModules = getAllowedModules(role)

  const filteredMenu = menuItems.filter((item) => allowedModules.includes(item.module))

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image src="/logo/vivit-logo.jpg" alt="VIVIT GROUP" fill className="object-contain rounded-lg" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight gradient-text">Vivit</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">CRM Pro</span>
            </div>
          )}
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-7 h-7">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredMenu.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("sidebar-item group", isActive && "active")}
              title={collapsed ? item.label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-current")} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{getRoleLabel(role)}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            className="w-full mt-3 text-muted-foreground hover:text-destructive justify-start gap-2"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background/98 backdrop-blur-xl border-r border-border flex flex-col transition-transform duration-300 lg:hidden",
        mobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"
      )}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex fixed left-0 top-0 z-40 h-screen bg-background/95 backdrop-blur-xl border-r border-border flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </aside>
    </>
  )
}
