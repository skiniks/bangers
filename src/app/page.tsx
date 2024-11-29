import { InformationCircleIcon } from '@heroicons/react/24/solid'
import SearchForm from '@/features/search/components/SearchForm'

export default function Page() {
  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Bangers</h1>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-16 w-16 text-blue-500" />
          <p className="text-gray-300 text-sm leading-relaxed">Find the most popular posts from any Bluesky user. Enter a handle to see their top 10 posts, ranked by likes and reposts.</p>
        </div>
      </div>
      <SearchForm />
    </div>
  )
}
