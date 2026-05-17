import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")
  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  try {
    const [clients, leads, tasks, users] = await Promise.all([
      prisma.client.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { companyName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, companyName: true, status: true },
        take: 5,
      }),
      prisma.salesLead.findMany({
        where: {
          OR: [
            { company: { contains: q, mode: "insensitive" } },
            { contactPerson: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, company: true, stage: true, estimatedValue: true },
        take: 5,
      }),
      prisma.creativeTask.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, title: true, status: true, type: true },
        take: 5,
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
          isActive: true,
        },
        select: { id: true, name: true, email: true, role: true },
        take: 5,
      }),
    ])

    return NextResponse.json({
      results: [
        ...clients.map((c) => ({ ...c, _type: "client", label: c.companyName, sub: c.name, href: `/clients` })),
        ...leads.map((l) => ({ ...l, _type: "lead", label: l.company, sub: `$${l.estimatedValue} - ${l.stage}`, href: `/sales` })),
        ...tasks.map((t) => ({ ...t, _type: "task", label: t.title, sub: `${t.type} - ${t.status}`, href: `/creative` })),
        ...users.map((u) => ({ ...u, _type: "user", label: u.name, sub: u.role, href: `/settings` })),
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
