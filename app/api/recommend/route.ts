import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scoreAll } from '@/lib/scoring'
import { z } from 'zod'

const preferencesSchema = z.object({
  budgetMin: z.number().int().min(0),
  budgetMax: z.number().int().positive(),
  useCase: z.string().min(1),
  performancePreference: z.enum(['maximum', 'balanced', 'battery']),
  portability: z.enum(['lightweight', 'balanced', 'any']),
  requiredFeatures: z.array(z.string()).default([]),
  condition: z.string().default('any'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = preferencesSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const prefs = parsed.data

    const laptops = await prisma.laptop.findMany({
      where: {
        archived: false,
        price: { lte: Math.round(prefs.budgetMax * 1.10) },
      },
    })

    const results = scoreAll(laptops as Parameters<typeof scoreAll>[0], prefs)

    await prisma.queryLog.create({
      data: {
        useCase: prefs.useCase,
        budgetMin: prefs.budgetMin,
        budgetMax: prefs.budgetMax,
        resultCount: results.length,
      },
    })

    return NextResponse.json({ results })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/recommend]', message)
    return NextResponse.json({ error: 'Recommendation failed', detail: message }, { status: 500 })
  }
}
