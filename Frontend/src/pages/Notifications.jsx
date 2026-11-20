import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiBell, FiTrash2, FiCheck, FiThumbsUp, FiCheckCircle } from "react-icons/fi";
import Layout from '../components/Layout'
import community from "../images/community.png"
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Motion'
import { NotifIcon, timeAgo } from '../components/NotificationBell'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const Notifications = () => {
  const headers = { 'auth-token': localStorage.getItem('Token') };
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/notifications?limit=100`, { headers });
        setItems(res.data.notifications);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('Token');
          window.location.href = '/login';
          return;
        }
        toast.error('Could not load notifications. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [])

  const unread = items.filter((n) => !n.read).length;
  const shown = filter === 'unread' ? items.filter((n) => !n.read) : items;

  const markAll = async () => {
    try {
      await axios.put(`${API}/api/notifications/read_all`, {}, { headers });
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  const openItem = async (n) => {
    if (!n.read) {
      try {
        await axios.put(`${API}/api/notifications/read/${n._id}`, {}, { headers });
        setItems((prev) => prev.map((x) => x._id === n._id ? { ...x, read: true } : x));
      } catch (error) { /* ignore */ }
    }
    navigate('/crime_response');
  }

  const remove = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API}/api/notifications/${id}`, { headers });
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      toast.error('Could not delete notification');
    }
  }

  const tabs = [
    { key: 'all', label: `All (${items.length})` },
    { key: 'unread', label: `Unread (${unread})` },
  ]

  return (
    <>
      <Layout>
        <ToastContainer />

        <PageHero
          title="Notifications"
          image={community}
          chips={[
            { icon: FiThumbsUp, label: 'Likes & comments' },
            { icon: FiCheckCircle, label: 'Status updates' },
          ]}
          subtitle="Likes, comments, confirmations and status updates on your complaints."
        />

        <section className="mx-auto my-16 w-[90%] max-w-3xl md:my-24">

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative grid w-full max-w-xs grid-cols-2 rounded-2xl bg-brand-mint p-1.5">
              <span className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-brand-deep shadow-lg transition-transform duration-300 ease-out ${filter === 'all' ? 'translate-x-0' : 'translate-x-full'}`} />
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`relative z-10 rounded-xl py-2 text-center text-sm font-semibold transition-colors duration-300 ${filter === t.key ? 'text-white' : 'text-brand-deep hover:text-brand-jade'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {unread > 0 && (
              <button onClick={markAll} className="group inline-flex items-center gap-2 font-semibold text-brand-jade transition-colors duration-300 hover:text-brand-deep">
                <FiCheck className="transition-transform duration-300 group-hover:scale-125" />
                Mark all as read
              </button>
            )}
          </div>

          {loading && <p className="mt-8 rounded-2xl bg-brand-paper p-10 text-center text-brand-ink/60">Loading notifications...</p>}

          {!loading && shown.length === 0 && (
            <div className="mt-8 rounded-2xl bg-brand-paper p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint text-2xl text-brand-jade">
                <FiBell />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</h3>
              <p className="mt-1 text-brand-ink/60">When someone likes, comments on or confirms your complaint, you will see it here.</p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            {shown.map((n, i) => (
              <Reveal key={n._id} delay={(i % 4) * 80}>
                <div
                  onClick={() => openItem(n)}
                  className={`group relative flex cursor-pointer items-start gap-4 overflow-hidden rounded-2xl p-5 shadow-md ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-deep/15 ${n.read ? 'bg-white ring-brand-deep/5' : 'bg-brand-mint/50 ring-brand-jade/30'}`}
                >
                  {!n.read && <span className="absolute left-0 top-0 h-full w-1 bg-brand-amber" />}
                  <NotifIcon type={n.type} className="h-11 w-11 text-xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
                  <div className="min-w-0 flex-1">
                    <p className={`leading-6 ${n.read ? 'text-brand-ink/70' : 'font-semibold'}`}>{n.message}</p>
                    <p className="mt-1 text-sm text-brand-ink/50">{timeAgo(n.date)}</p>
                  </div>
                  <button
                    onClick={(e) => remove(e, n._id)}
                    aria-label="Delete notification"
                    title="Delete"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-brand-ink/40 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      </Layout>
    </>
  )
}

export default Notifications