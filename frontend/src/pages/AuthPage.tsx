import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeSlash, HiOutlineClipboardDocumentList, HiOutlineUsers, HiOutlineChartBar } from 'react-icons/hi2';

const TaskBotHeadSVG: React.FC<{ isHiding: boolean, focusedField: string }> = ({ isHiding, focusedField }) => {
  let pupilX = 0;
  let pupilY = 0;
  if (!isHiding) {
    if (focusedField === 'email') {
       pupilY = 2;
       pupilX = 1;
    } else if (focusedField === 'name') {
       pupilY = -1;
       pupilX = 1;
    } else if (focusedField === 'password') {
       pupilY = 4;
       pupilX = 0;
    }
  }

  const antennaColor = isHiding ? '#64748B' : '#14B8A6';

  return (
    <div className="animate-float block mx-auto w-[120px] h-[95px]">
      <svg width="100%" height="100%" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
        <line x1="60" y1="35" x2="60" y2="15" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="60" cy="10" r="6" fill={antennaColor} stroke="#0F766E" strokeWidth="2.5" style={{ transition: 'fill 0.3s' }} />
        
        <rect x="30" y="35" width="60" height="50" rx="12" stroke="#0F766E" strokeWidth="3" fill="#F0FDFA" />
        
        <rect x="24" y="50" width="6" height="20" rx="3" fill="#F0FDFA" stroke="#0F766E" strokeWidth="2.5" />
        <rect x="90" y="50" width="6" height="20" rx="3" fill="#F0FDFA" stroke="#0F766E" strokeWidth="2.5" />

        <rect x="38" y="45" width="44" height="28" rx="6" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2" />

        <g style={{ transition: 'all 0.3s ease' }}>
          {!isHiding ? (
            <g className="animate-[blink_4s_infinite]" style={{ transformOrigin: '60px 58px' }}>
              <circle cx="48" cy="56" r="4.5" fill="#0F766E" />
              <circle cx="72" cy="56" r="4.5" fill="#0F766E" />
              <circle cx={49 + pupilX} cy={54.5 + pupilY} r="1.5" fill="white" style={{ transition: 'all 0.2s' }} />
              <circle cx={73 + pupilX} cy={54.5 + pupilY} r="1.5" fill="white" style={{ transition: 'all 0.2s' }} />
              <path d="M55 64 Q60 67 65 64" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g>
              <line x1="44" y1="56" x2="52" y2="56" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
              <line x1="68" y1="56" x2="76" y2="56" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterRoute = location.pathname === '/register';

  const [isFlipped, setIsFlipped] = useState(isRegisterRoute);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'name' | 'password'>('none');
  const [isMascotHiding, setIsMascotHiding] = useState(false);

  useEffect(() => {
    let hiding = false;
    if (focusedField === 'password') {
      if (!isFlipped && loginPassword.length > 0) hiding = true;
      if (isFlipped && (regForm.password.length > 0 || regForm.confirmPassword.length > 0)) hiding = true;
    }
    setIsMascotHiding(hiding);
  }, [focusedField, loginPassword, regForm.password, regForm.confirmPassword, isFlipped]);

  useEffect(() => {
    setIsFlipped(location.pathname === '/register');
  }, [location.pathname]);

  const validateLogin = () => {
    const errs: typeof loginErrors = {};
    if (!loginEmail) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = 'Invalid email format';
    if (!loginPassword) errs.password = 'Password is required';
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const validateRegister = () => {
    const errs: Record<string, string> = {};
    if (!regForm.name || regForm.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!regForm.email || !/\S+@\S+\.\S+/.test(regForm.email)) errs.email = 'Valid email is required';
    if (!regForm.password || regForm.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (regForm.password !== regForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setRegLoading(true);
    try {
      await register(regForm.name, regForm.email, regForm.password, regForm.confirmPassword);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const updateRegField = (field: string, value: string) => {
    setRegForm((prev) => ({ ...prev, [field]: value }));
    if (regErrors[field]) setRegErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const flipToRegister = () => {
    setIsFlipped(true);
    window.history.replaceState(null, '', '/register');
  };

  const flipToLogin = () => {
    setIsFlipped(false);
    window.history.replaceState(null, '', '/login');
  };

  const frontRef = React.useRef<HTMLDivElement>(null);
  const backRef = React.useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const frontH = frontRef.current?.scrollHeight || 0;
    const backH = backRef.current?.scrollHeight || 0;
    setCardHeight(Math.max(frontH, backH, 380));
  }, [isFlipped]);

  const features = [
    { icon: HiOutlineClipboardDocumentList, label: 'Task Management' },
    { icon: HiOutlineUsers, label: 'Team Collaboration' },
    { icon: HiOutlineChartBar, label: 'Progress Tracking' },
  ];

  const loginForm = (
    <div ref={frontRef} className="flip-card-front">
      <h1 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">Sign In</h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Masukkan email dan password Anda</p>

      <form onSubmit={handleLogin} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email</label>
          <div className="relative">
            <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('none')}
              className={`input-field pl-9 py-2 text-sm ${loginErrors.email ? 'border-red-500 focus:ring-red-500/50' : ''}`}
              placeholder="email@example.com" />
          </div>
          {loginErrors.email && <p className="text-red-500 text-xs mt-0.5">{loginErrors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Lupa password?</Link>
          </div>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type={showLoginPassword ? 'text' : 'password'} value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('none')}
              className={`input-field pl-9 pr-9 py-2 text-sm ${loginErrors.password ? 'border-red-500 focus:ring-red-500/50' : ''}`}
              placeholder="••••••••" />
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showLoginPassword ? <HiOutlineEyeSlash className="h-4 w-4" /> : <HiOutlineEye className="h-4 w-4" />}
            </button>
          </div>
          {loginErrors.password && <p className="text-red-500 text-xs mt-0.5">{loginErrors.password}</p>}
        </div>

        <button type="submit" disabled={loginLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 text-sm py-2.5">
          {loginLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
        Belum punya akun?{' '}
        <button onClick={flipToRegister} className="text-primary-600 hover:text-primary-700 font-semibold text-sm">Daftar Gratis</button>
      </p>

      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Demo Accounts:</p>
        <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
          <p><strong>Admin:</strong> admin@taskflow.com / password123</p>
          <p><strong>Leader:</strong> andi@taskflow.com / password123</p>
          <p><strong>Member:</strong> farhan@taskflow.com / password123</p>
        </div>
      </div>
    </div>
  );

  const registerForm = (
    <div ref={backRef} className="flip-card-back">
      <h1 className="text-lg font-bold mb-0.5 text-slate-900 dark:text-white">Create Account</h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">Isi data berikut untuk mendaftar</p>

      <form onSubmit={handleRegister} className="space-y-2">
        {[
          { key: 'name', label: 'Full Name', type: 'text', icon: HiOutlineUser, placeholder: 'Your Name' },
          { key: 'email', label: 'Email', type: 'email', icon: HiOutlineEnvelope, placeholder: 'email@example.com' },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium mb-0.5 text-slate-700 dark:text-slate-300">{field.label}</label>
            <div className="relative">
              <field.icon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input type={field.type} value={regForm[field.key as keyof typeof regForm]}
                onChange={(e) => updateRegField(field.key, e.target.value)}
                onFocus={() => setFocusedField(field.key as any)}
                onBlur={() => setFocusedField('none')}
                className={`input-field pl-8 py-1.5 text-xs ${regErrors[field.key] ? 'border-red-500' : ''}`}
                placeholder={field.placeholder} />
            </div>
            {regErrors[field.key] && <p className="text-red-500 text-[10px] mt-0.5">{regErrors[field.key]}</p>}
          </div>
        ))}

        {['password', 'confirmPassword'].map((key) => (
          <div key={key}>
            <label className="block text-xs font-medium mb-0.5 text-slate-700 dark:text-slate-300">
              {key === 'password' ? 'Password' : 'Confirm Password'}
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input type={showRegPassword ? 'text' : 'password'} value={regForm[key as keyof typeof regForm]}
                onChange={(e) => updateRegField(key, e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('none')}
                className={`input-field pl-8 pr-8 py-1.5 text-xs ${regErrors[key] ? 'border-red-500' : ''}`}
                placeholder="••••••••" />
              {key === 'password' && (
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {showRegPassword ? <HiOutlineEyeSlash className="h-3.5 w-3.5" /> : <HiOutlineEye className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
            {regErrors[key] && <p className="text-red-500 text-[10px] mt-0.5">{regErrors[key]}</p>}
          </div>
        ))}

        <button type="submit" disabled={regLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 text-xs py-2">
          {regLoading ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
        Sudah punya akun?{' '}
        <button onClick={flipToLogin} className="text-primary-600 hover:text-primary-700 font-semibold text-xs">Sign In</button>
      </p>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/30 via-primary-600/20 to-teal-500/30" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="relative z-10 flex flex-col justify-center px-16 w-full max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-3xl font-bold text-white">TaskFlow</span>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
                {isFlipped ? 'Siap Mulai?' : 'Selamat Datang Kembali'}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {isFlipped
                  ? 'Bergabung dengan ribuan tim yang sudah produktif bersama TaskFlow.'
                  : 'Kelola proyek, pantau progres, dan capai target bersama tim.'}
              </p>
            </div>

            <div className="flex gap-6">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col gap-2 items-center text-center text-slate-300">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <span className="text-xs font-medium max-w-[80px]">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          

        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 dark:bg-slate-900 relative">
        <div className="w-full max-w-md px-4 lg:px-6">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-base">T</span>
            </div>
            <span className="text-xl font-bold text-primary-700 dark:text-primary-400">TaskFlow</span>
          </div>

          <div className="glass-card p-5 sm:p-6 relative z-10">
            <div className="mb-2 -mt-10">
              <TaskBotHeadSVG isHiding={isMascotHiding} focusedField={focusedField} />
            </div>

            <div className="flip-container mt-2">
              <div
                className={`flip-card ${isFlipped ? 'flipped' : ''}`}
                style={{ height: cardHeight ? `${cardHeight}px` : '380px' }}
              >
                {loginForm}
                {registerForm}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
