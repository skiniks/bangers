import type { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import Post from './Post'

interface PostListProps {
  posts: FeedViewPost[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div>
      {posts.map(item => (
        <Post key={item.post.cid} post={item.post} identifier={item.post.author.handle} />
      ))}
    </div>
  )
}
