import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined, currency = "EGP"): string {
  const num = Number(amount || 0)
  if (isNaN(num)) return "EGP 0"
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric", month: "short", day: "numeric",
    }).format(new Date(date))
  } catch { return "—" }
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—"
  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(date))
  } catch { return "—" }
}

export function formatNumber(num: number | null | undefined): string {
  const n = Number(num || 0)
  if (isNaN(n)) return "0"
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M"
  if (n >= 1000) return (n / 1000).toFixed(1) + "K"
  return n.toLocaleString()
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    won: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  return colors[status?.toLowerCase()] || "bg-muted text-muted-foreground"
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  return colors[priority?.toLowerCase()] || colors.medium
}

export function calculateCPL(adSpend: number, leads: number): number {
  return leads > 0 ? adSpend / leads : 0
}

export function calculateAgencyFee(adSpend: number, rate = 0.15): number {
  return adSpend * rate
}

export function calculateNetProfit(revenue: number, expenses: number): number {
  return revenue - expenses
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || ""
  return text.substring(0, maxLength) + "..."
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url; link.download = filename
  document.body.appendChild(link); link.click()
  document.body.removeChild(link); window.URL.revokeObjectURL(url)
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), wait) }
}
