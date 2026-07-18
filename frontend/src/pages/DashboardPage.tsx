import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { DashboardStats } from '../types';
import { LoadingSpinner } from '../components/UI';
import { HiOutlineRectangleStack, HiOutlineClipboardDocumentList, HiOutlineExclamationTriangle, HiOutlineUserGroup, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div className="text-center py-12 text-slate-500">Failed to load dashboard</div>;

  const statCards = [
    { label: 'Total Projects', value: stats.projects.total, icon: HiOutlineRectangleStack, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Active Projects', value: stats.projects.active, icon: HiOutlineClock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Tasks', value: stats.tasks.total, icon: HiOutlineClipboardDocumentList, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Completed Tasks', value: stats.tasks.done, icon: HiOutlineCheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Overdue Tasks', value: stats.tasks.overdue, icon: HiOutlineExclamationTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Team Members', value: stats.totalMembers, icon: HiOutlineUserGroup, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const taskDistribution = [
    { label: 'To Do', count: stats.tasks.todo, color: 'bg-slate-400' },
    { label: 'In Progress', count: stats.tasks.inProgress, color: 'bg-blue-500' },
    { label: 'Review', count: stats.tasks.review, color: 'bg-amber-500' },
    { label: 'Done', count: stats.tasks.done, color: 'bg-emerald-500' },
  ];
  const totalTasks = Math.max(stats.tasks.total, 1);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of your projects and tasks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card p-5 hover:-translate-y-0.5 transition-transform duration-200 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{card.label}</p>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Distribution */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6">Task Distribution</h2>
          <div className="space-y-4">
            {taskDistribution.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(item.count / totalTasks) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {stats.recentActivities.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No recent activity</p>
            ) : (
              stats.recentActivities.map((log, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="mt-1 h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{log.user?.name?.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{log.user?.name}</span>{' '}
                      <span className="text-slate-500 dark:text-slate-400">{log.description || log.action}</span>
                    </p>
                    {log.project && (
                      <p className="text-xs text-primary-600 dark:text-primary-400">{log.project.name}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(log.createdAt).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
