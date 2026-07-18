import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../components/UI';

const UserFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    roleId: '', isActive: true,
    phoneNumber: '', bio: '',
  });

  useEffect(() => {
    api.get('/users/roles').then(({ data }) => setRoles(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit) {
      api.get(`/users/${id}`).then(({ data }) => {
        const u = data.data;
        setForm({
          name: u.name, email: u.email, password: '',
          roleId: String(u.roleId), isActive: u.isActive !== false,
          phoneNumber: u.profile?.phoneNumber || '',
          bio: u.profile?.bio || '',
        });
      }).catch(() => navigate('/404')).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.roleId) {
      toast.error('Name, email and role are required');
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit) {
        const payload: any = {
          name: form.name, email: form.email,
          roleId: Number(form.roleId), isActive: form.isActive,
          phoneNumber: form.phoneNumber || undefined,
          bio: form.bio || undefined,
        };
        await api.put(`/users/${id}`, payload);
        toast.success('User updated!');
      } else {
        await api.post('/users', {
          name: form.name, email: form.email, password: form.password,
          roleId: Number(form.roleId),
          phoneNumber: form.phoneNumber || undefined,
          bio: form.bio || undefined,
        });
        toast.success('User created!');
      }
      navigate('/users');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit User' : 'Create User'}</h1>
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="john@example.com" />
            </div>
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Password *</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field" placeholder="Minimum 8 characters" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Role *</label>
              <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })} className="input-field">
                <option value="">Select role</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            {isEdit && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Status</label>
                <select value={form.isActive ? 'true' : 'false'}
                  onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })} className="input-field">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Phone Number</label>
            <input type="text" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="input-field" placeholder="+62 xxx" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="input-field min-h-[80px]" placeholder="Short bio..." />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : (isEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormPage;
