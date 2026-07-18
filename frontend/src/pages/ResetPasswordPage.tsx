import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineCheckCircle } from 'react-icons/hi2';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password, confirmPassword });
      toast.success('Password reset successfully!');
      setDone(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
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
          <h2 className="text-4xl font-bold text-white mb-4">Reset Password</h2>
          <p className="text-slate-400 text-lg">Buat password baru yang kuat untuk akun Anda.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md px-6">
          <div className="glass-card p-6 sm:p-8">
            {!done ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <HiOutlineLockClosed className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h1 className="text-xl font-bold text-center mb-1">Reset Password</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                  Masukkan password baru Anda.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">New Password</label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type={showPassword ? 'text' : 'password'} value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field pl-9 pr-9 py-2 text-sm" placeholder="Min. 8 characters" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <HiOutlineEyeSlash className="h-4 w-4" /> : <HiOutlineEye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Confirm Password</label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type={showPassword ? 'text' : 'password'} value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field pl-9 py-2 text-sm" placeholder="Repeat password" required />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5">
                    {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Reset Password'}
                  </button>
                </form>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Kembali ke Login</Link>
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                    <HiOutlineCheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                <h1 className="text-xl font-bold text-center mb-1">Password Reset!</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                  Password Anda telah berhasil direset.
                </p>
                <button onClick={() => navigate('/login')} className="btn-primary w-full text-sm py-2.5">
                  Go to Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
