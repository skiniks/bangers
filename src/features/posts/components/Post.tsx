import type { AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyFeedDefs } from '@atproto/api'
import type { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import RepostIcon from '../../../shared/components/icons/RepostIcon'
import LikeIcon from '../../../shared/components/icons/LikeIcon'
import { getElapsedTime } from '../../../shared/utils/time'

interface PostProps {
  post: FeedViewPost['post']
  identifier: string
}

interface PostContentProps {
  record: Record<string, unknown>
  embed?: AppBskyFeedDefs.FeedViewPost['embed']
}

interface TextRecord {
  text: string
  [key: string]: unknown
}

function isTextRecord(record: unknown): record is TextRecord {
  return typeof record === 'object' && record !== null && 'text' in record && typeof (record as { text: unknown }).text === 'string'
}

function isEmbedView(embed: unknown): embed is { $type: string } {
  return typeof embed === 'object' && embed !== null && '$type' in embed
}

function isPostView(record: unknown): record is AppBskyFeedDefs.PostView {
  return typeof record === 'object' && record !== null && 'uri' in record && 'cid' in record && 'author' in record && 'record' in record && 'indexedAt' in record
}

function PostContent({ record, embed }: PostContentProps) {
  if (!isTextRecord(record))
    return null

  return (
    <div className="mb-4">
      <div className="whitespace-pre-wrap">{record.text}</div>
      {embed !== null && <PostEmbed embed={embed} />}
    </div>
  )
}

function PostEmbed({ embed }: { embed: AppBskyFeedDefs.FeedViewPost['embed'] }) {
  if (!isEmbedView(embed))
    return null

  switch (embed.$type) {
    case 'app.bsky.embed.images#view': {
      const imagesEmbed = embed as unknown as AppBskyEmbedImages.View
      if (!imagesEmbed.images)
        return null
      return <ImagesEmbed images={imagesEmbed.images} />
    }
    case 'app.bsky.embed.record#view': {
      const recordEmbed = embed as unknown as AppBskyEmbedRecord.View
      if (!recordEmbed.record || !isPostView(recordEmbed.record))
        return null
      return <QuotePostEmbed record={recordEmbed.record} />
    }
    case 'app.bsky.embed.recordWithMedia#view': {
      const mediaEmbed = embed as unknown as AppBskyEmbedRecordWithMedia.View
      if (!mediaEmbed.record?.record || !isPostView(mediaEmbed.record.record) || !mediaEmbed.media)
        return null
      return (
        <div>
          <QuotePostEmbed record={mediaEmbed.record.record} />
          {mediaEmbed.media.$type === 'app.bsky.embed.images#view' && <ImagesEmbed images={(mediaEmbed.media as AppBskyEmbedImages.View).images} />}
        </div>
      )
    }
    default:
      return null
  }
}

interface ImageView {
  thumb: string
  alt?: string
  fullsize?: string
}

function ImagesEmbed({ images }: { images: ImageView[] }) {
  if (!images?.length)
    return null

  return (
    <div
      className="mt-2 grid gap-2"
      style={{
        gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
      }}
    >
      {images.map((image: ImageView) => (
        <div key={image.thumb} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img src={image.thumb} alt={image.alt || ''} className="h-full w-full object-cover" />
          {image.alt && <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-xs text-white">{image.alt}</div>}
        </div>
      ))}
    </div>
  )
}

function QuotePostEmbed({ record }: { record: AppBskyFeedDefs.PostView }) {
  const isBlocked = record.$type === 'app.bsky.feed.defs#blockedPost'
  const isNotFound = record.$type === 'app.bsky.feed.defs#notFoundPost'
  const isMuted = record.author.viewer?.muted

  if (isBlocked || isNotFound || isMuted)
    return null

  return (
    <div className="mt-2 rounded-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2">
        {record.author.avatar && <img src={record.author.avatar} alt={record.author.handle} className="h-5 w-5 rounded-full" />}
        <span className="font-medium">{record.author.displayName || record.author.handle}</span>
      </div>
      {isTextRecord(record.record) && <div className="mt-1 text-sm">{record.record.text}</div>}
    </div>
  )
}

export default function Post({ post }: PostProps) {
  const postId = post.uri.split('/').pop()
  const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${postId}`

  const isRepost = post.record && typeof post.record === 'object' && '$type' in post.record && post.record.$type === 'app.bsky.feed.defs#repostRecord'

  const postContent = isRepost && typeof post.record === 'object' && 'subject' in post.record ? post.record.subject : post.record

  return (
    <div className="bg-gray-100 text-gray-800 p-4 mt-4 rounded-lg">
      <a href={postUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex items-center gap-3 mb-2">
          {post.author.avatar && <img src={post.author.avatar} alt={post.author.handle} className="h-10 w-10 rounded-full" />}
          <div>
            <div className="font-medium">{post.author.displayName || post.author.handle}</div>
            <div className="text-sm text-gray-500">
              @
              {post.author.handle}
            </div>
          </div>
        </div>

        <PostContent record={postContent as Record<string, unknown>} embed={post.embed} />

        <div className="flex justify-between items-center text-gray-500">
          <div className="flex items-center">
            <LikeIcon />
            <span className="ml-1 mr-2">{post.likeCount || 0}</span>
            <RepostIcon />
            <span className="ml-1">{post.repostCount || 0}</span>
          </div>
          <div>{getElapsedTime(post.indexedAt)}</div>
        </div>
      </a>
    </div>
  )
}
