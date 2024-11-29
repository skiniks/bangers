interface LoginFormProps {
  handle: string
  setHandle: (value: string) => void
  password: string
  setPassword: (value: string) => void
  authenticate: () => void
  loading: boolean
}

export default function LoginForm({ handle, setHandle, password, setPassword, authenticate, loading }: LoginFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    authenticate()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={handle}
        onChange={e => setHandle(e.target.value)}
        placeholder="Handle"
        className="w-full form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
        required
        autoComplete="handle"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
        required
        autoComplete="current-password"
      />
      <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
