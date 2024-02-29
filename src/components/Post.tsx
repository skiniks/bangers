import LikeIcon from '@/components/LikeIcon'
import RepostIcon from '@/components/RepostIcon'
import { getElapsedTime } from '@/lib/utils'

interface PostProps {
  post: {
    uri: string
    likeCount?: number
    repostCount?: number
    indexedAt: string
  }
  identifier: string
}

const Post: React.FC<PostProps> = ({ post, identifier }) => (
  <div className="bg-gray-100 text-gray-800 p-4 mt-4 rounded-lg">
    <a href={`https://bsky.app/profile/${identifier}/post/${post.uri.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
      <div className="mb-4">
        https://bsky.app/profile/
        {identifier}
        /post/
        {post.uri.split('/').pop()}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex">
          <span><LikeIcon /></span>
          <span className="ml-1">{post.likeCount}</span>
          <span className="ml-4"><RepostIcon /></span>
          <span className="ml-1">{post.repostCount}</span>
        </div>
        <div>{getElapsedTime(post.indexedAt)}</div>
      </div>
    </a>
  </div>
)

export default Post
