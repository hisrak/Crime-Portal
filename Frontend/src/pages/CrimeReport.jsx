import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import dateFormat from "dateformat";
import { FiArrowUpRight, FiArrowRight, FiMapPin, FiUsers, FiFileText, FiMessageSquare, FiBarChart2 } from "react-icons/fi"
import Layout from '../components/Layout'
import { StatusBadge, STATUSES } from '../components/status'
import SafetyScores from '../components/SafetyScores'
import PageHero from '../components/PageHero'
import { Reveal, CountUp, useInView } from '../components/Motion'
import bookmark from "../images/bookmark.png"
import cardlogo from "../images/cardlogo.png"
import blog2 from "../images/blog2.png"
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie, Line } from "react-chartjs-2";

Chart.register(CategoryScale);
Chart.defaults.font.family = '"DM Sans", system-ui, sans-serif';
Chart.defaults.color = '#04211F';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// key = database mein saved value, label = screen par dikhne wala naam
const categoryList = [
  { key: 'Target Killing', label: 'Target Killing' },
  { key: 'Snatching', label: 'Snatching' },
  { key: 'Bomb Blast', label: 'Bomb Blast' },
  { key: 'Murder', label: 'Murder' },
  { key: 'Roberry', label: 'Robbery' },
  { key: 'Gang Rape', label: 'Gang Rape' },
]
const regionList = ['South', 'East', 'West', 'North']

const CrimeReport = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Database se real stats mangwate hain
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axios.get(`${API}/api/posts/stats`, {
          headers: { 'auth-token': localStorage.getItem('Token') }
        });
        setStats(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('Token');
          window.location.href = '/login';
          return;
        }
        setError('Could not load crime data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [])

  const regionCounts = regionList.map((r) => (stats?.regions?.[r] || 0));
  const categoryCounts = categoryList.map((c) => (stats?.categories?.[c.key] || 0));
  const hasData = !!stats && stats.posts > 0;

  const statCards = [
    { icon: FiUsers, label: 'Users', value: stats ? stats.users : 0 },
    { icon: FiFileText, label: 'Posts', value: stats ? stats.posts : 0 },
    { icon: FiMessageSquare, label: 'Comments', value: stats ? stats.comments : 0 },
  ]

  const pieData = {
    labels: regionList.map((r, i) => `${r} (${regionCounts[i]})`),
    datasets: [
      {
        label: 'Crimes',
        data: regionCounts,
        backgroundColor: ['#309689', '#F5B544', '#03302D', '#9BDCD2'],
        hoverOffset: 14,
        borderColor: '#ffffff',
        borderWidth: 3,
      }
    ]
  }

  const lineData = {
    labels: categoryList.map((c) => c.label),
    datasets: [
      {
        label: 'Crime Rate Of All Categories',
        data: categoryCounts,
        borderColor: '#309689',
        backgroundColor: 'rgba(48, 150, 137, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#F5B544',
        pointBorderColor: '#03302D',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 9,
      }
    ]
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1800, easing: 'easeOutQuart' },
    plugins: {
      title: { display: true, text: "Crime Rate By Category", font: { size: 16, weight: 'bold' } },
      legend: { labels: { usePointStyle: true } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: 'rgba(3,48,45,0.08)' }, ticks: { precision: 0 } },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1600, easing: 'easeOutQuart' },
    plugins: {
      title: { display: true, text: "Crime Share By District", font: { size: 16, weight: 'bold' } },
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } },
    },
  }

  // Charts tab draw hote hain jab screen par aayen
  const [lineRef, lineInView] = useInView(0.25)
  const [pieRef, pieInView] = useInView(0.25)
  const [barRef, barInView] = useInView(0.3)

  // Complaint status ki ginti
  const statusCounts = STATUSES.map((st) => (stats?.statuses?.[st] || 0))
  const resolvedPct = hasData ? Math.round((statusCounts[2] / stats.posts) * 100) : 0

  // Chart ki jagah dikhne wala message (loading / error / khali data)
  const Placeholder = () => (
    <div className="grid h-full place-items-center text-center">
      {loading ? (
        <p className="text-brand-ink/60">Loading crime data...</p>
      ) : error ? (
        <p className="font-medium text-red-500">{error}</p>
      ) : (
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint text-2xl text-brand-jade">
            <FiBarChart2 />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold">No crime data yet</h3>
          <p className="mt-1 text-brand-ink/60">Charts will appear once complaints are registered.</p>
          <Link to="/crime_response" className="mt-4 inline-block font-semibold text-brand-jade transition-colors hover:text-brand-deep">
            Register a complaint
          </Link>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Layout>

        <PageHero
          title="Crime Reports"
          image={blog2}
          imagePosition="right center"
          subtitle="Dynamic crime statistics and insights into registered complaints across Karachi."
        />

        {/* ================= LATEST REPORT CARDS (database se) ================= */}
        <section className="mid mx-auto my-16 w-[90%] max-w-6xl md:my-24">
          {!loading && stats && stats.latest.length > 0 && (
            <div className="cards grid gap-6 md:grid-cols-3">
              {stats.latest.map((r, i) => (
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
                        <p className="mt-1 text-sm text-brand-ink/60">
                          {r.category === 'Roberry' ? 'Robbery' : r.category} · Karachi {r.region}
                        </p>
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
          )}

          {!loading && !error && stats && stats.latest.length === 0 && (
            <p className="rounded-2xl bg-brand-paper p-8 text-center text-brand-ink/60">No reports registered yet.</p>
          )}
        </section>

        {/* ================= LINE CHART ================= */}
        <section className="linechart bg-brand-paper py-16 md:py-24">
          <div className="mx-auto w-[90%] max-w-6xl">
            <Reveal>
              <div className="text-center">
                <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Crime Statistics</h2>
                <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-brand-amber" />
                <p className="mx-auto mt-5 max-w-3xl leading-8 text-brand-ink/65">
                  Our portal delivers dynamic crime statistics, offering insights into registered complaints such as robberies, snatchings, bomb blasts, gang rapes, and more.
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div
                ref={lineRef}
                className="mt-12 rounded-3xl bg-white p-4 shadow-xl shadow-brand-deep/10 ring-1 ring-brand-deep/5 transition-shadow duration-500 hover:shadow-2xl hover:shadow-brand-deep/20 md:p-8"
              >
                <div className="relative h-[320px] md:h-[420px]">
                  {hasData ? (lineInView && <Line data={lineData} options={lineOptions} />) : <Placeholder />}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= PIE + COUNTS ================= */}
        <section className="piechart mx-auto my-16 grid w-[90%] max-w-6xl items-stretch gap-8 md:my-24 lg:grid-cols-2">
          <Reveal className="h-full">
            <div
              ref={pieRef}
              className="left h-full rounded-3xl bg-white p-6 shadow-xl shadow-brand-deep/10 ring-1 ring-brand-deep/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-deep/20 md:p-8"
            >
              <div className="relative h-[340px] md:h-[400px]">
                {hasData ? (pieInView && <Pie data={pieData} options={pieOptions} />) : <Placeholder />}
              </div>
            </div>
          </Reveal>

          <div className="cards grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {statCards.map((c, i) => {
              const Icon = c.icon
              return (
                <Reveal key={c.label} delay={i * 120} className="h-full">
                  <div className="card group flex h-full cursor-default items-center gap-5 rounded-2xl bg-white p-6 shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30 sm:flex-col sm:justify-center sm:text-center lg:flex-row lg:justify-start lg:text-left">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-mint text-2xl text-brand-jade transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand-amber group-hover:text-brand-deep">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold transition-colors duration-300 group-hover:text-white">{c.label}</h3>
                      <p className="font-display text-4xl font-extrabold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber">
                        <CountUp to={c.value} />
                      </p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* ================= CRIME MAP LINK ================= */}
        <section className="mx-auto my-16 w-[90%] max-w-6xl">
          <Reveal>
            <Link to="/map" className="group relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-brand-deep p-8 text-white shadow-xl shadow-brand-deep/25 md:flex-row md:items-center md:p-12">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-jade/40 blur-3xl transition-all duration-700 group-hover:scale-150" />
              <div className="absolute inset-0 dot-grid opacity-60" />
              <div className="relative flex items-center gap-5">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/10 text-3xl text-brand-amber transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <FiMapPin />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-extrabold md:text-3xl">Explore the Crime Map</h2>
                  <p className="mt-1 text-white/70">See where complaints are happening across Karachi, area by area.</p>
                </div>
              </div>
              <span className="relative inline-flex items-center gap-2 rounded-full bg-brand-amber px-7 py-3 font-semibold text-brand-deep transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white">
                Open map
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </section>

        {/* ================= AREA SAFETY SCORE (asli data) ================= */}
        <SafetyScores tone="paper" />

        {/* ================= COMPLAINT STATUS ================= */}
        <section className="mx-auto mb-20 w-[90%] max-w-6xl">
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Complaint Status</h2>
              <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-brand-amber" />
              <p className="mx-auto mt-5 max-w-2xl leading-8 text-brand-ink/65">
                How many of the registered complaints have been reviewed and resolved so far.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div ref={barRef} className="mt-10 rounded-3xl bg-white p-6 shadow-xl shadow-brand-deep/10 ring-1 ring-brand-deep/5 md:p-10">
              <div className="flex items-end justify-between">
                <p className="font-display text-4xl font-extrabold text-brand-jade md:text-5xl">
                  <CountUp to={resolvedPct} suffix="%" />
                </p>
                <p className="font-semibold text-brand-ink/60">complaints resolved</p>
              </div>

              <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-brand-mint">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-jade to-brand-amber transition-all duration-[1500ms] ease-out"
                  style={{ width: barInView ? `${resolvedPct}%` : '0%' }}
                />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {STATUSES.map((st, i) => (
                  <div key={st} className="group rounded-2xl bg-brand-paper p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-xl hover:shadow-brand-deep/25">
                    <StatusBadge status={st} />
                    <p className="mt-3 font-display text-4xl font-extrabold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber">
                      <CountUp to={statusCounts[i]} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

      </Layout>
    </>
  )
}

export default CrimeReport