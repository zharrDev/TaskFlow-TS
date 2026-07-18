import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { HiOutlineHome, HiOutlineRectangleStack, HiOutlineClipboardDocumentList, HiOutlineUsers, HiOutlineBell, HiOutlineUser, HiOutlineArrowRightOnRectangle, HiOutlineSun, HiOutlineMoon, HiOutlineBars3, HiOutlineXMark, HiOutlinePlus, HiOutlineClock } from 'react-icons/hi2';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/notifications');
        setUnreadCount(data.data.filter((n: any) => !n.isRead).length);
      } catch { /* ignore */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/projects', icon: HiOutlineRectangleStack, label: 'Projects' },
    { path: '/tasks', icon: HiOutlineClipboardDocumentList, label: 'Tasks' },
    { path: '/notifications', icon: HiOutlineBell, label: 'Notifications' },
    { path: '/activity-log', icon: HiOutlineClock, label: 'Activity Log' },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ path: '/users', icon: HiOutlineUsers, label: 'Users' });
  }

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-primary-700 dark:text-primary-400">TaskFlow</span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <HiOutlineXMark className="h-6 w-6" />
            </button>
          </div>

          {/* Quick Create */}
          <div className="px-4 py-4">
            <Link to="/projects/new" className="btn-primary flex items-center justify-center gap-2 w-full text-sm">
              <HiOutlinePlus className="h-4 w-4" />
              New Project
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={isActive(item.path) ? 'sidebar-link-active' : 'sidebar-link'}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-2">
            <Link to="/profile" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
              <HiOutlineUser className="h-5 w-5" />
              Profile
            </Link>
            <button onClick={logout} className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60 px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setSidebarOpen(true)}>
                <HiOutlineBars3 className="h-6 w-6" />
              </button>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back,</p>
                <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {isDark ? <HiOutlineSun className="h-5 w-5 text-amber-400" /> : <HiOutlineMoon className="h-5 w-5 text-slate-600" />}
              </button>
              <Link to="/notifications" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                <HiOutlineBell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{user?.name?.charAt(0)}</span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
