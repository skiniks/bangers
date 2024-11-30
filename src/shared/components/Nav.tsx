'use client'

import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'

export default function Nav() {
  const router = useRouter()

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/')
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800/50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon icon="twemoji:butterfly" className="w-6 h-6 text-blue-400" aria-hidden="true" />
            <a href="/" onClick={handleLogoClick} className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
              Bangers
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/skiniks/bangers" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <Icon icon="simple-icons:github" className="w-6 h-6" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
