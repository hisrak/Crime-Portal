import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import { Reveal, CountUp, useInView } from './Motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const levelStyle = {
  'Safe': { text: 'text-brand-jade', stroke: 'stroke-brand-jade', badge: 'bg-brand-mint text-brand-deep' },
  'Moderate': { text: 'text-brand-amber', stroke: 'stroke-brand-amber', badge: 'bg-brand-amber/25 text-brand-deep' },
  'High Risk': { text: 'text-red-500', stroke: 'stroke-red-500', badge: 'bg-red-100 text-red-700' },
}
const catLabel = (key) => (key === 'Roberry' ? 'Robbery' : key)

const R = 44
const C = 2 * Math.PI * R

// Ek district ka card (gol meter ke saath)
const AreaCard = ({ area, delay }) => {
  const [ref, inView] = useInView(0.3)
  const st = levelStyle[area.level]

  return (
    <Reveal delay={delay} className="h-full">
      <div ref={ref} className="group flex h-full cursor-default flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30">
        <h3 className="font-display text-lg font-bold transition-colors duration-300 group-hover:text-white">Karachi {area.region}</h3>

        <div className="relative mt-4 h-32 w-32">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={R} fill="none" strokeWidth="9" className="stroke-brand-mint transition-colors duration-300 group-hover:stroke-white/15" />
            <circle
              cx="50" cy="50" r={R} fill="none" strokeWidth="9" strokeLinecap="round"
              className={`${st.stroke} transition-all duration-[1600ms] ease-out`}
              strokeDasharray={C}
              strokeDashoffset={inView ? C * (1 - area.score / 100) : C}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <p className={`font-display text-4xl font-extrabold ${st.text}`}><CountUp to={area.score} /></p>
          </div>
        </div>

        <span className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${st.badge}`}>
          {area.level}
        </span>

        <p className="mt-4 text-sm text-brand-ink/65 transition-colors duration-300 group-hover:text-white/70">
          {area.complaints} {area.complaints === 1 ? 'complaint' : 'complaints'}
          {area.complaints > 0 && <> &middot; {area.resolved} resolved</>}
        </p>
        <p className="mt-1 text-sm font-semibold text-brand-deep transition-colors duration-300 group-hover:text-brand-amber">
          {area.topCategory ? `Most reported: ${catLabel(area.topCategory)}` : 'No complaints'}
        </p>
      </div>
    </Reveal>
  )
}

// tone: 'white' ya 'paper' (section ka background)
const SafetyScores = ({ tone = 'white' }) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/posts/safety`, {
          headers: { 'auth-token': localStorage.getItem('Token') }
        })
        setData(res.data)
      } catch (err) {
        setError('Could not load safety scores.')
      }
    }
    load()
  }, [])

  const scoresDiffer = data && data.safest && data.riskiest && data.safest.score !== data.riskiest.score

  return (
    <section className={`py-16 md:py-24 ${tone === 'paper' ? 'bg-brand-paper' : ''}`}>
      <div className="mx-auto w-[90%] max-w-6xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Area Safety Score</h2>
            <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-brand-amber" />
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-brand-ink/65">
              How safe each part of Karachi is, based on the complaints registered in the last {data ? data.days : 30} days.
            </p>
          </div>
        </Reveal>

        {error && <p className="mt-10 rounded-xl bg-red-50 p-4 text-center font-medium text-red-500">{error}</p>}

        {data && (
          <>
            {scoresDiffer && (
              <Reveal delay={100}>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-2xl bg-brand-mint p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl text-brand-jade"><FiShield /></div>
                    <div>
                      <p className="text-sm font-semibold text-brand-ink/60">Safest area</p>
                      <p className="font-display text-xl font-bold">Karachi {data.safest.region} <span className="text-brand-jade">({data.safest.score})</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl bg-red-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl text-red-500"><FiAlertTriangle /></div>
                    <div>
                      <p className="text-sm font-semibold text-brand-ink/60">Needs attention</p>
                      <p className="font-display text-xl font-bold">Karachi {data.riskiest.region} <span className="text-red-500">({data.riskiest.score})</span></p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {!scoresDiffer && data.areas.every((a) => a.complaints === 0) && (
              <p className="mt-10 flex items-center justify-center gap-2 rounded-xl bg-brand-mint p-4 text-center font-semibold text-brand-deep">
                <FiCheckCircle /> No complaints in the last {data.days} days. All areas are fully safe.
              </p>
            )}

            <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {data.areas.map((a, i) => (
                <AreaCard key={a.region} area={a} delay={i * 100} />
              ))}
            </div>

            <Reveal delay={150}>
              <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-brand-ink/55">
                Every area starts at 100. Each complaint lowers the score, serious crimes (murder, bomb blast, target killing, gang rape) lower it more than robbery or snatching, and resolved complaints lower it only half as much.
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  )
}

export default SafetyScores