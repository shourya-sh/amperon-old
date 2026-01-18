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
  Camera
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
    <nav className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="text-sm font-semibold text-[#c9d1d9]">Amperon</span>
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'text-[#c9d1d9] bg-[#21262d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128]'
              }`}
            >
              <Icon size={14} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Collaboration Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#1c2128] rounded text-sm text-[#8b949e] hover:text-[#c9d1d9] transition-colors duration-150">
          <Users size={14} strokeWidth={2} />
          <span>Share</span>
        </button>

        {/* User Menu */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#1c2128] rounded transition-colors duration-150"
            >
              <div className="w-6 h-6 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#c9d1d9] text-xs font-medium">
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown size={12} className="text-[#8b949e]" strokeWidth={2} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#161b22] border border-[#30363d] rounded shadow-2xl overflow-hidden animate-fade-in">
                <div className="px-3 py-2 border-b border-[#30363d]">
                  <p className="text-sm font-medium text-[#c9d1d9] truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-[#8b949e] truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#c9d1d9] hover:bg-[#1c2128] transition-colors duration-150"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={14} strokeWidth={2} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#c9d1d9] hover:bg-[#1c2128] transition-colors duration-150"
                  >
                    <LogOut size={14} strokeWidth={2} />
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
              className="px-3 py-1.5 text-sm text-[#8b949e] hover:text-[#c9d1d9] transition-colors duration-150 font-medium"
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
