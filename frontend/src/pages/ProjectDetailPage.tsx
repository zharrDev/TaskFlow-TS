import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Project, Task } from '../types';
import { LoadingSpinner, getStatusBadge, getPriorityBadge, ConfirmDialog } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineUserPlus, HiOutlineCalendar } from 'react-icons/hi2';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data.data);
      } catch { navigate('/404'); }
      finally { setLoading(false); }
    };
    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const handleAddMember = async () => {
    try {
      const { data: usersData } = await api.get(`/users?search=${memberEmail}&limit=1`);
      if (usersData.data.length === 0) { toast.error('User not found'); return; }
      await api.post(`/members/project/${id}`, { userId: usersData.data[0].id });
      toast.success('Member added');
      setShowAddMember(false);
      setMemberEmail('');
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.data);
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to add member'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

  const isLeaderOrAdmin = user?.role === 'Admin' || user?.id === project.leaderId;
  const kanbanColumns = [
    { status: 'TODO', label: 'To Do', color: 'border-slate-300 dark:border-slate-600' },
    { status: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-400' },
    { status: 'REVIEW', label: 'Review', color: 'border-amber-400' },
    { status: 'DONE', label: 'Done', color: 'border-emerald-400' },
  ];

  const groupedTasks: Record<string, Task[]> = { TODO: [], IN_PROGRESS: [], REVIEW: [], DONE: [] };
  project.tasks?.forEach((t) => { if (groupedTasks[t.status]) groupedTasks[t.status].push(t); });

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.data);
      toast.success('Task status updated');
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-slate-500 dark:text-slate-400">{project.description || 'No description'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
              <span>👤 Leader: {project.leader?.name}</span>
              {project.startDate && <span className="flex items-center gap-1"><HiOutlineCalendar className="h-4 w-4" />{new Date(project.startDate).toLocaleDateString('id-ID')}</span>}
              {project.endDate && <span>→ {new Date(project.endDate).toLocaleDateString('id-ID')}</span>}
            </div>
          </div>
          {isLeaderOrAdmin && (
            <div className="flex gap-2">
              <Link to={`/projects/${id}/edit`} className="btn-secondary flex items-center gap-1 text-sm"><HiOutlinePencil className="h-4 w-4" />Edit</Link>
              <button onClick={() => setShowDelete(true)} className="btn-danger flex items-center gap-1 text-sm"><HiOutlineTrash className="h-4 w-4" />Delete</button>
            </div>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Team Members ({project.members?.length || 0})</h2>
          {isLeaderOrAdmin && (
            <button onClick={() => setShowAddMember(true)} className="btn-secondary flex items-center gap-1 text-sm">
              <HiOutlineUserPlus className="h-4 w-4" />Add
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {project.members?.map((m) => (
            <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{(m.user?.name || m.name || '?').charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{m.user?.name || m.name}</p>
                <p className="text-xs text-slate-400">{m.user?.email || m.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <Link to={`/tasks/new?projectId=${id}`} className="btn-primary text-sm flex items-center gap-1">
            + New Task
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => (
            <div key={col.status} className={`rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border-t-4 ${col.color}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">{col.label}</h3>
                <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center font-semibold">
                  {groupedTasks[col.status].length}
                </span>
              </div>
              <div className="space-y-3 min-h-[100px]">
                {groupedTasks[col.status].map((task) => (
                  <Link key={task.id} to={`/tasks/${task.id}`}
                    className="block glass-card p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                    <h4 className="text-sm font-medium mb-2">{task.title}</h4>
                    <div className="flex items-center justify-between">
                      {getPriorityBadge(task.priority)}
                      {task.assignee && (
                        <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center" title={task.assignee.name}>
                          <span className="text-white text-[10px] font-bold">{task.assignee.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    {task.dueDate && (
                      <p className={`text-xs mt-2 ${new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-500' : 'text-slate-400'}`}>
                        📅 {new Date(task.dueDate).toLocaleDateString('id-ID')}
                      </p>
                    )}
                    <select value={task.status}
                      onClick={(e) => e.preventDefault()}
                      onChange={(e) => { e.preventDefault(); handleStatusChange(task.id, e.target.value); }}
                      className="mt-2 w-full text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent">
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">Review</option>
                      <option value="DONE">Done</option>
                    </select>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddMember(false)} />
          <div className="relative w-full max-w-sm glass-card p-6 animate-scale-in">
            <h3 className="text-lg font-semibold mb-4">Add Member</h3>
            <input type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)}
              className="input-field mb-4" placeholder="Enter user email" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddMember(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleAddMember} className="btn-primary text-sm">Add</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Project" message="Are you sure you want to delete this project? This action cannot be undone." confirmText="Delete" />
    </div>
  );
};

export default ProjectDetailPage;
