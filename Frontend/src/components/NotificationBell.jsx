import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import dateFormat from "dateformat";
import { FiBell, FiThumbsUp, FiMessageCircle, FiEye, FiCheckCircle, FiArrowRight } from 'react-icons/fi'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// "5 min ago" jaisa text
export const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60) return 'Just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} day${d > 1 ? 's' : ''} ago`
  return dateFormat(date, 'mmm dS, yyyy')
}

const icons = {
  like: FiThumbsUp,
  comment: FiMessageCircle,
  confirm: FiEye,
  status: FiCheckCircle,
}

export const NotifIcon = ({ type, className = '' }) => {
  const Icon = icons[type] || FiBell
  return (
    <div className={`grid shrink-0 place-items-center rounded-xl bg-brand-mint text-brand-jade ${className}`}>
      <Icon />
    </div>
  )
}

// Navbar ka bell icon (desktop: dropdown, mobile: seedha Notifications page ka link)
const NotificationBell = ({ mobile = false, onNavigate }) => {
  const headers = { 'auth-token': localStorage.getItem('Token') }
  const navigate = useNavigate()
  const wrapRef = useRef(null)

  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const loadCount = async () => {
    try {
      const res = await axios.get(`${API}/api/notifications/unread_count`, { headers })
      setCount(res.data.count)
    } catch (error) {
      // bell chhupi rahe to bhi navbar kaam kare
    }
  }

  // Har 30 second mein nayi notifications check hoti hain
  useEffect(() => {
    loadCount()
    const t = setInterval(loadCount, 30000)
    return () => clearInterval(t)
  }, [])

  // Bahar click karne par dropdown band
  useEffect(() => {
    const onClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const toggle = async () => {
    const next = !open
    setOpen(next)
    if (next) {
      setLoading(true)
      try {
        const res = await axios.get(`${API}/api/notifications?limit=6`, { headers })
        setItems(res.data.notifications)
        setCount(res.data.unread)
      } catch (error) {
        // khali list dikhegi
      } finally {
        setLoading(false)
      }
    }
  }

  const openItem = async (n) => {
    setOpen(false)
    if (!n.read) {
      try {
        await axios.put(`${API}/api/notifications/read/${n._id}`, {}, { headers })
        setCount((c) => Math.max(0, c - 1))
      } catch (error) { /* ignore */ }
    }
    navigate('/crime_response')
  }

  const markAll = async () => {
    try {
      await axios.put(`${API}/api/notifications/read_all`, {}, { headers })
      setItems((prev) => prev.map((n) => ({ ...n, read: true })))
      setCount(0)
    } catch (error) { /* ignore */ }
  }

  const badge = count > 0 && (
    <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-amber px-1 text-[11px] font-bold text-brand-deep">
      {count > 9 ? '9+' : count}
    </span>
  )

  if (mobile) {
    return (
      <Link to="/notifications" onClick={onNavigate} className="relative inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10">
        <FiBell />
        Notifications
        {count > 0 && <span className="rounded-full bg-brand-amber px-2 text-xs font-bold text-brand-deep">{count}</span>}
      </Link>
    )
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={toggle}
        aria-label="Notifications"
        aria-expanded={open}
        className={`relative grid h-10 w-10 place-items-center rounded-full border text-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-amber hover:text-brand-amber ${open ? 'border-brand-amber text-brand-amber' : 'border-white/25 text-white'}`}
      >
        <FiBell className={count > 0 ? 'animate-pulse' : ''} />
        {badge}
      </button>

      <div className={`absolute right-0 top-full z-50 mt-3 w-[22rem] origin-top-right overflow-hidden rounded-2xl bg-white text-brand-ink shadow-2xl ring-1 ring-brand-deep/10 transition-all duration-200 ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
        <div className="flex items-center justify-between bg-brand-deep px-5 py-3 text-white">
          <h3 className="font-display font-bold">Notifications</h3>
          {count > 0 && (
            <button onClick={markAll} className="text-xs font-semibold text-brand-amber transition-colors hover:text-white">Mark all as read</button>
          )}
        </div>

        <div className="max-h-[22rem] overflow-y-auto">
          {loading && <p className="p-6 text-center text-sm text-brand-ink/55">Loading...</p>}
          {!loading && items.length === 0 && (
            <div className="p-8 text-center">
              <FiBell className="mx-auto text-3xl text-brand-jade/60" />
              <p className="mt-3 text-sm font-semibold">No notifications yet</p>
              <p className="mt-1 text-xs text-brand-ink/55">Likes, comments and status updates on your complaints will show up here.</p>
            </div>
          )}
          {items.map((n) => (
            <button
              key={n._id}
              onClick={() => openItem(n)}
              className={`flex w-full items-start gap-3 px-5 py-3 text-left transition-colors duration-200 hover:bg-brand-mint/60 ${n.read ? '' : 'bg-brand-mint/40'}`}
            >
              <NotifIcon type={n.type} className="mt-0.5 h-9 w-9 text-base" />
              <div className="min-w-0 flex-1">
                <p className={`text-sm leading-5 ${n.read ? 'text-brand-ink/70' : 'font-semibold'}`}>{n.message}</p>
                <p className="mt-1 text-xs text-brand-ink/50">{timeAgo(n.date)}</p>
              </div>
              {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-amber" />}
            </button>
          ))}
        </div>

        <Link to="/notifications" onClick={() => setOpen(false)} className="group flex items-center justify-center gap-2 border-t border-brand-deep/10 py-3 text-sm font-semibold text-brand-jade transition-colors hover:bg-brand-mint/60 hover:text-brand-deep">
          View all
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export default NotificationBell