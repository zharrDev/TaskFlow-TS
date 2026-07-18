import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineEnvelope, HiOutlineArrowLeft } from 'react-icons/hi2';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      if (data.data?.resetToken) {
        setSent(true);
        toast.success('Reset link generated!');
      } else {
        toast.success('If the email exists, a reset link has been sent');
        setSent(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/30 via-primary-600/20 to-teal-500/30" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-3xl font-bold text-white">TaskFlow</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Lupa Password?</h2>
          <p className="text-slate-400 text-lg">Tenang, kami akan bantu Anda mengatur ulang password.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md px-6">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <HiOutlineEnvelope className="h-8 w-8 text-primary-600" />
              </div>
            </div>

            {!sent ? (
              <>
                <h1 className="text-xl font-bold text-center mb-1">Forgot Password</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                  Masukkan email Anda dan kami akan kirim link reset password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email</label>
                    <div className="relative">
                      <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="input-field pl-9 py-2 text-sm" placeholder="email@example.com" required />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5">
                    {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-center mb-1">Check Your Email</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                  Link reset password telah dikirim. Silakan cek email Anda.
                </p>
                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-6">
                  <p className="text-xs text-primary-700 dark:text-primary-400 font-medium">
                    Untuk demo, token reset: <code className="bg-primary-100 dark:bg-primary-900/40 px-1 rounded text-[10px]">lihat di response API</code>
                  </p>
                </div>
                <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5">
                  <HiOutlineArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </>
            )}

            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Kembali ke Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
