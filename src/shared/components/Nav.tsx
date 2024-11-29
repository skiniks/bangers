import { Icon } from '@iconify/react'
import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800/50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
              Bangers
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/skiniks/bangers" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <Icon icon="simple-icons:github" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
