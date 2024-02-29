'use client'

import { useState } from 'react'
import Post from '@/components/Post'
import SearchBar from '@/components/SearchBar'
import WarningBar from '@/components/WarningBar'
import type { ApiResponse, PostView } from '@/types'

function Page() {
  const [tempIdentifier, setTempIdentifier] = useState('')
  const [posts, setPosts] = useState<PostView[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchPosts = async () => {
    if (!tempIdentifier) {
      alert('Please enter an identifier.')
      return
    }
    setLoading(true)
    setHasSearched(true)
    let allPosts: PostView[] = []
    let cursor = null
    const uniqueIds = new Set()

    try {
      do {
        const response: Response = await fetch(`https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${tempIdentifier}${cursor ? `&cursor=${cursor}` : ''}`)
        if (response.status === 200) {
          const data: ApiResponse = await response.json()
          if (data && data.feed) {
            const newPosts = data.feed.filter(post => !uniqueIds.has(post.post.cid))
            newPosts.forEach(post => uniqueIds.add(post.post.cid))
            allPosts = allPosts.concat(newPosts)
            cursor = data.cursor
          }
          else {
            console.error('Failed to fetch posts:', data)
            break
          }
        }
        else {
          console.error('HTTP Error:', response.statusText)
          break
        }
      } while (cursor)

      const filteredPosts = allPosts.filter(item => item.post.author.handle === tempIdentifier)
      const topPosts = filteredPosts.sort((a: PostView, b: PostView) => b.post.likeCount - a.post.likeCount).slice(0, 10)
      setPosts(topPosts)
    }
    catch (error) {
      console.error('Error fetching posts:', error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">Bangers</h1>
      </div>
      <SearchBar
        tempIdentifier={tempIdentifier}
        setTempIdentifier={setTempIdentifier}
        fetchPosts={fetchPosts}
        loading={loading}
      />
      {!loading && hasSearched && posts.length === 0 && (
        <div className="mt-4 text-center">No posts found.</div>
      )}
      {!loading && posts.map((item, index) => (
        <Post key={index} post={item.post} identifier={item.post.author.handle} />
      ))}
      <WarningBar />
    </div>
  )
}

export default Page
