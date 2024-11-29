'use client'

import type { OutputSchema } from '@atproto/api/dist/client/types/app/bsky/feed/getAuthorFeed'
import { fetchPosts } from '@/app/actions'
import { useState, useTransition } from 'react'
import PostList from '../post/PostList'

export default function SearchForm() {
  const [isPending, startTransition] = useTransition()
  const [posts, setPosts] = useState<OutputSchema['feed']>([])
  const [handle, setHandle] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!handle)
      return

    setHasSearched(true)
    startTransition(async () => {
      const newPosts = await fetchPosts(handle)
      setPosts(newPosts)
    })
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
        <button type="submit" disabled={isPending} className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {isPending ? 'Loading...' : 'Fetch Posts'}
        </button>
      </form>

      {posts.length === 0 && hasSearched && !isPending && <div className="mt-4 text-center">No posts found.</div>}

      <PostList posts={posts} />
    </>
  )
}
