import { LaptopForm } from '@/components/admin/LaptopForm'

export default function NewLaptopPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Add New Laptop</h1>
        <p className="mt-1 text-[#8B97A8]">Fill in the details below</p>
      </div>
      <LaptopForm />
    </div>
  )
}
