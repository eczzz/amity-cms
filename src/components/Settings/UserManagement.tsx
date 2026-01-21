import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';
import { UserEditor } from './UserEditor';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditorOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    loadUsers();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-bg-slate rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-semibold text-text-primary">User Management</h2>
          <p className="text-text-muted text-small mt-1">Manage team members and their permissions</p>
        </div>
        <button
          onClick={handleAddUser}
          className="btn-primary py-2 text-small flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Add User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-text-muted mb-4">No users yet. Add your first team member.</p>
          <button
            onClick={handleAddUser}
            className="btn-primary py-2 text-small inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Add First User
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-light-gray border-b border-bg-slate">
                <tr>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Name</th>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Email</th>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Phone</th>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Role</th>
                  <th className="text-left px-6 py-4 text-small font-semibold text-text-primary">Joined</th>
                  <th className="text-right px-6 py-4 text-small font-semibold text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-slate">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-bg-light-gray transition cursor-pointer"
                    onClick={() => handleEditUser(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">
                        {user.first_name || user.last_name
                          ? `${user.first_name} ${user.last_name}`.trim()
                          : 'No name'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-tiny text-text-muted">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-tiny text-text-muted">{user.phone_number || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-pill text-tiny font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'editor'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-bg-light-gray text-text-primary'
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-small text-text-muted">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-light-gray rounded-md transition"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UserEditor
        user={selectedUser}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
