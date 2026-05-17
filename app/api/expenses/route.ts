import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const clientId = searchParams.get("clientId")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  try {
    const where: any = {}
    if (type) where.type = type
    if (clientId) where.clientId = clientId
    if (from || to) {
      where.date = {}
      if (from) where.date.gte = new Date(from)
      if (to) where.date.lte = new Date(to)
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, companyName: true } },
      },
      orderBy: { date: "desc" },
    })

    const summary = {
      totalClientExpenses: expenses
        .filter((e) => e.type === "CLIENT")
        .reduce((sum, e) => sum + Number(e.amount), 0),
      totalCompanyExpenses: expenses
        .filter((e) => e.type === "COMPANY")
        .reduce((sum, e) => sum + Number(e.amount), 0),
      total: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
      byCategory: expenses.reduce((acc: Record<string, number>, e) => {
        acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
        return acc
      }, {}),
    }

    return NextResponse.json({ expenses, summary })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = await request.json()
    const expense = await prisma.expense.create({
      data: {
        ...data,
        date: new Date(data.date),
        amount: parseFloat(data.amount),
      },
      include: { client: { select: { name: true } } },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE_EXPENSE",
        entityType: "Expense",
        entityId: expense.id,
        newValue: JSON.stringify(data),
        userId: session.user.id,
      },
    })

    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

  try {
    await prisma.expense.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 })
  }
}
