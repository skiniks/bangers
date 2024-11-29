import SearchForm from '@/components/SearchForm'

export default function Page() {
  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">Bangers</h1>
      </div>
      <SearchForm />
    </div>
  )
}
