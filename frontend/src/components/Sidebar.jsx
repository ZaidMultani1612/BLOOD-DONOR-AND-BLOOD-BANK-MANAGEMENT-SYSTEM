import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Users,
  UserCheck,
  Building2,
  MessageSquare,
  Droplet,
  AlertCircle,
  CalendarDays,
  Award,
  Tent,
  MapPin,
  BarChart3,
  Heart,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'admin';

  // Base navigation matching screenshots
  const adminNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Donors', path: '/admin/donors', icon: Users },
    { name: 'Recipients', path: '/admin/recipients', icon: UserCheck },
    { name: 'Hospitals', path: '/admin/hospitals', icon: Building2 },
    { name: 'Hospital Chats', path: '/admin/chats', icon: MessageSquare },
    { name: 'Blood Requests', path: '/admin/requests', icon: Droplet },
    { name: 'Emergency SOS', path: '/admin/emergency', icon: AlertCircle, badge: 'SOS' },
    { name: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
    { name: 'Rewards', path: '/admin/rewards', icon: Award },
    { name: 'Donation Camps', path: '/admin/camps', icon: Tent },
    { name: 'Blood Stock Map', path: '/admin/map', icon: MapPin },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  const donorNav = [
    { name: 'Donor Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
    { name: 'Find Blood Banks', path: '/admin/map', icon: MapPin },
    { name: 'Book Appointment', path: '/donor/appointments', icon: CalendarDays },
    { name: 'Donation Camps', path: '/admin/camps', icon: Tent },
    { name: 'Rewards & Badges', path: '/admin/rewards', icon: Award },
    { name: 'Emergency SOS', path: '/admin/emergency', icon: AlertCircle, badge: 'SOS' },
  ];

  const recipientNav = [
    { name: 'Recipient Dashboard', path: '/recipient/dashboard', icon: LayoutDashboard },
    { name: 'Search Blood Stock', path: '/admin/map', icon: MapPin },
    { name: 'My Blood Requests', path: '/recipient/requests', icon: Droplet },
    { name: 'Emergency SOS', path: '/admin/emergency', icon: AlertCircle, badge: 'SOS' },
  ];

  const bloodBankNav = [
    { name: 'Blood Bank Dashboard', path: '/bloodbank/dashboard', icon: LayoutDashboard },
    { name: 'Manage Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Incoming Requests', path: '/admin/requests', icon: Droplet },
    { name: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
    { name: 'Donation Camps', path: '/admin/camps', icon: Tent },
    { name: 'Hospital Chats', path: '/admin/chats', icon: MessageSquare },
    { name: 'Blood Stock Map', path: '/admin/map', icon: MapPin },
  ];

  const hospitalNav = [
    { name: 'Hospital Dashboard', path: '/hospital/dashboard', icon: LayoutDashboard },
    { name: 'Search Blood Banks', path: '/admin/map', icon: MapPin },
    { name: 'Request Blood', path: '/admin/requests', icon: Droplet },
    { name: 'Emergency SOS', path: '/admin/emergency', icon: AlertCircle, badge: 'SOS' },
    { name: 'Blood Bank Chats', path: '/admin/chats', icon: MessageSquare },
  ];

  let navItems = adminNav;
  if (role === 'donor') navItems = donorNav;
  else if (role === 'recipient') navItems = recipientNav;
  else if (role === 'bloodbank') navItems = bloodBankNav;
  else if (role === 'hospital') navItems = hospitalNav;

  return (
    <aside className="w-64 bg-[#145348] text-white flex flex-col justify-between shadow-xl min-h-screen shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-6 flex items-center gap-3 border-b border-[#1c6457]">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-red-500 shadow-sm border border-white/20">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>HealthTech</span>
            </h1>
            <p className="text-[10px] text-teal-200/80 uppercase tracking-widest font-semibold">
              Blood Bank Network
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <div className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1e6f61] text-white shadow-inner font-semibold'
                      : 'text-teal-100/80 hover:bg-[#1a5f53] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 opacity-90" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer version */}
      <div className="p-4 border-t border-[#1c6457] text-xs text-teal-200/60 flex items-center justify-between">
        <div>
          <p>© 2025 HealthTech</p>
          <p className="text-[10px] font-mono">v2.0.0</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online"></div>
      </div>
    </aside>
  );
};

export default Sidebar;
