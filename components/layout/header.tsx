"use client"

import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"
import { Bell, Search, Sun, Moon, Users, TrendingUp, Palette, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SearchResult {
  id: string
  _type: string
  label: string
  sub: string
  href: string
}

export function Header() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/notifications")
        const data = await res.json()
        if (Array.isArray(data)) setUnread(data.filter((n: any) => !n.isRead).length)
      } catch {}
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch("/api/search?q=" + encodeURIComponent(query))
        const data = await res.json()
        setResults(data.results || [])
      } catch {}
    }, 250)
    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <header className="sticky top-0 z-30 w-full glass-card-strong border-b px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients, tasks, leads..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-primary/50"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          {searchOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-card-strong rounded-xl shadow-2xl border overflow-hidden z-50">
              {results.map((r) => (
                <Link
                  key={r._type + r.id}
                  href={r.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  onClick={() => { setQuery(""); setSearchOpen(false) }}
                >
                  <div className="p-1.5 rounded-lg bg-muted">
                    {r._type === "client" ? <Users className="w-3 h-3" /> : r._type === "lead" ? <TrendingUp className="w-3 h-3" /> : <Palette className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.sub}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">{r._type}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary">
                  {unread > 9 ? "9+" : unread}
                </Badge>
              )}
            </Button>
          </Link>
          <div className="flex items-center gap-2 ml-1 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-tight">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
