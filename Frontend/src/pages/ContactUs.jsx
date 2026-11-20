import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Motion'
import { CiLocationOn } from "react-icons/ci";
import { FiClock, FiAlertCircle, FiSend, FiCheckCircle, FiInbox } from "react-icons/fi";
import dateFormat from "dateformat";
import { FaRegEnvelope } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import community from "../images/community.png"

const infoCards = [
  { icon: IoCallOutline, title: 'Call for inquiry', text: '+92 ----------' },
  { icon: FaRegEnvelope, title: 'Send us email', text: 'crimeportal.com' },
  { icon: FiClock, title: 'Service', text: '24/7' },
  { icon: CiLocationOn, title: 'Location', text: 'Karachi' },
]

const inputCls = (hasErr) =>
  `w-full rounded-xl border bg-white px-4 py-3 outline-none transition-all duration-300 placeholder:text-brand-ink/35 ${
    hasErr
      ? 'border-red-400 ring-4 ring-red-100'
      : 'border-brand-deep/10 hover:border-brand-jade/50 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15'
  }`

const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-500">
      <FiAlertCircle className="shrink-0" />
      {msg}
    </p>
  ) : null

const ContactUs = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [myMessages, setMyMessages] = useState([]);

  const authHeaders = { 'auth-token': localStorage.getItem('Token') };

  // Meri pehle bheji hui messages (database se)
  const loadMessages = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/contact/my_messages', { headers: authHeaders });
      setMyMessages(res.data.messages);
    } catch (error) {
      // Messages na aayen to form phir bhi chalna chahiye
    }
  }

  useEffect(() => {
    loadMessages();
  }, [])

  const validate = () => {
    const err = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fname.trim()) err.fname = "First name is required";
    else if (fname.trim().length < 3) err.fname = "At least 3 characters";

    if (!lname.trim()) err.lname = "Last name is required";
    else if (lname.trim().length < 3) err.lname = "At least 3 characters";

    if (!email.trim()) err.email = "Email is required";
    else if (!emailRegex.test(email)) err.email = "Enter a valid email";

    if (!message.trim()) err.message = "Message is required";
    else if (message.trim().length < 10) err.message = "At least 10 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  const addFeedback = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:4000/api/contact/add_contact', {
        fname, lname, email, message
      }, { headers: authHeaders });
      if (res.status === 200) {
        toast.success('Your Response has been added!', {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
        setFname("");
        setLname("");
        setEmail("");
        setMessage("");
        setErrors({});
        loadMessages();
      }
    } catch (error) {
      toast.error(error.response?.data?.err || 'Something went wrong');
    }
  }

  return (
    <>
      <Layout>
        <ToastContainer />

        <PageHero
          title="Contact Us"
          image={community}
          subtitle="For immediate assistance or to report a crime, please use our online portal."
        />

        {/* ================= INFO + FORM ================= */}
        <section className="contact-mid mx-auto my-16 grid w-[90%] max-w-6xl items-start gap-12 md:my-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">

          {/* Left: info */}
          <div className="contact-mid-left">
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">CONNECT WITH US</h2>
              <h3 className="mt-3 font-display text-xl font-bold text-brand-jade md:text-2xl">STAY INFORMED, STAY SAFE</h3>
              <span className="mt-5 block h-1 w-14 rounded-full bg-brand-amber" />
              <p className="mt-5 max-w-md leading-8 text-brand-ink/65">
                For immediate assistance or to report a crime, please use our online portal.
              </p>
            </Reveal>

            <div className="cards mt-10 grid gap-5 sm:grid-cols-2">
              {infoCards.map((c, i) => {
                const Icon = c.icon
                return (
                  <Reveal key={c.title} delay={i * 100} className="h-full">
                    <div className="card group h-full cursor-pointer rounded-2xl bg-white p-6 shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint text-3xl text-brand-jade transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand-amber group-hover:text-brand-deep">
                        <Icon />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold transition-colors duration-300 group-hover:text-white">{c.title}</h3>
                      <p className="mt-1 font-semibold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber">{c.text}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>

          {/* Right: form */}
          <Reveal delay={150}>
            <div className="contact-mid-right relative overflow-hidden rounded-3xl bg-brand-mint p-6 shadow-xl shadow-brand-deep/10 md:p-10">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-jade/15 blur-2xl" />

              <h2 className="relative text-center font-display text-3xl font-extrabold tracking-tight">Contact Info</h2>
              <span className="relative mx-auto mt-4 block h-1 w-12 rounded-full bg-brand-amber" />

              <form className="contact-form relative mt-8 space-y-5" onSubmit={addFeedback} noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="inp">
                    <label className="mb-1.5 block text-sm font-bold" htmlFor="fname">First Name</label>
                    <input id="fname" value={fname} onChange={(e) => setFname(e.target.value)} className={inputCls(errors.fname)} type="text" placeholder="Your Name" />
                    <FieldError msg={errors.fname} />
                  </div>
                  <div className="inp">
                    <label className="mb-1.5 block text-sm font-bold" htmlFor="lname">Last Name</label>
                    <input id="lname" value={lname} onChange={(e) => setLname(e.target.value)} className={inputCls(errors.lname)} type="text" placeholder="Your Last Name" />
                    <FieldError msg={errors.lname} />
                  </div>
                </div>

                <div className="inp">
                  <label className="mb-1.5 block text-sm font-bold" htmlFor="email">Email Address</label>
                  <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls(errors.email)} type="email" placeholder="Your Email Address" />
                  <FieldError msg={errors.email} />
                </div>

                <div className="inp">
                  <label className="mb-1.5 block text-sm font-bold" htmlFor="message">Message</label>
                  <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputCls(errors.message)} h-40 resize-none`} placeholder="Your Message" />
                  <FieldError msg={errors.message} />
                </div>

                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-jade px-10 py-3.5 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-deep hover:shadow-xl hover:shadow-brand-deep/30 active:translate-y-0"
                >
                  Send Message
                  <FiSend className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </form>
            </div>
          </Reveal>
        </section>

        {/* ================= MY MESSAGES (database se) ================= */}
        <section className="mx-auto mb-16 w-[90%] max-w-6xl">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Your Messages</h2>
            <span className="mt-4 block h-1 w-14 rounded-full bg-brand-amber" />
          </Reveal>

          {myMessages.length === 0 && (
            <div className="mt-8 rounded-2xl bg-brand-paper p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint text-2xl text-brand-jade">
                <FiInbox />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">No messages sent yet</h3>
              <p className="mt-1 text-brand-ink/60">Messages you send using the form will show up here.</p>
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {myMessages.map((m, i) => (
              <Reveal key={m._id} delay={(i % 2) * 120} className="h-full">
                <div className="group h-full rounded-2xl bg-white p-6 shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-deep/15">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-brand-ink/55">{dateFormat(m.date, "mmmm dS, yyyy, h:MM TT")}</p>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${m.read ? 'bg-brand-mint text-brand-deep' : 'bg-brand-amber/25 text-brand-deep'}`}>
                      {m.read ? <FiCheckCircle /> : <FiClock />}
                      {m.read ? 'Seen by team' : 'Received'}
                    </span>
                  </div>
                  <p className="mt-4 leading-7 text-brand-ink/75">{m.message}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= MAP ================= */}
        <Reveal>
          <section className="contact-btm group mx-auto mb-20 w-[90%] max-w-6xl overflow-hidden rounded-3xl shadow-xl shadow-brand-deep/15 ring-1 ring-brand-deep/10">
            <iframe className="grayscale transition-all duration-700 group-hover:grayscale-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.9024867479634!2d67.02166607442994!3d24.867179844990453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6b1566c46f%3A0x65318f4eb62c7aa8!2sAptech%20Computer%20Education%20Garden%20Center!5e0!3m2!1sen!2s!4v1728276334584!5m2!1sen!2s" width="100%" height="420" style={{ border: "0", display: "block" }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Crime Portal location"></iframe>
          </section>
        </Reveal>

      </Layout>
    </>
  )
}

export default ContactUs