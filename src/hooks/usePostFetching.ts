import type { AppBskyFeedDefs } from '@atcute/bluesky'
import { useCallback, useState } from 'react'

const POSTS_PER_PAGE = 20

export interface PostAnalysis {
  engagement: number
  isReply: boolean
  hasMedia: boolean
  textLength: number
  mentions: number
  urls: number
}

export interface AnalyzedPost {
  post: AppBskyFeedDefs.FeedViewPost['post']
  analysis: PostAnalysis
  score: number
}

export function usePostFetching() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [analyzedPosts, setAnalyzedPosts] = useState<AnalyzedPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [processedPosts, setProcessedPosts] = useState(0)

  const reset = useCallback(() => {
    setAnalyzedPosts([])
    setCurrentPage(1)
    setProcessedPosts(0)
    setError(null)
  }, [])

  function analyzePost(post: AppBskyFeedDefs.FeedViewPost): AnalyzedPost {
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

  async function fetchPosts(handle: string) {
    setIsLoading(true)
    setError(null)
    setProcessedPosts(0)

    const allPosts: AppBskyFeedDefs.FeedViewPost[] = []
    let cursor: string | undefined
    const uniqueIds = new Set()

    try {
      do {
        const response = await fetch(`https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}${cursor ? `&cursor=${cursor}` : ''}`, { headers: { Accept: 'application/json' } })

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)

        const data: { feed: AppBskyFeedDefs.FeedViewPost[], cursor?: string } = await response.json()

        if (!data?.feed)
          break

        data.feed.forEach((post) => {
          if (post.post.author.handle === handle && !uniqueIds.has(post.post.cid)) {
            uniqueIds.add(post.post.cid)
            allPosts.push(post)
          }
        })

        setProcessedPosts(prev => prev + data.feed.length)
        cursor = data.cursor
      } while (cursor)

      const analyzed = allPosts.map(post => analyzePost(post)).sort((a, b) => b.score - a.score)

      setAnalyzedPosts(analyzed)
      setCurrentPage(1)
    }
    catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'))
    }
    finally {
      setIsLoading(false)
    }
  }

  function getPaginatedPosts() {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    return {
      posts: analyzedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE).map(({ post }) => ({ post })),
      totalPages: Math.ceil(analyzedPosts.length / POSTS_PER_PAGE),
      currentPage,
    }
  }

  return {
    fetchPosts,
    getPaginatedPosts,
    isLoading,
    error,
    setCurrentPage,
    totalPosts: analyzedPosts.length,
    processedPosts,
    reset,
  }
}
