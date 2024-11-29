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
    <form onSubmit={handleSubmit}>
      <div className="relative mb-2">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-500/20 rounded-full p-1.5">
          <Icon icon="mdi:at" className="w-4 h-4 text-blue-500" />
        </div>
        <input
          type="text"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          placeholder="handle"
          className="w-full form-input pl-10 pr-4 py-2
            bg-gray-800/50
            text-white
            placeholder:text-gray-400
            border border-gray-700/50
            rounded-md
            focus:outline-hidden
            focus:ring-2
            focus:ring-green-500
            focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !handle}
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4
          rounded-sm focus:outline-hidden focus:shadow-outline flex items-center
          justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? <LoadingButton /> : 'Fetch Posts'}
      </button>
    </form>
  )
}
