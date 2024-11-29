import SearchContainer from '@/features/search/components/SearchContainer'
import Nav from '@/shared/components/Nav'
import { Icon } from '@iconify/react'

export const maxDuration = 60

export default function Page() {
  const featureCard = (
    <div className="relative bg-linear-to-br/oklch from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl mb-8 shadow-xl inset-shadow-sm inset-shadow-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br/oklch from-blue-500/5 via-purple-500/5 to-pink-500/5" />

      <div className="relative px-8 pt-12 pb-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white">
            Find Your Best
            {' '}
            <span className="bg-linear-to-r/oklch from-blue-400 to-blue-300 text-transparent bg-clip-text">Posts</span>
          </h2>
          <p className="text-gray-400 text-lg font-light">
            Discover your most engaging
            {' '}
            <a href="https://bsky.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors ease-fluid font-bold">
              Bluesky
            </a>
            {' '}
            posts, ranked by community engagement.
          </p>
        </div>
      </div>

      <div className="relative mt-4 bg-gradient-to-b from-gray-800/50 to-gray-800/30 border-t border-white/[0.08]">
        <div className="grid grid-cols-3">
          <div className="p-6 flex flex-col items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400/20 blur-xl rounded-full group-hover:bg-red-400/30 transition-all ease-fluid" />
              <Icon icon="mdi:heart" className="relative w-7 h-7 text-red-400 group-hover:scale-110 transition-all ease-fluid" />
            </div>
            <div className="text-gray-300 text-sm font-medium">Likes</div>
          </div>

          <div className="p-6 flex flex-col items-center gap-3 group border-l border-r border-white/[0.08]">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full group-hover:bg-green-400/30 transition-all ease-fluid" />
              <Icon icon="twemoji:fire" className="relative w-7 h-7 text-green-400 group-hover:scale-110 transition-all ease-fluid" />
            </div>
            <div className="text-gray-300 text-sm font-medium">Reposts</div>
          </div>

          <div className="p-6 flex flex-col items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full group-hover:bg-amber-400/30 transition-all ease-fluid" />
              <Icon icon="twemoji:sparkles" className="relative w-7 h-7 text-amber-400 group-hover:scale-110 transition-all ease-fluid" />
            </div>
            <div className="text-gray-300 text-sm font-medium">Engagement</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="scheme-dark min-h-screen bg-linear-to-b/oklch from-gray-900 via-gray-900 to-gray-800">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <SearchContainer featureCard={featureCard} />
      </main>
    </div>
  )
}
