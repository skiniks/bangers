interface SearchBarProps {
  tempIdentifier: string
  setTempIdentifier: (value: string) => void
  fetchPosts: () => void
  loading: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ tempIdentifier, setTempIdentifier, fetchPosts, loading }) => {
  return (
    <div>
      <input
        type="text"
        value={tempIdentifier}
        onChange={e => setTempIdentifier(e.target.value)}
        placeholder="Enter user handle"
        className="w-full mb-2 form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
      />
      <button onClick={fetchPosts} disabled={loading} className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {loading ? 'Loading...' : 'Fetch Posts'}
      </button>
    </div>
  )
}

export default SearchBar
