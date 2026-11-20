import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
import { toast, ToastContainer, } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { FiUser, FiMail, FiLock, FiArrowRight, FiUploadCloud, FiCheckCircle } from 'react-icons/fi'
import AuthLayout, { AuthField, AuthPassword, AuthPolicies } from '../components/AuthLayout'

const Register = () => {
  const [Name, setName] = useState('')
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const registerHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formdata = new FormData();
    formdata.append('username', Name);
    formdata.append('email', Email);
    formdata.append('password', Password);
    formdata.append('image', image);

    try {
      let res = await axios.post('http://localhost:4000/api/auth/register', formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      if (res.status === 200 || res.status === 201) {
        toast.success('Registered Successfully', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",

        });
        setName("")
        setEmail("")
        setPassword("")
        setImage("")

        document.getElementById('imageprofile').value = "";


      }
      else {
        toast.error('User Not Working', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.err || error.response?.data?.message || 'User Not Working');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <ToastContainer />

      <div className="reigister-right-mid animate-fade-up" style={{ animationDelay: '100ms' }}>
        <h1 className="text-center font-display text-3xl font-extrabold tracking-tight md:text-left md:text-4xl">Register Your Account</h1>
        <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-brand-amber md:mx-0" />

        <form onSubmit={registerHandler} className="inputs mt-6 space-y-4">
          <div className="input">
            <AuthField icon={FiUser} value={Name} onChange={(e) => setName(e.target.value)} required type="text" placeholder="Name" />
          </div>
          <div className="input">
            <AuthField icon={FiMail} value={Email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email" />
          </div>
          <div className="input">
            <AuthPassword icon={FiLock} value={Password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="password (min 6 characters)" />
          </div>

          <div className="input">
            <label className="mb-1.5 block text-sm font-bold" htmlFor="imageprofile">User Profile</label>
            <label
              htmlFor="imageprofile"
              className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 text-sm transition-all duration-300 hover:border-brand-jade hover:bg-brand-mint/60 hover:text-brand-jade ${image && image.name ? 'border-brand-jade bg-brand-mint/60 text-brand-deep' : 'border-brand-jade/40 text-brand-ink/60'}`}
            >
              {image && image.name
                ? <FiCheckCircle className="text-xl text-brand-jade" />
                : <FiUploadCloud className="text-xl transition-transform duration-300 group-hover:-translate-y-1" />}
              <span className="truncate">{image && image.name ? image.name : 'Upload profile photo'}</span>
            </label>
            <input id="imageprofile" onChange={(e) => setImage(e.target.files[0])} className="sr-only" required type="file" />
          </div>

          <div className="input">
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-jade py-2.5 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-deep hover:shadow-xl hover:shadow-brand-deep/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>
                  Register
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="reigister-right-btm animate-fade-up mt-6" style={{ animationDelay: '250ms' }}>
        <Link
          to={'/login'}
          className="group flex items-center justify-center gap-2 rounded-xl border-2 border-brand-jade/30 px-4 py-2.5 text-center font-semibold text-brand-jade transition-all duration-300 hover:border-brand-jade hover:bg-brand-mint"
        >
          Already have an account or login
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
        <AuthPolicies />
      </div>
    </AuthLayout>
  )
}

export default Register