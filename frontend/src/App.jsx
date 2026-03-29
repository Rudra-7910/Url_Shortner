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
    <>
      <header className="header">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          Trim<span>Link</span>
        </div>
      </header>

      <main className="hero-section">
        <h1 className="hero-title">Shorten your links.</h1>
        <p className="hero-subtitle">A minimalist, high-performance URL shortener built for modern teams.</p>
        
        <form className="shortener-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input 
              type="url" 
              className="url-input" 
              placeholder="Paste your long link here..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit" disabled={loading || !url}>
              {loading ? <div className="spinner" /> : 'Shorten'}
            </button>
          </div>
          {error && <div style={{ color: '#ff4444', fontSize: '0.9rem', textAlign: 'left', marginTop: '4px', paddingLeft: '8px' }}>{error}</div>}
        </form>

        {shortened && (
          <div className="result-card">
            <div className="result-info">
               <span className="result-label">Your shortened link is ready <br /></span>
               <a href={`${API_BASE}/${shortened.shortId}`} target="_blank" rel="noreferrer" className="short-url">
                 localhost:3000/api/v1/{shortened.shortId}
               </a>
            </div>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Info'}
            </button>
          </div>
        )}
      </main>

      {links.length > 0 && (
        <section className="links-section">
          <div className="section-header">
            <h3>Recent Links</h3>
            <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: '400' }}>{links.length} total</span>
          </div>
          <div className="links-grid">
            {links.map((item) => (
              <div key={item._id} className="link-row">
                <div className="row-original" title={item.redirectUrl}>
                  {item.redirectUrl}
                </div>
                <a href={`${API_BASE}/${item.shortId}`} target="_blank" rel="noreferrer" className="row-short">
                  localhost:3000/api/v1/{item.shortId}
                </a>
                <div className="row-stats">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  {item.visited} clicks
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default App
