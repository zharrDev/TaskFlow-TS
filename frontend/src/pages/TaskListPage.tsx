import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Task, PaginationMeta } from '../types';
import Pagination, { LoadingSpinner, EmptyState, getStatusBadge, getPriorityBadge } from '../components/UI';
import { useDebounce } from '../hooks/useDebounce';
import { HiOutlinePlus, HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort, order });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (status) params.set('status', status);
      if (priority) params.set('priority', priority);
      const { data } = await api.get(`/tasks?${params}`);
      setTasks(data.data);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [debouncedSearch, status, priority, sort, order, page, limit]);
  useEffect(() => { setPage(1); }, [debouncedSearch, status, priority, sort, order, limit]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400">All tasks across projects</p>
        </div>
        <Link to="/tasks/new" className="btn-primary flex items-center gap-2 text-sm">
          <HiOutlinePlus className="h-4 w-4" /> New Task
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10" placeholder="Search tasks..." />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field min-w-[130px]">
            <option value="">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field min-w-[130px]">
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <select value={`${sort}-${order}`} onChange={(e) => { const [s, o] = e.target.value.split('-'); setSort(s); setOrder(o); }}
            className="input-field min-w-[130px]">
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="dueDate-asc">Due Soon</option>
            <option value="title-asc">A-Z</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      {loading ? <LoadingSpinner /> : tasks.length === 0 ? (
        <EmptyState title="No tasks found" description="Create a new task to get started" />
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {['Title', 'Project', 'Status', 'Priority', 'Assignee', 'Due Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/tasks/${task.id}`} className="font-medium text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{task.title}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{task.project?.name}</td>
                      <td className="px-4 py-3">{getStatusBadge(task.status)}</td>
                      <td className="px-4 py-3">{getPriorityBadge(task.priority)}</td>
                      <td className="px-4 py-3">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">{task.assignee.name.charAt(0)}</span>
                            </div>
                            <span className="text-sm">{task.assignee.name}</span>
                          </div>
                        ) : <span className="text-sm text-slate-400">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {task.dueDate ? (
                          <span className={new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-500 font-medium' : 'text-slate-500'}>
                            {new Date(task.dueDate).toLocaleDateString('id-ID')}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {pagination && <Pagination pagination={pagination} onPageChange={setPage} onLimitChange={setLimit} />}
        </>
      )}
    </div>
  );
};

export default TaskListPage;
