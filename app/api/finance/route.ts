import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const clientId = searchParams.get("clientId")

  try {
    const where: any = {}
    if (clientId) where.clientId = clientId
    if (from || to) {
      where.date = {}
      if (from) where.date.gte = new Date(from)
      if (to) where.date.lte = new Date(to)
    }

    const [records, expenses, clients] = await Promise.all([
      prisma.financeRecord.findMany({
        where,
        include: {
          client: { select: { id: true, name: true } },
          createdBy: { select: { id: true, name: true } },
        },
        orderBy: { date: "desc" },
      }),
      prisma.expense.findMany({
        where: clientId ? { clientId } : {},
        include: { client: { select: { id: true, name: true } } },
        orderBy: { date: "desc" },
      }),
      prisma.client.findMany({
        where: { status: "active" },
        select: {
          id: true, name: true, companyName: true,
          monthlyRetainer: true, mediaBudget: true, contractValue: true,
          mediaMetrics: {
            select: { adSpend: true, agencyFee: true },
            orderBy: { date: "desc" },
            take: 1,
          },
          financeRecords: {
            select: { amount: true, type: true },
          },
        },
      }),
    ])

    const summary = {
      totalRevenue: records.filter(r => r.type === "income").reduce((s, r) => s + Number(r.amount), 0),
      totalExpenses: expenses.reduce((s, e) => s + Number(e.amount), 0),
      clientExpenses: expenses.filter(e => e.type === "CLIENT").reduce((s, e) => s + Number(e.amount), 0),
      companyExpenses: expenses.filter(e => e.type === "COMPANY").reduce((s, e) => s + Number(e.amount), 0),
    }
    summary.netProfit = summary.totalRevenue - summary.totalExpenses

    return NextResponse.json({ records, expenses, clients, summary })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch finance data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = await request.json()
    const record = await prisma.financeRecord.create({
      data: {
        type: data.type,
        category: data.category,
        amount: parseFloat(data.amount),
        currency: data.currency || "EGP",
        description: data.description,
        date: new Date(data.date),
        clientId: data.clientId || null,
        createdById: session.user.id,
      },
      include: { client: { select: { name: true } } },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE_FINANCE_RECORD",
        entityType: "FinanceRecord",
        entityId: record.id,
        newValue: JSON.stringify({ type: data.type, amount: data.amount }),
        userId: session.user.id,
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create finance record" }, { status: 500 })
  }
}
