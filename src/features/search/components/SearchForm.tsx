import LoadingButton from '@/shared/components/LoadingButton'
import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { type IsValidHandle, validateHandle } from '../utils/strings/handles'

interface SearchFormProps {
  handle: string
  setHandle: (value: string) => void
  onSubmit: () => void
  onClear: () => void
  isLoading: boolean
}

export default function SearchForm({ handle, setHandle, onSubmit, onClear, isLoading }: SearchFormProps) {
  const [error, setError] = useState<string>('')
  const [isDirty, setIsDirty] = useState(false)

  function getValidationError(results: IsValidHandle): string {
    if (!results.handleChars)
      return 'Handle can only contain letters, numbers, and hyphens'
    if (!results.hyphenStartOrEnd)
      return 'Handle cannot start or end with a hyphen'
    if (!results.frontLength)
      return 'Handle must be at least 3 characters'
    if (!results.totalLength)
      return 'Handle is too long'
    return ''
  }

  function validateHandleInput(value: string): boolean {
    if (!value) {
      setError('')
      return false
    }

    const parts = value.split('.')
    if (parts.length < 2) {
      setError('Invalid handle format. Example: user.bsky.social')
      return false
    }

    const handlePart = parts[0]
    const domain = parts.slice(1).join('.')

    const results = validateHandle(handlePart, domain)

    if (!results.overall) {
      setError(getValidationError(results))
      return false
    }

    setError('')
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsDirty(true)

    if (validateHandleInput(handle)) {
      onSubmit()
    }
  }

  function handleInputChange(value: string) {
    setHandle(value.toLowerCase())
    if (isDirty) {
      validateHandleInput(value)
    }
  }

  function handleClearClick() {
    onClear()
    setError('')
    setIsDirty(false)
  }

  const isValid = !error && handle.length > 0

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 ${error ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
            <Icon icon="mdi:at" className={`w-4 h-4 ${error ? 'text-red-500' : 'text-blue-500'}`} />
          </div>
          <input
            type="text"
            value={handle}
            onChange={e => handleInputChange(e.target.value)}
            onBlur={() => setIsDirty(true)}
            placeholder="Enter Bluesky handle (e.g. user.bsky.social)"
            className={`w-full form-input pl-12 pr-12 h-12
              bg-gray-800/50
              text-white
              placeholder:text-gray-400
              border ${error ? 'border-red-500/50' : 'border-gray-700/50'}
              rounded-lg
              focus:outline-hidden
              focus:ring-2
              ${error ? 'focus:ring-red-500/50' : 'focus:ring-green-500/50'}
              focus:border-transparent
              transition-all`}
          />
          {handle && (
            <button
              type="button"
              onClick={handleClearClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5
                text-gray-400 hover:text-white
                rounded-full
                hover:bg-gray-700/50
                transition-all"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 h-12
            rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-500/50
            flex items-center justify-center gap-2 w-[144px]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all"
        >
          <AnimatePresence mode="wait">
            {isLoading
              ? (
                  <LoadingButton key="loading" />
                )
              : (
                  <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Fetch Posts
                  </motion.span>
                )}
          </AnimatePresence>
        </button>
      </form>
      {error && <div className="text-red-400 text-sm px-2">{error}</div>}
    </div>
  )
}
