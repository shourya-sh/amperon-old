import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  LayoutDashboard, 
  BookOpen, 
  FolderOpen, 
  Settings,
  Users,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Designer', icon: LayoutDashboard },
    { path: '/tutorials', label: 'Learn', icon: BookOpen },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="h-12 bg-dark-900 border-b border-dark-800 flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-forest-600 flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-dark-100">CircuitCo</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'text-dark-100 bg-dark-800'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
              }`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Collaboration Button */}
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-dark-800 rounded-md text-sm text-dark-400 hover:text-dark-200 transition-colors">
          <Users size={14} />
          <span>Share</span>
        </button>

        {/* User Menu */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-dark-800 rounded-md transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-dark-300 text-xs font-medium">
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown size={12} className="text-dark-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-dark-850 border border-dark-700 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                <div className="px-3 py-2 border-b border-dark-700">
                  <p className="text-sm font-medium text-dark-200 truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-dark-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={14} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm text-dark-400 hover:text-dark-200 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="btn-primary"
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
