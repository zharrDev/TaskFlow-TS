import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { ActivityLog, PaginationMeta } from '../types';
import Pagination, { LoadingSpinner, EmptyState } from '../components/UI';
import { HiOutlineClock } from 'react-icons/hi2';

const ActivityLogPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/activity-logs?page=${page}&limit=${limit}`);
        setLogs(data.data);
        setPagination(data.pagination);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchLogs();
  }, [page, limit]);

  const getActionColor = (action: string) => {
    if (action.includes('created') || action.includes('completed') || action.includes('login')) return 'text-emerald-600 dark:text-emerald-400';
    if (action.includes('deleted') || action.includes('cancelled') || action.includes('error')) return 'text-red-600 dark:text-red-400';
    if (action.includes('updated') || action.includes('changed')) return 'text-amber-600 dark:text-amber-400';
    return 'text-primary-600 dark:text-primary-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <p className="text-slate-500 dark:text-slate-400">Riwayat aktivitas sistem</p>
      </div>

      {loading ? <LoadingSpinner /> : logs.length === 0 ? (
        <EmptyState title="No activity yet" description="Aktivitas akan muncul saat ada perubahan" />
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log, i) => (
                <div key={log.id || i} className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(log.action)} bg-slate-100 dark:bg-slate-800`}>
                    <HiOutlineClock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-slate-900 dark:text-white">{log.user?.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-1">{log.description || log.action}</span>
                    </p>
                    {log.project && (
                      <Link to={`/projects/${log.project.id}`} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                        {log.project.name}
                      </Link>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(log.createdAt).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
};

export default ActivityLogPage;
