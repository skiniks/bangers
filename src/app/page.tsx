'use client'

import { useEffect, useState } from 'react'
import type { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { useBskyAgent } from './hooks/useBskyAgent'
import LoginForm from '@/components/LoginForm'
import Post from '@/components/Post'
import SearchBar from '@/components/SearchBar'
import WarningBar from '@/components/WarningBar'

const Page: React.FC = () => {
  const [agent, agentReady] = useBskyAgent()
  const [handle, setHandle] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [tempIdentifier, setTempIdentifier] = useState<string>('')
  const [identifier, setIdentifier] = useState<string>('')
  const [posts, setPosts] = useState<PostView[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [hasFetchedPosts, setHasFetchedPosts] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (agentReady) {
      const storedSession = localStorage.getItem('sessionData')
      setIsLoggedIn(!!storedSession)
    }
  }, [agentReady])

  const authenticate = async () => {
    if (!agent)
      return
    setLoading(true)
    try {
      await agent.login({ identifier: handle, password })
      setIsLoggedIn(true)
    }
    catch (error) {
      console.error('Authentication failed:', error)
      setIsLoggedIn(false)
    }
    finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    if (!agent || !isLoggedIn) {
      alert('Please log in first.')
      return
    }
    setLoading(true)
    setHasFetchedPosts(false)

    let allPosts: PostView[] = []
    let nextCursor
    const seenCids = new Set()

    try {
      do {
        const params = {
          actor: tempIdentifier,
          ...(nextCursor && { cursor: nextCursor }),
          limit: 100,
        }
        const response = await agent.getAuthorFeed(params)

        if (response.success && response.data.feed) {
          const filteredPosts = response.data.feed.filter((post) => {
            const isUnique = !seenCids.has(post.post.cid)
            if (isUnique)
              seenCids.add(post.post.cid)
            return isUnique && post.post.author.handle === tempIdentifier
          })

          allPosts = [...allPosts, ...filteredPosts.map(item => ({
            ...item.post,
            record: item.post.record,
          }))]
          nextCursor = response.data.cursor
        }
        else {
          console.error('Fetch posts failed:', response)
          break
        }
      } while (nextCursor)

      const sortedPostsData = allPosts.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0)).slice(0, 10)
      setPosts(sortedPostsData)
      setIdentifier(tempIdentifier)
    }
    catch (error) {
      console.error('Failed to fetch posts:', error)
    }
    finally {
      setLoading(false)
      if (allPosts.length > 0)
        setHasFetchedPosts(true)
    }
  }

  const logout = () => {
    localStorage.removeItem('sessionData')
    setIsLoggedIn(false)
  }

  const clearPosts = () => {
    setPosts([])
    setHasFetchedPosts(false)
  }

  if (isLoggedIn === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-5xl font-bold">Bangers</h1>
        {isLoggedIn && (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log Out
          </button>
        )}
      </div>
      {!isLoggedIn
        ? (
          <LoginForm
            handle={handle}
            setHandle={setHandle}
            password={password}
            setPassword={setPassword}
            authenticate={authenticate}
            loading={loading}
          />
          )
        : (
          <>
            <SearchBar
              tempIdentifier={tempIdentifier}
              setTempIdentifier={setTempIdentifier}
              fetchPosts={fetchPosts}
              loading={loading}
            />
            {hasFetchedPosts && posts.length > 0 && (
              <button
                onClick={clearPosts}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Clear
              </button>
            )}
          </>
          )}
      {!loading && hasFetchedPosts && posts.length === 0 && <div className="mt-4">No posts found.</div>}
      {!loading && posts.map((post, index) => <Post key={index} post={post} identifier={identifier} />)}
      <WarningBar />
    </div>
  )
}

export default Page
