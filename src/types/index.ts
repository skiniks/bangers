export interface Author {
  did: string
  handle: string
  displayName: string
  avatar: string
}

export interface PostData {
  uri: string
  cid: string
  author: Author
  record: {
    text: string
    createdAt: string
  }
  likeCount: number
  repostCount: number
  replyCount: number
  indexedAt: string
}

export interface FeedItem {
  post: PostData
}

export interface PostProps {
  post: {
    uri: string
    cid: string
    author: {
      did: string
      handle: string
      displayName: string
      avatar: string
    }
    record: {
      text: string
      createdAt: string
    }
    likeCount: number
    repostCount: number
    replyCount: number
    indexedAt: string
  }
  identifier: string
}

export interface ApiResponse {
  feed: PostView[]
  cursor?: string
}

export interface PostView {
  post: PostData
}
