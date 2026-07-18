import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineRocketLaunch, HiOutlineUserGroup, HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineArrowRight } from 'react-icons/hi2';

const LandingPage: React.FC = () => {
  const features = [
    { icon: HiOutlineRocketLaunch, title: 'Project Management', desc: 'Kelola proyek dari awal hingga selesai dengan tampilan yang intuitif.' },
    { icon: HiOutlineUserGroup, title: 'Team Collaboration', desc: 'Kolaborasi real-time dengan komentar, notifikasi, dan task assignment.' },
    { icon: HiOutlineChartBar, title: 'Progress Tracking', desc: 'Pantau progres tim dengan dashboard statistik dan Kanban board.' },
    { icon: HiOutlineShieldCheck, title: 'Role-Based Access', desc: 'Kontrol akses granular dengan 3 level role: Admin, Leader, Member.' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-20 py-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary-500 to-teal-400 flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-teal-300 bg-clip-text text-transparent">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors px-4 py-2">Login</Link>
          <Link to="/register" className="bg-gradient-to-r from-primary-500 to-teal-400 text-white font-semibold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all">
            Mulai Gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 lg:px-20 pt-16 pb-32">
        {/* Background effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
            Platform Kolaborasi Tim #1
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
            Kelola Proyek
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Tanpa Batas</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200">
            TaskFlow menyatukan manajemen proyek, kolaborasi tim, dan pemantauan progres dalam satu platform yang powerful dan elegan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-300">
            <Link to="/register" className="group flex items-center gap-2 bg-gradient-to-r from-primary-500 to-teal-400 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all duration-300">
              Mulai Gratis Sekarang
              <HiOutlineArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="flex items-center gap-2 text-slate-300 font-semibold px-8 py-4 rounded-2xl border border-slate-700 hover:border-slate-500 hover:text-white transition-all">
              Sudah punya akun? Login
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Card */}
        <div className="relative max-w-4xl mx-auto mt-20 animate-slide-up animate-delay-500">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-teal-400 rounded-3xl opacity-20 blur-2xl animate-glow" />
          <div className="relative rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-4 text-xs text-slate-500">TaskFlow Dashboard</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Active Projects', value: '12', color: 'from-primary-500 to-teal-400' },
                { label: 'Total Tasks', value: '86', color: 'from-blue-500 to-cyan-500' },
                { label: 'Completed', value: '64', color: 'from-emerald-500 to-green-400' },
                { label: 'Team Members', value: '25', color: 'from-amber-500 to-orange-400' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-slate-700/50 p-4">
                  <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 lg:px-20 py-24 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
            Semua yang Tim Anda <span className="text-primary-400">Butuhkan</span>
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-16">
            Fitur lengkap untuk mengelola proyek dari perencanaan hingga penyelesaian.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group rounded-2xl bg-slate-800/80 border border-slate-700/50 p-6 hover:border-primary-500/50 hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-20 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Siap Memulai?</h2>
          <p className="text-slate-400 mb-8">Bergabung dengan ribuan tim yang sudah menggunakan TaskFlow.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-teal-400 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:shadow-2xl hover:shadow-primary-500/40 transition-all">
            Mulai Gratis <HiOutlineArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 lg:px-20 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-primary-400">TaskFlow</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
