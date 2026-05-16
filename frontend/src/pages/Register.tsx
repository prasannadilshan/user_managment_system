import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User as UserIcon, Mail, Lock, CreditCard, Loader2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    nic: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to register.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4 py-12">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-indigo-200">Join our community today</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-white text-sm text-center">
              Registration successful! Redirecting to login...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Email Address"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Password (min 6 chars)"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-indigo-300" />
              </div>
              <input
                type="text"
                name="nic"
                required
                value={formData.nic}
                onChange={handleChange}
                className="block w-full pl-10 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                placeholder="NIC (9 digits)"
                pattern="^[0-9]{9}[vVxX]?|[0-9]{12}$"
                title="9 digits optionally followed by V/X, or 12 digits"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || success}
              className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-indigo-200">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white hover:text-indigo-100 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
