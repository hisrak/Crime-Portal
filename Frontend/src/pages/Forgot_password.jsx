import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import AuthLayout, { AuthField, AuthPolicies } from "../components/AuthLayout";

const Forgot_Password = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const recoverHandler = (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error('Enter a valid email');
        }
        // NOTE: Backend mein abhi password-reset API nahi hai.
        // Jab API bane to yahan axios.post(...) lagana hai.
        setSent(true);
    }

    return (
        <AuthLayout>
            <ToastContainer />

            <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
                {!sent ? (
                    <>
                        <h1 className="text-center font-display text-3xl font-extrabold tracking-tight md:text-left md:text-4xl">Recover Your Password</h1>
                        <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-brand-amber md:mx-0" />

                        <form onSubmit={recoverHandler} noValidate className="mt-6 space-y-4">
                            <AuthField
                                icon={FiMail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Enter Your Email"
                            />

                            <button
                                type="submit"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-jade py-2.5 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-deep hover:shadow-xl hover:shadow-brand-deep/30 active:translate-y-0"
                            >
                                Send Reset Link
                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="animate-fade-up text-center md:text-left">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-mint text-4xl text-brand-jade md:mx-0">
                            <FiCheckCircle />
                        </div>
                        <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight">Check Your Email</h1>
                        <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-brand-amber md:mx-0" />
                        <p className="mt-4 leading-7 text-brand-ink/70">
                            If an account exists for <span className="font-semibold text-brand-deep">{email}</span>, a password reset link will be sent to it.
                        </p>
                        <button
                            onClick={() => { setSent(false); setEmail(''); }}
                            className="mt-4 font-semibold text-brand-jade transition-colors duration-300 hover:text-brand-deep"
                        >
                            Use a different email
                        </button>
                    </div>
                )}
            </div>

            <div className="animate-fade-up mt-6" style={{ animationDelay: '250ms' }}>
                <Link
                    to="/login"
                    className="group flex items-center justify-center gap-2 rounded-xl border-2 border-brand-jade/30 px-4 py-2.5 text-center font-semibold text-brand-jade transition-all duration-300 hover:border-brand-jade hover:bg-brand-mint"
                >
                    <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1.5" />
                    Back to Login
                </Link>
                <AuthPolicies />
            </div>
        </AuthLayout>
    )
}
export default Forgot_Password;