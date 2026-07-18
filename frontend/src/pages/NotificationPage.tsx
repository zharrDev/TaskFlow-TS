import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Notification } from '../types';
import { LoadingSpinner, EmptyState, Badge } from '../components/UI';
import toast from 'react-hot-toast';
import { HiOutlineBell, HiOutlineCheck, HiOutlineCheckCircle } from 'react-icons/hi2';

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch { toast.error('Failed to mark as read'); }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch { toast.error('Failed'); }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const typeConfig: Record<string, { variant: 'success' | 'danger' | 'warning' | 'info' }> = {
    SUCCESS: { variant: 'success' },
    ERROR: { variant: 'danger' },
    WARNING: { variant: 'warning' },
    INFO: { variant: 'info' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn-secondary flex items-center gap-2 text-sm">
            <HiOutlineCheckCircle className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {loading ? <LoadingSpinner /> : notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You'll see notifications here when there's activity" />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id}
              className={`glass-card p-4 flex items-start gap-4 transition-all ${
                !n.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : ''
              }`}>
              <div className="flex-shrink-0 mt-0.5">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  n.type === 'SUCCESS' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  n.type === 'ERROR' ? 'bg-red-100 dark:bg-red-900/30' :
                  n.type === 'WARNING' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <HiOutlineBell className={`h-5 w-5 ${
                    n.type === 'SUCCESS' ? 'text-emerald-600 dark:text-emerald-400' :
                    n.type === 'ERROR' ? 'text-red-600 dark:text-red-400' :
                    n.type === 'WARNING' ? 'text-amber-600 dark:text-amber-400' :
                    'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{n.title}</h3>
                  <Badge variant={typeConfig[n.type]?.variant || 'default'}>{n.type}</Badge>
                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary-500" />}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString('id-ID')}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markAsRead(n.id)}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Mark as read">
                  <HiOutlineCheck className="h-4 w-4 text-slate-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
