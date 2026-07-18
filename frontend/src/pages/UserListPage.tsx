import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { User, PaginationMeta } from '../types';
import Pagination, { LoadingSpinner, EmptyState, Badge, ConfirmDialog } from '../components/UI';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (role) params.set('role', role);
      const { data } = await api.get(`/users?${params}`);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [debouncedSearch, role, page, limit]);
  useEffect(() => { setPage(1); }, [debouncedSearch, role, limit]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/users/${deleteId}`);
      toast.success('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage system users (Admin only)</p>
        </div>
        <Link to="/users/new" className="btn-primary flex items-center gap-2 text-sm">
          <HiOutlinePlus className="h-4 w-4" /> New User
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10" placeholder="Search users..." />
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field min-w-[140px]">
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Project Leader">Project Leader</option>
            <option value="Member">Member</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : users.length === 0 ? (
        <EmptyState title="No users found" description="No users match your filters" />
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{u.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-sm">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === 'Admin' ? 'danger' : u.role === 'Project Leader' ? 'teal' : 'default'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={u.isActive !== false ? 'success' : 'danger'}>
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/users/${u.id}/edit`}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <HiOutlinePencil className="h-4 w-4 text-slate-500" />
                          </Link>
                          <button onClick={() => setDeleteId(u.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <HiOutlineTrash className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
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

      <ConfirmDialog isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete User" message="Are you sure you want to delete this user?" confirmText="Delete" />
    </div>
  );
};

export default UserListPage;
