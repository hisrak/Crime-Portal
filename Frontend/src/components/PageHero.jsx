import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiActivity } from 'react-icons/fi'

const defaultChips = [
  { icon: FiClock, label: '24/7 Service' },
  { icon: FiActivity, label: 'Real-time crime data' },
]

// Har inner page ka upar wala banner (About, Contact, Reports, etc.)
// image, subtitle aur chips optional hain
const PageHero = ({ title, image, subtitle, chips = defaultChips, imagePosition = 'center', imageShape = 'rect' }) => {
  const isCircle = imageShape === 'circle'
  const sectionRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Mouse ke peeche chalne wali roshni (spotlight)
  const onSectionMove = (e) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  // Image card mouse ki taraf jhukta hai (3D tilt)
  const onTilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: py * -12, y: px * 14 })
  }

  const words = title.split(' ')

  return (
    <section
      ref={sectionRef}
      onMouseMove={onSectionMove}
      className="page-hero group/hero relative overflow-hidden bg-brand-deep text-white"
      style={{ '--x': '70%', '--y': '30%' }}
    >
      {/* Background layers */}
      <div className="dot-grid absolute inset-0" />
      <div className="absolute -right-24 -top-32 h-96 w-96 animate-float rounded-full bg-brand-jade/30 blur-[120px]" />
      <div className="absolute -bottom-48 -left-24 h-80 w-80 rounded-full bg-brand-amber/15 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100"
        style={{ background: 'radial-gradient(520px circle at var(--x) var(--y), rgba(48,150,137,0.28), transparent 65%)' }}
      />

      <div className={`relative mx-auto grid w-[90%] max-w-6xl items-center gap-12 py-16 md:py-24 ${image ? 'md:grid-cols-[1.1fr_0.9fr]' : ''}`}>

        {/* ---------- Left: text ---------- */}
        <div>
          <nav
            className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm text-white/70 backdrop-blur-md transition-colors duration-300 hover:border-brand-amber/60"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition-colors duration-300 hover:text-brand-amber">Home</Link>
            <span>/</span>
            <span className="font-medium text-white">{title}</span>
          </nav>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            {words.map((w, i) => (
              <span key={i} className="mr-4 inline-block overflow-hidden pb-2 align-bottom">
                <span
                  className="animate-fade-up inline-block cursor-default transition-colors duration-300 hover:text-brand-amber"
                  style={{ animationDelay: `${150 + i * 140}ms` }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <span
            className={`mt-6 block h-1 w-24 origin-left rounded-full bg-brand-amber transition-transform duration-1000 ease-out ${ready ? 'scale-x-100' : 'scale-x-0'}`}
            style={{ transitionDelay: '500ms' }}
          />

          {subtitle && (
            <p className="animate-fade-up mt-6 max-w-xl text-base leading-8 text-white/75 md:text-lg" style={{ animationDelay: '500ms' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* ---------- Right: image card ---------- */}
        {image && (
          <div className={`animate-fade-up relative mx-auto w-full ${isCircle ? 'max-w-[260px] md:max-w-[320px]' : 'max-w-sm md:max-w-md'}`} style={{ animationDelay: '300ms' }}>
            {/* ghoomta hua ring */}
            <div className={`absolute -inset-5 animate-spin border border-dashed border-brand-amber/40 [animation-duration:40s] ${isCircle ? 'rounded-full' : 'rounded-[2.5rem]'}`} />

            <div
              onMouseMove={onTilt}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
              className={`group relative overflow-hidden border border-white/15 shadow-2xl shadow-black/40 transition-transform duration-200 ease-out ${isCircle ? 'rounded-full border-4 border-brand-amber/60' : 'rounded-3xl'}`}
              style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
            >
              <img
                src={image}
                alt=""
                style={{ objectPosition: imagePosition }}
                className={`w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 ${isCircle ? 'aspect-square bg-white' : 'aspect-[4/3]'}`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-transparent to-brand-jade/10" />
            </div>

            {/* floating chips */}
            {chips[0] && (
              <div className="animate-float absolute -right-3 -top-5 flex cursor-default items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm font-semibold shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-brand-amber hover:text-brand-deep md:-right-8">
                {React.createElement(chips[0].icon, { className: 'text-lg' })}
                {chips[0].label}
              </div>
            )}
            {chips[1] && (
              <div
                className="animate-float absolute -bottom-5 -left-3 flex cursor-default items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm font-semibold shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-brand-amber hover:text-brand-deep md:-left-8"
                style={{ animationDelay: '1.5s' }}
              >
                {React.createElement(chips[1].icon, { className: 'text-lg' })}
                {chips[1].label}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Neeche white page mein curve ke saath milta hai */}
      <div className="absolute inset-x-0 -bottom-px h-8 rounded-t-[2rem] bg-white md:h-10 md:rounded-t-[3rem]" />
    </section>
  )
}

export default PageHero