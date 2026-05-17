import { PrismaClient, Role, CreativeType, TaskStatus, Priority, PipelineStage, ExpenseCategory, ExpenseType, NotificationType, RevisionCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const users = [
  { name: 'Asem', email: 'asem@vivit.group', role: Role.SUPER_ADMIN, password: 'VivitAdmin2024!' },
  { name: 'Islam', email: 'islam@vivit.group', role: Role.SUPER_ADMIN, password: 'VivitAdmin2024!' },
  { name: 'Saber', email: 'saber@vivit.group', role: Role.SUPER_ADMIN, password: 'VivitAdmin2024!' },
  { name: 'Mostafa', email: 'mostafa@vivit.group', role: Role.ACCOUNTANT, password: 'VivitAccount2024!' },
  { name: 'Noha', email: 'noha@vivit.group', role: Role.MEDIA_BUYER, password: 'VivitMedia2024!' },
  { name: 'Samo', email: 'samo@vivit.group', role: Role.CREATOR, password: 'VivitCreate2024!' },
  { name: 'Fathy', email: 'fathy@vivit.group', role: Role.CREATOR, password: 'VivitCreate2024!' },
  { name: 'Sondos', email: 'sondos@vivit.group', role: Role.ACCOUNT_MANAGER, password: 'VivitManager2024!' },
  { name: 'Naira', email: 'naira@vivit.group', role: Role.ACCOUNT_MANAGER, password: 'VivitManager2024!' },
  { name: 'Yossef', email: 'yossef@vivit.group', role: Role.ACCOUNT_MANAGER, password: 'VivitManager2024!' },
  { name: 'Sales User', email: 'sales@vivit.group', role: Role.SALES, password: 'VivitSales2024!' },
  { name: 'MISfive', email: 'client-misfive@vivit.group', role: Role.CLIENT, password: 'VivitClient2024!' },
  { name: 'Moru', email: 'client-moru@vivit.group', role: Role.CLIENT, password: 'VivitClient2024!' },
  { name: 'Play Hub', email: 'client-playhub@vivit.group', role: Role.CLIENT, password: 'VivitClient2024!' },
  { name: 'Seas', email: 'client-seas@vivit.group', role: Role.CLIENT, password: 'VivitClient2024!' },
  { name: 'Vivit Marketing', email: 'client-vivitmarketing@vivit.group', role: Role.CLIENT, password: 'VivitClient2024!' },
  { name: 'Vivit Tech', email: 'client-vivittech@vivit.group', role: Role.CLIENT, password: 'VivitClient2024!' },
  { name: 'Perla', email: 'client-perla@vivit.group', role: Role.CLIENT, password: 'VivitClient2024!' },
  { name: 'West Court', email: 'client-westcourt@vivit.group', role: Role.CLIENT, password: 'VivitClient2024!' },
]

const clientsData = [
  { name: 'MISfive', companyName: 'MISfive Digital', email: 'info@misfive.com', phone: '+20 100 123 4567', industry: 'Digital Marketing', monthlyRetainer: 5000, mediaBudget: 15000, contractValue: 180000, website: 'https://misfive.com', address: 'Cairo, Egypt', notes: 'Key digital marketing client, high growth potential' },
  { name: 'Moru', companyName: 'Moru Fashion', email: 'hello@moru.com', phone: '+20 100 234 5678', industry: 'Fashion & Retail', monthlyRetainer: 3000, mediaBudget: 10000, contractValue: 120000, website: 'https://moru.fashion', address: 'Alexandria, Egypt', notes: 'Fashion brand with seasonal campaigns' },
  { name: 'Play Hub', companyName: 'Play Hub Gaming', email: 'contact@playhub.com', phone: '+20 100 345 6789', industry: 'Gaming & Entertainment', monthlyRetainer: 8000, mediaBudget: 25000, contractValue: 300000, website: 'https://playhub.gg', address: 'Giza, Egypt', notes: 'Gaming entertainment platform, heavy social media presence' },
  { name: 'Seas', companyName: 'Seas Restaurants', email: 'info@seas.com', phone: '+20 100 456 7890', industry: 'Food & Beverage', monthlyRetainer: 4000, mediaBudget: 12000, contractValue: 144000, website: 'https://seas-eg.com', address: '5th Settlement, Cairo', notes: 'Restaurant chain with multiple locations' },
  { name: 'Vivit Marketing', companyName: 'Vivit Marketing', email: 'marketing@vivit.group', phone: '+20 100 567 8901', industry: 'Marketing Agency', monthlyRetainer: 6000, mediaBudget: 20000, contractValue: 240000, website: 'https://vivit.group', address: 'New Cairo, Egypt', notes: 'Internal marketing arm' },
  { name: 'Vivit Tech', companyName: 'Vivit Technology', email: 'tech@vivit.group', phone: '+20 100 678 9012', industry: 'Technology', monthlyRetainer: 7000, mediaBudget: 18000, contractValue: 210000, website: 'https://vivittech.com', address: 'Smart Village, Giza', notes: 'SaaS and technology products' },
  { name: 'Perla', companyName: 'Perla Cosmetics', email: 'beauty@perla.com', phone: '+20 100 789 0123', industry: 'Beauty & Cosmetics', monthlyRetainer: 4500, mediaBudget: 14000, contractValue: 168000, website: 'https://perla-cosmetics.com', address: 'Heliopolis, Cairo', notes: 'Premium cosmetics brand targeting women 18-45' },
  { name: 'West Court', companyName: 'West Court Real Estate', email: 'sales@westcourt.com', phone: '+20 100 890 1234', industry: 'Real Estate', monthlyRetainer: 5500, mediaBudget: 16000, contractValue: 192000, website: 'https://westcourt.eg', address: '6th of October, Giza', notes: 'Luxury real estate developer' },
]

const leadsData = [
  { company: 'TechStart Inc', contactPerson: 'John Smith', phone: '+20 100 111 2222', email: 'john@techstart.com', source: 'Website', estimatedValue: 15000, probability: 75, stage: PipelineStage.NEGOTIATION, notes: 'Interested in full digital marketing package' },
  { company: 'GreenLeaf Co', contactPerson: 'Sarah Johnson', phone: '+20 100 222 3333', email: 'sarah@greenleaf.com', source: 'Referral', estimatedValue: 8000, probability: 50, stage: PipelineStage.PROPOSAL_SENT, notes: 'Waiting for board budget approval' },
  { company: 'Metro Retail', contactPerson: 'Ahmed Hassan', phone: '+20 100 333 4444', email: 'ahmed@metro.com', source: 'Social Media', estimatedValue: 25000, probability: 95, stage: PipelineStage.WON, notes: 'Contract signed, onboarding next week' },
  { company: 'CloudNine Tech', contactPerson: 'Lisa Chen', phone: '+20 100 444 5555', email: 'lisa@cloudnine.com', source: 'Cold Call', estimatedValue: 12000, probability: 30, stage: PipelineStage.QUALIFIED, notes: 'Needs custom SaaS marketing solution' },
  { company: 'OceanView Hotels', contactPerson: 'Mohamed Ali', phone: '+20 100 555 6666', email: 'mohamed@oceanview.com', source: 'Website', estimatedValue: 20000, probability: 60, stage: PipelineStage.CONTACTED, notes: 'Follow up scheduled for next Monday' },
  { company: 'FastTrack Logistics', contactPerson: 'Emma Wilson', phone: '+20 100 666 7777', email: 'emma@fasttrack.com', source: 'Referral', estimatedValue: 18000, probability: 40, stage: PipelineStage.NEW_LEAD, notes: 'Initial inquiry from LinkedIn' },
  { company: 'BrightStar Edu', contactPerson: 'Omar Khaled', phone: '+20 100 777 8888', email: 'omar@brightstar.com', source: 'Social Media', estimatedValue: 10000, probability: 20, stage: PipelineStage.LOST, notes: 'Budget constraints this quarter, follow up Q1' },
  { company: 'Desert Rose Spa', contactPerson: 'Nadia Farouk', phone: '+20 100 888 9999', email: 'nadia@desertspa.com', source: 'Website', estimatedValue: 9000, probability: 70, stage: PipelineStage.NEGOTIATION, notes: 'Wants social media + photography package' },
  { company: 'Nile Cruises Co', contactPerson: 'Tarek Mansour', phone: '+20 100 999 0000', email: 'tarek@nilecruises.com', source: 'Event', estimatedValue: 35000, probability: 55, stage: PipelineStage.PROPOSAL_SENT, notes: 'Met at Cairo Tourism Expo' },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.approval.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.creativeTask.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.financeRecord.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.calendarEvent.deleteMany()
  await prisma.file.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.kpiRecord.deleteMany()
  await prisma.mediaMetric.deleteMany()
  await prisma.salesLead.deleteMany()
  await prisma.client.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Cleared existing data')

  // Create users
  const createdUsers: any[] = []
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12)
    const created = await prisma.user.create({
      data: { name: user.name, email: user.email, role: user.role, password: hashedPassword },
    })
    createdUsers.push(created)
    console.log(`👤 Created user: ${user.name} (${user.role})`)
  }

  const superAdmins = createdUsers.filter(u => u.role === Role.SUPER_ADMIN)
  const accountManagers = createdUsers.filter(u => u.role === Role.ACCOUNT_MANAGER)
  const creators = createdUsers.filter(u => u.role === Role.CREATOR)
  const mediaBuyers = createdUsers.filter(u => u.role === Role.MEDIA_BUYER)
  const salesUsers = createdUsers.filter(u => u.role === Role.SALES)
  const clientUsers = createdUsers.filter(u => u.role === Role.CLIENT)

  // Create clients
  const createdClients: any[] = []
  for (let i = 0; i < clientsData.length; i++) {
    const c = clientsData[i]
    const manager = accountManagers[i % accountManagers.length]
    const clientUser = clientUsers[i]

    const client = await prisma.client.create({
      data: {
        name: c.name,
        companyName: c.companyName,
        email: c.email,
        phone: c.phone,
        industry: c.industry,
        monthlyRetainer: c.monthlyRetainer,
        mediaBudget: c.mediaBudget,
        contractValue: c.contractValue,
        website: c.website,
        address: c.address,
        notes: c.notes,
        status: 'active',
        startDate: new Date(2024, 0, 1),
        accountManagers: { connect: { id: manager.id } },
        contacts: {
          create: [
            { name: `${c.name} - Marketing Manager`, email: `marketing@${c.companyName.toLowerCase().replace(/\s/g, '')}.com`, phone: c.phone, position: 'Marketing Manager', isPrimary: true },
            { name: `${c.name} - CEO`, email: `ceo@${c.companyName.toLowerCase().replace(/\s/g, '')}.com`, phone: c.phone?.replace('100', '101'), position: 'CEO', isPrimary: false },
          ],
        },
      },
    })
    createdClients.push(client)
    console.log(`🏢 Created client: ${c.companyName}`)

    // Media Metrics (3 months)
    for (let month = 0; month < 3; month++) {
      const budget = c.mediaBudget
      const spend = budget * (0.6 + Math.random() * 0.3)
      const leads = Math.floor(spend / (12 + Math.random() * 8))
      const purchases = Math.floor(leads * (0.2 + Math.random() * 0.2))
      const revenue = spend * (2 + Math.random() * 1.5)

      await prisma.mediaMetric.create({
        data: {
          clientId: client.id,
          metaAdsLink: 'https://business.facebook.com/adsmanager',
          tiktokAdsLink: 'https://ads.tiktok.com/business',
          snapchatAdsLink: 'https://ads.snapchat.com',
          googleAdsLink: 'https://ads.google.com',
          adSpend: Math.round(spend),
          leads,
          purchases,
          addToCart: Math.floor(leads * 0.5),
          revenue: Math.round(revenue),
          roas: parseFloat((revenue / spend).toFixed(2)),
          cpl: parseFloat((spend / leads).toFixed(2)),
          cpa: parseFloat((spend / (purchases || 1)).toFixed(2)),
          agencyFee: Math.round(spend * 0.15),
          totalDue: Math.round(spend * 1.15),
          remainingBudget: Math.round(budget - spend),
          date: new Date(2025, 2 + month, 1),
        },
      })
    }

    // KPI Records
    await prisma.kpiRecord.create({
      data: {
        clientId: client.id,
        targetKPI: c.mediaBudget * 2.5,
        actualKPI: c.mediaBudget * (2 + Math.random()),
        metricType: 'Revenue',
        period: 'Q1 2025',
        date: new Date(2025, 3, 1),
        difference: c.mediaBudget * (Math.random() - 0.2),
        projection: c.mediaBudget * 3,
      },
    })

    // Calendar Events
    const platforms = ['Instagram', 'Facebook', 'TikTok', 'Snapchat']
    for (let e = 0; e < 4; e++) {
      const eventDate = new Date(2025, 4, 5 + e * 7)
      await prisma.calendarEvent.create({
        data: {
          clientId: client.id,
          title: `${c.name} - ${['Campaign Launch', 'Content Post', 'Story Series', 'Reel Upload'][e]}`,
          description: `Scheduled content for ${platforms[e % platforms.length]}`,
          startDate: eventDate,
          endDate: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000),
          platform: platforms[e % platforms.length],
          isPosted: e < 2,
          caption: `Check out our latest ${['campaign', 'post', 'stories', 'reel'][e]}! #${c.name.replace(/\s/g, '')} #Marketing`,
        },
      })
    }

    // Finance Records
    await prisma.financeRecord.create({
      data: {
        type: 'income',
        category: 'retainer',
        amount: c.monthlyRetainer,
        currency: 'EGP',
        description: `Monthly retainer - ${c.companyName}`,
        date: new Date(2025, 4, 1),
        clientId: client.id,
        createdById: superAdmins[0].id,
      },
    })

    // Client Expenses
    const expenseCategories: ExpenseCategory[] = [ExpenseCategory.MODELS, ExpenseCategory.PHOTOGRAPHY, ExpenseCategory.PRODUCTION, ExpenseCategory.FREELANCERS]
    await prisma.expense.create({
      data: {
        type: ExpenseType.CLIENT,
        category: expenseCategories[i % expenseCategories.length],
        amount: 500 + Math.floor(Math.random() * 3000),
        description: `Production cost for ${c.companyName}`,
        date: new Date(2025, 4, 10 + i),
        clientId: client.id,
      },
    })
  }

  // Company Expenses
  const companyExpenses = [
    { category: ExpenseCategory.SALARIES, amount: 85000, description: 'Monthly staff salaries' },
    { category: ExpenseCategory.RENT, amount: 18000, description: 'Office rent - New Cairo' },
    { category: ExpenseCategory.SUBSCRIPTIONS, amount: 4500, description: 'Software subscriptions (Adobe, Slack, etc.)' },
    { category: ExpenseCategory.INTERNET_TELECOM, amount: 1200, description: 'Fiber internet + phone lines' },
    { category: ExpenseCategory.BUFFET_CLEANING, amount: 2500, description: 'Office buffet and cleaning service' },
    { category: ExpenseCategory.MISCELLANEOUS, amount: 3000, description: 'Miscellaneous office expenses' },
  ]
  for (const exp of companyExpenses) {
    await prisma.expense.create({
      data: { type: ExpenseType.COMPANY, ...exp, date: new Date(2025, 4, 1) },
    })
  }
  console.log('💰 Created expenses')

  // Creative Tasks
  const taskTypes: CreativeType[] = [CreativeType.GRAPHIC, CreativeType.CAROUSEL, CreativeType.REEL, CreativeType.STORY, CreativeType.VIDEO_EDIT, CreativeType.MOTION_GRAPHIC, CreativeType.PHOTO_SESSION, CreativeType.UGC]
  const taskStatuses: TaskStatus[] = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.APPROVED, TaskStatus.CHANGES_REQUESTED]
  const priorities: Priority[] = [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.URGENT]

  const taskTitles = [
    'Summer Campaign Hero Banner', 'New Collection Carousel', 'Brand Story Reel',
    'Product Demo Video', 'Ramadan Special Campaign', 'Influencer Collaboration Content',
    'Website Banner Set', 'Social Media Monthly Pack', 'Event Coverage Edit',
    'Behind-the-Scenes Story', 'Customer Testimonial UGC', 'Motion Logo Animation',
    'Photography Session - Products', 'Year End Campaign Assets', 'Launch Day Content Pack',
    'Weekly Instagram Stories', 'TikTok Series Episode 1', 'Email Newsletter Design',
    'Podcast Cover Art', 'YouTube Thumbnail Set',
  ]

  for (let i = 0; i < 20; i++) {
    const client = createdClients[i % createdClients.length]
    const creator = creators[i % creators.length]
    const manager = accountManagers[i % accountManagers.length]
    const status = taskStatuses[i % taskStatuses.length]
    const deadline = new Date(2025, 4, 10 + (i * 3) % 25)

    const task = await prisma.creativeTask.create({
      data: {
        title: taskTitles[i],
        description: `Creative brief for ${client.companyName} - ${taskTitles[i]}`,
        brief: 'Brand colors: Blue & White. Target audience: 25-45. Tone: Professional yet approachable.',
        tov: 'Confident, friendly, aspirational',
        type: taskTypes[i % taskTypes.length],
        status,
        priority: priorities[i % priorities.length],
        deadline,
        clientId: client.id,
        creatorId: creator.id,
        createdById: manager.id,
      },
    })

    // Add submission for review/approved tasks
    if (['REVIEW', 'APPROVED', 'CHANGES_REQUESTED'].includes(status)) {
      const submission = await prisma.submission.create({
        data: {
          taskId: task.id,
          creatorId: creator.id,
          fileUrl: 'https://drive.google.com/file/example',
          fileName: `${taskTitles[i].replace(/\s/g, '_')}_v1.jpg`,
          comment: 'First version ready for review',
          version: 1,
        },
      })

      if (status === 'APPROVED') {
        await prisma.approval.create({
          data: {
            submissionId: submission.id,
            clientId: manager.id,
            status: 'APPROVED',
            comment: 'Looks great! Approved.',
          },
        })
      } else if (status === 'CHANGES_REQUESTED') {
        await prisma.approval.create({
          data: {
            submissionId: submission.id,
            clientId: manager.id,
            status: 'CHANGES_REQUESTED',
            comment: 'Please adjust the color palette to match brand guidelines',
            revisionCategory: RevisionCategory.VISUAL_DESIGN,
          },
        })
      }
    }
  }
  console.log('🎨 Created creative tasks')

  // Sales Leads
  const salesUser = salesUsers[0]
  for (const lead of leadsData) {
    await prisma.salesLead.create({
      data: {
        ...lead,
        estimatedValue: lead.estimatedValue,
        ownerId: salesUser.id,
        clientId: lead.stage === PipelineStage.WON ? createdClients[0].id : null,
      },
    })
  }
  console.log('📈 Created sales leads')

  // Notifications for admin
  const notificationSamples = [
    { type: NotificationType.ASSIGNMENT, title: 'New Task Assigned', message: 'Summer Campaign has been assigned to Samo' },
    { type: NotificationType.APPROVAL_REQUEST, title: 'Submission Ready for Review', message: 'Moru Fashion reel is ready for your approval' },
    { type: NotificationType.REVISION, title: 'Revision Requested', message: 'Client requested changes on MISfive banner' },
    { type: NotificationType.DEADLINE, title: 'Deadline Tomorrow', message: 'Play Hub Gaming Trailer is due tomorrow' },
    { type: NotificationType.LOW_BUDGET, title: 'Low Budget Alert', message: 'Seas Restaurants has 20% media budget remaining' },
    { type: NotificationType.SYSTEM, title: 'Welcome to Vivit CRM Pro', message: 'Your CRM system is ready. All features are active.' },
  ]

  for (const admin of superAdmins) {
    for (const notif of notificationSamples) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          ...notif,
          isRead: false,
        },
      })
    }
  }

  // Notifications for account managers
  for (const manager of accountManagers) {
    await prisma.notification.create({
      data: {
        userId: manager.id,
        type: NotificationType.ASSIGNMENT,
        title: 'Client Assigned',
        message: 'You have been assigned as account manager for new client',
        isRead: false,
      },
    })
  }
  console.log('🔔 Created notifications')

  // Audit Logs
  for (let i = 0; i < 10; i++) {
    await prisma.auditLog.create({
      data: {
        action: ['CREATE_CLIENT', 'UPDATE_TASK', 'CREATE_LEAD', 'UPDATE_LEAD', 'CREATE_FINANCE_RECORD'][i % 5],
        entityType: ['Client', 'CreativeTask', 'SalesLead', 'FinanceRecord'][i % 4],
        entityId: createdClients[i % createdClients.length].id,
        newValue: JSON.stringify({ action: 'seed data' }),
        userId: superAdmins[0].id,
      },
    })
  }

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('═══════════════════════════════════════════════════')
  console.log('SUPER ADMIN  | asem@vivit.group     | VivitAdmin2024!')
  console.log('SUPER ADMIN  | islam@vivit.group    | VivitAdmin2024!')
  console.log('ACCOUNTANT   | mostafa@vivit.group  | VivitAccount2024!')
  console.log('MEDIA BUYER  | noha@vivit.group     | VivitMedia2024!')
  console.log('CREATOR      | samo@vivit.group     | VivitCreate2024!')
  console.log('CREATOR      | fathy@vivit.group    | VivitCreate2024!')
  console.log('ACC MANAGER  | sondos@vivit.group   | VivitManager2024!')
  console.log('SALES        | sales@vivit.group    | VivitSales2024!')
  console.log('CLIENT       | client-misfive@vivit.group | VivitClient2024!')
  console.log('═══════════════════════════════════════════════════')
}

main()
  .catch(console.error)
  .finally(async () => { await prisma.$disconnect() })
