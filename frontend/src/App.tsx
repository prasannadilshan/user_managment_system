import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

const PrivateRoute = ({ children, role }: { children: React.ReactNode, role?: 'ADMIN' | 'USER' }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/user'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin" element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/user" element={
            <PrivateRoute role="USER">
              <UserDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
