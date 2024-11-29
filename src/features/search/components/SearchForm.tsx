import LoadingButton from '@/shared/components/LoadingButton'
import { Icon } from '@iconify/react'
import { useState } from 'react'

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

  function validateHandle(value: string): boolean {
    if (!value) {
      setError('')
      return false
    }

    if (value.startsWith('.')) {
      setError('Handle must start with a letter or number')
      return false
    }

    const handleRegex = /^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)*$/i
    if (!handleRegex.test(value)) {
      setError('Invalid handle format. Example: user.bsky.social')
      return false
    }

    setError('')
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsDirty(true)

    if (validateHandle(handle)) {
      onSubmit()
    }
  }

  function handleInputChange(value: string) {
    setHandle(value)
    if (isDirty) {
      validateHandle(value)
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
            flex items-center justify-center gap-2 min-w-[120px]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all"
        >
          {isLoading ? <LoadingButton /> : 'Fetch Posts'}
        </button>
      </form>
      {error && <div className="text-red-400 text-sm px-2">{error}</div>}
    </div>
  )
}
