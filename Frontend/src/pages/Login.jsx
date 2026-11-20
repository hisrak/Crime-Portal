import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import AuthLayout, { AuthField, AuthPassword, AuthPolicies } from '../components/AuthLayout'


const Login = ({ setToken }) => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const Navigation = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res = await axios.post('http://localhost:4000/api/auth/login',
        {
          email: Email,
          password: Password
        }
      )
      if (res.status === 200) {
        if (!res.data.token) {
          return toast.error('Token Not Found');
        }
        localStorage.setItem('Token', res.data.token)
        setToken(res.data.token);
        toast.success("Login Successfully!");
        setEmail("");
        setPassword("");
        Navigation('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.err || error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }


  return (
    <AuthLayout>
      <ToastContainer />

      <div className="reigister-right-mid animate-fade-up" style={{ animationDelay: '100ms' }}>
        <h1 className="text-center font-display text-3xl font-extrabold tracking-tight md:text-left md:text-4xl">Log In Your Account</h1>
        <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-brand-amber md:mx-0" />

        <form onSubmit={loginHandler} className="inputs mt-6 space-y-4">
          <div className="input">
            <AuthField icon={FiMail} value={Email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email" />
          </div>
          <div className="input">
            <AuthPassword icon={FiLock} onChange={(e) => setPassword(e.target.value)} value={Password} required placeholder="password" />
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
                  Login
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="mt-4 text-center md:text-left">
              <Link
                to="/forgot_password"
                className="relative inline-block font-semibold text-brand-jade transition-colors duration-300 hover:text-brand-deep after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-amber after:transition-all after:duration-300 hover:after:w-full"
              >
                Forgot Your Password
              </Link>
            </div>
          </div>
        </form>
      </div>

      <div className="reigister-right-btm animate-fade-up mt-6" style={{ animationDelay: '250ms' }}>
        <Link
          to={'/register'}
          className="group flex items-center justify-center gap-2 rounded-xl border-2 border-brand-jade/30 px-4 py-2.5 text-center font-semibold text-brand-jade transition-all duration-300 hover:border-brand-jade hover:bg-brand-mint"
        >
          Create an account or sign up
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
        <AuthPolicies />
      </div>
    </AuthLayout>
  )
}

export default Login