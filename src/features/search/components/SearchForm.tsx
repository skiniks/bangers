import LoadingButton from '@/shared/components/LoadingButton'
import { Icon } from '@iconify/react'

interface SearchFormProps {
  handle: string
  setHandle: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export default function SearchForm({ handle, setHandle, onSubmit, isLoading }: SearchFormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-blue-500/20 rounded-full p-1.5">
          <Icon icon="mdi:at" className="w-4 h-4 text-blue-500" />
        </div>
        <input
          type="text"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          placeholder="Enter Bluesky handle"
          className="w-full form-input pl-12 pr-4 h-12
            bg-gray-800/50
            text-white
            placeholder:text-gray-400
            border border-gray-700/50
            rounded-lg
            focus:outline-hidden
            focus:ring-2
            focus:ring-green-500/50
            focus:border-transparent
            transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !handle}
        className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 h-12
          rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-500/50
          flex items-center justify-center gap-2 min-w-[120px]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all"
      >
        {isLoading ? <LoadingButton /> : 'Fetch Posts'}
      </button>
    </form>
  )
}
