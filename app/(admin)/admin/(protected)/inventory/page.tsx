import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { InventoryActions } from '@/components/admin/InventoryActions'
import { Laptop } from '@/types'

export default async function InventoryPage() {
  const laptops = await prisma.laptop.findMany({
    where: { archived: false },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Inventory</h1>
          <p className="mt-1 text-[#8B97A8]">{laptops.length} laptops</p>
        </div>
        <Link
          href="/admin/inventory/new"
          className="rounded-xl bg-[#00D4FF] px-5 py-2.5 font-semibold text-black hover:bg-[#00bfe6] transition-colors"
        >
          + Add Laptop
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#1E2530]">
        <table className="w-full">
          <thead className="border-b border-[#1E2530] bg-[#0F1318]">
            <tr>
              {['Brand & Model', 'Price', 'RAM', 'Condition', 'Availability', 'Views', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8B97A8]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2530] bg-[#080B11]">
            {laptops.map((laptop) => (
              <tr key={laptop.id} className="hover:bg-[#0F1318] transition-colors">
                <td className="px-4 py-3">
                  <p className="text-xs text-[#00D4FF]">{laptop.brand}</p>
                  <p className="text-sm font-medium text-white">{laptop.model}</p>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-white">₦{formatPrice(laptop.price)}</td>
                <td className="px-4 py-3 font-mono text-sm text-[#8B97A8]">{laptop.ram}GB</td>
                <td className="px-4 py-3 text-sm text-[#8B97A8]">{laptop.condition}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    laptop.availability === 'In Stock'
                      ? 'bg-[#00E676]/10 text-[#00E676]'
                      : laptop.availability === 'Low Stock'
                      ? 'bg-[#FFB300]/10 text-[#FFB300]'
                      : 'bg-[#FF6B35]/10 text-[#FF6B35]'
                  }`}>
                    {laptop.availability}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-[#8B97A8]">{laptop.views}</td>
                <td className="px-4 py-3">
                  <InventoryActions laptop={laptop as unknown as Laptop} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
