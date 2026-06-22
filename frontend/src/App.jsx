import { useState } from 'react'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE = 'http://localhost:3000/api/v1'

function App() {
  const [url, setUrl] = useState('')
  const [shortened, setShortened] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const queryClient = useQueryClient()
  const { data: links = [] } = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      try {
        const res = await axios.get(API_BASE)
        return res.data.success ? res.data.data.reverse() : []
      } catch (err) {
        console.error('Failed to fetch links:', err)
        return []
      }
    }
  })
  const shortenMutation = useMutation({
    mutationFn: async (redirectUrl) => {
      const res = await axios.post(API_BASE, { redirectUrl })
      return res.data
    },
    onSuccess: (data) => {
      if (data.success) {
        setShortened(data.data)
        setUrl('')
        setErrorMsg('')
        queryClient.invalidateQueries({ queryKey: ['links'] })
      } else {
        setErrorMsg(data.message || 'Something went wrong')
      }
    },
    onError: () => {
      setErrorMsg('Failed to connect to server')
    }
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url) return
    setCopied(false)
    setShortened(null)
    setErrorMsg('')
    shortenMutation.mutate(url)
  }
  const handleCopy = () => {
    if (!shortened) return
    const shortUrl = `${API_BASE}/${shortened.shortId}`
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const loading = shortenMutation.isPending
  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="bg-slate-100 py-4 shadow-sm">
        <div className="text-4xl font-serif text-center">
          Trim <span className="text-red-500">Link</span>
        </div>
      </header>
      <main className="mt-16 text-center px-4">
        <h1 className="text-3xl font-semibold text-slate-800">
          Shorten your links
        </h1>
        <p className="text-slate-500 mt-2 text-base">
          Fast, simple and clean URL shortening.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex justify-center gap-3">
            <input
              className="border border-slate-300 px-4 py-3 rounded-xl w-full max-w-xl outline-none focus:border-green-500 transition-colors"
              type="url"
              placeholder="Paste your long link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all disabled:opacity-50 font-medium"
            >
              {loading ? 'Shortening...' : 'Shorten'}
            </button>
          </div>
          {errorMsg && (
            <p className="text-red-500 mt-3 text-sm font-medium">
              {errorMsg}
            </p>
          )}
        </form>

        {shortened && (
          <div className="mt-8 border rounded-2xl p-6 max-w-xl mx-auto bg-slate-50 shadow-sm transition-all">
            <p className="text-green-600 font-medium mb-3">
              Your shortened link is ready
            </p>
            <a
              href={`${API_BASE}/${shortened.shortId}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-lg break-all hover:underline"
            >
              localhost:3000/api/v1/{shortened.shortId}
            </a>
            <div className="mt-5">
              <button
                onClick={handleCopy}
                className="bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm"
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        )}
      </main>

      {links.length > 0 && (
        <section className="max-w-3xl mx-auto mt-16 px-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-slate-800">
              Recent Links
            </h3>
            <span className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
              {links.length} total
            </span>
          </div>

          <div className="space-y-4">
            {links.map((item) => (
              <div
                key={item._id}
                className="border rounded-xl p-5 text-left shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white"
              >
                <div className="overflow-hidden">
                  <p
                    className="truncate text-slate-700 font-medium mb-1"
                    title={item.redirectUrl}
                  >
                    {item.redirectUrl}
                  </p>
                  <a
                    href={`${API_BASE}/${item.shortId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    localhost:3000/api/v1/{item.shortId}
                  </a>
                </div>
                <div className="text-sm text-slate-500 whitespace-nowrap bg-slate-50 px-3 py-1.5 rounded-lg border font-medium">
                  {item.visited} clicks
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default App

