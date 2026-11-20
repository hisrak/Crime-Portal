import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import { StatusBadge, STATUSES } from '../components/status'
import { areasOf } from '../components/areas'
import PageHero from '../components/PageHero'
import { Reveal, CountUp } from '../components/Motion'
import { CiLocationOn } from "react-icons/ci";
import blog1 from "../images/blog1.png"
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import { FiX, FiSend, FiFileText, FiInbox, FiUploadCloud, FiImage, FiTrash2, FiSearch, FiEdit2, FiEyeOff, FiEye, FiCheckCircle } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import d1 from "../images/1732251642567Group.png"
import dateFormat from "dateformat";

// Itne users tasdeeq karein to post "Verified" ho jati hai
const VERIFY_THRESHOLD = 3
const confCount = (p) => (p.confirmations || []).length

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Backend se aayi hui image ka poora link
const profileImg = (img) => (img ? `${API}/profile/${img}` : d1)
const postImg = (img) => (img ? `${API}/uploads/${img}` : null)

const fieldCls =
  "w-full rounded-xl border border-brand-deep/10 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-300 placeholder:text-brand-ink/35 hover:border-brand-jade/50 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15"

const CrimeResponse = () => {
  const Token = localStorage.getItem('Token');
  const headers = { 'auth-token': Token };

  // Form
  const [ptitle, setPtitle] = useState('');
  const [pdesc, setPdesc] = useState('');
  const [pcategory, setPcategory] = useState('');
  const [pregion, setPregion] = useState('');
  const [pimage, setPimage] = useState('');
  const [pArea, setPArea] = useState('');
  const [pAnon, setPAnon] = useState(false);
  const fileRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  // Data (ab database se aata hai)
  const [aUser, setAUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comment modal
  const [postId, setPostId] = useState('');
  const [commentText, setCommentText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Tabs
  const [tab, setTab] = useState('complaints');

  // Delete post confirm
  const [deleteId, setDeleteId] = useState('');

  // Edit post
  const [editPost, setEditPost] = useState(null);
  const [eTitle, setETitle] = useState('');
  const [eDesc, setEDesc] = useState('');
  const [eRegion, setERegion] = useState('');
  const [eCategory, setECategory] = useState('');
  const [eImage, setEImage] = useState('');
  const [eArea, setEArea] = useState('');
  const [eAnon, setEAnon] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  // Search + filters
  const [search, setSearch] = useState('');
  const [fRegion, setFRegion] = useState('');
  const [fCategory, setFCategory] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Token expire ho gaya ho to login par bhej do
  const handleError = (error, fallback) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('Token');
      window.location.href = '/login';
      return;
    }
    toast.error(error.response?.data?.err || fallback);
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/getuser`, { headers });
      setAUser(res.data.user);
    } catch (error) {
      handleError(error, 'Could not load user');
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/api/posts/get_all_post`, { headers });
      setPosts(res.data.PostUser);
    } catch (error) {
      handleError(error, 'Could not load posts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [])

  // Esc dabane se modal band
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setModalOpen(false); setEditPost(null); } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const commentModalHandler = (id) => {
    if (!modalOpen) {
      setModalOpen(true);
      setPostId(id);
    }
    else {
      setModalOpen(false);
    }
  }

  // ---------- Like / Dislike ----------
  const addLikeHandler = async (id) => {
    try {
      const res = await axios.put(`${API}/api/posts/Add_Like/${id}`, {}, { headers });
      setPosts((prev) => prev.map((p) => p._id === id ? { ...p, likes: res.data.likes, dislikes: res.data.dislikes } : p));
    } catch (error) {
      if (error.response?.status === 400) toast.info(error.response.data.err);
      else handleError(error, 'Something went wrong');
    }
  }

  const addDisLikeHandler = async (id) => {
    try {
      const res = await axios.put(`${API}/api/posts/Add_disLike/${id}`, {}, { headers });
      setPosts((prev) => prev.map((p) => p._id === id ? { ...p, likes: res.data.likes, dislikes: res.data.dislikes } : p));
    } catch (error) {
      if (error.response?.status === 400) toast.info(error.response.data.err);
      else handleError(error, 'Something went wrong');
    }
  }

  // ---------- Add Post (form -> MongoDB) ----------
  const addPostHandler = async (e) => {
    e.preventDefault();

    if (!ptitle.trim() || !pdesc.trim() || !pregion || !pcategory) {
      return toast.error('Please fill title, description, region and category');
    }

    const formdata = new FormData();
    formdata.append('title', ptitle);
    formdata.append('description', pdesc);
    formdata.append('region', pregion);
    formdata.append('category', pcategory);
    formdata.append('area', pArea);
    formdata.append('anonymous', pAnon);
    if (pimage) formdata.append('image', pimage);

    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/api/posts/add_post`, formdata, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      if (res.status === 200) {
        toast.success('Report Registered Successfully!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setPtitle("");
        setPdesc("");
        setPcategory("");
        setPregion("");
        setPArea("");
        setPimage("");
        setPAnon(false);
        if (fileRef.current) fileRef.current.value = "";
        setTab('complaints');
        fetchPosts(); // nayi post foran list mein aa jati hai
      }
    } catch (error) {
      handleError(error, 'Could not add complaint');
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- Confirm Incident ("I also saw this") ----------
  const confirmIncident = async (id) => {
    try {
      const res = await axios.put(`${API}/api/posts/confirm/${id}`, {}, { headers });
      setPosts((prev) => prev.map((p) => p._id === id ? { ...p, confirmations: res.data.confirmations } : p));
    } catch (error) {
      if (error.response?.status === 400) toast.info(error.response.data.err);
      else handleError(error, 'Something went wrong');
    }
  }

  // ---------- Add Comment ----------
  const addComment = async (id) => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`${API}/api/posts/add_comment/${id}`, { description: commentText }, { headers });
      setPosts((prev) => prev.map((p) => p._id === id ? { ...p, comments: res.data.comments } : p));
      setCommentText('');
    } catch (error) {
      handleError(error, 'Could not add comment');
    }
  }

  // ---------- Delete Comment ----------
  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`${API}/api/posts/delete_comment/${postId}/${commentId}`, { headers });
      setPosts((prev) => prev.map((p) => p._id === postId ? { ...p, comments: res.data.comments } : p));
      toast.success('Comment deleted', { autoClose: 1000 });
    } catch (error) {
      handleError(error, 'Could not delete comment');
    }
  }

  // ---------- Status badalna (sirf admin) ----------
  const changeStatus = async (id, status) => {
    try {
      const res = await axios.put(`${API}/api/posts/set_status/${id}`, { status }, { headers });
      setPosts((prev) => prev.map((p) => p._id === id ? { ...p, status: res.data.status } : p));
      toast.success(`Status changed to ${res.data.status}`, { autoClose: 1000 });
    } catch (error) {
      handleError(error, 'Could not change status');
    }
  }

  // ---------- Edit Post ----------
  const openEdit = (post) => {
    setEditPost(post);
    setETitle(post.title);
    setEDesc(post.description);
    setERegion(post.region);
    setECategory(post.category);
    setEArea(post.area || '');
    setEImage('');
    setEAnon(!!post.anonymous);
  }

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!eTitle.trim() || !eDesc.trim() || !eRegion || !eCategory) {
      return toast.error('Please fill title, description, region and category');
    }
    const formdata = new FormData();
    formdata.append('title', eTitle);
    formdata.append('description', eDesc);
    formdata.append('region', eRegion);
    formdata.append('category', eCategory);
    formdata.append('area', eArea);
    formdata.append('anonymous', eAnon);
    if (eImage) formdata.append('image', eImage);

    setEditSaving(true);
    try {
      const res = await axios.put(`${API}/api/posts/edit_post/${editPost._id}`, formdata, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setPosts((prev) => prev.map((p) => p._id === editPost._id ? {
        ...p,
        title: res.data.title,
        description: res.data.description,
        region: res.data.region,
        category: res.data.category,
        anonymous: res.data.anonymous,
        area: res.data.area,
        image: res.data.image
      } : p));
      toast.success('Complaint updated', { autoClose: 1000 });
      setEditPost(null);
    } catch (error) {
      handleError(error, 'Could not update complaint');
    } finally {
      setEditSaving(false);
    }
  }

  // ---------- Delete Post ----------
  const deletePost = async (id) => {
    try {
      await axios.delete(`${API}/api/posts/delete_post/${id}`, { headers });
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setDeleteId('');
      if (postId === id) setModalOpen(false);
      toast.success('Complaint deleted', { autoClose: 1000 });
    } catch (error) {
      setDeleteId('');
      handleError(error, 'Could not delete complaint');
    }
  }

  // ---------- Derived values ----------
  const myCount = aUser ? posts.filter((p) => p.user && p.user._id === aUser._id).length : 0;
  const filtersActive = search.trim() !== '' || fRegion !== '' || fCategory !== '' || fStatus !== '' || sortBy !== 'newest';

  const clearFilters = () => {
    setSearch('');
    setFRegion('');
    setFCategory('');
    setFStatus('');
    setSortBy('newest');
  }

  // Tab -> search -> region -> category -> sort (sab frontend par, foran chalta hai)
  const tabPosts = tab === 'responses' ? posts.filter((p) => p.comments.length > 0) : posts;
  const q = search.trim().toLowerCase();
  const shownPosts = tabPosts
    .filter((p) => !q || (p.area || '').toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.user && p.user.username.toLowerCase().includes(q)))
    .filter((p) => !fRegion || p.region === fRegion)
    .filter((p) => !fCategory || p.category === fCategory)
    .filter((p) => !fStatus || (p.status || 'Pending') === fStatus)
    .slice()
    .sort((a, b) => {
      if (sortBy === 'liked') return b.likes.length - a.likes.length;
      if (sortBy === 'commented') return b.comments.length - a.comments.length;
      if (sortBy === 'confirmed') return confCount(b) - confCount(a);
      return new Date(b.date) - new Date(a.date);
    });
  const selectedPost = posts.find((p) => p._id === postId);
  const modalComments = selectedPost ? selectedPost.comments : [];

  return (
    <>
      <Layout>
        <ToastContainer />

        <PageHero
          title="Crime Responses"
          image={blog1}
          imagePosition="right center"
          subtitle="Engage with the community by responding to crime reports and sharing information."
        />

        {/* ================= DASHBOARD ================= */}
        <section className="crime-response-mid mx-auto mt-16 grid w-[90%] max-w-6xl items-start gap-8 md:mt-24 lg:grid-cols-[2fr_1fr]">

          <div className="left">
            <div className="top">
              <div className="cards grid gap-5 sm:grid-cols-3">

                <Reveal className="h-full">
                  <div className="card group relative flex h-full cursor-pointer flex-col items-center overflow-hidden rounded-2xl bg-brand-deep p-6 text-center text-white shadow-xl shadow-brand-deep/25 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-deep/40">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-jade/40 blur-2xl transition-all duration-500 group-hover:scale-150" />
                    <div className="img relative rounded-full p-1 ring-2 ring-brand-amber transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <img className="h-12 w-12 rounded-full bg-white object-cover" src={aUser ? profileImg(aUser.image) : d1} alt="user image" />
                    </div>
                    <h3 className="relative mt-4 font-display text-lg font-bold">{aUser ? aUser.username : '...'}</h3>
                    <p className="relative mt-1 break-all text-xs text-white/70">{aUser ? aUser.email : ''}</p>
                  </div>
                </Reveal>

                <Reveal delay={120} className="h-full">
                  <div className="card group flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-mint text-xl text-brand-jade transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand-amber group-hover:text-brand-deep">
                      <FiFileText />
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold transition-colors duration-300 group-hover:text-white">Total Posts</h3>
                    <p className="font-display text-4xl font-extrabold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber">
                      <CountUp to={posts.length} />
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={240} className="h-full">
                  <div className="card group flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-md ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:bg-brand-deep hover:shadow-2xl hover:shadow-brand-deep/30">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-mint text-xl text-brand-jade transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand-amber group-hover:text-brand-deep">
                      <FiInbox />
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold transition-colors duration-300 group-hover:text-white">COMPLAINT BOX</h3>
                    <p className="font-display text-4xl font-extrabold text-brand-jade transition-colors duration-300 group-hover:text-brand-amber">
                      <CountUp to={myCount} />
                    </p>
                  </div>
                </Reveal>

              </div>
            </div>

            {/* Tabs */}
            <Reveal delay={100}>
              <div className="btm mt-8">
                <div className="btm-btm relative grid grid-cols-2 rounded-2xl bg-brand-mint p-1.5">
                  <span
                    className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-brand-deep shadow-lg transition-transform duration-300 ease-out ${tab === 'complaints' ? 'translate-x-0' : 'translate-x-full'}`}
                  />
                  <button
                    onClick={() => setTab('complaints')}
                    className={`btn relative z-10 rounded-xl py-2.5 text-center font-semibold transition-colors duration-300 ${tab === 'complaints' ? 'text-white' : 'text-brand-deep hover:text-brand-jade'}`}
                  >
                    Complaints
                  </button>
                  <button
                    onClick={() => setTab('responses')}
                    className={`btn relative z-10 rounded-xl py-2.5 text-center font-semibold transition-colors duration-300 ${tab === 'responses' ? 'text-white' : 'text-brand-deep hover:text-brand-jade'}`}
                  >
                    People Responses
                  </button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Location */}
          <Reveal delay={150}>
            <div className="right overflow-hidden rounded-3xl bg-brand-mint shadow-lg ring-1 ring-brand-deep/5">
              <div className="top flex items-center gap-4 px-5 py-4">
                <div className="icon grid h-11 w-11 place-items-center rounded-xl bg-white text-2xl text-brand-jade shadow-sm">
                  <CiLocationOn />
                </div>
                <div className="desc">
                  <p className="font-display font-bold">Location</p>
                  <p className="text-sm text-brand-ink/65">Krachi Karachi</p>
                </div>
              </div>

              <div className="btm group px-4 pb-4">
                <iframe className="rounded-2xl grayscale transition-all duration-700 group-hover:grayscale-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.9024867479634!2d67.02166607442994!3d24.867179844990453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6b1566c46f%3A0x65318f4eb62c7aa8!2sAptech%20Computer%20Education%20Garden%20Center!5e0!3m2!1sen!2s!4v1728276334584!5m2!1sen!2s" width="100%" height="220" style={{ border: "0", display: "block" }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location map"></iframe>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================= POSTS + FORM ================= */}
        <section className="crime-response-mid mx-auto my-12 grid w-[90%] max-w-6xl items-start gap-8 md:my-16 lg:grid-cols-[2fr_1fr]">

          {/* Posts */}
          <div className="left grid grid-cols-1 gap-6 md:grid-cols-2">

            {loading && (
              <p className="col-span-full rounded-2xl bg-brand-paper p-10 text-center text-brand-ink/60">Loading complaints...</p>
            )}

            {/* ---------- Search + Filters ---------- */}
            {!loading && (
              <div className="col-span-full rounded-2xl bg-white p-4 shadow-md ring-1 ring-brand-deep/5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="group relative flex-1">
                    <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-brand-ink/40 transition-colors duration-300 group-focus-within:text-brand-jade" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      type="text"
                      placeholder="Search by title, description or name"
                      className="w-full rounded-xl border border-brand-deep/10 bg-brand-paper py-2.5 pl-11 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-brand-ink/35 hover:border-brand-jade/50 focus:border-brand-jade focus:bg-white focus:ring-4 focus:ring-brand-jade/15"
                    />
                  </div>

                  <select value={fRegion} onChange={(e) => setFRegion(e.target.value)} className="rounded-xl border border-brand-deep/10 bg-brand-paper px-3 py-2.5 text-sm outline-none transition-all duration-300 hover:border-brand-jade/50 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15">
                    <option value="">All Regions</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                  </select>

                  <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className="rounded-xl border border-brand-deep/10 bg-brand-paper px-3 py-2.5 text-sm outline-none transition-all duration-300 hover:border-brand-jade/50 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15">
                    <option value="">All Categories</option>
                    <option value="Target Killing">Target Killing</option>
                    <option value="Murder">Murder</option>
                    <option value="Roberry">Robbery</option>
                    <option value="Bomb Blast">Bomb Blast</option>
                    <option value="Snatching">Snatching</option>
                    <option value="Gang Rape">Gang Rape</option>
                  </select>

                  <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="rounded-xl border border-brand-deep/10 bg-brand-paper px-3 py-2.5 text-sm outline-none transition-all duration-300 hover:border-brand-jade/50 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15">
                    <option value="">All Statuses</option>
                    {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>

                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-brand-deep/10 bg-brand-paper px-3 py-2.5 text-sm outline-none transition-all duration-300 hover:border-brand-jade/50 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15">
                    <option value="newest">Newest first</option>
                    <option value="liked">Most liked</option>
                    <option value="commented">Most commented</option>
                    <option value="confirmed">Most confirmed</option>
                  </select>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <p className="text-brand-ink/60">
                    Showing <span className="font-bold text-brand-deep">{shownPosts.length}</span> of {tabPosts.length} complaints
                  </p>
                  {filtersActive && (
                    <button onClick={clearFilters} className="group inline-flex items-center gap-1.5 font-semibold text-brand-jade transition-colors duration-300 hover:text-red-500">
                      <FiX className="transition-transform duration-300 group-hover:rotate-90" />
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {!loading && shownPosts.length === 0 && (
              <div className="col-span-full rounded-2xl bg-brand-paper p-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-mint text-2xl text-brand-jade">
                  {filtersActive ? <FiSearch /> : <FiInbox />}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">
                  {filtersActive ? 'No complaints match your search' : tab === 'responses' ? 'No responses yet' : 'No complaints yet'}
                </h3>
                <p className="mt-1 text-brand-ink/60">
                  {filtersActive ? 'Try a different keyword or clear the filters.' : tab === 'responses' ? 'Posts with comments will show up here.' : 'Use the form to register the first complaint.'}
                </p>
                {filtersActive && (
                  <button onClick={clearFilters} className="mt-4 rounded-full bg-brand-jade px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-deep">
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {
              shownPosts.map((data, index) => {
                const liked = aUser && data.likes.includes(aUser._id);
                const disliked = aUser && data.dislikes.includes(aUser._id);
                const img = postImg(data.image);
                const isOwner = aUser && data.user && data.user._id === aUser._id;
                // Anonymous post jiska naam server ne chupa diya (sirf malik/admin ko asli naam milta hai)
                const maskedPost = data.anonymous && !(data.user && data.user._id);
                const confirmed = aUser && (data.confirmations || []).includes(aUser._id);
                const confirmCount = confCount(data);
                const verified = confirmCount >= VERIFY_THRESHOLD;
                return (
                  <Reveal key={data._id} delay={(index % 2) * 120} className="h-full">
                    <article className="card group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-brand-deep/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-deep/20">

                      <div className="img relative overflow-hidden">
                        {img ? (
                          <img className="h-[240px] w-full object-cover transition-transform duration-700 group-hover:scale-110" src={img} alt="post image" />
                        ) : (
                          <div className="grid h-[240px] w-full place-items-center bg-gradient-to-br from-brand-mint to-brand-jade/30 text-5xl text-brand-jade/60">
                            <FiImage />
                          </div>
                        )}
                        <span className="absolute left-3 top-3 max-w-[58%] truncate rounded-full bg-brand-deep/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                          {data.category} · {data.area ? `${data.area}, ${data.region}` : data.region}
                        </span>
                        {isOwner && (
                          <>
                          <button
                            onClick={() => openEdit(data)}
                            aria-label="Edit complaint"
                            title="Edit complaint"
                            className="absolute right-14 top-3 z-[5] grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-ink/70 shadow-md transition-all duration-300 hover:scale-110 hover:bg-brand-jade hover:text-white"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => setDeleteId(data._id)}
                            aria-label="Delete complaint"
                            title="Delete complaint"
                            className="absolute right-3 top-3 z-[5] grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-ink/70 shadow-md transition-all duration-300 hover:scale-110 hover:bg-red-500 hover:text-white"
                          >
                            <FiTrash2 />
                          </button>
                          </>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/40 via-transparent to-transparent" />
                        {verified && (
                          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-brand-jade px-3 py-1 text-xs font-semibold text-white shadow-lg">
                            <FiCheckCircle /> Verified by community
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 px-5 pt-5 u-details">
                        <div className="img">
                          {maskedPost ? (
                            <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-deep text-xl text-white ring-2 ring-brand-jade/30 transition-all duration-300 group-hover:ring-brand-amber">
                              <FiEyeOff />
                            </div>
                          ) : (
                            <img className="h-12 w-12 rounded-full bg-brand-mint object-cover ring-2 ring-brand-jade/30 transition-all duration-300 group-hover:ring-brand-amber" src={profileImg(data.user?.image)} alt="" />
                          )}
                        </div>
                        <div className="details min-w-0">
                          <h3 className="truncate font-display font-bold">{maskedPost ? 'Anonymous' : (data.user ? data.user.username : 'Unknown user')}</h3>
                          {data.anonymous && !maskedPost && (
                            <span className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-brand-deep/10 px-2 py-0.5 text-[11px] font-semibold text-brand-deep">
                              <FiEyeOff /> Hidden from public
                            </span>
                          )}
                          <p className="text-xs text-brand-ink/55">{dateFormat(data.date, "mmmm dS, yyyy, h:MM TT")}</p>
                        </div>
                        {aUser && aUser.isAdmin ? (
                          <select
                            value={data.status || 'Pending'}
                            onChange={(e) => changeStatus(data._id, e.target.value)}
                            title="Change status (admin)"
                            className="ml-auto cursor-pointer rounded-full border border-brand-deep/15 bg-white px-3 py-1 text-xs font-semibold outline-none transition-all duration-300 hover:border-brand-jade focus:border-brand-jade focus:ring-2 focus:ring-brand-jade/20"
                          >
                            {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                          </select>
                        ) : (
                          <StatusBadge status={data.status} className="ml-auto" />
                        )}
                      </div>

                      <div className="desc px-5 pb-5 pt-4">
                        <h3 className="font-display text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-brand-jade">{data.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-brand-ink/65">{data.description}</p>
                      </div>

                      <div className="px-5 pb-4">
                        {isOwner ? (
                          <p className="flex items-center gap-2 text-sm text-brand-ink/60">
                            <FiEye className="text-brand-jade" /> {confirmCount} {confirmCount === 1 ? 'person' : 'people'} confirmed this
                          </p>
                        ) : (
                          <button
                            onClick={() => confirmIncident(data._id)}
                            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${confirmed ? 'border-brand-jade bg-brand-jade text-white hover:bg-brand-deep' : 'border-brand-jade/40 text-brand-jade hover:border-brand-jade hover:bg-brand-mint'}`}
                          >
                            {confirmed ? <FiCheckCircle /> : <FiEye />}
                            {confirmed ? 'You confirmed this' : 'I also saw this'}
                            <span className={`rounded-full px-2 py-0.5 text-xs ${confirmed ? 'bg-white/20' : 'bg-brand-mint text-brand-deep'}`}>{confirmCount}</span>
                          </button>
                        )}
                      </div>

                      <div className="options mt-auto flex items-center justify-between border-t border-brand-deep/10 px-4 py-3">
                        <button onClick={() => addLikeHandler(data._id)} className={`like flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-brand-mint hover:text-brand-jade active:scale-90 ${liked ? 'bg-brand-mint text-brand-jade' : 'text-brand-ink/70'}`}>
                          {liked ? <AiFillLike className="text-xl" /> : <AiOutlineLike className="text-xl" />}
                          <span className="font-semibold">{data.likes.length}</span>
                        </button>
                        <button onClick={() => commentModalHandler(data._id)} className="comment flex items-center gap-1.5 rounded-full px-3 py-1.5 text-brand-ink/70 transition-all duration-200 hover:bg-brand-mint hover:text-brand-jade active:scale-90">
                          <FaRegComment className="text-lg" />
                          <span className="font-semibold">{data.comments.length}</span>
                        </button>
                        <button onClick={() => addDisLikeHandler(data._id)} className={`dislike flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-red-50 hover:text-red-500 active:scale-90 ${disliked ? 'bg-red-50 text-red-500' : 'text-brand-ink/70'}`}>
                          {disliked ? <AiFillDislike className="text-xl" /> : <AiOutlineDislike className="text-xl" />}
                          <span className="font-semibold">{data.dislikes.length}</span>
                        </button>
                      </div>
                      {deleteId === data._id && (
                        <div className="animate-fade-up absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-brand-ink/90 p-6 text-center text-white backdrop-blur-sm">
                          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-500/20 text-2xl text-red-300">
                            <FiTrash2 />
                          </div>
                          <p className="font-display text-lg font-bold">Delete this complaint?</p>
                          <p className="text-sm text-white/70">Its likes and comments will also be removed.</p>
                          <div className="mt-1 flex gap-3">
                            <button onClick={() => setDeleteId('')} className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold transition-colors hover:bg-white/10">Cancel</button>
                            <button onClick={() => deletePost(data._id)} className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold transition-colors hover:bg-red-600">Yes, Delete</button>
                          </div>
                        </div>
                      )}
                    </article>
                  </Reveal>
                )
              })
            }
          </div>

          {/* Send response form */}
          <Reveal delay={150} className="lg:sticky lg:top-24">
            <form onSubmit={addPostHandler} className="right relative overflow-hidden rounded-3xl bg-brand-mint p-6 shadow-xl shadow-brand-deep/10">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-jade/20 blur-2xl" />
              <h2 className="relative font-display text-2xl font-extrabold">Send Response</h2>
              <span className="relative mt-2 block h-1 w-10 rounded-full bg-brand-amber" />

              <div className="relative mt-6 space-y-4">
                <div className="inp">
                  <input value={ptitle} onChange={(e) => setPtitle(e.target.value)} className={fieldCls} type="text" placeholder="Complaint Title" />
                </div>

                <div className="inp">
                  <label className="mb-1.5 block text-sm font-bold">Post Image</label>
                  <label className="group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-brand-jade/40 bg-white px-4 py-3 text-sm text-brand-ink/60 transition-all duration-300 hover:border-brand-jade hover:bg-white hover:text-brand-jade">
                    <FiUploadCloud className="text-xl transition-transform duration-300 group-hover:-translate-y-1" />
                    <span className="truncate">{pimage && pimage.name ? pimage.name : 'Choose an image'}</span>
                    <input ref={fileRef} accept="image/*" onChange={(e) => setPimage(e.target.files[0])} className="hidden" type="file" />
                  </label>
                </div>

                <div className="inp">
                  <textarea value={pdesc} onChange={(e) => setPdesc(e.target.value)} className={`${fieldCls} resize-none`} name="" id="" rows="6" placeholder="Description"></textarea>
                </div>

                <div className="inp">
                  <label className="mb-1.5 block text-sm font-bold">Region</label>
                  <select name="" className={fieldCls} value={pregion} onChange={(e) => { setPregion(e.target.value); setPArea(''); }}>
                    <option value="">Region</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                  </select>
                </div>

                <div className="inp">
                  <label className="mb-1.5 block text-sm font-bold">Area <span className="font-normal text-brand-ink/50">(optional)</span></label>
                  <select value={pArea} onChange={(e) => setPArea(e.target.value)} disabled={!pregion} className={`${fieldCls} disabled:cursor-not-allowed disabled:opacity-60`}>
                    <option value="">{pregion ? 'Select area' : 'Choose a region first'}</option>
                    {areasOf(pregion).map((a) => <option key={a.name} value={a.name}>{a.name}</option>)}
                  </select>
                </div>

                <div className="inp">
                  <label className="mb-1.5 block text-sm font-bold">Category</label>
                  <select value={pcategory} onChange={(e) => setPcategory(e.target.value)} name="" className={fieldCls}>
                    <option value="">Category</option>
                    <option value="Target Killing">Target Killing</option>
                    <option value="Murder">Murder</option>
                    <option value="Roberry">Robbery</option>
                    <option value="Bomb Blast">Bomb Blast</option>
                    <option value="Snatching">Snatching</option>
                    <option value="Gang Rape">Gang Rape</option>
                  </select>
                </div>

                <label className="group flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-brand-deep/10 transition-all duration-300 hover:ring-brand-jade/50">
                  <input type="checkbox" checked={pAnon} onChange={(e) => setPAnon(e.target.checked)} className="peer sr-only" />
                  <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-brand-deep/20 transition-colors duration-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-300 peer-checked:bg-brand-jade peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-jade/30" />
                  <span>
                    <span className="flex items-center gap-1.5 text-sm font-bold"><FiEyeOff className="text-brand-jade" /> Post anonymously</span>
                    <span className="block text-xs leading-5 text-brand-ink/60">Your name and photo will be hidden from other users.</span>
                  </span>
                </label>

                <button type="submit" disabled={submitting} className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-jade px-5 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-deep hover:shadow-xl hover:shadow-brand-deep/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0">
                  {submitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <>
                      Add Complain
                      <FiSend className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        </section>

        {/* ================= EDIT MODAL ================= */}
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-300 ${editPost ? 'visible opacity-100' : 'invisible opacity-0'}`}
          aria-hidden={!editPost}
        >
          <div onClick={() => setEditPost(null)} className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm" />

          <form
            onSubmit={saveEdit}
            className={`relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all duration-300 ${editPost ? 'translate-y-0 scale-100' : 'translate-y-6 scale-95'}`}
          >
            <div className="flex items-center justify-between bg-brand-deep px-6 py-4 text-white">
              <h2 className="font-display text-xl font-bold">Edit Complaint</h2>
              <button type="button" onClick={() => setEditPost(null)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-lg transition-all duration-300 hover:rotate-90 hover:bg-white/15">
                <FiX />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <input value={eTitle} onChange={(e) => setETitle(e.target.value)} className={fieldCls} type="text" placeholder="Complaint Title" />

              <textarea value={eDesc} onChange={(e) => setEDesc(e.target.value)} className={`${fieldCls} resize-none`} rows="5" placeholder="Description"></textarea>

              <div className="grid gap-4 sm:grid-cols-2">
                <select value={eRegion} onChange={(e) => { setERegion(e.target.value); setEArea(''); }} className={fieldCls}>
                  <option value="">Region</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                </select>
                <select value={eCategory} onChange={(e) => setECategory(e.target.value)} className={fieldCls}>
                  <option value="">Category</option>
                  <option value="Target Killing">Target Killing</option>
                  <option value="Murder">Murder</option>
                  <option value="Roberry">Robbery</option>
                  <option value="Bomb Blast">Bomb Blast</option>
                  <option value="Snatching">Snatching</option>
                  <option value="Gang Rape">Gang Rape</option>
                </select>
              </div>

              <select value={eArea} onChange={(e) => setEArea(e.target.value)} disabled={!eRegion} className={`${fieldCls} disabled:cursor-not-allowed disabled:opacity-60`}>
                <option value="">{eRegion ? 'Area (optional)' : 'Choose a region first'}</option>
                {areasOf(eRegion).map((a) => <option key={a.name} value={a.name}>{a.name}</option>)}
              </select>

              <label className="group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-brand-jade/40 bg-brand-paper px-4 py-3 text-sm text-brand-ink/60 transition-all duration-300 hover:border-brand-jade hover:text-brand-jade">
                <FiUploadCloud className="text-xl transition-transform duration-300 group-hover:-translate-y-1" />
                <span className="truncate">{eImage && eImage.name ? eImage.name : 'Change image (optional)'}</span>
                <input accept="image/*" onChange={(e) => setEImage(e.target.files[0])} className="hidden" type="file" />
              </label>

              <label className="group flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-brand-deep/10 transition-all duration-300 hover:ring-brand-jade/50">
                  <input type="checkbox" checked={eAnon} onChange={(e) => setEAnon(e.target.checked)} className="peer sr-only" />
                  <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-brand-deep/20 transition-colors duration-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-300 peer-checked:bg-brand-jade peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-jade/30" />
                  <span>
                    <span className="flex items-center gap-1.5 text-sm font-bold"><FiEyeOff className="text-brand-jade" /> Post anonymously</span>
                    <span className="block text-xs leading-5 text-brand-ink/60">Your name and photo will be hidden from other users.</span>
                  </span>
                </label>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditPost(null)} className="rounded-xl border border-brand-deep/15 px-6 py-2.5 font-semibold transition-colors duration-300 hover:bg-brand-paper">
                  Cancel
                </button>
                <button type="submit" disabled={editSaving} className="inline-flex items-center gap-2 rounded-xl bg-brand-jade px-6 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-70">
                  {editSaving ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ================= COMMENT MODAL ================= */}
        <div
          id="commentModal"
          className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-300 ${modalOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
          aria-hidden={!modalOpen}
        >
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm" />

          <div className={`relative flex h-[75vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${modalOpen ? 'translate-y-0 scale-100' : 'translate-y-6 scale-95'}`}>

            <div className="top flex items-center justify-between border-b border-brand-deep/10 bg-brand-deep px-6 py-4 text-white">
              <div className="head">
                <h2 className="font-display text-xl font-bold">All Comments</h2>
              </div>
              <button onClick={() => setModalOpen(false)} aria-label="Close" className="icon grid h-9 w-9 place-items-center rounded-full text-lg transition-all duration-300 hover:rotate-90 hover:bg-white/15">
                <FiX />
              </button>
            </div>

            <div className="mid flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {modalComments.length === 0 && (
                <p className="py-10 text-center text-brand-ink/55">No comments yet. Be the first to comment.</p>
              )}
              {
                modalComments.map((data, index) => (
                  <div key={data._id || index} className="group/c flex items-start gap-3">
                    <img className="h-11 w-11 shrink-0 rounded-full bg-brand-mint object-cover" src={profileImg(data.user?.image)} alt="img" />
                    <div className="rounded-2xl rounded-tl-sm bg-brand-paper px-4 py-2.5 ring-1 ring-brand-deep/5">
                      <p className="text-sm font-bold">{data.user ? data.user.username : 'Unknown user'}</p>
                      <p className="text-sm text-brand-ink/75">{data.description}</p>
                    </div>
                    {aUser && ((data.user && data.user._id === aUser._id) || (selectedPost && selectedPost.user && selectedPost.user._id === aUser._id)) && (
                      <button
                        onClick={() => deleteComment(data._id)}
                        aria-label="Delete comment"
                        title="Delete comment"
                        className="mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-full text-brand-ink/40 transition-all duration-300 hover:bg-red-50 hover:text-red-500 md:opacity-0 md:group-hover/c:opacity-100 md:focus:opacity-100"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))
              }
            </div>

            <div className="btm flex items-center gap-3 border-t border-brand-deep/10 bg-white px-5 py-4">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addComment(postId) }}
                type="text"
                placeholder="Add Comment"
                className="w-full rounded-xl border border-brand-deep/10 bg-brand-paper px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:border-brand-jade focus:ring-4 focus:ring-brand-jade/15"
              />
              <button onClick={() => addComment(postId)} className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-jade px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-deep">
                Comment
                <FiSend className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

      </Layout>
    </>
  )
}

export default CrimeResponse