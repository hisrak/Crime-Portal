import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import dateFormat from "dateformat";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit2, FiX, FiUploadCloud, FiFileText, FiThumbsUp, FiMessageCircle, FiImage, FiArrowRight, FiMail, FiCalendar, FiInbox, FiEyeOff, FiEye } from "react-icons/fi";
import Layout from '../components/Layout'
import { StatusBadge } from '../components/status'
import PageHero from '../components/PageHero'
import { Reveal, CountUp } from '../components/Motion'
import d1 from "../images/1732251642567Group.png"

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const profileImg = (img) => (img ? `${API}/profile/${img}` : d1)
const catLabel = (key) => (key === 'Roberry' ? 'Robbery' : key)

const Profile = () => {
  const headers = { 'auth-token': localStorage.getItem('Token') };

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit profile
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [saving, setSaving] = useState(false);

  const handleError = (error, fallback) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('Token');
      window.location.href = '/login';
      return;
    }
    toast.error(error.response?.data?.err || fallback);
  }

  // User ki detail aur uski apni posts, dono database se
  useEffect(() => {
    const load = async () => {
      try {
        const [u, p] = await Promise.all([
          axios.get(`${API}/api/auth/getuser`, { headers }),
          axios.get(`${API}/api/posts/my_posts`, { headers }),
        ]);
        setUser(u.data.user);
        setPosts(p.data.posts);
      } catch (error) {
        handleError(error, 'Could not load profile. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [])

  const openEdit = () => {
    setName(user.username);
    setPhoto('');
    setEditing(true);
  }

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name is required');

    const formdata = new FormData();
    formdata.append('username', name);
    if (photo) formdata.append('image', photo);

    setSaving(true);
    try {
      const res = await axios.put(`${API}/api/auth/update_profile`, formdata, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated', { autoClose: 1000 });
    } catch (error) {
      handleError(error, 'Could not update profile');
    } finally {
      setSaving(false);
    }
  }

  const likesReceived = posts.reduce((sum, p) => sum + p.likes.length, 0);
  const commentsReceived = posts.reduce((sum, p) => sum + p.comments.length, 0);

  const stats = [
    { icon: FiFileText, label: 'My Complaints', value: posts.length },
    { icon: FiThumbsUp, label: 'Likes Received', value: likesReceived },
    { icon: FiMessageCircle, label: 'Comments Received', value: commentsReceived },
  ]

  const inputCls = "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-brand-amber focus:bg-white/15 focus:ring-4 focus:ring-brand-amber/20"

  return (
    <>
      <Layout>
        <ToastContainer />

        <PageHero
          title="My Profile"
          image={user ? profileImg(user.image) : d1}
          imageShape="circle"
          chips={[
            { icon: FiFileText, label: `${posts.length} Complaints` },
            { icon: FiThumbsUp, label: `${likesReceived} Likes Received` },
          ]}
          subtitle="Manage your account and see all the complaints you have registered."
        />

        <section className="mx-auto my-16 grid w-[90%] max-w-6xl items-start gap-8 md:my-24 lg:grid-cols-[1fr_2fr]">

          {/* ================= PROFILE CARD ================= */}
          <Reveal className="lg:sticky lg:top-24">
            <div className="group relative overflow-hidden rounded-3xl bg-brand-deep p-8 text-center text-white shadow-xl shadow-brand-deep/25">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-jade/40 blur-3xl transition-all duration-700 group-hover:scale-150" />
              <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-brand-amber/15 blur-3xl" />

              {loading && <p className="relative py-16 text-white/70">Loading profile...</p>}

              {!loading && user && !editing && (
                <div className="relative">
                  <div className="mx-auto w-fit rounded-full p-1.5 ring-2 ring-brand-amber transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
                    <img className="h-28 w-28 rounded-full bg-white object-cover" src={profileImg(user.image)} alt={user.username} />
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-extrabold">{user.username}</h2>

                  <div className="mt-4 space-y-2 text-sm text-white/75">
                    <p className="flex items-center justify-center gap-2 break-all"><FiMail className="shrink-0 text-brand-amber" /> {user.email}</p>
                    <p className="flex items-center justify-center gap-2"><FiCalendar className="shrink-0 text-brand-amber" /> Member since {dateFormat(user.date, "mmmm yyyy")}</p>
                  </div>

                  <button
                    onClick={openEdit}
                    className="group/btn mt-7 inline-flex items-center gap-2 rounded-full bg-brand-amber px-6 py-2.5 font-semibold text-brand-deep transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/30"
                  >
                    <FiEdit2 className="transition-transform duration-300 group-hover/btn:rotate-12" />
                    Edit Profile
                  </button>

                  {user.isAdmin && (
                    <div className="mt-4">
                      <Link to="/admin_messages" className="group/adm inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-brand-amber hover:text-brand-amber">
                        <FiMail />
                        Contact Messages (Admin)
                        <FiArrowRight className="transition-transform duration-300 group-hover/adm:translate-x-1" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {!loading && user && editing && (
                <form onSubmit={saveProfile} className="animate-fade-up relative text-left">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold">Edit Profile</h2>
                    <button type="button" onClick={() => setEditing(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-lg transition-all duration-300 hover:rotate-90 hover:bg-white/15">
                      <FiX />
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-white/80">Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} type="text" placeholder="Your name" />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-white/80">Profile photo</label>
                      <label className="group/up flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-white/25 px-4 py-3 text-sm text-white/70 transition-all duration-300 hover:border-brand-amber hover:text-brand-amber">
                        <FiUploadCloud className="text-xl transition-transform duration-300 group-hover/up:-translate-y-1" />
                        <span className="truncate">{photo && photo.name ? photo.name : 'Change photo (optional)'}</span>
                        <input accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="hidden" type="file" />
                      </label>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button type="button" onClick={() => setEditing(false)} className="flex-1 rounded-xl border border-white/25 py-2.5 font-semibold transition-colors duration-300 hover:bg-white/10">
                        Cancel
                      </button>
                      <button type="submit" disabled={saving} className="flex flex-1 items-center justify-center rounded-xl bg-brand-amber py-2.5 font-semibold text-brand-deep transition-all duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
                        {saving ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-deep/30 border-t-brand-deep" /> : 'Save'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* ================= STATS + MY POSTS ================= */}
          <div>
            <div className="grid gap-5 sm:grid-cols-3">
              {stats.map((c, i) => {
                const Icon = c.icon
                return (
                  <Reveal key={c.label} delay={i * 120} className="h-full">
                    <div className="group flex h-full cursor-default flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-mint text-xl text-brand-jade transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand-amber group-hover:text-brand-deep">
                        <Icon />
                      </div>
                      <p className="mt-3 font-display text-4xl font-extrabold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber">
                        <CountUp to={c.value} />
                      </p>
                      <h3 className="mt-1 text-sm font-semibold transition-colors duration-300 group-hover:text-white">{c.label}</h3>
                    </div>
                  </Reveal>
                )
              })}
            </div>

            <Reveal>
              <div className="mt-12 flex items-end justify-between">
                <div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">My Complaints</h2>
                  <span className="mt-3 block h-1 w-12 rounded-full bg-brand-amber" />
                </div>
                <Link to="/crime_response" className="group inline-flex items-center gap-2 font-semibold text-brand-jade">
                  Manage
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </Reveal>

            {!loading && posts.length === 0 && (
              <div className="mt-8 rounded-2xl bg-brand-paper p-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint text-2xl text-brand-jade">
                  <FiInbox />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">You have not registered any complaint yet</h3>
                <Link to="/crime_response" className="mt-3 inline-block font-semibold text-brand-jade transition-colors hover:text-brand-deep">Register a complaint</Link>
              </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {posts.map((p, i) => (
                <Reveal key={p._id} delay={(i % 2) * 120} className="h-full">
                  <Link to="/crime_response" className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-deep/20">
                    <div className="relative overflow-hidden">
                      {p.image ? (
                        <img className="h-[170px] w-full object-cover transition-transform duration-700 group-hover:scale-110" src={`${API}/uploads/${p.image}`} alt={p.title} />
                      ) : (
                        <div className="grid h-[170px] w-full place-items-center bg-gradient-to-br from-brand-mint to-brand-jade/30 text-5xl text-brand-jade/60">
                          <FiImage />
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-brand-deep/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {catLabel(p.category)} · {p.region}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="flex items-center gap-2 text-xs text-brand-ink/55">
                          {dateFormat(p.date, "mmmm dS, yyyy")}
                          {p.anonymous && <span className="inline-flex items-center gap-1 rounded-full bg-brand-deep/10 px-2 py-0.5 font-semibold text-brand-deep"><FiEyeOff /> Anonymous</span>}
                        </p>
                        <StatusBadge status={p.status} />
                      </div>
                      <h3 className="mt-1 font-display text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-brand-jade">{p.title}</h3>
                      <div className="mt-auto flex items-center gap-4 pt-4 text-sm text-brand-ink/60">
                        <span className="flex items-center gap-1.5"><FiThumbsUp /> {p.likes.length}</span>
                        <span className="flex items-center gap-1.5"><FiMessageCircle /> {p.comments.length}</span>
                        <span className="flex items-center gap-1.5" title="People who confirmed this"><FiEye /> {(p.confirmations || []).length}</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

      </Layout>
    </>
  )
}

export default Profile