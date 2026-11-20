import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPhoneCall, FiCopy, FiCheck, FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import { FaUserShield, FaTruckMedical, FaFireFlameCurved, FaLifeRing } from "react-icons/fa6";
import Layout from '../components/Layout'
import aboutBg from "../images/aboutbg.png"
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Motion'

const services = [
  { icon: FaUserShield, name: 'Police (Madadgar)', number: '15', text: 'Crimes in progress, robbery, snatching or any danger that needs the police right now.' },
  { icon: FaTruckMedical, name: 'Edhi Ambulance', number: '115', text: 'Ambulance and medical emergencies across Karachi.' },
  { icon: FaTruckMedical, name: 'Chhipa Ambulance', number: '1020', text: 'Ambulance service that works 24/7 in Karachi.' },
  { icon: FaTruckMedical, name: 'Aman Ambulance', number: '1021', text: 'Ambulance and health service (Karachi only).' },
  { icon: FaLifeRing, name: 'Rescue', number: '1122', text: 'Rescue and emergency service. Coverage can differ by area, so use 15 if it does not connect.' },
  { icon: FaFireFlameCurved, name: 'Fire Brigade', number: '16', text: 'Fire emergencies. If 16 does not connect, call the police on 15 and tell them about the fire.' },
]

const callNow = ['A crime is happening right now', 'Someone is injured or unconscious', 'There is a fire or an explosion', 'You or someone else is in danger']
const usePortal = ['Report a crime that already happened', 'Share what you saw in your area', 'Track the status of your complaint', 'Check how safe each area is']

const Emergency = () => {
  const [copied, setCopied] = useState('')

  const copyNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number)
      setCopied(number)
      setTimeout(() => setCopied(''), 1500)
    } catch (error) {
      // copy na ho to bhi call ka button kaam karta hai
    }
  }

  return (
    <>
      <Layout>
        <PageHero
          title="Emergency Numbers"
          image={aboutBg}
          chips={[
            { icon: FiPhoneCall, label: 'Police: 15' },
            { icon: FaTruckMedical, label: 'Ambulance: 115' },
          ]}
          subtitle="Important helpline numbers for Karachi. In an emergency, call first."
        />

        <section className="mx-auto my-16 w-[90%] max-w-6xl md:my-24">

          {/* Warning */}
          <Reveal>
            <div className="flex items-start gap-4 rounded-2xl border-l-4 border-red-500 bg-red-50 p-5 md:p-6">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-xl text-red-500"><FiAlertTriangle /></div>
              <div>
                <h2 className="font-display text-lg font-bold text-red-700">Crime Portal is not an emergency service</h2>
                <p className="mt-1 leading-7 text-red-900/80">
                  Complaints on this website are not watched in real time. If someone is in danger, do not wait here. Call the right number below first.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Numbers */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal key={s.name} delay={(i % 3) * 100} className="h-full">
                  <div className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint text-2xl text-brand-jade transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand-amber group-hover:text-brand-deep">
                      <Icon />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold transition-colors duration-300 group-hover:text-white">{s.name}</h3>
                    <p className="mt-1 font-display text-5xl font-extrabold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber">{s.number}</p>
                    <p className="mt-3 flex-1 text-sm leading-6 text-brand-ink/65 transition-colors duration-300 group-hover:text-white/70">{s.text}</p>

                    <div className="mt-5 flex gap-3">
                      <a
                        href={`tel:${s.number}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-jade py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-amber hover:text-brand-deep"
                      >
                        <FiPhoneCall /> Call {s.number}
                      </a>
                      <button
                        onClick={() => copyNumber(s.number)}
                        aria-label={`Copy ${s.number}`}
                        title="Copy number"
                        className="grid h-11 w-11 place-items-center rounded-xl border border-brand-deep/15 text-brand-ink/60 transition-all duration-300 hover:border-brand-amber hover:text-brand-amber group-hover:border-white/25 group-hover:text-white"
                      >
                        {copied === s.number ? <FiCheck className="text-brand-jade" /> : <FiCopy />}
                      </button>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>

          {/* Call now / Use portal */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="h-full rounded-2xl bg-red-50 p-6 md:p-8">
                <h3 className="font-display text-xl font-bold text-red-700">Call a number now if</h3>
                <ul className="mt-4 space-y-3">
                  {callNow.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-red-900/80"><FiPhoneCall className="mt-1 shrink-0 text-red-500" /> {t}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120} className="h-full">
              <div className="h-full rounded-2xl bg-brand-mint p-6 md:p-8">
                <h3 className="font-display text-xl font-bold text-brand-deep">Use this portal to</h3>
                <ul className="mt-4 space-y-3">
                  {usePortal.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-brand-ink/80"><FiCheck className="mt-1 shrink-0 text-brand-jade" /> {t}</li>
                  ))}
                </ul>
                <Link to="/crime_response" className="group mt-6 inline-flex items-center gap-2 font-semibold text-brand-jade transition-colors hover:text-brand-deep">
                  Register a complaint
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-10 rounded-2xl bg-brand-paper p-6">
              <h3 className="font-display text-lg font-bold">When you call, tell them</h3>
              <p className="mt-2 leading-7 text-brand-ink/70">Your exact location or the nearest landmark, what happened, how many people are involved or hurt, and your phone number. Stay on the line until they say you can hang up.</p>
              <p className="mt-4 text-sm text-brand-ink/50">These numbers were collected from public sources and may change over time. Please verify them before depending on them.</p>
            </div>
          </Reveal>
        </section>

      </Layout>
    </>
  )
}

export default Emergency