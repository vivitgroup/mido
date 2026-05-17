import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("clientId")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  try {
    const where: any = {}
    if (clientId) where.clientId = clientId
    if (from || to) {
      where.date = {}
      if (from) where.date.gte = new Date(from)
      if (to) where.date.lte = new Date(to)
    }

    const metrics = await prisma.mediaMetric.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, companyName: true, mediaBudget: true } },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(metrics)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media metrics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = await request.json()
    const metric = await prisma.mediaMetric.create({
      data: {
        clientId: data.clientId,
        metaAdsLink: data.metaAdsLink || null,
        tiktokAdsLink: data.tiktokAdsLink || null,
        snapchatAdsLink: data.snapchatAdsLink || null,
        googleAdsLink: data.googleAdsLink || null,
        adSpend: parseFloat(data.adSpend) || 0,
        leads: parseInt(data.leads) || 0,
        purchases: parseInt(data.purchases) || 0,
        addToCart: parseInt(data.addToCart) || 0,
        revenue: parseFloat(data.revenue) || 0,
        roas: data.roas ? parseFloat(data.roas) : null,
        cpl: data.cpl ? parseFloat(data.cpl) : null,
        cpa: data.cpa ? parseFloat(data.cpa) : null,
        agencyFee: data.agencyFee ? parseFloat(data.agencyFee) : null,
        totalDue: data.totalDue ? parseFloat(data.totalDue) : null,
        remainingBudget: data.remainingBudget ? parseFloat(data.remainingBudget) : null,
        date: new Date(data.date),
      },
      include: { client: { select: { name: true } } },
    })

    // Check for low budget alert
    if (data.remainingBudget && parseFloat(data.remainingBudget) < 2000) {
      const admins = await prisma.user.findMany({
        where: { role: { in: ["SUPER_ADMIN", "MEDIA_BUYER"] }, isActive: true },
        select: { id: true },
      })
      await prisma.notification.createMany({
        data: admins.map((a) => ({
          userId: a.id,
          type: "LOW_BUDGET" as const,
          title: "Low Media Budget Alert ⚠️",
          message: `${metric.client.name} has only ${data.remainingBudget} EGP remaining in media budget`,
          link: "/media-buying",
        })),
      })
    }

    return NextResponse.json(metric)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create media metric" }, { status: 500 })
  }
}
