import { useState, useEffect } from 'react'

function App() {
  const [url, setUrl] = useState('')
  const [shortened, setShortened] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [links, setLinks] = useState([])
  const [copied, setCopied] = useState(false)
  const API_BASE = 'http://localhost:3000/api/v1'
  const fetchLinks = async () => {
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()
      if (data.success) {
        setLinks(data.data.reverse())
      }
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    fetchLinks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setError('')
    setCopied(false)
    setShortened(null)

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirectUrl: url })
      })
      const data = await res.json()
      if (data.success) {
        setShortened(data.data)
        setUrl('')
        fetchLinks()
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!shortened) return
    const shortUrl = `${API_BASE}/${shortened.shortId}`
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
return (
<> <header className="bg-slate-100 py-4 shadow-sm"> <div className="text-4xl font-serif text-center">
Trim <span className="text-red-500">Link</span> </div> </header>
<main className="mt-16 text-center px-4">
  <h1 className="text-3xl font-semibold">
    Shorten your links
  </h1>
  <p className="text-slate-500 mt-2 text-base">
    Fast, simple and clean URL shortening.
  </p>
  <form onSubmit={handleSubmit} className="mt-8">
    <div className="flex justify-center gap-3">
      <input
        className="border border-slate-300 px-4 py-3 rounded-xl w-full max-w-xl outline-none focus:border-green-500"
        type="url"
        placeholder="Paste your long link here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading || !url}
        className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl transition disabled:opacity-50"
      >
        {loading ? "..." : "Shorten"}
      </button>
    </div>
    {error && (
      <p className="text-red-500 mt-3 text-sm">
        {error}
      </p>
    )}
  </form>
  {shortened && (
    <div className="mt-8 border rounded-2xl p-5 max-w-xl mx-auto bg-slate-50 shadow-sm">
      <p className="text-green-600 font-medium mb-2">
        Your shortened link is ready
      </p>
      <a
        href={`${API_BASE}/${shortened.shortId}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 break-all hover:underline"
      >
        localhost:3000/api/v1/{shortened.shortId}
      </a>
      <div>
        <button
          onClick={handleCopy}
          className="mt-4 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  )}
</main>
{links.length > 0 && (
  <section className="max-w-3xl mx-auto mt-12 px-4 mb-10">
    <div className="flex justify-between items-center mb-5">
      <h3 className="text-2xl font-semibold">
        Recent Links
      </h3>
      <span className="text-slate-500">
        {links.length} total
      </span>
    </div>
    <div className="space-y-3">
      {links.map((item) => (
        <div
          key={item._id}
          className="border rounded-xl p-4 text-left shadow-sm hover:shadow-md transition"
        >
          <p
            className="truncate text-slate-700 mb-2"
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
          <p className="text-sm text-slate-500 mt-2">
            {item.visited} clicks
          </p>
        </div>
      ))}
    </div>
  </section>
)}
</>
  )
}
export default App
