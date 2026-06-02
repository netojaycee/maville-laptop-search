import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RecommendationModal } from '@/components/recommendation/RecommendationModal'
import { MatchesWidget }       from '@/components/recommendation/MatchesWidget'
import { CompareDrawer }       from '@/components/laptops/CompareDrawer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Modals / overlays — order matters for z-index stacking */}
      <RecommendationModal />   {/* z-50 */}
      <MatchesWidget />          {/* z-45 */}
      <CompareDrawer />          {/* z-50 */}
    </>
  )
}
