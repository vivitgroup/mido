# Vivit CRM Pro

**Enterprise Marketing Agency CRM by VIVIT GROUP**

A complete, production-ready CRM built for marketing agencies — managing clients, media buying, creative workflows, sales pipeline, finance, HR, and notifications.

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech) / [Supabase](https://supabase.com) free tier)

### 1. Install
```bash
cd vivit-crm
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your database URL and secrets
```

### 3. Setup Database
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Run
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🌐 Deploy to Vercel (Production)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-ORG/vivit-crm.git
git push -u origin main

# 2. Import on vercel.com
# Add environment variables:
#   DATABASE_URL = your-postgres-url
#   NEXTAUTH_SECRET = random-32-char-string
#   NEXTAUTH_URL = https://your-app.vercel.app

# 3. After deploy, run seed:
# vercel env pull .env.local
# npm run db:migrate:prod
# npm run db:seed
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | asem@vivit.group | VivitAdmin2024! |
| **Super Admin** | islam@vivit.group | VivitAdmin2024! |
| **Accountant** | mostafa@vivit.group | VivitAccount2024! |
| **Media Buyer** | noha@vivit.group | VivitMedia2024! |
| **Creator** | samo@vivit.group | VivitCreate2024! |
| **Creator** | fathy@vivit.group | VivitCreate2024! |
| **Account Manager** | sondos@vivit.group | VivitManager2024! |
| **Sales** | sales@vivit.group | VivitSales2024! |
| **Client** | client-misfive@vivit.group | VivitClient2024! |

---

## ✨ Features

### Core Modules
| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time KPIs, deadlines, quick actions |
| **Clients** | Full client management, contacts, brand guidelines |
| **Media Buying** | Ad spend tracking, ROAS, CPL, CPA, platform links |
| **Creative** | Task management with approval/revision workflow |
| **Sales CRM** | Kanban pipeline, lead scoring, deal tracking |
| **Finance** | Revenue, expenses, P&L, client vs company costs |
| **Calendar** | Content calendar, post scheduling per platform |
| **Reports** | Performance analytics with export (PDF/Excel) |
| **Team & HR** | User management, roles, permissions |
| **Notifications** | Real-time alerts, mark read, notification center |

### Workflow Features
- ✅ Role-based access control (7 roles)
- ✅ Creative task approval workflow with versioning
- ✅ Revision requests with categories
- ✅ Real-time notifications system
- ✅ Global search across all modules
- ✅ Audit trail for all actions
- ✅ Dark/Light mode
- ✅ Arabic RTL support ready
- ✅ Mobile responsive
- ✅ PDF & Excel export

### API Endpoints
```
GET/POST   /api/dashboard          - Dashboard KPIs
GET/POST   /api/clients            - Client CRUD
GET/PATCH/DELETE /api/clients/[id] - Single client
GET/POST   /api/creative-tasks     - Creative tasks
GET/PATCH/DELETE /api/creative-tasks/[id] - Single task
POST/PATCH /api/creative-tasks/[id]/submissions - Submissions & approvals
GET/POST   /api/sales-leads        - Sales pipeline
GET/PATCH/DELETE /api/sales-leads/[id] - Single lead
GET/POST   /api/finance            - Finance records
GET/POST   /api/expenses           - Expenses management
GET/POST/PATCH/DELETE /api/calendar-events - Calendar
GET/POST   /api/media-metrics      - Media buying data
GET/POST   /api/kpi-records        - KPI tracking
GET/POST   /api/users              - Team management
GET/POST/DELETE /api/contacts      - Client contacts
GET/PATCH  /api/notifications      - Notifications
GET        /api/search             - Global search
GET        /api/audit-logs         - Audit trail
GET        /api/reports            - Report data
```

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js v4 (JWT strategy)
- **UI Libraries**: Recharts, FullCalendar, Framer Motion, Lucide Icons
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand
- **Export**: jsPDF, xlsx

---

## 📁 Project Structure

```
vivit-crm/
├── app/
│   ├── (auth)/login/           # Login page
│   ├── (dashboard)/
│   │   ├── dashboard/          # Main dashboard
│   │   ├── clients/            # Client management
│   │   ├── media-buying/       # Media buying tracker
│   │   ├── creative/           # Creative task workflow
│   │   ├── sales/              # Sales CRM pipeline
│   │   ├── finance/            # Finance & accounting
│   │   ├── calendar/           # Content calendar
│   │   ├── reports/            # Analytics & reports
│   │   ├── hr/                 # Team & HR management
│   │   └── notifications/      # Notification center
│   └── api/                    # 15+ REST API endpoints
├── components/
│   ├── layout/                 # Sidebar, Header
│   ├── ui/                     # shadcn components
│   └── providers/              # Theme, Auth, Toast
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── permissions.ts          # RBAC system
│   └── utils.ts                # Helpers
├── prisma/schema.prisma        # Database schema
└── scripts/seed.ts             # Demo data seed
```

---

## 🔧 Environment Variables

```env
# Required
DATABASE_URL="postgresql://user:password@host:5432/vivit_crm"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Optional (for file uploads)
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

# Optional (for email notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@email.com"
SMTP_PASSWORD="your-app-password"
```

---

Built with ❤️ for **VIVIT GROUP**
