import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RecommendationModal } from '@/components/recommendation/RecommendationModal'
import { CompareDrawer }       from '@/components/laptops/CompareDrawer'
import { LaptopDetailModal }   from '@/components/laptops/LaptopDetailModal'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      <RecommendationModal />   {/* z-50 */}
      <LaptopDetailModal />     {/* z-60 */}
      <CompareDrawer />          {/* z-50 */}
    </>
  )
}
