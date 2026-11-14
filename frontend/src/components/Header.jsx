import React, { useState } from 'react';
import { Bell, ChevronDown, User, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Generate breadcrumbs from URL pathname
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumb = pathParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' > ');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-slate-800 text-base">
          {breadcrumb || 'Dashboard'}
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <Link
          to="/admin/emergency"
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          title="Emergency SOS Alerts"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Link>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-50 transition border border-slate-100"
          >
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {user?.email || 'admin@bloodbank.com'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 text-sm z-50 animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role} Account</p>
              </div>

              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-4 py-2.5 text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
