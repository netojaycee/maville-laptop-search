import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

const laptopUpdateSchema = z.object({
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  cpuName: z.string().min(1).optional(),
  cpuGeneration: z.string().nullable().optional(),
  ram: z.number().int().positive().optional(),
  maxRam: z.number().int().positive().nullable().optional(),
  ramUpgradeable: z.boolean().optional(),
  storage: z.string().min(1).optional(),
  storageType: z.string().nullable().optional(),
  additionalSsdSlot: z.boolean().optional(),
  gpu: z.string().min(1).optional(),
  batteryHealth: z.string().nullable().optional(),
  estimatedBatteryHours: z.number().positive().nullable().optional(),
  weight: z.number().positive().nullable().optional(),
  touchscreen: z.boolean().optional(),
  backlitKeyboard: z.boolean().optional(),
  fingerprintReader: z.boolean().optional(),
  chargerIncluded: z.boolean().optional(),
  keyboardType: z.string().nullable().optional(),
  condition: z.enum(['New', 'Refurbished', 'Used', 'Very Good']).optional(),
  price: z.number().int().positive().optional(),
  availability: z.enum(['In Stock', 'Low Stock', 'Out of Stock']).optional(),
  images: z.array(z.string()).optional(),
  gamingScore: z.number().int().min(0).max(100).nullable().optional(),
  editingScore: z.number().int().min(0).max(100).nullable().optional(),
  programmingScore: z.number().int().min(0).max(100).nullable().optional(),
  batteryScore: z.number().int().min(0).max(100).nullable().optional(),
  featured: z.boolean().optional(),
  archived: z.boolean().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const laptop = await prisma.laptop.findUnique({ where: { id } })
    if (!laptop) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(laptop)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch laptop' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const parsed = laptopUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const laptop = await prisma.laptop.update({ where: { id }, data: parsed.data })
    return NextResponse.json(laptop)
  } catch {
    return NextResponse.json({ error: 'Failed to update laptop' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.laptop.update({ where: { id }, data: { archived: true } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to archive laptop' }, { status: 500 })
  }
}
