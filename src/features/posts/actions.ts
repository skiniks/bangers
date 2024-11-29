'use server'

import type { OutputSchema } from '@atproto/api/dist/client/types/app/bsky/feed/getAuthorFeed'

export async function fetchPostsFromBsky(handle: string): Promise<OutputSchema['feed']> {
  if (!handle)
    return []

  const allPosts: OutputSchema['feed'] = []
  let cursor = null
  const uniqueIds = new Set()

  try {
    do {
      const response = await fetch(`https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}${cursor ? `&cursor=${cursor}` : ''}`)

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)

      const data: OutputSchema = await response.json()

      if (!data?.feed)
        break

      data.feed.forEach((post) => {
        if (!uniqueIds.has(post.post.cid)) {
          uniqueIds.add(post.post.cid)
          allPosts.push(post)
        }
      })

      cursor = data.cursor
    } while (cursor)

    const filteredPosts = allPosts.filter(item => item.post.author.handle === handle)
    return filteredPosts.sort((a, b) => (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0)).slice(0, 10)
  }
  catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}
