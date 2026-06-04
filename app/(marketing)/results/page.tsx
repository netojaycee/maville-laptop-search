import type { Metadata } from 'next'
import { ResultsClient } from './ResultsClient'

export const metadata: Metadata = {
  title: 'Your Laptop Matches',
  description: 'Personalised laptop recommendations based on your preferences.',
}

export default function ResultsPage() {
  return <ResultsClient />
}
