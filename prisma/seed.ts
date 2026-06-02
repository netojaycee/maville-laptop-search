import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as XLSX from 'xlsx'
import * as path from 'path'
import * as fs from 'fs'
import slugifyLib from 'slugify'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

// For migrations/seeding, prefer the direct (non-pooler) URL if provided
const dbUrl = process.env.DATABASE_SEED_URL || process.env.DATABASE_URL
if (!dbUrl) throw new Error('DATABASE_URL is not set in .env.local')

const adapter = new PrismaPg({ connectionString: dbUrl })
const prisma  = new PrismaClient({ adapter })

function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, trim: true })
}

function parseBoolean(val: unknown): boolean {
  if (typeof val === 'boolean') return val
  if (typeof val === 'number')  return val === 1
  if (typeof val === 'string')  return ['yes', '1', 'true', 'y'].includes(val.toLowerCase())
  return false
}

function parseNumber(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

// Case-insensitive column lookup — exact match only (no partial) to avoid "RAM" → "Upgradeable RAM"
function col(row: Record<string, unknown>, ...keys: string[]): unknown {
  const rowKeys = Object.keys(row)
  for (const key of keys) {
    if (key in row) return row[key]
    const found = rowKeys.find((k) => k.trim().toLowerCase() === key.trim().toLowerCase())
    if (found !== undefined) return row[found]
  }
  return undefined
}

// Safe integer parse — strips non-digits (e.g. "8GB" → 8), falls back to defaultVal
function safeInt(val: unknown, defaultVal: number): number {
  if (val === undefined || val === null || val === '') return defaultVal
  const n = parseInt(String(val).replace(/[^\d]/g, ''), 10)
  return isNaN(n) || n === 0 ? defaultVal : n
}

async function seedAdmin() {
  const email        = process.env.ADMIN_EMAIL
  const passwordHash = process.env.ADMIN_PASSWORD_HASH

  if (!email || !passwordHash) {
    console.log('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD_HASH not set — skipping admin seed')
    return
  }

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password: passwordHash },
  })
  console.log(`✓ Admin seeded: ${email}`)
}

async function seedLaptops() {
  // __dirname is not available in ESM/tsx — use process.cwd() instead
  const xlsxPath = path.join(process.cwd(), 'prisma', 'data', 'inventory.xlsx')

  if (!fs.existsSync(xlsxPath)) {
    console.log(`⚠️  inventory.xlsx not found at ${xlsxPath} — skipping laptop seed`)
    return
  }

  const workbook = XLSX.readFile(xlsxPath)
  const sheetName = workbook.SheetNames[0]
  const sheet     = workbook.Sheets[sheetName]
  const rows      = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[]

  console.log(`📦 Sheet: "${sheetName}" — ${rows.length} rows`)

  if (rows.length === 0) {
    console.log('⚠️  No rows found in sheet')
    return
  }

  // Log the actual column names from the first row so you can verify mapping
  console.log('📋 Columns found:', Object.keys(rows[0]).join(' | '))

  let upserted = 0
  let skipped  = 0

  for (const row of rows) {
    const brand = String(col(row, 'Brand', 'brand', 'Make') || '').trim()
    const model = String(col(row, 'Model', 'model', 'Name', 'Laptop') || '').trim()

    if (!brand || !model) {
      skipped++
      continue
    }

    const slug = slugify(`${brand}-${model}`)

    // Extract fields — safeInt prevents NaN from being passed to Prisma Int fields
    const cpuName   = String(col(row, 'CPU', 'Processor', 'CPU Name', 'Chip') || '')
    const ram       = safeInt(col(row, 'RAM', 'RAM (GB)', 'Memory (GB)', 'Memory'), 8)
    const storage   = String(col(row, 'Storage', 'SSD', 'HDD', 'Disk') || '256GB SSD')
    const gpu       = String(col(row, 'GPU', 'Graphics', 'Video Card', 'Display Adapter') || 'Intel UHD')
    const price     = safeInt(col(row, 'Price', 'Price (NGN)', 'Cost', 'Amount'), 0)
    const condition = String(col(row, 'Condition', 'Grade', 'Status') || 'Used')

    try {
      await prisma.laptop.upsert({
        where:  { slug },
        update: { price, condition, availability: String(col(row, 'Availability', 'availability', 'Stock') || 'In Stock') },
        create: {
          slug,
          brand,
          model,
          cpuName,
          cpuGeneration:         col(row, 'CPU Generation', 'CPU Gen', 'Generation', 'Gen') ? String(col(row, 'CPU Generation', 'CPU Gen', 'Generation', 'Gen')) : null,
          ram,
          maxRam:                parseNumber(col(row, 'Max RAM', 'Max RAM (GB)')),
          ramUpgradeable:        parseBoolean(col(row, 'Upgradeable RAM', 'RAM Upgradeable', 'Upgradeable')),
          storage,
          storageType:           col(row, 'Storage Type') ? String(col(row, 'Storage Type')) : null,
          additionalSsdSlot:     parseBoolean(col(row, 'Additional SSD Slot')),
          gpu,
          batteryHealth:         col(row, 'Battery Health') ? String(col(row, 'Battery Health')) : null,
          estimatedBatteryHours: parseNumber(col(row, 'Estimated Battery Hours', 'Battery Hours', 'Battery Life')),
          weight:                parseNumber(col(row, 'Weight (kg)', 'Weight')),
          touchscreen:           parseBoolean(col(row, 'Touchscreen', 'Touch Screen')),
          backlitKeyboard:       parseBoolean(col(row, 'Backlit Keyboard', 'Backlit')),
          fingerprintReader:     parseBoolean(col(row, 'Fingerprint', 'Fingerprint Reader')),
          chargerIncluded:       parseBoolean(col(row, 'Charger Included', 'Charger') ?? true),
          keyboardType:          col(row, 'Keyboard Type') ? String(col(row, 'Keyboard Type')) : null,
          condition,
          price,
          availability:          String(col(row, 'Availability', 'Stock') || 'In Stock'),
          images:                col(row, 'Laptop Image URL', 'Image URL', 'Image') ? [String(col(row, 'Laptop Image URL', 'Image URL', 'Image'))] : [],
          gamingScore:           parseNumber(col(row, 'Gaming Score', 'Gaming')),
          editingScore:          parseNumber(col(row, 'Editing Score', 'Editing')),
          programmingScore:      parseNumber(col(row, 'Programming Score', 'Programming')),
          batteryScore:          parseNumber(col(row, 'Battery Score')),
          featured:              parseBoolean(col(row, 'Featured')),
        },
      })
      upserted++
      if (upserted % 10 === 0) process.stdout.write(`  → ${upserted} done...\r`)
    } catch (err) {
      console.error(`\n✗ Failed ${brand} ${model}:`, (err as Error).message)
      skipped++
    }
  }

  console.log(`\n✓ Seeded ${upserted} laptops (${skipped} skipped)`)
}

async function main() {
  console.log('🌱 Starting seed...')
  await seedAdmin()
  await seedLaptops()
  console.log('✅ Seed complete')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
