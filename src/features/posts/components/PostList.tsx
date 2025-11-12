import type { AppBskyFeedDefs } from '@atcute/bluesky'
import { AnimatePresence, motion } from 'framer-motion'
import Pagination from './Pagination'
import Post from './Post'

interface PostListProps {
  data: {
    posts: AppBskyFeedDefs.FeedViewPost[]
    totalPages: number
    currentPage: number
  }
  onPageChange: (page: number) => void
}

export default function PostList({ data, onPageChange }: PostListProps) {
  if (!Array.isArray(data.posts))
    return null

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait" initial={false}>
        {data.posts.map(feedItem => (
          <motion.div
            key={feedItem.post.cid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.2,
              ease: [0.165, 0.84, 0.44, 1],
            }}
          >
            <Post post={feedItem.post} identifier={feedItem.post.author.handle} />
          </motion.div>
        ))}
      </AnimatePresence>

      {data.totalPages > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <Pagination currentPage={data.currentPage} totalPages={data.totalPages} onPageChange={onPageChange} />
        </motion.div>
      )}
    </div>
  )
}
