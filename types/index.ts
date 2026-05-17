export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  isActive: boolean
}

export interface Client {
  id: string
  name: string
  companyName: string
  email: string | null
  phone: string | null
  industry: string | null
  website: string | null
  address: string | null
  monthlyRetainer: number | null
  mediaBudget: number | null
  contractValue: number | null
  status: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
  accountManagers: User[]
  contacts: Contact[]
}

export interface Contact {
  id: string
  name: string
  email: string | null
  phone: string | null
  position: string | null
  isPrimary: boolean
}

export interface MediaMetric {
  id: string
  clientId: string
  metaAdsLink: string | null
  tiktokAdsLink: string | null
  snapchatAdsLink: string | null
  googleAdsLink: string | null
  adSpend: number
  leads: number
  purchases: number
  addToCart: number
  revenue: number
  roas: number | null
  cpl: number | null
  cpa: number | null
  agencyFee: number | null
  totalDue: number | null
  remainingBudget: number | null
  date: Date
}

export interface CreativeTask {
  id: string
  title: string
  description: string | null
  brief: string | null
  tov: string | null
  references: string | null
  script: string | null
  type: string
  status: string
  priority: string
  deadline: Date | null
  completedAt: Date | null
  clientId: string
  client: Client
  creatorId: string | null
  creator: User | null
  createdById: string
  createdBy: User
  submissions: Submission[]
  createdAt: Date
  updatedAt: Date
}

export interface Submission {
  id: string
  taskId: string
  creatorId: string
  creator: User
  fileUrl: string | null
  fileName: string | null
  comment: string | null
  version: number
  approvals: Approval[]
  createdAt: Date
}

export interface Approval {
  id: string
  submissionId: string
  clientId: string
  client: User
  status: string
  comment: string | null
  revisionCategory: string | null
  createdAt: Date
}

export interface SalesLead {
  id: string
  company: string
  contactPerson: string | null
  phone: string | null
  email: string | null
  source: string | null
  estimatedValue: number | null
  probability: number | null
  stage: string
  notes: string | null
  strategyFile: string | null
  clientId: string | null
  client: Client | null
  ownerId: string | null
  owner: User | null
  createdAt: Date
  updatedAt: Date
}

export interface FinanceRecord {
  id: string
  type: string
  category: string
  amount: number
  currency: string
  description: string | null
  date: Date
  clientId: string | null
  client: Client | null
  createdById: string
  createdBy: User
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  id: string
  type: string
  category: string
  amount: number
  description: string | null
  date: Date
  clientId: string | null
  client: Client | null
  createdAt: Date
  updatedAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date | null
  isPosted: boolean
  caption: string | null
  platform: string | null
  clientId: string
  client: Client
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string | null
  isRead: boolean
  link: string | null
  userId: string
  createdAt: Date
}

export interface DashboardStats {
  activeClients: number
  totalLeads: number
  adSpend: number
  revenue: number
  netProfit: number
  pendingApprovals: number
  tasksDueToday: number
  creatorProductivity: number
  averageRoas: number
  averageCpl: number
  remainingBudget: number
}

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export interface FilterState {
  search: string
  status: string | null
  dateRange: { from: Date | null; to: Date | null }
  clientId: string | null
}
