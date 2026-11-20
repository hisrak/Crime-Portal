import React, { useState } from 'react'
import axios from 'axios'
import navlogo from "../images/navlogo.png";
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUp } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const pages = [
  { to: '/', label: 'Home' },
  { to: '/about_us', label: 'About Us' },
  { to: '/crime_report', label: 'Crime Reports' },
  { to: '/crime_response', label: 'Crime Responses' },
  { to: '/map', label: 'Crime Map' },
  { to: '/contact_us', label: 'Contact Us' },
  { to: '/emergency', label: 'Emergency Numbers' },
];

const categories = ['Murder', 'Target Killing', 'Bomb Blast', 'High Way & Bank Robbery', 'Snatching', 'Gang Rape'];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [sending, setSending] = useState(false);

  // Newsletter subscribe (email database mein save hoti hai)
  const subscribe = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setMsg({ type: 'error', text: 'Enter a valid email' });
    }
    setSending(true);
    try {
      const res = await axios.post(`${API}/api/newsletter/subscribe`, { email });
      setMsg({ type: 'success', text: res.data.message });
      setEmail('');
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.err || 'Something went wrong' });
    } finally {
      setSending(false);
    }
  }

  return (
    <footer className="footer relative overflow-hidden bg-brand-ink text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-jade to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-jade/10 blur-[110px]" />

      <div className="sub-footer relative mx-auto w-[90%] max-w-6xl">

        <div className="footer-top grid grid-cols-1 gap-12 py-16 md:grid-cols-5 md:gap-8 md:py-20">

          <div className="md:col-span-2">
            <Link to="/" className="logo inline-block transition-transform duration-300 hover:scale-[1.03]">
              <img src={navlogo} alt="Crime Portal" />
            </Link>
            <p className="description mt-6 max-w-sm leading-7 text-white/65">
              Our Crime Monitoring Portal provides real-time crime data and empowers citizens to report incidents. Together, we enhance public safety and foster community collaboration.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold">Pages</h3>
            <ul className="mt-6 space-y-3.5">
              {pages.map((p) => (
                <li key={p.to}>
                  <Link to={p.to} className="group inline-flex items-center gap-2 text-white/65 transition-all duration-300 hover:translate-x-1 hover:text-white">
                    {p.label}
                    <FiArrowRight className="-translate-x-2 text-brand-amber opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold">Crime Categories</h3>
            <ul className="mt-6 space-y-3.5">
              {categories.map((c) => (
                <li key={c} className="cursor-default text-white/65 transition-all duration-300 hover:translate-x-1 hover:text-brand-amber">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold">Newsletter</h3>
            <p className="mt-6 text-white/65">Get Updates Of Latest Crimes</p>
            <form onSubmit={subscribe} noValidate>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value); setMsg(null); }}
                className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-brand-jade focus:bg-white/10 focus:ring-4 focus:ring-brand-jade/20"
                type="email"
                placeholder="Email"
              />
              {msg && (
                <p className={`mt-2 text-sm ${msg.type === 'success' ? 'text-brand-mint' : 'text-red-300'}`}>{msg.text}</p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="group mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-jade px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-amber hover:text-brand-deep hover:shadow-lg hover:shadow-black/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {sending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <>
                    Subscribe now
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-btm flex flex-col items-center gap-4 border-t border-white/10 py-7 md:flex-row md:justify-between">
          <p className="footer-btm-left text-sm text-white/55">© Copyright Crime Portal  2024.</p>

          <div className="footer-btm-right flex items-center gap-6 text-sm text-white/55">
            <p className="cursor-pointer transition-colors duration-300 hover:text-white">Privacy Policy</p>
            <p className="cursor-pointer transition-colors duration-300 hover:text-white">Terms & Conditions</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber hover:bg-brand-amber hover:text-brand-deep"
            >
              <FiArrowUp />
            </button>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer