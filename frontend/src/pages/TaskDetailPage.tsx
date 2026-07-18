import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import type { Task } from '../types';
import { LoadingSpinner, getStatusBadge, getPriorityBadge, ConfirmDialog } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePaperClip, HiOutlineChatBubbleLeft } from 'react-icons/hi2';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchTask = async () => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      setTask(data.data);
    } catch { navigate('/404'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTask(); }, [id]);

  const handleDelete = async () => {
    try { await api.delete(`/tasks/${id}`); toast.success('Task deleted'); navigate('/tasks'); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      await api.post(`/comments/task/${id}`, { content: comment });
      setComment('');
      fetchTask();
      toast.success('Comment added');
    } catch { toast.error('Failed to add comment'); }
    finally { setSubmittingComment(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/attachments/task/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchTask();
      toast.success('File uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status: newStatus });
      fetchTask();
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!task) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{task.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {getStatusBadge(task.status)}
              {getPriorityBadge(task.priority)}
              {task.project && (
                <Link to={`/projects/${task.project.id}`} className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700">📁 {task.project.name}</Link>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400">{task.description || 'No description'}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/tasks/${id}/edit`} className="btn-secondary flex items-center gap-1 text-sm"><HiOutlinePencil className="h-4 w-4" />Edit</Link>
            <button onClick={() => setShowDelete(true)} className="btn-danger flex items-center gap-1 text-sm"><HiOutlineTrash className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Info */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-xs text-slate-400 mb-1">Assignee</p>
            {task.assignee ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{task.assignee.name.charAt(0)}</span>
                </div>
                <span className="font-medium text-sm">{task.assignee.name}</span>
              </div>
            ) : <span className="text-sm text-slate-400">Unassigned</span>}
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Due Date</p>
            <p className={`text-sm font-medium ${task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-500' : ''}`}>
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No due date'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Change Status</p>
            <select value={task.status} onChange={(e) => handleStatusChange(e.target.value)} className="input-field text-sm py-1.5">
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><HiOutlinePaperClip className="h-5 w-5" />Attachments ({task.attachments?.length || 0})</h2>
          <label className="btn-secondary text-sm cursor-pointer flex items-center gap-1">
            {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" /> : '+ Upload'}
            <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {task.attachments?.map((att) => (
            <div key={att.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 text-xs font-bold">{att.fileType === 'image' ? '🖼️' : '📄'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{att.fileName}</p>
                <p className="text-xs text-slate-400">{att.uploader?.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><HiOutlineChatBubbleLeft className="h-5 w-5" />Comments ({task.comments?.length || 0})</h2>
        <div className="space-y-4 mb-6">
          {task.comments?.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{c.user?.name?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{c.user?.name}</span>
                  <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString('id-ID')}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleComment} className="flex gap-3">
          <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}
            className="input-field flex-1" placeholder="Write a comment..." />
          <button type="submit" disabled={submittingComment || !comment.trim()} className="btn-primary text-sm disabled:opacity-50">
            {submittingComment ? '...' : 'Send'}
          </button>
        </form>
      </div>

      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Task" message="Are you sure?" confirmText="Delete" />
    </div>
  );
};

export default TaskDetailPage;
