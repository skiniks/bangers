'use client'

import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import PostList from '@/features/posts/components/PostList'
import { usePostFetching } from '@/hooks/usePostFetching'
import SearchForm from './SearchForm'

interface ProfileResponse {
  postsCount?: number
}

const fadeTransition = {
  duration: 0.2,
  ease: [0.32, 0.72, 0, 1] as const,
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
  mass: 0.5,
}

export default function SearchContainer({ featureCard }: { featureCard: React.ReactNode }) {
  const [hasSearched, setHasSearched] = useState(false)
  const [handle, setHandle] = useState('')
  const [debouncedHandle, setDebouncedHandle] = useState('')

  const { fetchPosts, getPaginatedPosts, isLoading, error, setCurrentPage, totalPosts, reset } = usePostFetching()

  const { data: profileData } = useQuery<ProfileResponse>({
    queryKey: ['profile', debouncedHandle],
    queryFn: async () => {
      if (!debouncedHandle)
        return {}
      const response = await fetch(`https://api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${debouncedHandle}`)
      if (!response.ok)
        return {}
      return response.json()
    },
    enabled: Boolean(debouncedHandle),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    reset()
  }, [reset])

  const handleClear = useCallback(() => {
    setHasSearched(false)
    setHandle('')
    setDebouncedHandle('')
    reset()
  }, [reset])

  const handleSubmit = useCallback(() => {
    reset()
    setHasSearched(true)
    setDebouncedHandle(handle)
    fetchPosts(handle)
  }, [handle, fetchPosts, reset])

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
    },
    [setCurrentPage],
  )

  const paginatedData = getPaginatedPosts()

  return (
    <div className="space-y-8">
      <motion.div layout transition={springTransition}>
        <AnimatePresence mode="wait">
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 1, height: 'auto' }}
              exit={{
                opacity: 0,
                height: 0,
                marginBottom: 0,
                transition: {
                  height: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
                  opacity: { duration: 0.2 },
                },
              }}
              className="mb-8"
            >
              {featureCard}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout transition={springTransition} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
          <AnimatePresence mode="wait">
            {!hasSearched && (
              <motion.div initial={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={fadeTransition} className="flex items-center gap-3 mb-4 overflow-hidden">
                <h2 className="text-lg font-medium text-white">Start Exploring</h2>
                <div className="h-4 w-px bg-gray-700" />
                <p className="text-gray-400 text-sm">Enter a Bluesky handle to find their most engaging posts.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <SearchForm handle={handle} setHandle={setHandle} onSubmit={handleSubmit} onClear={handleClear} isLoading={isLoading} />
        </motion.div>
      </motion.div>

      <div className="relative min-h-[100px]">
        <AnimatePresence mode="wait">
          {isLoading
            ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fadeTransition}
                  className="absolute inset-0 mt-6 flex justify-center items-center"
                >
                  <div className="relative max-w-md bg-gray-800/20 backdrop-blur-sm rounded-lg border border-white/[0.08] shadow-lg overflow-hidden inline-flex">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-r/oklch from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" style={{ animationTimingFunction: 'ease-in-out' }} />
                    </div>
                    <div className="relative px-4 py-3 flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
                        <Icon icon="mdi:loading" className="w-5 h-5 text-blue-400 animate-[spin_2s_linear_infinite]" aria-hidden="true" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium bg-linear-to-r/oklch from-blue-400/90 to-blue-300/90 text-transparent bg-clip-text whitespace-nowrap">
                            Analyzing Posts
                            {profileData?.postsCount !== undefined && ` (${profileData.postsCount.toLocaleString()} total)`}
                          </span>
                          <span className="text-sm text-gray-400 whitespace-nowrap">{totalPosts > 0 ? `Processed ${totalPosts.toLocaleString()} posts so far...` : 'Finding the most engaging posts'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            : null}

          {!isLoading && (
            <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.1 }}>
              {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-md">
                  Error:
                  {error.message}
                </div>
              )}

              {!error && paginatedData.posts.length === 0 && debouncedHandle && <div className="mt-4 text-center text-gray-300">No posts found.</div>}

              {paginatedData.posts.length > 0 && (
                <PostList
                  data={{
                    posts: paginatedData.posts,
                    totalPages: paginatedData.totalPages,
                    currentPage: paginatedData.currentPage,
                  }}
                  onPageChange={handlePageChange}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
