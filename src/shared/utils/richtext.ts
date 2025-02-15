interface Feature {
  $type: string
  did?: string
  uri?: string
  [key: string]: unknown
}

interface TextFacet {
  index: { byteStart: number, byteEnd: number }
  features: Array<{ $type: string, did?: string, uri?: string, [key: string]: unknown }>
}

interface RichTextSegment {
  text: string
  feature: Feature | undefined
}

const encoder = new TextEncoder()

function createUtf8Slice(text: string, start: number, end: number): string {
  const utf8 = encoder.encode(text)
  const decoder = new TextDecoder()
  return decoder.decode(utf8.slice(start, end))
}

function createSegment(text: string, feature: Feature | undefined): RichTextSegment {
  return { text, feature }
}

export function segmentRichText(text: string, facets?: TextFacet[]): RichTextSegment[] {
  if (!facets?.length) {
    return [createSegment(text, undefined)]
  }

  const segments: RichTextSegment[] = []
  const sortedFacets = [...facets].sort((a, b) => a.index.byteStart - b.index.byteStart)
  const utf8Length = encoder.encode(text).length

  let textCursor = 0
  let facetCursor = 0

  while (facetCursor < sortedFacets.length) {
    const facet = sortedFacets[facetCursor]
    const { byteStart, byteEnd } = facet.index

    if (textCursor < byteStart) {
      segments.push(createSegment(
        createUtf8Slice(text, textCursor, byteStart),
        undefined,
      ))
    }
    else if (textCursor > byteStart) {
      facetCursor++
      continue
    }

    if (byteStart < byteEnd) {
      const subtext = createUtf8Slice(text, byteStart, byteEnd)
      const feature = facet.features[0]

      if (!feature || subtext.trim().length === 0) {
        segments.push(createSegment(subtext, undefined))
      }
      else {
        segments.push(createSegment(subtext, feature))
      }
    }

    textCursor = byteEnd
    facetCursor++
  }

  if (textCursor < utf8Length) {
    segments.push(createSegment(
      createUtf8Slice(text, textCursor, utf8Length),
      undefined,
    ))
  }

  return segments
}

export type { Feature, RichTextSegment, TextFacet }
