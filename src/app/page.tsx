import SearchContainer from '@/features/search/components/SearchContainer'
import Nav from '@/shared/components/Nav'
import { Icon } from '@iconify/react'

export default function Page() {
  const featureCard = (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur rounded-2xl mb-8 shadow-xl border border-gray-700/50 overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-white">
            Find Your Best Content
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Discover your most engaging Bluesky posts, ranked by impact and reach.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-700/50">
        <div className="grid grid-cols-3 divide-x divide-gray-700/50">
          <div className="p-4 text-center">
            <Icon
              icon="mdi:heart"
              className="inline w-6 h-6 text-red-400 mb-2"
            />
            <div className="text-gray-300 text-sm">Most Liked</div>
          </div>
          <div className="p-4 text-center">
            <Icon
              icon="mdi:repeat"
              className="inline w-6 h-6 text-green-400 mb-2"
            />
            <div className="text-gray-300 text-sm">Most Shared</div>
          </div>
          <div className="p-4 text-center">
            <Icon
              icon="mdi:trophy"
              className="inline w-6 h-6 text-amber-400 mb-2"
            />
            <div className="text-gray-300 text-sm">Top 10</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <SearchContainer featureCard={featureCard} />
      </main>
    </div>
  )
}
