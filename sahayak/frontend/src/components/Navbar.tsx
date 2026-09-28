import React from 'react';
import { Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-danger text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Shield size={28} className="text-white" />
          <div>
            <h1 className="text-xl font-bold tracking-wider">SAHAYAK</h1>
            <p className="text-[10px] opacity-90 hidden sm:block">Emergency assistance when every second matters.</p>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-4 mr-4 text-sm font-medium">
            <Link to="/" className="hover:text-red-200 transition">Dashboard</Link>
            <Link to="/contacts" className="hover:text-red-200 transition">Contacts</Link>
            <Link to="/history" className="hover:text-red-200 transition">History</Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
            <Link to="/profile" className="p-2 hover:bg-red-700 rounded-full transition">
              <User size={20} />
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-700 rounded-full transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
