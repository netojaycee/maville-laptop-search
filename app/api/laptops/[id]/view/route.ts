import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.laptop.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to increment view' }, { status: 500 })
  }
}
