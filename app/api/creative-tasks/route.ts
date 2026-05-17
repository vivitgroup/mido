import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const type = searchParams.get("type")
  const clientId = searchParams.get("clientId")
  const creatorId = searchParams.get("creatorId")

  try {
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (clientId) where.clientId = clientId
    if (creatorId) where.creatorId = creatorId

    // Creators only see their own tasks
    if (session.user.role === "CREATOR") {
      where.creatorId = session.user.id
    }

    const tasks = await prisma.creativeTask.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, companyName: true } },
        creator: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        submissions: {
          include: {
            creator: { select: { name: true } },
            approvals: { select: { status: true } },
          },
          orderBy: { version: "desc" },
          take: 1,
        },
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = await request.json()
    const task = await prisma.creativeTask.create({
      data: {
        title: data.title,
        description: data.description,
        brief: data.brief,
        tov: data.tov,
        references: data.references,
        script: data.script,
        type: data.type,
        priority: data.priority || "MEDIUM",
        deadline: data.deadline ? new Date(data.deadline) : null,
        clientId: data.clientId,
        creatorId: data.creatorId,
        createdById: session.user.id,
      },
      include: {
        client: { select: { name: true } },
        creator: { select: { name: true } },
      },
    })

    // Notify assigned creator
    if (data.creatorId && data.creatorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: data.creatorId,
          type: "ASSIGNMENT",
          title: "New Task Assigned",
          message: `You have been assigned: "${task.title}" for ${task.client.name}`,
          link: `/creative`,
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        action: "CREATE_TASK",
        entityType: "CreativeTask",
        entityId: task.id,
        newValue: JSON.stringify({ title: task.title, type: task.type }),
        userId: session.user.id,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
