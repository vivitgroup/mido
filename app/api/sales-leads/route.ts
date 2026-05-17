import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const stage = searchParams.get("stage")
  const ownerId = searchParams.get("ownerId")

  try {
    const where: any = {}
    if (stage) where.stage = stage
    if (ownerId) where.ownerId = ownerId

    const leads = await prisma.salesLead.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, companyName: true } },
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(leads)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = await request.json()
    const lead = await prisma.salesLead.create({
      data: {
        ...data,
        estimatedValue: data.estimatedValue ? parseFloat(data.estimatedValue) : null,
        probability: data.probability ? parseInt(data.probability) : 0,
        ownerId: data.ownerId || session.user.id,
      },
      include: { owner: { select: { name: true } } },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE_LEAD",
        entityType: "SalesLead",
        entityId: lead.id,
        newValue: JSON.stringify({ company: lead.company, stage: lead.stage }),
        userId: session.user.id,
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
}
