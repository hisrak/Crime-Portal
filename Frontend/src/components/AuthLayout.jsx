import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiActivity, FiEye, FiEyeOff } from 'react-icons/fi'
import navlogo from "../images/navlogo.png";
import registerside from "../images/registerside.png";
import logo from "../images/logo.png";

// Login aur Register dono ka common layout (left: branding, right: form)
const AuthLayout = ({ children }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 })
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <div className="register grid min-h-screen w-full md:h-screen md:grid-cols-[1.05fr_1fr] md:overflow-hidden">

      {/* ================= LEFT: branding ================= */}
      <div
        onMouseMove={onMove}
        onMouseLeave={() => setPos({ x: 0, y: 0 })}
        className="register-left group/panel relative hidden overflow-hidden bg-brand-deep text-white md:flex md:flex-col md:justify-between"
        style={{ '--x': '60%', '--y': '40%' }}
      >
        <div className="dot-grid absolute inset-0" />
        <div className="absolute -right-24 -top-24 h-96 w-96 animate-float rounded-full bg-brand-jade/30 blur-[120px]" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-brand-amber/15 blur-[120px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/panel:opacity-100"
          style={{ background: 'radial-gradient(520px circle at var(--x) var(--y), rgba(48,150,137,0.28), transparent 65%)' }}
        />

        <div className="relative px-12 pt-8 animate-fade-up">
          <Link to="/" className="inline-block transition-transform duration-300 hover:scale-[1.04]">
            <img src={navlogo} alt="Crime Portal" />
          </Link>
        </div>

        {/* Image + floating chips (mouse ke saath halka sa hilti hai) */}
        <div className="relative mx-auto w-fit px-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div
            className="transition-transform duration-300 ease-out"
            style={{ transform: `translate(${pos.x * 22}px, ${pos.y * 22}px)` }}
          >
            <img className="animate-float mx-auto max-h-[40vh] w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" src={registerside} alt="Crime Portal" />
          </div>

          <div
            className="animate-float absolute -left-2 top-6 flex cursor-default items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm font-semibold shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-brand-amber hover:text-brand-deep"
            style={{ animationDelay: '0.8s' }}
          >
            <FiActivity className="text-lg" />
            Real-time crime data
          </div>
          <div
            className="animate-float absolute -right-2 bottom-10 flex cursor-default items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm font-semibold shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-brand-amber hover:text-brand-deep"
            style={{ animationDelay: '2s' }}
          >
            <FiClock className="text-lg" />
            24/7 Service
          </div>
        </div>

        <div className="relative px-12 pb-10 animate-fade-up" style={{ animationDelay: '350ms' }}>
          <h2 className="max-w-md font-display text-3xl font-extrabold lg:text-4xl leading-tight tracking-tight">
            Your Portal to Crime Free Living
          </h2>
          <span className="mt-4 block h-1 w-16 rounded-full bg-brand-amber" />
          <p className="mt-4 max-w-md leading-7 text-white/70">
            Stay informed and vigilant with our comprehensive data. Insight into Neighborhood Security.
          </p>
        </div>
      </div>

      {/* ================= RIGHT: form ================= */}
      <div className="register-right relative flex min-h-screen flex-col justify-center bg-white px-6 py-8 md:h-screen md:min-h-0 md:overflow-y-auto md:px-12 md:py-6 lg:px-20">
        <div className="mx-auto w-full max-w-md my-auto">
          <div className="reigister-right-top animate-fade-up mb-5 flex justify-center md:justify-end">
            <img className="h-14 w-auto transition-transform duration-500 hover:rotate-6 hover:scale-110" src={logo} alt="" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

// Icon wala input
export const AuthField = ({ icon: Icon, ...props }) => (
  <div className="group relative">
    <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-brand-ink/40 transition-colors duration-300 group-focus-within:text-brand-jade" />
    <input
      {...props}
      className="w-full rounded-xl border border-brand-deep/15 bg-white py-2.5 pl-11 pr-4 outline-none transition-all duration-300 placeholder:text-brand-ink/35 hover:border-brand-jade/50 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15"
    />
  </div>
)

// Password input (show / hide button ke saath)
export const AuthPassword = ({ icon: Icon, ...props }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="group relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-brand-ink/40 transition-colors duration-300 group-focus-within:text-brand-jade" />
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className="w-full rounded-xl border border-brand-deep/15 bg-white py-2.5 pl-11 pr-12 outline-none transition-all duration-300 placeholder:text-brand-ink/35 hover:border-brand-jade/50 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-brand-ink/45 transition-colors duration-300 hover:bg-brand-mint hover:text-brand-jade"
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  )
}

// Neeche ki policy links
export const AuthPolicies = () => (
  <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm font-semibold text-brand-jade">
    <span className="cursor-pointer transition-colors duration-300 hover:text-brand-deep">Terms and Conditions</span>
    <span className="text-brand-ink/25">|</span>
    <span className="cursor-pointer transition-colors duration-300 hover:text-brand-deep">Privacy Policy</span>
    <span className="text-brand-ink/25">|</span>
    <span className="cursor-pointer transition-colors duration-300 hover:text-brand-deep">Security Policy</span>
  </p>
)

export default AuthLayout