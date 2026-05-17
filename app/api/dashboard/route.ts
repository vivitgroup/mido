import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalClients,
      activeClients,
      totalLeads,
      wonLeads,
      pendingTasks,
      overdueTasks,
      totalUsers,
      mediaMetrics,
      lastMonthMetrics,
      recentActivity,
      upcomingDeadlines,
      pendingApprovals,
      financeThisMonth,
      notifications,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { status: "active" } }),
      prisma.salesLead.count(),
      prisma.salesLead.count({ where: { stage: "WON" } }),
      prisma.creativeTask.count({ where: { status: { in: ["PENDING", "IN_PROGRESS", "REVIEW"] } } }),
      prisma.creativeTask.count({
        where: {
          deadline: { lt: now },
          status: { notIn: ["APPROVED"] },
        },
      }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.mediaMetric.aggregate({
        where: { date: { gte: startOfMonth } },
        _sum: { adSpend: true, leads: true, revenue: true, purchases: true },
      }),
      prisma.mediaMetric.aggregate({
        where: { date: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _sum: { adSpend: true, leads: true, revenue: true },
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, role: true } } },
      }),
      prisma.creativeTask.findMany({
        where: {
          deadline: { gte: now, lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
          status: { notIn: ["APPROVED"] },
        },
        include: { client: { select: { name: true } }, creator: { select: { name: true } } },
        orderBy: { deadline: "asc" },
        take: 5,
      }),
      prisma.submission.count({
        where: {
          approvals: { none: {} },
        },
      }),
      prisma.financeRecord.aggregate({
        where: { date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.notification.count({
        where: { userId: session.user.id, isRead: false },
      }),
    ])

    // Calculate KPIs
    const adSpend = Number(mediaMetrics._sum.adSpend || 0)
    const revenue = Number(mediaMetrics._sum.revenue || 0)
    const lastAdSpend = Number(lastMonthMetrics._sum.adSpend || 0)
    const lastRevenue = Number(lastMonthMetrics._sum.revenue || 0)

    const roas = adSpend > 0 ? (revenue / adSpend).toFixed(2) : "0"
    const adSpendChange = lastAdSpend > 0 ? (((adSpend - lastAdSpend) / lastAdSpend) * 100).toFixed(1) : "0"
    const revenueChange = lastRevenue > 0 ? (((revenue - lastRevenue) / lastRevenue) * 100).toFixed(1) : "0"

    return NextResponse.json({
      kpis: {
        totalClients,
        activeClients,
        totalLeads,
        wonLeads,
        winRate: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0,
        pendingTasks,
        overdueTasks,
        totalUsers,
        adSpend,
        adSpendChange: parseFloat(adSpendChange),
        totalLeadsMedia: mediaMetrics._sum.leads || 0,
        revenue,
        revenueChange: parseFloat(revenueChange),
        purchases: mediaMetrics._sum.purchases || 0,
        roas: parseFloat(roas),
        pendingApprovals,
        unreadNotifications: notifications,
        monthlyRevenue: Number(financeThisMonth._sum.amount || 0),
      },
      recentActivity,
      upcomingDeadlines,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
