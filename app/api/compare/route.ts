import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const compareSchema = z.object({
  ids: z.array(z.string()).min(2).max(3),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = compareSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const laptops = await prisma.laptop.findMany({
      where: { id: { in: parsed.data.ids }, archived: false },
    })

    return NextResponse.json({ laptops })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch laptops for comparison' }, { status: 500 })
  }
}
