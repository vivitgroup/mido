import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "overview"
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date(new Date().setMonth(new Date().getMonth() - 3))
  const to = searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date()

  try {
    if (type === "overview") {
      const [
        clientStats,
        taskStats,
        mediaStats,
        salesStats,
        financeStats,
      ] = await Promise.all([
        prisma.client.groupBy({ by: ["status"], _count: true }),
        prisma.creativeTask.groupBy({ by: ["status"], _count: true }),
        prisma.mediaMetric.aggregate({
          where: { date: { gte: from, lte: to } },
          _sum: { adSpend: true, leads: true, revenue: true, purchases: true },
          _avg: { roas: true, cpl: true },
        }),
        prisma.salesLead.groupBy({ by: ["stage"], _count: true, _sum: { estimatedValue: true } }),
        prisma.expense.aggregate({
          where: { date: { gte: from, lte: to } },
          _sum: { amount: true },
        }),
      ])

      return NextResponse.json({ clientStats, taskStats, mediaStats, salesStats, financeStats })
    }

    if (type === "media") {
      const metrics = await prisma.mediaMetric.findMany({
        where: { date: { gte: from, lte: to } },
        include: { client: { select: { name: true, companyName: true } } },
        orderBy: { date: "desc" },
      })
      return NextResponse.json(metrics)
    }

    if (type === "clients") {
      const clients = await prisma.client.findMany({
        include: {
          _count: { select: { creativeTasks: true, mediaMetrics: true } },
          mediaMetrics: {
            select: { adSpend: true, revenue: true, leads: true, roas: true },
            orderBy: { date: "desc" },
            take: 3,
          },
          financeRecords: {
            select: { amount: true, type: true },
            where: { date: { gte: from, lte: to } },
          },
        },
      })
      return NextResponse.json(clients)
    }

    if (type === "tasks") {
      const tasks = await prisma.creativeTask.groupBy({
        by: ["type", "status"],
        _count: true,
      })
      const tasksByCreator = await prisma.creativeTask.groupBy({
        by: ["creatorId"],
        _count: true,
        where: { createdAt: { gte: from, lte: to } },
      })
      return NextResponse.json({ tasks, tasksByCreator })
    }

    return NextResponse.json({ error: "Unknown report type" }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
