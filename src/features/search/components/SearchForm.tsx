'use client'

import type { OutputSchema } from '@atproto/api/dist/client/types/app/bsky/feed/getAuthorFeed'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import PostList from '../../posts/components/PostList'
import { fetchPostsFromBsky } from '@/features/posts/actions'

export default function SearchForm() {
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
    gcTime: 1000 * 60 * 10,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDebouncedHandle(handle)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          placeholder="Enter user handle"
          className="w-full mb-2 form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
        />
        <button
          type="submit"
          disabled={isLoading || !handle}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Loading posts...
              </>
              )
            : (
                'Fetch Posts'
              )}
        </button>
      </form>

      {isLoading && <p className="text-sm text-gray-400 mt-2 text-center">This may take a moment if the user has many posts to analyze</p>}

      {isError && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          Error:
          {error.message}
        </div>
      )}

      {!isLoading && !isError && posts?.length === 0 && debouncedHandle && <div className="mt-4 text-center">No posts found.</div>}

      {posts && <PostList posts={posts} />}
    </>
  )
}
