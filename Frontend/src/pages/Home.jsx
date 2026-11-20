import React from 'react'
import { Link } from 'react-router-dom'
import dateFormat from "dateformat";
import { FiArrowRight, FiArrowUpRight, FiImage, FiThumbsUp, FiMessageCircle, FiFileText, FiUsers, FiMessageSquare } from "react-icons/fi"
import Layout from '../components/Layout'
import { Reveal, CountUp } from '../components/Motion'
import { useStats, API } from '../components/useStats'
import SafetyScores from '../components/SafetyScores'
import bookmark from "../images/bookmark.png"
import cardlogo from "../images/cardlogo.png"
import community from "../images/community.png"
import banner from "../images/banner.png"

// key = database mein saved value, label = screen par dikhne wala naam
const categoryList = [
  { key: 'Murder', label: 'Murder' },
  { key: 'Target Killing', label: 'Target Killing' },
  { key: 'Bomb Blast', label: 'Bomb Blast' },
  { key: 'Roberry', label: 'High Way & Bank Robbery' },
  { key: 'Snatching', label: 'Snatching' },
  { key: 'Gang Rape', label: 'Gang Rape' },
]
const regionList = ['East', 'West', 'South', 'North']
const catLabel = (key) => (categoryList.find((c) => c.key === key) || { label: key }).label

const Home = () => {
  const { stats, loading, error } = useStats()

  const regionCounts = regionList.map((r) => (stats?.regions?.[r] || 0))
  const maxRegion = Math.max(1, ...regionCounts)
  const categoryCounts = categoryList.map((c) => (stats?.categories?.[c.key] || 0))
  const latest = stats ? stats.latest : []
  const trending = stats ? stats.trending : []

  const numbers = [
    { value: stats ? stats.posts : 0, label: 'Crime Reports' },
    { value: stats ? stats.users : 0, label: 'Registered Users' },
    { value: stats ? stats.comments : 0, label: 'Community Responses' },
  ]

  return (
    <>
      <Layout>

        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <div className="dot-grid absolute inset-0" />
          <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-jade/30 blur-[120px]" />
          <div className="absolute -bottom-48 -left-24 h-[24rem] w-[24rem] rounded-full bg-brand-amber/10 blur-[120px]" />

          <div className="relative mx-auto grid w-[90%] max-w-6xl items-center gap-14 py-16 md:grid-cols-2 md:py-28">

            <div>
              <span className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/85">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-amber opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-amber" />
                </span>
                Real-time crime data for Karachi
              </span>

              <h1 className="animate-fade-up mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl" style={{ animationDelay: '120ms' }}>
                Your Portal to Crime Free Living
              </h1>

              <p className="animate-fade-up mt-6 max-w-md text-lg leading-8 text-white/70" style={{ animationDelay: '240ms' }}>
                Stay informed and vigilant with our comprehensive data. Insight into Neighborhood Security.
              </p>

              <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: '360ms' }}>
                <Link
                  to="/crime_report"
                  className="group inline-flex items-center gap-2 rounded-full bg-brand-amber px-7 py-3 font-semibold text-brand-deep transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/30"
                >
                  Search Crime
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/about_us"
                  className="rounded-full border border-white/25 px-7 py-3 font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Hero visual: real district-wise report card */}
            <div className="animate-fade-up relative mx-auto w-full max-w-md" style={{ animationDelay: '300ms' }}>
              <div className="animate-float rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-mint px-3.5 py-1 text-sm font-medium text-brand-deep">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-jade" />
                    {latest[0] ? `Updated ${dateFormat(latest[0].date, "mmm dS")}` : 'No reports yet'}
                  </span>
                  <img className="h-5 w-5 brightness-0 invert" src={bookmark} alt="" />
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white">
                    <img src={cardlogo} alt="" className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-tight">Crime Reports By District</h3>
                    <p className="text-sm text-white/60">{stats ? `${stats.posts} reports registered` : 'Karachi East, West, South, North'}</p>
                  </div>
                </div>

                <div className="mt-8 flex h-36 items-end gap-4 border-b border-white/10 pb-0">
                  {regionList.map((name, i) => (
                    <div key={name} className="flex h-full flex-1 flex-col items-center justify-end">
                      <span className="mb-1 text-xs font-bold text-brand-amber">{regionCounts[i]}</span>
                      <div
                        className="animate-bar-grow w-full origin-bottom rounded-t-xl bg-gradient-to-t from-brand-jade to-brand-mint/80"
                        style={{ height: `${Math.max(6, (regionCounts[i] / maxRegion) * 78)}%`, animationDelay: `${700 + i * 120}ms` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-4">
                  {regionList.map((name) => (
                    <span key={name} className="flex-1 text-center text-xs font-medium text-white/60">{name}</span>
                  ))}
                </div>
              </div>

              <div className="animate-float absolute -bottom-6 -left-4 rounded-2xl bg-brand-amber px-5 py-3 text-brand-deep shadow-xl shadow-black/30 md:-left-10" style={{ animationDelay: '1.5s' }}>
                <p className="text-xs font-medium">Service</p>
                <p className="font-display text-2xl font-extrabold leading-none">24/7</p>
              </div>
            </div>
          </div>

          {/* Ticker (category + asli ginti) */}
          <div className="relative overflow-hidden border-t border-white/10 bg-black/20 py-4">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[0, 1, 2, 3].flatMap(() => categoryList).map((c, i) => (
                <span key={i} className="mx-7 flex items-center gap-14 whitespace-nowrap text-sm font-medium text-white/70">
                  {c.label} ({stats?.categories?.[c.key] || 0})
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-amber" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <p className="mx-auto mt-8 w-[90%] max-w-6xl rounded-xl bg-red-50 p-4 text-center font-medium text-red-500">{error}</p>
        )}

        {/* ================= RECENT CRIMES (database se) ================= */}
        <section className="recent-crime mx-auto my-16 w-[90%] max-w-6xl md:my-24">
          <Reveal>
            <div className="top flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Recent Crimes Happened</h2>
                <p className="mt-2 text-brand-ink/60">Stay informed and vigilant with our comprehensive data</p>
              </div>
              <Link to="/crime_response" className="group inline-flex items-center gap-2 font-semibold text-brand-jade">
                View all
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </Reveal>

          {!loading && !error && latest.length === 0 && (
            <div className="mt-10 rounded-2xl bg-brand-paper p-10 text-center">
              <h3 className="font-display text-xl font-bold">No crimes registered yet</h3>
              <p className="mt-1 text-brand-ink/60">Be the first to report a complaint.</p>
              <Link to="/crime_response" className="mt-4 inline-block font-semibold text-brand-jade transition-colors hover:text-brand-deep">Register a complaint</Link>
            </div>
          )}

          <div className="btm mt-10 grid gap-6 md:grid-cols-3">
            {latest.map((r, i) => (
              <Reveal key={r._id} delay={i * 120} className="h-full">
                <div className="card group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-deep/15">
                  <span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-brand-jade transition-transform duration-500 group-hover:scale-y-100" />

                  <div className="card-top flex items-center justify-between">
                    <span className="updated inline-flex items-center gap-2 rounded-full bg-[#c8ece9] px-3.5 py-1 text-sm font-medium text-brand-deep">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-jade" />
                      {dateFormat(r.date, "mmm dS, yyyy")}
                    </span>
                    <img className="icon cursor-pointer transition-transform duration-300 hover:scale-125" src={bookmark} alt="bookmark" />
                  </div>

                  <div className="card-mid mt-6 flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-mint transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <img src={cardlogo} alt="" />
                    </div>
                    <div className="title min-w-0">
                      <h3 className="truncate font-display text-lg font-bold leading-tight">{r.title}</h3>
                      <p className="mt-1 text-sm text-brand-ink/60">{catLabel(r.category)} · Karachi {r.region}</p>
                    </div>
                  </div>

                  <div className="card-btm mt-auto flex justify-end pt-7">
                    <Link to="/crime_response" className="group/btn inline-flex items-center gap-2 rounded-full bg-brand-jade px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-deep">
                      See More
                      <FiArrowUpRight className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= CATEGORIES (asli ginti) ================= */}
        <section className="crime-category bg-brand-mint py-16 md:py-24">
          <div className="mx-auto w-[90%] max-w-6xl">
            <Reveal>
              <div className="top text-center">
                <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Browse by Crime Category</h2>
                <p className="mt-4 text-brand-ink/60">Explore Crime Types and Patterns</p>
              </div>
            </Reveal>

            <div className="btm mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {categoryList.map((c, i) => (
                <Reveal key={c.key} delay={i * 80} className="h-full">
                  <Link to="/crime_report" className="card group relative flex h-full min-h-[190px] flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30 md:p-8">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-white md:text-xl">{c.label}</h3>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-mint text-brand-deep transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-amber">
                        <FiArrowUpRight />
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-5xl font-extrabold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber">
                        <CountUp to={categoryCounts[i]} />
                      </p>
                      <p className="mt-1 text-sm text-brand-ink/55 transition-colors duration-300 group-hover:text-white/60">reports</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= AREA SAFETY SCORE (asli data) ================= */}
        <SafetyScores tone="white" />

        {/* ================= COMMUNITY ================= */}
        <section className="community mx-auto my-16 w-[90%] max-w-6xl md:my-28">
          <div className="top grid items-center gap-12 md:grid-cols-2">
            <Reveal>
              <div className="left group relative mx-auto w-full max-w-md">
                <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl border-2 border-brand-jade/40 transition-all duration-500 group-hover:-bottom-6 group-hover:-right-6" />
                <div className="relative overflow-hidden rounded-3xl">
                  <img className="w-full transition-transform duration-700 group-hover:scale-105" src={community} alt="Community safety" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="right">
                <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                  Enhancing <br /> Community Safety <br /> Together
                </h2>
                <p className="mt-5 leading-8 text-brand-ink/70">
                  In our shared mission to enhance community safety, collaboration is key. By working together, residents, law enforcement, and local organizations can create a proactive approach to crime prevention. Our platform encourages open communication and reporting, empowering everyone to contribute
                </p>
                <div className="btns mt-8 flex flex-wrap items-center gap-6">
                  <Link
                    to="/crime_report"
                    className="group inline-flex items-center gap-2 rounded-full bg-brand-jade px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-deep hover:shadow-xl hover:shadow-brand-deep/25"
                  >
                    Search Crime
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/about_us"
                    className="relative font-semibold text-brand-jade after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-brand-jade after:transition-transform after:duration-300 hover:after:scale-x-0"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Asli numbers (database se) */}
          <div className="mt-16 grid grid-cols-3 gap-3 md:gap-6">
            {numbers.map((n, i) => {
              const Icon = [FiFileText, FiUsers, FiMessageSquare][i]
              return (
                <Reveal key={n.label} delay={i * 120} className="h-full">
                  <div className="group flex h-full cursor-default flex-col items-center rounded-2xl bg-white px-3 py-6 text-center shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30 md:py-8">
                    <div className="mb-3 hidden h-12 w-12 place-items-center rounded-2xl bg-brand-mint text-xl text-brand-jade transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand-amber group-hover:text-brand-deep sm:grid">
                      <Icon />
                    </div>
                    <p className="font-display text-3xl font-extrabold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber md:text-5xl">
                      <CountUp to={n.value} />
                    </p>
                    <h3 className="mt-2 text-sm font-semibold transition-colors duration-300 group-hover:text-white md:text-lg">{n.label}</h3>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* ================= UNITING FOR SAFETY ================= */}
        <Reveal>
          <section className="safety relative mx-auto my-16 w-[92%] max-w-6xl overflow-hidden rounded-3xl bg-brand-ink text-white md:my-24">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-jade/30 blur-[100px]" />
            <div className="absolute inset-0 dot-grid opacity-60" />

            <div className="relative flex flex-col-reverse items-center md:flex-row">
              <div className="left px-8 pb-10 md:w-[40%] md:px-14 md:py-14">
                <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
                  Uniting for Safety: <br className="hidden md:block" /> Your Portal to Crime Free Living
                </h2>
                <p className="py-5 text-white/70">Insight into Neighborhood Security</p>
                <Link
                  to="/crime_report"
                  className="group inline-flex items-center gap-2 rounded-full bg-brand-amber px-7 py-3 font-semibold text-brand-deep transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  Search Crime
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="right group flex justify-center pt-8 md:w-[60%] md:pt-6">
                <img className="w-[90%] transition-transform duration-700 group-hover:scale-[1.03]" src={banner} alt="banner" />
              </div>
            </div>
          </section>
        </Reveal>

        {/* ================= MOST DISCUSSED (asli posts) ================= */}
        <section className="news-blog mx-auto mb-20 w-[90%] max-w-6xl">
          <Reveal>
            <div className="top">
              <h2 className="font-display text-3xl font-extrabold tracking-tight">Most Discussed Crimes</h2>
              <p className="mt-2 text-brand-ink/60">What the community is talking about right now</p>
            </div>
          </Reveal>

          {!loading && !error && trending.length === 0 && (
            <div className="mt-10 rounded-2xl bg-brand-paper p-10 text-center text-brand-ink/60">
              Posts that get likes or comments will appear here.
            </div>
          )}

          <div className="btm mt-10 grid gap-8 md:grid-cols-2">
            {trending.map((n, i) => (
              <Reveal key={n._id} delay={i * 150}>
                <Link to="/crime_response" className="card group block cursor-pointer">
                  <div className="card-top relative overflow-hidden rounded-2xl">
                    {n.image ? (
                      <img className="h-[260px] w-full object-cover transition-transform duration-700 group-hover:scale-105" src={`${API}/uploads/${n.image}`} alt={n.title} />
                    ) : (
                      <div className="grid h-[260px] w-full place-items-center bg-gradient-to-br from-brand-mint to-brand-jade/30 text-6xl text-brand-jade/60">
                        <FiImage />
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-brand-deep/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {catLabel(n.category)} · {n.region}
                    </span>
                  </div>
                  <div className="card-btm mt-4">
                    <div className="flex items-center gap-3">
                      <p className="inline-block rounded-full bg-brand-mint px-3 py-1 text-sm font-semibold text-brand-deep">{dateFormat(n.date, "dd mmm")}</p>
                      <span className="flex items-center gap-1 text-sm text-brand-ink/60"><FiThumbsUp /> {n.likes.length}</span>
                      <span className="flex items-center gap-1 text-sm text-brand-ink/60"><FiMessageCircle /> {n.comments.length}</span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-brand-jade">{n.title}</h3>
                    <p className="mt-3 flex items-center gap-1 font-bold text-brand-jade">
                      Join discussion
                      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

      </Layout>
    </>
  )
}

export default Home