import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { slugify } from '@/lib/utils'
import { auth } from '@/auth'

const laptopCreateSchema = z.object({
  brand:                 z.string().min(1),
  model:                 z.string().min(1),
  price:                 z.number().int().positive(),
  condition:             z.enum(['New', 'Refurbished', 'Used', 'Very Good']),
  cpuName:               z.string().optional().default(''),
  cpuGeneration:         z.string().optional().nullable(),
  ram:                   z.number().int().min(0).optional().default(0),
  maxRam:                z.number().int().positive().optional().nullable(),
  ramUpgradeable:        z.boolean().default(false),
  storage:               z.string().optional().default(''),
  storageType:           z.string().optional().nullable(),
  additionalSsdSlot:     z.boolean().default(false),
  gpu:                   z.string().optional().default(''),
  batteryHealth:         z.string().optional().nullable(),
  estimatedBatteryHours: z.number().positive().optional().nullable(),
  weight:                z.number().positive().optional().nullable(),
  touchscreen:           z.boolean().default(false),
  backlitKeyboard:       z.boolean().default(false),
  fingerprintReader:     z.boolean().default(false),
  chargerIncluded:       z.boolean().default(true),
  keyboardType:          z.string().optional().nullable(),
  availability:          z.enum(['In Stock', 'Low Stock', 'Out of Stock']).default('In Stock'),
  images:                z.array(z.string()).default([]),
  gamingScore:           z.number().int().min(0).max(100).optional().nullable(),
  editingScore:          z.number().int().min(0).max(100).optional().nullable(),
  programmingScore:      z.number().int().min(0).max(100).optional().nullable(),
  batteryScore:          z.number().int().min(0).max(100).optional().nullable(),
  featured:              z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'))
    const limit = Math.min(48, parseInt(searchParams.get('limit') || '24'))
    const skip  = (page - 1) * limit

    // Build where clause incrementally with proper types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { archived: false }

    const brandParam = searchParams.get('brand')
    if (brandParam) where.brand = { in: brandParam.split(',').filter(Boolean) }

    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    if (priceMin || priceMax) {
      where.price = {}
      if (priceMin) where.price.gte = parseInt(priceMin)
      if (priceMax) where.price.lte = parseInt(priceMax)
    }

    const ramParam = searchParams.get('ram')
    if (ramParam) {
      const ramNums = ramParam.split(',').map(Number).filter((n) => !isNaN(n))
      if (ramNums.length) where.ram = { in: ramNums }
    }

    const conditionParam = searchParams.get('condition')
    if (conditionParam) where.condition = { in: conditionParam.split(',').filter(Boolean) }

    const featuredParam = searchParams.get('featured')
    if (featuredParam === 'true') where.featured = true

    const sortParam = searchParams.get('sort') || 'newest'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any =
      sortParam === 'price_asc'  ? { price: 'asc'  } :
      sortParam === 'price_desc' ? { price: 'desc' } :
      sortParam === 'views'      ? { views: 'desc' } :
                                   { createdAt: 'desc' }

    const [laptops, total] = await Promise.all([
      prisma.laptop.findMany({ where, orderBy, skip, take: limit }),
      prisma.laptop.count({ where }),
    ])

    return NextResponse.json({ laptops, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[GET /api/laptops]', message)
    return NextResponse.json({ error: 'Failed to fetch laptops', detail: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body   = await req.json()
    const parsed = laptopCreateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const data = parsed.data
    const slug = slugify(`${data.brand}-${data.model}`)
    const laptop = await prisma.laptop.create({ data: { ...data, slug } })
    return NextResponse.json(laptop, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/laptops]', message)
    return NextResponse.json({ error: 'Failed to create laptop', detail: message }, { status: 500 })
  }
}
