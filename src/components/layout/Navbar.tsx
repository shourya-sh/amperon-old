import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FolderOpen, 
  Settings,
  Users,
  LogOut,
  ChevronDown,
  Camera,
  Zap
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
    { path: '/ar', label: 'AR Lab', icon: Camera },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="h-14 bg-dark-850 border-b-2 border-dark-700 flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-xl bg-duo-green flex items-center justify-center shadow-[0_3px_0_0_theme(colors.duo.greenDeep)]">
          <Zap size={18} className="text-white" fill="currentColor" />
        </div>
        <span className="text-base font-display font-bold text-dark-100">Amperon</span>
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all duration-150 ${
                isActive
                  ? 'text-duo-green bg-duo-green/10 border-2 border-duo-green/30'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800 border-2 border-transparent'
              }`}
            >
              <Icon size={16} strokeWidth={2.5} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Collaboration Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-xl text-sm font-display font-semibold text-dark-300 hover:text-dark-100 transition-all duration-150 border-2 border-dark-700">
          <Users size={16} strokeWidth={2.5} />
          <span>Share</span>
        </button>

        {/* User Menu */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-dark-800 rounded-xl transition-all duration-150 border-2 border-transparent hover:border-dark-700"
            >
              <div className="w-8 h-8 rounded-xl bg-duo-purple/20 border-2 border-duo-purple/30 flex items-center justify-center text-duo-purple text-sm font-display font-bold">
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown size={14} className="text-dark-500" strokeWidth={2.5} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-dark-850 border-2 border-dark-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b-2 border-dark-700">
                  <p className="text-sm font-display font-bold text-dark-100 truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-dark-500 truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-dark-300 hover:text-dark-100 hover:bg-dark-800 rounded-xl transition-all duration-150"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} strokeWidth={2.5} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-dark-300 hover:text-duo-red hover:bg-duo-red/10 rounded-xl transition-all duration-150"
                  >
                    <LogOut size={16} strokeWidth={2.5} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-display font-semibold text-dark-400 hover:text-dark-200 transition-colors duration-150"
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
