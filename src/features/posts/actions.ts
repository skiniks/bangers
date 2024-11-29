'use server'

import type { OutputSchema } from '@atproto/api/dist/client/types/app/bsky/feed/getAuthorFeed'
import process from 'node:process'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'

const REVALIDATE_TTL = 60 * 5

interface PostAnalysis {
  engagement: number
  isReply: boolean
  hasMedia: boolean
  textLength: number
  mentions: number
  urls: number
}

interface AnalyzedPost {
  post: OutputSchema['feed'][0]['post']
  analysis: PostAnalysis
  score: number
}

function analyzePost(post: OutputSchema['feed'][0]): AnalyzedPost {
  const analysis: PostAnalysis = {
    engagement: (post.post.likeCount || 0) + (post.post.repostCount || 0),
    isReply: post.reply !== undefined,
    hasMedia: post.post.embed !== undefined,
    textLength: typeof post.post.record === 'object' ? (post.post.record as { text?: string })?.text?.length || 0 : 0,
    mentions: 0,
    urls: 0,
  }

  const score = analysis.engagement * 1.0 + (analysis.hasMedia ? 0.2 : 0) + (analysis.isReply ? -0.1 : 0) + Math.min(analysis.textLength / 100, 1) * 0.3

  return {
    post: post.post,
    analysis,
    score,
  }
}

async function fetchFromBskyAPI(handle: string) {
  const allPosts: OutputSchema['feed'] = []
  let cursor = null
  const uniqueIds = new Set()

  try {
    do {
      const response = await fetch(`https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}${cursor ? `&cursor=${cursor}` : ''}`, { headers: { Accept: 'application/json' } })

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)

      const data: OutputSchema = await response.json()

      if (!data?.feed)
        break

      data.feed.forEach((post) => {
        if (post.post.author.handle === handle && !uniqueIds.has(post.post.cid)) {
          uniqueIds.add(post.post.cid)
          allPosts.push(post)
        }
      })

      cursor = data.cursor
    } while (cursor)

    return allPosts
  }
  catch (error) {
    console.error('Error fetching from Bluesky:', error)
    throw error
  }
}

const POSTS_PER_PAGE = 20

export async function fetchPostsFromBsky(handle: string, page = 1) {
  const cached = await unstable_cache(
    async (): Promise<{
      posts: OutputSchema['feed']
      totalPages: number
      currentPage: number
      lastUpdated: string
    }> => {
      if (!handle) {
        return {
          posts: [],
          totalPages: 0,
          currentPage: 1,
          lastUpdated: new Date().toISOString(),
        }
      }

      try {
        const allPosts = await fetchFromBskyAPI(handle)

        const analyzedPosts = allPosts.map(post => analyzePost(post)).sort((a, b) => b.score - a.score)

        const totalPages = Math.ceil(analyzedPosts.length / POSTS_PER_PAGE)
        const startIndex = (page - 1) * POSTS_PER_PAGE
        const paginatedPosts = analyzedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE).map(({ post }) => ({ post }))

        return {
          posts: paginatedPosts,
          totalPages,
          currentPage: page,
          lastUpdated: new Date().toISOString(),
        }
      }
      catch (error) {
        console.error('Error in fetchPostsFromBsky:', error)
        throw error
      }
    },
    [`posts:${handle}:${page}`],
    {
      revalidate: REVALIDATE_TTL,
      tags: ['posts'],
    },
  )()

  return cached
}

export async function invalidatePostsCache(_handle: string) {
  const headersList = await headers()
  const adminKey = headersList.get('x-admin-key')

  if (adminKey !== process.env.ADMIN_KEY)
    throw new Error('Unauthorized')

  await fetch('/api/revalidate?tag=posts', { method: 'POST' })
}
