import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Project, PaginationMeta } from '../types';
import Pagination, { LoadingSpinner, EmptyState, getStatusBadge } from '../components/UI';
import { useDebounce } from '../hooks/useDebounce';
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const ProjectListPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort, order });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (status) params.set('status', status);
      const { data } = await api.get(`/projects?${params}`);
      setProjects(data.data);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, [debouncedSearch, status, sort, order, page, limit]);
  useEffect(() => { setPage(1); }, [debouncedSearch, status, sort, order, limit]);

  const canCreate = user?.role === 'Admin' || user?.role === 'Project Leader';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your projects</p>
        </div>
        {canCreate && (
          <Link to="/projects/new" className="btn-primary flex items-center gap-2 text-sm">
            <HiOutlinePlus className="h-4 w-4" /> New Project
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10" placeholder="Search projects..." />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <HiOutlineFunnel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field pl-9 pr-8 min-w-[140px]">
                <option value="">All Status</option>
                <option value="PLANNING">Planning</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <select value={`${sort}-${order}`} onChange={(e) => { const [s, o] = e.target.value.split('-'); setSort(s); setOrder(o); }}
              className="input-field min-w-[130px]">
              <option value="createdAt-desc">Newest</option>
              <option value="createdAt-asc">Oldest</option>
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      {loading ? <LoadingSpinner /> : projects.length === 0 ? (
        <EmptyState title="No projects found" description="Create your first project to get started" action={
          canCreate ? <Link to="/projects/new" className="btn-primary text-sm">Create Project</Link> : undefined
        } />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}
                className="glass-card p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-bold">{project.name.charAt(0)}</span>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{project.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{project.description || 'No description'}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>👤 {project.leader?.name}</span>
                  <span>📋 {project._count?.tasks || 0} tasks</span>
                </div>
              </Link>
            ))}
          </div>
          {pagination && <Pagination pagination={pagination} onPageChange={setPage} onLimitChange={setLimit} />}
        </>
      )}
    </div>
  );
};

export default ProjectListPage;
