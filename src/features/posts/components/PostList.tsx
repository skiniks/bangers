import type { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import Pagination from './Pagination'
import Post from './Post'

interface PostListProps {
  data: {
    posts: FeedViewPost[]
    totalPages: number
    currentPage: number
  }
  onPageChange: (page: number) => void
}

export default function PostList({ data, onPageChange }: PostListProps) {
  if (!Array.isArray(data.posts))
    return null

  return (
    <div>
      {data.posts.map(item => (
        <Post key={item.post.cid} post={item.post} identifier={item.post.author.handle} />
      ))}
      <Pagination currentPage={data.currentPage} totalPages={data.totalPages} onPageChange={onPageChange} />
    </div>
  )
}
