import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { getSupabase } from '../../lib/supabase';
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
      const { data, error } = await getSupabase()
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
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <p className="text-gray-500 text-sm mt-1">Manage team members and their permissions</p>
        </div>
        <button
          onClick={handleAddUser}
          className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Add User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-gray-600 mb-6 text-sm">No users yet. Add your first team member to get started.</p>
          <button
            onClick={handleAddUser}
            className="btn-primary py-2.5 px-6 text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Add First User
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Phone</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Joined</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleEditUser(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                          {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-900 text-sm">
                          {user.first_name || user.last_name
                            ? `${user.first_name} ${user.last_name}`.trim()
                            : 'No name'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">{user.phone_number || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'editor'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
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
