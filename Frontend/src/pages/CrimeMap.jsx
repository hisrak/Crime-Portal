import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import dateFormat from "dateformat";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { FiMapPin, FiFilter, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import Layout from '../components/Layout'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Motion'
import { StatusBadge, STATUSES } from '../components/status'
import { AREAS } from '../components/areas'
import blog2 from "../images/blog2.png"

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const CENTER = { lat: 24.90, lng: 67.08, zoom: 11 }
const categories = [
  { key: 'Murder', label: 'Murder' },
  { key: 'Target Killing', label: 'Target Killing' },
  { key: 'Bomb Blast', label: 'Bomb Blast' },
  { key: 'Roberry', label: 'Robbery' },
  { key: 'Snatching', label: 'Snatching' },
  { key: 'Gang Rape', label: 'Gang Rape' },
]
const catLabel = (key) => (key === 'Roberry' ? 'Robbery' : key)

// Zyada complaints = zyada khatarnak rang
const colorFor = (n) => (n >= 4 ? '#ef4444' : n >= 2 ? '#F5B544' : '#309689')
const radiusFor = (n) => 10 + Math.min(n, 10) * 3

// Side list par click karne se map us ilaqe tak jata hai
const FlyTo = ({ target }) => {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom || 13, { duration: 1.2 })
  }, [target, map])
  return null
}

const selectCls = "rounded-xl border border-brand-deep/10 bg-brand-paper px-3 py-2.5 text-sm outline-none transition-all duration-300 hover:border-brand-jade/50 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15"

const CrimeMap = () => {
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [days, setDays] = useState('')
  const [data, setData] = useState({ areas: [], total: 0, withoutArea: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [focus, setFocus] = useState(null)

  // Filter badalte hi database se naya data aata hai
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API}/api/posts/map`, {
          headers: { 'auth-token': localStorage.getItem('Token') },
          params: { category, status, days },
        })
        setData(res.data)
        setError('')
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('Token')
          window.location.href = '/login'
          return
        }
        setError('Could not load the map data. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category, status, days])

  // Har ilaqe ke liye pin (jis mein complaints nahi, wo halka dot)
  const pins = AREAS.map((a) => {
    const found = data.areas.find((x) => x.area === a.name)
    return { ...a, count: found ? found.count : 0, categories: found ? found.categories : {}, recent: found ? found.recent : [] }
  })
  const ranked = pins.filter((p) => p.count > 0).sort((a, b) => b.count - a.count)
  const maxCount = ranked.length ? ranked[0].count : 1
  const areasWithData = ranked.length
  const filtersActive = category || status || days

  return (
    <>
      <Layout>
        <PageHero
          title="Crime Map"
          image={blog2}
          imagePosition="right center"
          chips={[
            { icon: FiMapPin, label: 'Complaints by area' },
            { icon: FiFilter, label: 'Filter and explore' },
          ]}
          subtitle="See where complaints are being registered across Karachi, area by area."
        />

        <section className="mx-auto my-16 w-[90%] max-w-6xl md:my-24">

          {/* Filters */}
          <Reveal>
            <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-brand-deep/5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${selectCls} md:flex-1`}>
                  <option value="">All Categories</option>
                  {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${selectCls} md:flex-1`}>
                  <option value="">All Statuses</option>
                  {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
                <select value={days} onChange={(e) => setDays(e.target.value)} className={`${selectCls} md:flex-1`}>
                  <option value="">All time</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                {filtersActive && (
                  <button onClick={() => { setCategory(''); setStatus(''); setDays('') }} className="group inline-flex items-center justify-center gap-2 px-2 font-semibold text-brand-jade transition-colors duration-300 hover:text-red-500">
                    <FiRefreshCw className="transition-transform duration-500 group-hover:rotate-180" />
                    Reset
                  </button>
                )}
              </div>
              <p className="mt-3 text-sm text-brand-ink/60">
                {loading ? 'Loading...' : <>Showing <span className="font-bold text-brand-deep">{data.total - data.withoutArea}</span> complaints in <span className="font-bold text-brand-deep">{areasWithData}</span> {areasWithData === 1 ? 'area' : 'areas'}</>}
                {!loading && data.withoutArea > 0 && <> &middot; {data.withoutArea} complaints have no area selected, so they are not on the map</>}
              </p>
            </div>
          </Reveal>

          {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-center font-medium text-red-500">{error}</p>}

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[2fr_1fr]">

            {/* Map (isolate: map navbar ke upar na aaye) */}
            <div className="relative isolate z-0">
              <div className="overflow-hidden rounded-3xl shadow-xl shadow-brand-deep/15 ring-1 ring-brand-deep/10">
                <MapContainer center={[CENTER.lat, CENTER.lng]} zoom={CENTER.zoom} scrollWheelZoom={false} className="h-[480px] w-full md:h-[560px]">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FlyTo target={focus} />

                  {pins.map((p) => (
                    p.count === 0 ? (
                      <CircleMarker key={p.name} center={[p.lat, p.lng]} radius={5} pathOptions={{ color: '#9ca3af', fillColor: '#9ca3af', fillOpacity: 0.5, weight: 1 }}>
                        <Tooltip direction="top">{p.name}: no complaints</Tooltip>
                      </CircleMarker>
                    ) : (
                      <CircleMarker key={p.name} center={[p.lat, p.lng]} radius={radiusFor(p.count)} pathOptions={{ color: colorFor(p.count), fillColor: colorFor(p.count), fillOpacity: 0.45, weight: 2 }}>
                        <Tooltip direction="top">{p.name}: {p.count} {p.count === 1 ? 'complaint' : 'complaints'}</Tooltip>
                        <Popup minWidth={230}>
                          <div className="font-sans">
                            <h3 className="font-display text-base font-bold">{p.name}</h3>
                            <p className="text-xs text-brand-ink/60">Karachi {p.region} &middot; {p.count} {p.count === 1 ? 'complaint' : 'complaints'}</p>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {Object.entries(p.categories).map(([k, v]) => (
                                <span key={k} className="rounded-full bg-brand-mint px-2 py-0.5 text-[11px] font-semibold text-brand-deep">{catLabel(k)} {v}</span>
                              ))}
                            </div>

                            <div className="mt-3 space-y-2">
                              {p.recent.map((r) => (
                                <div key={r._id} className="rounded-lg bg-brand-paper p-2">
                                  <p className="text-sm font-semibold leading-snug">{r.title}</p>
                                  <div className="mt-1 flex items-center justify-between gap-2">
                                    <span className="text-[11px] text-brand-ink/55">{dateFormat(r.date, "mmm dS, yyyy")}</span>
                                    <StatusBadge status={r.status} />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <Link to="/crime_response" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-jade">
                              View all complaints <FiArrowRight />
                            </Link>
                          </div>
                        </Popup>
                      </CircleMarker>
                    )
                  ))}
                </MapContainer>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-ink/65">
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-jade" /> 1 complaint</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-amber" /> 2 to 3</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /> 4 or more</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gray-400" /> none</span>
              </div>
              <p className="mt-2 text-xs text-brand-ink/45">Pins are placed at the approximate centre of each area, not at the exact location of a complaint.</p>
            </div>

            {/* Most affected areas */}
            <Reveal delay={120}>
              <div className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-deep/10 ring-1 ring-brand-deep/5">
                <h2 className="font-display text-xl font-bold">Most reported areas</h2>
                <span className="mt-2 block h-1 w-10 rounded-full bg-brand-amber" />

                {!loading && ranked.length === 0 && (
                  <p className="mt-6 rounded-xl bg-brand-paper p-5 text-center text-sm text-brand-ink/60">
                    {filtersActive ? 'No complaints match these filters.' : 'No complaints with an area yet. Choose an area when you register a complaint.'}
                  </p>
                )}

                <div className="mt-5 space-y-2">
                  {ranked.slice(0, 8).map((p) => (
                    <button
                      key={p.name}
                      onClick={() => setFocus({ lat: p.lat, lng: p.lng, zoom: 13 })}
                      className="group block w-full rounded-xl p-3 text-left transition-all duration-300 hover:bg-brand-mint"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold transition-colors duration-300 group-hover:text-brand-jade">{p.name}</span>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: colorFor(p.count) }}>{p.count}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-mint group-hover:bg-white">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(p.count / maxCount) * 100}%`, backgroundColor: colorFor(p.count) }} />
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setFocus({ lat: CENTER.lat, lng: CENTER.lng, zoom: CENTER.zoom })}
                  className="mt-4 w-full rounded-xl border border-brand-jade/40 py-2.5 text-sm font-semibold text-brand-jade transition-all duration-300 hover:border-brand-jade hover:bg-brand-mint"
                >
                  Show all of Karachi
                </button>
              </div>
            </Reveal>
          </div>
        </section>

      </Layout>
    </>
  )
}

export default CrimeMap