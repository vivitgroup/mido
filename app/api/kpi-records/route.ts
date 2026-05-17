import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("clientId")

  try {
    const where: any = {}
    if (clientId) where.clientId = clientId

    const records = await prisma.kpiRecord.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, companyName: true } },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch KPI records" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = await request.json()
    const actualKPI = parseFloat(data.actualKPI)
    const targetKPI = parseFloat(data.targetKPI)

    const record = await prisma.kpiRecord.create({
      data: {
        clientId: data.clientId,
        targetKPI,
        actualKPI,
        difference: actualKPI - targetKPI,
        projection: data.projection ? parseFloat(data.projection) : null,
        metricType: data.metricType,
        period: data.period,
        date: new Date(data.date),
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create KPI record" }, { status: 500 })
  }
}
