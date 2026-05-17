export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: {
    modules: ["dashboard","clients","media-buying","creative","sales","finance","calendar","reports","settings","users","audit-logs","hr","notifications"],
    actions: ["create","read","update","delete","export","manage"],
  },
  ACCOUNTANT: {
    modules: ["dashboard","finance","reports","clients","notifications"],
    actions: ["read","create","update","export"],
  },
  ACCOUNT_MANAGER: {
    modules: ["dashboard","clients","creative","calendar","reports","notifications"],
    actions: ["read","create","update","export"],
  },
  MEDIA_BUYER: {
    modules: ["dashboard","media-buying","clients","reports","notifications"],
    actions: ["read","create","update","export"],
  },
  CREATOR: {
    modules: ["dashboard","creative","calendar","notifications"],
    actions: ["read","create","update"],
  },
  SALES: {
    modules: ["dashboard","sales","clients","reports","notifications"],
    actions: ["read","create","update","export"],
  },
  CLIENT: {
    modules: ["dashboard","creative","calendar","reports","notifications"],
    actions: ["read","approve","reject"],
  },
} as const

export type Role = keyof typeof ROLE_PERMISSIONS
export type Module = (typeof ROLE_PERMISSIONS)[Role]["modules"][number]
export type Action = (typeof ROLE_PERMISSIONS)[Role]["actions"][number]

export function hasPermission(role: string, module: string, action?: string): boolean {
  const permissions = ROLE_PERMISSIONS[role as Role]
  if (!permissions) return false
  const hasModule = permissions.modules.includes(module as Module)
  if (!action) return hasModule
  return hasModule && permissions.actions.includes(action as Action)
}

export function getAllowedModules(role: string): string[] {
  return ROLE_PERMISSIONS[role as Role]?.modules || []
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ACCOUNTANT: "Accountant",
    ACCOUNT_MANAGER: "Account Manager",
    MEDIA_BUYER: "Media Buyer",
    CREATOR: "Creator",
    SALES: "Sales",
    CLIENT: "Client",
  }
  return labels[role] || role
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    ACCOUNTANT: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    ACCOUNT_MANAGER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    MEDIA_BUYER: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    CREATOR: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    SALES: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    CLIENT: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  }
  return colors[role] || colors.CLIENT
}
