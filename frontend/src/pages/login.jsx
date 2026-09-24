import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { useAuth } from '../../Context/authcontext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login({
        email: form.email,
        password: form.password,
      });

      if (response && response.success) {
        checkLoginStatus(response); // updates AuthContext's user state
        navigate('/home'); // change to '/board' if that's your protected landing route
      } else {
        setError(response?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Something went wrong during login.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4 font-sans antialiased select-none">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-[28px] overflow-hidden border border-[#E7E4DA] bg-white shadow-[0_20px_60px_-25px_rgba(31,30,23,0.25)]">

        {/* ================= LEFT: FORM ================= */}
        <div className="flex items-center justify-center px-8 py-12 sm:px-14">
          <div className="w-full max-w-[360px]">

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-[#171923] tracking-tight">
                Bitrixmini
              </span>
            </div>

            <h1 className="text-[28px] leading-tight font-bold text-[#171923]">
              Log in to your workspace
            </h1>
            <p className="text-sm text-[#6B7280] mt-2">
              Pick up right where your team left off.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#171923] mb-1.5">
                  Work email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#171923] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-11 pr-11 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#171923]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs font-medium text-red-600 -mt-1">{error}</p>
              )}

              <div className="flex justify-end -mt-1">
                <Link
                  to="/forget-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#171923] text-white text-sm font-semibold flex items-center justify-center gap-2 transition hover:bg-[#0E0F16] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Continue'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            
          </div>
        </div>

        {/* RIGHT: BRAND ILLUSTRATION */}
        <div className="hidden lg:block relative bg-[#1a2638] w-full h-full min-h-[600px]">
          <img
            src="/collabrative-logo.jpg"
            alt="Visual Graphic"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
