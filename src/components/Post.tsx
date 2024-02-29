import LikeIcon from '@/components/LikeIcon'
import RepostIcon from '@/components/RepostIcon'
import { getElapsedTime } from '@/lib/utils'
import type { PostProps } from '@/types'

const Post: React.FC<PostProps> = ({ post }) => {
  const postId = post.uri.split('/').pop()
  const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${postId}`

  return (
    <div className="bg-gray-100 text-gray-800 p-4 mt-4 rounded-lg">
      <a href={postUrl} target="_blank" rel="noopener noreferrer" className="break-words">
        <div className="mb-4">
          {postUrl}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <LikeIcon />
            <span className="ml-1 mr-2">{post.likeCount}</span>
            <RepostIcon />
            <span className="ml-1">{post.repostCount}</span>
          </div>
          <div>{getElapsedTime(post.indexedAt)}</div>
        </div>
      </a>
    </div>
  )
}

export default Post
