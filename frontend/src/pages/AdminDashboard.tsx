import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User as UserType } from '../types';
import { 
  LogOut, Plus, Edit2, Trash2, Shield, 
  Loader2, Search, X, Check
} from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [formData, setFormData] = useState({
    email: '', fullName: '', password: '', nic: ''
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDelete = async (email: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${email}`);
        setUsers(users.filter(u => u.email !== email));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const openCreateModal = () => {
    setModalMode('CREATE');
    setFormData({ email: '', fullName: '', password: '', nic: '' });
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserType) => {
    setModalMode('EDIT');
    setFormData({ 
      email: user.email, 
      fullName: user.fullName, 
      password: '', // Password left blank unless changing
      nic: user.nic 
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    try {
      const payload = {
        ...formData
      };

      if (modalMode === 'CREATE') {
        await api.post('/admin/users', payload);
      } else {
        await api.put(`/admin/users/${formData.email}`, payload);
      }
      
      await fetchUsers();
      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err.response?.data || 'An error occurred.');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">Admin Portal</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage platform users, roles, and access.</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">New User</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
                      <p className="mt-2 text-gray-500 font-medium">Loading users...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-medium text-lg">No users found</p>
                      <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.email} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">NIC: {user.nic}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditModal(user)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {user.email !== 'admin@admin.com' && (
                            <button 
                              onClick={() => handleDelete(user.email)}
                              className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          ></div>

          <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg z-10">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center">
                    {modalMode === 'CREATE' ? <Plus className="mr-2 h-5 w-5 text-indigo-600" /> : <Edit2 className="mr-2 h-5 w-5 text-indigo-600" />}
                    {modalMode === 'CREATE' ? 'Add New User' : 'Edit User Details'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 bg-gray-50 p-1 rounded-lg">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {modalError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
                    {modalError}
                  </div>
                )}

                <form id="user-form" onSubmit={handleModalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (ID)</label>
                    <input
                      type="email"
                      required
                      disabled={modalMode === 'EDIT'}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="block w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="block w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {modalMode === 'CREATE' ? 'Password' : 'New Password (Leave blank to keep current)'}
                    </label>
                    <input
                      type="password"
                      required={modalMode === 'CREATE'}
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="block w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIC (9 digits)</label>
                    <input
                      type="text"
                      required
                      pattern="^[0-9]{9}[vVxX]?|[0-9]{12}$"
                      value={formData.nic}
                      onChange={(e) => setFormData({...formData, nic: e.target.value})}
                      className="block w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
                <button
                  type="submit"
                  form="user-form"
                  disabled={modalLoading}
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-70"
                >
                  {modalLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="mr-2 h-4 w-4" /> Save</>}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
