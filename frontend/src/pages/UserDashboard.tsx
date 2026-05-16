import { useNavigate } from 'react-router-dom';
import type { User as UserType } from '../types';
import { LogOut, User as UserIcon, Mail, CreditCard, Shield } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user: UserType | null = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 flex justify-between items-center text-white">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-blue-100 mt-2">Manage your personal information</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-10">
            <div className="flex items-center mb-8 pb-8 border-b border-gray-100">
              <div className="h-24 w-24 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-indigo-600 shadow-inner">
                <UserIcon className="h-12 w-12" />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                <div className="flex items-center mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full w-max">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center mb-1">
                    <Mail className="h-4 w-4 mr-2" /> Email Address
                  </label>
                  <div className="text-lg text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    {user.email}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center mb-1">
                    <UserIcon className="h-4 w-4 mr-2" /> Full Name
                  </label>
                  <div className="text-lg text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    {user.fullName}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center mb-1">
                    <CreditCard className="h-4 w-4 mr-2" /> NIC Number
                  </label>
                  <div className="text-lg text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    {user.nic}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
