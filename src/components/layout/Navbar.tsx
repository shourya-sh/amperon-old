import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  LayoutDashboard, 
  BookOpen, 
  FolderOpen, 
  Settings,
  Users,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Designer', icon: LayoutDashboard },
    { path: '/tutorials', label: 'Tutorials', icon: BookOpen },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="h-14 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800 flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-forest-600/30 transition-shadow">
          <Zap size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold text-dark-100">
          Circuit<span className="text-forest-500">Co</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-forest-400'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
              }`}
            >
              <Icon size={16} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-forest-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Collaboration Button */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-sm text-dark-300 hover:text-dark-100 transition-colors">
          <Users size={14} />
          <span>Collaborate</span>
        </button>

        {/* User Menu */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-dark-800 rounded-lg transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center text-white text-xs font-medium">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <ChevronDown size={14} className="text-dark-400" />
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-3 border-b border-dark-700">
                  <p className="font-medium text-dark-100 truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-dark-500 truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-700 rounded-lg transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={14} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm text-dark-300 hover:text-dark-100 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="btn-primary text-sm"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
