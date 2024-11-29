import SearchContainer from '@/features/search/components/SearchContainer'
import Nav from '@/shared/components/Nav'
import { Icon } from '@iconify/react'

export default function Page() {
  const featureCard = (
    <div className="relative bg-[#1C1C1E]/80 backdrop-blur-xl rounded-3xl mb-8 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

      <div className="relative px-8 pt-12 pb-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-medium tracking-tight text-white">
            Find Your Best
            {' '}
            <span className="text-blue-400">Posts</span>
          </h2>
          <p className="text-gray-400 text-lg font-light">Discover your most engaging Bluesky posts, ranked by impact and reach.</p>
        </div>
      </div>

      <div className="relative mt-4 bg-[#2C2C2E]/50 border-t border-white/[0.08]">
        <div className="grid grid-cols-3">
          <div className="p-6 flex flex-col items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400/20 blur-xl rounded-full group-hover:bg-red-400/30 transition-all" />
              <Icon icon="mdi:heart" className="relative w-7 h-7 text-red-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-gray-300 text-sm font-medium">Most Liked</div>
          </div>

          <div className="p-6 flex flex-col items-center gap-3 group border-l border-r border-white/[0.08]">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full group-hover:bg-green-400/30 transition-all" />
              <Icon icon="twemoji:fire" className="relative w-7 h-7 text-green-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-gray-300 text-sm font-medium">Most Shared</div>
          </div>

          <div className="p-6 flex flex-col items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full group-hover:bg-amber-400/30 transition-all" />
              <Icon icon="twemoji:trophy" className="relative w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-gray-300 text-sm font-medium">Top 10</div>
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
