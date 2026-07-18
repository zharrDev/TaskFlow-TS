import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../components/UI';
import type { Project } from '../types';

const TaskFormPage: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    projectId: searchParams.get('projectId') || '',
    assigneeId: '',
    title: '', description: '',
    priority: 'MEDIUM', status: 'TODO',
    dueDate: '',
  });

  useEffect(() => {
    api.get('/projects?limit=100').then(({ data }) => setProjects(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.projectId) {
      api.get(`/members/project/${form.projectId}`).then(({ data }) => {
        setMembers(data.data.map((m: any) => ({ id: m.userId, name: m.name })));
      }).catch(() => setMembers([]));
    }
  }, [form.projectId]);

  useEffect(() => {
    if (isEdit) {
      api.get(`/tasks/${id}`).then(({ data }) => {
        const t = data.data;
        setForm({
          projectId: String(t.projectId),
          assigneeId: t.assigneeId ? String(t.assigneeId) : '',
          title: t.title,
          description: t.description || '',
          priority: t.priority,
          status: t.status,
          dueDate: t.dueDate ? t.dueDate.split('T')[0] : '',
        });
      }).catch(() => navigate('/404')).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.projectId) { toast.error('Title and Project are required'); return; }
    setSubmitting(true);
    try {
      const payload = {
        projectId: Number(form.projectId),
        assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || undefined,
      };
      if (isEdit) { await api.put(`/tasks/${id}`, payload); toast.success('Task updated!'); }
      else { await api.post('/tasks', payload); toast.success('Task created!'); }
      navigate('/tasks');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Task' : 'Create Task'}</h1>
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field" placeholder="Task title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Project *</label>
            <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value, assigneeId: '' })} className="input-field">
              <option value="">Select project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Assignee</label>
            <select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} className="input-field">
              <option value="">Unassigned</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field min-h-[80px]" placeholder="Task description..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? '...' : (isEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormPage;
