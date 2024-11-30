import { forceLTR } from './bidi'

const VALIDATE_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/i

export function makeValidHandle(str: string): string {
  if (str.length > 20) {
    str = str.slice(0, 20)
  }
  str = str.toLowerCase()
  return str.replace(/^[^a-z0-9]+/g, '').replace(/[^a-z0-9-]/g, '')
}

export function createFullHandle(name: string, domain: string): string {
  name = (name || '').replace(/\.+$/, '')
  domain = (domain || '').replace(/^\.+/, '')
  return `${name}.${domain}`
}

export function isInvalidHandle(handle: string): boolean {
  return handle === 'handle.invalid'
}

export function sanitizeHandle(handle: string, prefix = ''): string {
  return isInvalidHandle(handle) ? '⚠Invalid Handle' : forceLTR(`${prefix}${handle}`)
}

export interface IsValidHandle {
  handleChars: boolean
  hyphenStartOrEnd: boolean
  frontLength: boolean
  totalLength: boolean
  overall: boolean
}

export function validateHandle(str: string, userDomain: string): IsValidHandle {
  str = str.trim()
  const fullHandle = createFullHandle(str, userDomain)
  const normalizedHandle = str.toLowerCase()

  const results = {
    handleChars: !normalizedHandle || (VALIDATE_REGEX.test(fullHandle) && !normalizedHandle.includes('.')),
    hyphenStartOrEnd: !normalizedHandle.startsWith('-') && !normalizedHandle.endsWith('-'),
    frontLength: normalizedHandle.length >= 1,
    totalLength: fullHandle.length <= 253,
  }

  return {
    ...results,
    overall: !Object.values(results).includes(false),
  }
}
