import { useEffect, useState } from 'react'
import axios from 'axios'

export const API = 'http://localhost:4000'

// Database se real stats laane wala hook (Home page mein use hota hai)
export const useStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/posts/stats`, {
          headers: { 'auth-token': localStorage.getItem('Token') }
        })
        setStats(res.data)
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('Token')
          window.location.href = '/login'
          return
        }
        setError('Could not load crime data. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { stats, loading, error }
}