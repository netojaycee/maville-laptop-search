import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { LaptopForm } from '@/components/admin/LaptopForm'

export default async function EditLaptopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const laptop = await prisma.laptop.findUnique({ where: { id } })
  if (!laptop) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Edit Laptop</h1>
        <p className="mt-1 text-[#8B97A8]">{laptop.brand} {laptop.model}</p>
      </div>
      <LaptopForm laptop={laptop as any} />
    </div>
  )
}
