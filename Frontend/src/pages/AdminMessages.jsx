import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import dateFormat from "dateformat";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiMail, FiInbox, FiTrash2, FiCheckCircle, FiCircle, FiLock, FiUser } from "react-icons/fi";
import Layout from '../components/Layout'
import blog2 from "../images/blog2.png"
import PageHero from '../components/PageHero'
import { Reveal, CountUp } from '../components/Motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const AdminMessages = () => {
  const headers = { 'auth-token': localStorage.getItem('Token') };

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/contact/all`, { headers });
        setMessages(res.data.messages);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('Token');
          window.location.href = '/login';
          return;
        }
        if (error.response?.status === 403) setForbidden(true);
        else toast.error('Could not load messages. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [])

  const toggleRead = async (id) => {
    try {
      const res = await axios.put(`${API}/api/contact/mark_read/${id}`, {}, { headers });
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: res.data.read } : m));
    } catch (error) {
      toast.error(error.response?.data?.err || 'Something went wrong');
    }
  }

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${API}/api/contact/delete/${id}`, { headers });
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setDeleteId('');
      toast.success('Message deleted', { autoClose: 1000 });
    } catch (error) {
      setDeleteId('');
      toast.error(error.response?.data?.err || 'Something went wrong');
    }
  }

  const unread = messages.filter((m) => !m.read).length;
  const shown = filter === 'unread' ? messages.filter((m) => !m.read) : messages;

  const tabs = [
    { key: 'all', label: `All (${messages.length})` },
    { key: 'unread', label: `Unread (${unread})` },
  ]

  return (
    <>
      <Layout>
        <ToastContainer />

        <PageHero
          title="Contact Messages"
          image={blog2}
          imagePosition="right center"
          chips={[
            { icon: FiMail, label: 'User messages' },
            { icon: FiCheckCircle, label: 'Read / unread' },
          ]}
          subtitle="Messages sent by users through the Contact Us form."
        />

        <section className="mx-auto my-16 w-[90%] max-w-5xl md:my-24">

          {loading && <p className="rounded-2xl bg-brand-paper p-10 text-center text-brand-ink/60">Loading messages...</p>}

          {!loading && forbidden && (
            <div className="rounded-2xl bg-brand-paper p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint text-2xl text-brand-jade">
                <FiLock />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">Admin access only</h3>
              <p className="mt-1 text-brand-ink/60">Your account does not have permission to view these messages.</p>
              <Link to="/" className="mt-4 inline-block font-semibold text-brand-jade transition-colors hover:text-brand-deep">Go to Home</Link>
            </div>
          )}

          {!loading && !forbidden && (
            <>
              {/* Numbers */}
              <div className="grid grid-cols-2 gap-5">
                {[{ label: 'Total Messages', value: messages.length }, { label: 'Unread', value: unread }].map((c, i) => (
                  <Reveal key={c.label} delay={i * 120} className="h-full">
                    <div className="group flex h-full cursor-default flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30">
                      <p className="font-display text-4xl font-extrabold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber md:text-5xl">
                        <CountUp to={c.value} />
                      </p>
                      <h3 className="mt-1 font-semibold transition-colors duration-300 group-hover:text-white">{c.label}</h3>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Tabs */}
              <div className="relative mt-8 grid grid-cols-2 rounded-2xl bg-brand-mint p-1.5">
                <span className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-brand-deep shadow-lg transition-transform duration-300 ease-out ${filter === 'all' ? 'translate-x-0' : 'translate-x-full'}`} />
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setFilter(t.key)}
                    className={`relative z-10 rounded-xl py-2.5 text-center font-semibold transition-colors duration-300 ${filter === t.key ? 'text-white' : 'text-brand-deep hover:text-brand-jade'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {shown.length === 0 && (
                <div className="mt-8 rounded-2xl bg-brand-paper p-10 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint text-2xl text-brand-jade">
                    <FiInbox />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold">{filter === 'unread' ? 'No unread messages' : 'No messages yet'}</h3>
                </div>
              )}

              {/* Messages */}
              <div className="mt-8 space-y-5">
                {shown.map((m, i) => (
                  <Reveal key={m._id} delay={(i % 3) * 100}>
                    <div className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-deep/15 ${m.read ? 'ring-brand-deep/5' : 'ring-brand-amber/60'}`}>
                      <span className={`absolute left-0 top-0 h-full w-1 ${m.read ? 'bg-brand-jade/40' : 'bg-brand-amber'}`} />

                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-bold">{m.fname} {m.lname}</h3>
                          <a href={`mailto:${m.email}`} className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-brand-jade transition-colors hover:text-brand-deep">
                            <FiMail /> {m.email}
                          </a>
                        </div>
                        <div className="text-right text-sm text-brand-ink/55">
                          <p>{dateFormat(m.date, "mmmm dS, yyyy, h:MM TT")}</p>
                          <p className="mt-1 flex items-center justify-end gap-1.5">
                            <FiUser /> {m.user ? m.user.username : 'Not logged in'}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 leading-7 text-brand-ink/75">{m.message}</p>

                      <div className="mt-5 flex items-center justify-between border-t border-brand-deep/10 pt-4">
                        <button
                          onClick={() => toggleRead(m._id)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${m.read ? 'bg-brand-mint text-brand-deep hover:bg-brand-jade hover:text-white' : 'bg-brand-amber text-brand-deep hover:bg-brand-deep hover:text-white'}`}
                        >
                          {m.read ? <FiCheckCircle /> : <FiCircle />}
                          {m.read ? 'Marked as read' : 'Mark as read'}
                        </button>

                        {deleteId === m._id ? (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-red-500">Delete?</span>
                            <button onClick={() => setDeleteId('')} className="rounded-full border border-brand-deep/15 px-4 py-1.5 font-semibold transition-colors hover:bg-brand-paper">No</button>
                            <button onClick={() => deleteMessage(m._id)} className="rounded-full bg-red-500 px-4 py-1.5 font-semibold text-white transition-colors hover:bg-red-600">Yes</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(m._id)}
                            aria-label="Delete message"
                            title="Delete message"
                            className="grid h-9 w-9 place-items-center rounded-full text-brand-ink/45 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </section>

      </Layout>
    </>
  )
}

export default AdminMessages