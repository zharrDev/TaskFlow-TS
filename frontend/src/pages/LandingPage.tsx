import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineRocketLaunch, HiOutlineUserGroup, HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineArrowRight, HiOutlineCheck, HiOutlineSparkles } from 'react-icons/hi2';
import BorderBeamBadge from '../components/BorderBeamBadge';

const LandingPage: React.FC = () => {
  const features = [
    { icon: HiOutlineRocketLaunch, title: 'Project Management', desc: 'Kelola proyek dari awal hingga selesai dengan tampilan yang intuitif.' },
    { icon: HiOutlineUserGroup, title: 'Team Collaboration', desc: 'Kolaborasi real-time dengan komentar, notifikasi, dan task assignment.' },
    { icon: HiOutlineChartBar, title: 'Progress Tracking', desc: 'Pantau progres tim dengan dashboard statistik dan Kanban board.' },
    { icon: HiOutlineShieldCheck, title: 'Role-Based Access', desc: 'Kontrol akses granular dengan 3 level role: Admin, Leader, Member.' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-20 py-5 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800/50">
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
      <section className="relative px-6 lg:px-20 pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #64748B 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="order-1" style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div className="mb-6">
                <BorderBeamBadge text="Platform Kolaborasi Tim" icon={<HiOutlineSparkles className="h-3.5 w-3.5" />} />
              </div>

              <h1 className="text-[34px] lg:text-[40px] font-semibold leading-tight mb-5 text-white">
                Kelola Proyek Tanpa Batas
              </h1>

              <p className="text-[15px] leading-relaxed text-slate-400 max-w-[400px] mb-8">
                TaskFlow menyatukan manajemen proyek, kolaborasi tim, dan pemantauan progres dalam satu platform yang powerful dan elegan.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-7 py-3 rounded-xl text-[15px] transition-all">
                  Mulai Gratis
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center gap-2 text-slate-300 font-medium px-7 py-3 rounded-xl border border-slate-600 hover:border-slate-400 hover:text-white transition-all text-[15px]">
                  Lihat Demo
                </Link>
              </div>
            </div>

            {/* Right: Flat Kanban Illustration */}
            <div className="order-2" style={{ animation: 'slideUp 0.5s ease-out 0.2s both' }}>
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
                <div className="flex gap-3">
                  {/* To Do */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2.5">To do</div>
                    <div className="space-y-2">
                      <div className="rounded-lg bg-slate-700/50 px-2.5 py-2">
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#0D9488' }} />
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#F0997B' }} />
                        </div>
                        <p className="text-[12px] font-medium text-slate-200">Desain dashboard</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">3 subtasks</p>
                      </div>
                      <div className="rounded-lg bg-slate-700/50 px-2.5 py-2">
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#FAC775' }} />
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#0D9488' }} />
                        </div>
                        <p className="text-[12px] font-medium text-slate-200">API integrasi</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">5 subtasks</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2.5">Progress</div>
                    <div className="space-y-2">
                      <div className="rounded-lg bg-slate-700/50 px-2.5 py-2">
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#F0997B' }} />
                        </div>
                        <p className="text-[12px] font-medium text-slate-200">User auth</p>
                        <div className="mt-1.5 h-1 rounded-full bg-slate-600 overflow-hidden">
                          <div className="h-full w-[65%] rounded-full" style={{ backgroundColor: '#0D9488' }} />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">65%</p>
                      </div>
                      <div className="rounded-lg bg-slate-700/50 px-2.5 py-2">
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#FAC775' }} />
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#0D9488' }} />
                        </div>
                        <p className="text-[12px] font-medium text-slate-200">Halaman profil</p>
                        <div className="mt-1.5 h-1 rounded-full bg-slate-600 overflow-hidden">
                          <div className="h-full w-[40%] rounded-full" style={{ backgroundColor: '#0D9488' }} />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">40%</p>
                      </div>
                    </div>
                  </div>

                  {/* Done */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2.5">Done</div>
                    <div className="space-y-2">
                      <div className="rounded-lg bg-slate-700/50 px-2.5 py-2">
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#0D9488' }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[12px] font-medium text-slate-400 line-through">Logo</p>
                          <HiOutlineCheck className="h-3 w-3" style={{ color: '#0D9488' }} />
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-700/50 px-2.5 py-2">
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#F0997B' }} />
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#FAC775' }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[12px] font-medium text-slate-400 line-through">Wireframe</p>
                          <HiOutlineCheck className="h-3 w-3" style={{ color: '#0D9488' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avatars */}
                <div className="flex items-center mt-4 pt-3.5 border-t border-slate-700/40">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-900" style={{ backgroundColor: '#0D9488' }}>A</div>
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-900" style={{ backgroundColor: '#F0997B' }}>B</div>
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-900" style={{ backgroundColor: '#FAC775' }}>C</div>
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-900" style={{ backgroundColor: '#6366F1' }}>D</div>
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-900" style={{ backgroundColor: '#34D399' }}>E</div>
                  </div>
                  <span className="text-[10px] text-slate-500 ml-2.5">+12 anggota tim</span>
                </div>
              </div>
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
