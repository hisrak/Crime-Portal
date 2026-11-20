import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiPhoneCall } from 'react-icons/fi'

// Navbar mein jagah bachane ke liye emergency button neeche kone mein tairta hai
const EmergencyButton = () => {
  const { pathname } = useLocation()

  // Emergency page par is button ki zaroorat nahi
  if (pathname === '/emergency') return null

  return (
    <Link
      to="/emergency"
      aria-label="Emergency numbers"
      title="Emergency Numbers"
      className="group fixed bottom-5 right-5 z-40 md:bottom-7 md:right-7"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40 [animation-duration:2.5s]" />
      <span className="relative inline-flex h-14 items-center rounded-full bg-red-500 px-4 text-white shadow-xl shadow-red-900/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-red-600 group-hover:shadow-2xl">
        <FiPhoneCall className="text-2xl transition-transform duration-300 group-hover:rotate-12" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-semibold transition-all duration-300 group-hover:ml-2 group-hover:max-w-[8rem]">Emergency</span>
      </span>
    </Link>
  )
}

export default EmergencyButton