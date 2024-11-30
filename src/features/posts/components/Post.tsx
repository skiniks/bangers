import type { AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyFeedDefs } from '@atproto/api'
import type { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { getElapsedTime } from '@/shared/utils/time'
import { RichText } from '@atproto/api'
import { Icon } from '@iconify/react'
import { useMemo } from 'react'

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
  facets?: Array<{
    index: { byteStart: number, byteEnd: number }
    features: Array<{ $type: string, [key: string]: unknown }>
  }>
  [key: string]: unknown
}

interface ImageView {
  thumb: string
  alt?: string
  fullsize?: string
}

interface EmbedViewExternal {
  external: {
    uri: string
    title?: string
    description?: string
    thumb?: string
  }
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

function RichTextRenderer({ text, facets }: { text: string, facets?: TextRecord['facets'] }) {
  const richText = useMemo(() => {
    if (!facets)
      return new RichText({ text })
    return new RichText({ text, facets })
  }, [text, facets])

  const segments = useMemo(() => Array.from(richText.segments()), [richText])

  return (
    <span className="whitespace-pre-wrap break-words">
      {segments.map((segment, index) => {
        const key = segment.isMention()
          ? `mention-${segment.text}`
          : segment.isLink()
            ? `link-${segment.link?.uri}`
            : segment.isTag()
              ? `tag-${segment.text}`
              : `text-${segment.text.substring(0, 10)}-${index}`

        if (segment.isMention()) {
          return (
            <a key={key} href={`https://bsky.app/profile/${segment.text}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {segment.text}
            </a>
          )
        }

        if (segment.isLink()) {
          return (
            <a key={key} href={segment.link?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {segment.text}
            </a>
          )
        }

        if (segment.isTag()) {
          return (
            <a key={key} href={`https://bsky.app/search?q=${encodeURIComponent(segment.text)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {segment.text}
            </a>
          )
        }

        return <span key={key}>{segment.text}</span>
      })}
    </span>
  )
}

function PostContent({ record, embed }: PostContentProps) {
  if (!isTextRecord(record))
    return null

  return (
    <div className="mb-4">
      <div className="break-words">
        <RichTextRenderer text={record.text} facets={record.facets} />
      </div>
      {embed !== null && <PostEmbed embed={embed} />}
    </div>
  )
}

function PostMediaContent({ images }: { images: ImageView[] }) {
  if (!images?.length)
    return null

  const gridCols = images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : images.length === 3 ? 'grid-cols-2' : 'grid-cols-2'

  return (
    <div className={`mt-2 grid gap-2 ${gridCols}`}>
      {images.map((image: ImageView, index) => {
        const shouldSpanFull = images.length === 3 && index === 0

        return (
          <div key={image.thumb} className={`relative aspect-square overflow-hidden rounded-lg bg-gray-800/50 ${shouldSpanFull ? 'col-span-2' : ''}`}>
            <img src={image.thumb} alt={image.alt || ''} className="h-full w-full object-cover" />
            {image.alt && <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-xs text-white">{image.alt}</div>}
            <a
              href={image.fullsize || image.thumb}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <span className="sr-only">View full image</span>
            </a>
          </div>
        )
      })}
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
      return <PostMediaContent images={imagesEmbed.images} />
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
          {mediaEmbed.media.$type === 'app.bsky.embed.images#view' && <PostMediaContent images={(mediaEmbed.media as AppBskyEmbedImages.View).images} />}
        </div>
      )
    }
    case 'app.bsky.embed.external#view': {
      const externalEmbed = embed as unknown as { external: EmbedViewExternal['external'] }
      const { uri, thumb, title, description } = externalEmbed.external

      return (
        <div className="mt-2 rounded-lg border border-white/[0.08] bg-gray-800/50 p-3 group">
          <div className="relative">
            {thumb && (
              <div className="relative aspect-[1.91/1] mb-3 overflow-hidden rounded-lg bg-gray-800/50">
                <img src={thumb} alt={title || 'Link preview'} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="font-medium line-clamp-1">{title}</span>
              {description && <span className="text-sm text-gray-400 line-clamp-2">{description}</span>}
              <span className="text-sm text-gray-500 truncate">{new URL(uri).hostname}</span>
            </div>
            <a href={uri} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="absolute inset-0 bg-gray-800/0 hover:bg-gray-800/20 transition-colors rounded-lg">
              <span className="sr-only">
                Visit
                {title || 'link'}
              </span>
            </a>
          </div>
        </div>
      )
    }
    default:
      return null
  }
}

function QuotePostEmbed({ record }: { record: AppBskyFeedDefs.PostView }) {
  return (
    <div className="mt-2 rounded-lg border border-white/[0.08] bg-gray-800/50 p-3">
      <div className="flex items-center gap-2">
        {record.author.avatar && <img src={record.author.avatar} alt={record.author.handle} className="h-5 w-5 rounded-full" />}
        <span className="font-medium">{record.author.displayName || record.author.handle}</span>
      </div>
      {isTextRecord(record.record) && (
        <div className="mt-1 text-sm">
          <RichTextRenderer text={record.record.text} facets={record.record.facets} />
        </div>
      )}
    </div>
  )
}

export default function Post({ post }: PostProps) {
  const postId = post.uri.split('/').pop()
  const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${postId}`
  const isRepost = post.record && typeof post.record === 'object' && '$type' in post.record && post.record.$type === 'app.bsky.feed.defs#repostRecord'
  const postContent = isRepost && typeof post.record === 'object' && 'subject' in post.record ? post.record.subject : post.record

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm text-gray-100 p-4 mt-4 rounded-xl border border-white/[0.08] shadow-xl">
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          {post.author.avatar && <img src={post.author.avatar} alt={post.author.handle} className="h-10 w-10 rounded-full ring-2 ring-white/10" />}
          <div>
            <div className="font-medium">{post.author.displayName || post.author.handle}</div>
            <div className="text-sm text-gray-400">
              @
              {post.author.handle}
            </div>
          </div>
        </div>

        <PostContent record={postContent as Record<string, unknown>} embed={post.embed} />

        <div className="flex justify-between items-center text-gray-400">
          <div className="flex items-center">
            <Icon icon="mdi:heart" className="w-5 h-5 text-red-400" aria-hidden="true" />
            <span className="ml-1 mr-2">{post.likeCount || 0}</span>
            <Icon icon="mdi:repeat" className="w-5 h-5 text-green-400" aria-hidden="true" />
            <span className="ml-1">{post.repostCount || 0}</span>
          </div>
          <div>{getElapsedTime(post.indexedAt)}</div>
        </div>

        <a href={postUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-gray-800/0 hover:bg-gray-800/20 transition-colors rounded-xl">
          <span className="sr-only">View post</span>
        </a>
      </div>
    </div>
  )
}
