'use client'

import type { OutputSchema } from '@atproto/api/dist/client/types/app/bsky/feed/getAuthorFeed'
import PostList from '@/features/posts/components/PostList'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { fetchPostsFromBsky } from '../../posts/actions'
import SearchForm from './SearchForm'

export default function SearchContainer({ featureCard }: { featureCard: React.ReactNode }) {
  const [hasSearched, setHasSearched] = useState(false)
  const [handle, setHandle] = useState('')
  const [debouncedHandle, setDebouncedHandle] = useState('')

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<OutputSchema['feed'], Error>({
    queryKey: ['posts', debouncedHandle],
    queryFn: () => fetchPostsFromBsky(debouncedHandle),
    enabled: Boolean(debouncedHandle),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  })

  const handleClear = () => {
    setHandle('')
    setDebouncedHandle('')
    setHasSearched(false)
  }

  return (
    <>
      <AnimatePresence>
        {!hasSearched && (
          <motion.div initial={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ duration: 0.3 }}>
            {featureCard}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout transition={{ type: 'spring', bounce: 0.2 }} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
        <AnimatePresence>
          {!hasSearched && (
            <motion.div initial={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-3 mb-4 overflow-hidden">
              <h2 className="text-lg font-medium text-white">Start Exploring</h2>
              <div className="h-4 w-px bg-gray-700" />
              <p className="text-gray-400 text-sm">Enter a Bluesky handle to find their best content</p>
            </motion.div>
          )}
        </AnimatePresence>

        <SearchForm
          handle={handle}
          setHandle={setHandle}
          onSubmit={() => {
            setDebouncedHandle(handle)
            setHasSearched(true)
          }}
          onClear={handleClear}
          isLoading={isLoading}
        />
      </motion.div>

      {isLoading && <p className="text-sm text-gray-400 mt-2 text-center">This may take a moment if the user has many posts to analyze</p>}

      {isError && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-md">
          Error:
          {error.message}
        </div>
      )}

      {!isLoading && !isError && posts?.length === 0 && debouncedHandle && <div className="mt-4 text-center text-gray-300">No posts found.</div>}

      {posts && <PostList posts={posts} />}
    </>
  )
}
