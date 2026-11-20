import React from 'react'
import { Link } from 'react-router-dom'
import dateFormat from "dateformat";
import { FiArrowRight, FiImage, FiThumbsUp, FiMessageCircle, FiFileText, FiUsers, FiMessageSquare } from "react-icons/fi"
import Layout from '../components/Layout'
import PageHero from '../components/PageHero'
import { Reveal, CountUp } from '../components/Motion'
import { useStats, API } from '../components/useStats'
import aboutBg from "../images/aboutbg.png"
import tick from "../images/tick.png"
import register from "../images/register.png"
import crime from "../images/crime.png"
import bcase from "../images/bcase.png"
import aboutaftermid from "../images/aboutaftermid.png"
import crown from "../images/crown.png"
import mask from "../images/mask.png"
import star from "../images/star.png"
import badge from "../images/badge.png"
import env1 from "../images/env1.png"
import env2 from "../images/env2.png"
import env3 from "../images/env3.png"

const steps = [
  { icon: register, title: 'Register or Login', text: 'Create an account or log in to access our features.' },
  { icon: crime, title: 'Report Crime', text: 'Easily register your complaint and report crimes through our intuitive interface.', to: '/crime_response' },
  { icon: bcase, title: 'Response to Crimes', text: 'Engage with the community by responding to crime reports and sharing information.', to: '/crime_response' },
  { icon: tick, title: 'View Crime Statistics', text: 'Access detailed crime statistics and insights specific to Karachi.', to: '/crime_report' },
]

const features = [
  { icon: crown, title: 'Safe & Secure Community' },
  { icon: mask, title: 'Registering Complaints' },
  { icon: star, title: 'Response Optimization' },
  { icon: badge, title: 'Predictive Policing Solutions' },
]

// Category ka screen par dikhne wala naam
const catLabel = (key) => (key === 'Roberry' ? 'Robbery' : key)

const About = () => {
  const { stats, loading, error } = useStats()
  const latest = stats ? stats.latest : []
  const numbers = [
    { value: stats ? stats.posts : 0, label: 'Crime Reports' },
    { value: stats ? stats.users : 0, label: 'Registered Users' },
    { value: stats ? stats.comments : 0, label: 'Community Responses' },
  ]

  return (
    <>
      <Layout>
        <PageHero
          title="About Us"
          image={aboutBg}
          subtitle="Advanced monitoring solutions for comprehensive crime management."
        />

        {/* ================= WHAT WE DO ================= */}
        <section className="about-after-top mx-auto my-16 w-[90%] max-w-6xl md:my-24">
          <div className="top grid gap-6 md:grid-cols-[1fr_2fr] md:gap-12">
            <Reveal>
              <div className="left">
                <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">What We Do?</h2>
                <span className="mt-5 block h-1 w-14 rounded-full bg-brand-amber" />
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="right">
                <p className="text-lg leading-8 text-brand-deep md:text-2xl md:leading-10">
                  We deliver advanced monitoring solutions for comprehensive crime management. Our platform empowers communities with crime data insights, enabling proactive crime complaints and responses. Stay ahead of threats and protect your community.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <div className="btm group relative mt-12 overflow-hidden rounded-3xl shadow-2xl shadow-brand-deep/20 md:mt-16">
              <img className="w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105" src={aboutBg} alt="Crime monitoring team" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/40 via-transparent to-transparent" />
            </div>
          </Reveal>

          {/* Asli numbers (database se) */}
          <div className="mt-14 grid grid-cols-3 gap-3 md:gap-6">
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

        {/* ================= HOW IT WORKS ================= */}
        <section className="about-mid bg-brand-paper py-16 md:py-24">
          <div className="mx-auto w-[90%] max-w-6xl">
            <Reveal>
              <div className="desc flex flex-col items-center text-center">
                <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">How it works</h2>
                <span className="my-5 block h-1 w-16 rounded-full bg-brand-amber" />
                <p className="max-w-2xl leading-8 text-brand-ink/65">
                  Discover how to effectively use our portal to report crimes, respond to incidents, and access valuable crime statistics in Karachi.
                </p>
              </div>
            </Reveal>

            <div className="cards mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => {
                const Wrapper = s.to ? Link : 'div'
                return (
                <Reveal key={s.title} delay={i * 120} className="h-full">
                  <Wrapper {...(s.to ? { to: s.to } : {})} className="card group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white p-7 shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30">
                    <span className="absolute right-5 top-3 font-display text-6xl font-extrabold text-brand-mint transition-colors duration-300 group-hover:text-white/10">
                      {i + 1}
                    </span>

                    <div className="icon relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand-amber">
                      <img className="h-7 w-7 transition-all duration-300 group-hover:brightness-0" src={s.icon} alt={s.title} />
                    </div>

                    <div className="desc mt-6">
                      <h3 className="font-display text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-white">{s.title}</h3>
                      <p className="mt-3 leading-7 text-brand-ink/65 transition-colors duration-300 group-hover:text-white/70">{s.text}</p>
                    </div>
                    {s.to && (
                      <FiArrowRight className="mt-5 text-xl text-brand-jade transition-all duration-300 group-hover:translate-x-2 group-hover:text-brand-amber" />
                    )}
                  </Wrapper>
                </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ================= AFTER MID ================= */}
        <section className="about-after-mid mx-auto my-16 w-[90%] max-w-6xl md:my-24">
          <Reveal>
            <div className="top group overflow-hidden rounded-3xl shadow-xl shadow-brand-deep/15">
              <img className="w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105" src={aboutaftermid} alt="aboutaftermid" />
            </div>
          </Reveal>

          <div className="btm mt-14 grid items-center gap-12 md:mt-20 md:grid-cols-2">

            <Reveal>
              <div className="left grid grid-cols-2 gap-4">
                <div className="group overflow-hidden rounded-2xl shadow-lg">
                  <img className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={env1} alt="" />
                </div>
                <div className="flex flex-col gap-4 md:pt-10">
                  <div className="group overflow-hidden rounded-2xl shadow-lg">
                    <img className="w-full transition-transform duration-700 group-hover:scale-110" src={env2} alt="" />
                  </div>
                  <div className="group overflow-hidden rounded-2xl shadow-lg">
                    <img className="w-full transition-transform duration-700 group-hover:scale-110" src={env3} alt="" />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="righ">
                <div className="top">
                  <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">Enhancing Community</h2>
                  <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-brand-jade md:text-4xl">Safety Together</h2>
                  <p className="mt-5 leading-8 text-brand-ink/70">
                    In our shared mission to enhance community safety, collaboration is key. By working together, residents, law enforcement, and local organizations can create a proactive approach to crime prevention.
                  </p>
                </div>

                <div className="btm mt-8 grid gap-4 sm:grid-cols-2">
                  {features.map((f) => (
                    <div
                      key={f.title}
                      className="card group flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-brand-deep/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-mint hover:shadow-lg"
                    >
                      <div className="badge rounded-xl bg-brand-jade p-2.5 transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand-deep">
                        <img className="w-[26px]" src={f.icon} alt="" />
                      </div>
                      <h3 className="desc font-bold leading-snug">{f.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= LATEST CRIME UPDATES (database se) ================= */}
        <section className="blog mx-auto mb-20 w-[90%] max-w-6xl">
          <Reveal>
            <div className="top flex flex-col items-center text-center">
              <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Latest Crime Updates</h2>
              <span className="my-5 block h-1 w-16 rounded-full bg-brand-amber" />
              <p className="text-brand-ink/65">Crime in Karachi: What’s Happening Now?</p>
            </div>
          </Reveal>

          {error && (
            <p className="mt-10 rounded-xl bg-red-50 p-4 text-center font-medium text-red-500">{error}</p>
          )}

          {!loading && !error && latest.length === 0 && (
            <div className="mt-10 rounded-2xl bg-brand-paper p-10 text-center">
              <h3 className="font-display text-xl font-bold">No crimes registered yet</h3>
              <p className="mt-1 text-brand-ink/60">Registered complaints will show up here.</p>
              <Link to="/crime_response" className="mt-4 inline-block font-semibold text-brand-jade transition-colors hover:text-brand-deep">Register a complaint</Link>
            </div>
          )}

          <div className="cards mt-12 grid gap-8 md:grid-cols-3">
            {latest.map((n, i) => (
              <Reveal key={n._id} delay={i * 150} className="h-full">
                <Link to="/crime_response" className="card group block h-full cursor-pointer">
                  <div className="card-top relative overflow-hidden rounded-2xl">
                    {n.image ? (
                      <img className="h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-105" src={`${API}/uploads/${n.image}`} alt={n.title} />
                    ) : (
                      <div className="grid h-[220px] w-full place-items-center bg-gradient-to-br from-brand-mint to-brand-jade/30 text-6xl text-brand-jade/60">
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
                      Read more
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

export default About