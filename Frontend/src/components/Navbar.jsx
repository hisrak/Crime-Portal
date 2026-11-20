import React, { useEffect, useState } from 'react';
import navlogo from "../images/navlogo.png";
import { HiMiniBars4, HiMiniXMark } from "react-icons/hi2";
import { Link, NavLink } from 'react-router-dom';
import { FiUser } from "react-icons/fi";
import NotificationBell from './NotificationBell';
import EmergencyButton from './EmergencyButton';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about_us', label: 'About Us' },
  { to: '/crime_report', label: 'Crime Reports' },
  { to: '/crime_response', label: 'Crime Response' },
  { to: '/contact_us', label: 'Contact Us' },
];

const Navbar = () => {
  const Token = localStorage.getItem('Token');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const LogoutHandler = () => {
    localStorage.removeItem('Token');
    window.location.href = '/login';
  }

  const desktopLink = ({ isActive }) =>
    `relative whitespace-nowrap py-1 text-sm font-medium transition-colors duration-300 hover:text-white xl:text-[15px]
     after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-brand-amber after:transition-all after:duration-300
     ${isActive ? 'text-white after:w-full' : 'text-white/70 after:w-0 hover:after:w-full'}`;

  const mobileLink = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200
     ${isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:bg-white/5 hover:text-white'}`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-brand-deep transition-all duration-300 ${scrolled ? 'shadow-lg shadow-black/25 backdrop-blur-md bg-brand-deep/95' : ''}`}
      >
        <div className={`mx-auto flex w-[92%] max-w-7xl items-center justify-between gap-6 transition-all duration-300 ${scrolled ? 'h-16' : 'h-16 lg:h-20'}`}>

          <Link to="/" className="logo shrink-0 transition-transform duration-300 hover:scale-[1.04]">
            <img src={navlogo} alt="Crime Portal" />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={desktopLink}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 lg:flex xl:gap-4">
            {Token ? (
              <>
                <NotificationBell />
                <NavLink
                  to="/profile"
                  title="Profile"
                  className={({ isActive }) => `inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-amber hover:text-brand-amber xl:px-4 ${isActive ? 'border-brand-amber text-brand-amber' : 'border-white/25 text-white'}`}
                >
                  <FiUser className="text-base" />
                  <span className="hidden xl:inline">Profile</span>
                </NavLink>
                <button
                  onClick={LogoutHandler}
                  className="rounded-full bg-brand-jade px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-brand-deep hover:shadow-lg hover:shadow-black/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="relative py-1 text-[15px] font-medium text-white/80 transition-colors hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-amber after:transition-all after:duration-300 hover:after:w-full"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-brand-jade px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-brand-deep hover:shadow-lg hover:shadow-black/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="rounded-lg p-2 text-2xl text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <HiMiniXMark /> : <HiMiniBars4 />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-white/10 px-4 pb-6 pt-3">
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.to}>
                    <NavLink to={l.to} end={l.end} className={mobileLink} onClick={() => setOpen(false)}>
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-3 px-1">
                {Token ? (
                  <>
                    <NotificationBell mobile onNavigate={() => setOpen(false)} />
                    <Link to="/profile" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                      <FiUser />
                      Profile
                    </Link>
                    <button onClick={LogoutHandler} className="rounded-full bg-brand-jade px-6 py-2 text-sm font-semibold text-white">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="rounded-full border border-white/25 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="rounded-full bg-brand-jade px-6 py-2 text-sm font-semibold text-white">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <EmergencyButton />
    </>
  )
}

export default Navbar