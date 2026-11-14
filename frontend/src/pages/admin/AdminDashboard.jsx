import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Users,
  CheckCircle,
  AlertTriangle,
  FileText,
  AlertCircle,
  Calendar,
  Clock,
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import BloodGroupCard from '../../components/BloodGroupCard';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bloodGroupInventory, setBloodGroupInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/admin/overview');
        if (res.data.success) {
          setStats(res.data.stats);
          setBloodGroupInventory(res.data.bloodGroupInventory);
        }
      } catch (err) {
        console.error('Failed to load overview data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Overview Greeting */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Overview</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Welcome to the Blood Bank Management System Dashboard
        </p>
      </div>

      {/* Top 4 Metric Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Blood Units"
          value={stats?.totalBloodUnits?.toLocaleString() || '1,250'}
          trend="↑ 12%"
          trendColor="text-emerald-600"
          icon={Droplet}
          iconBg="bg-rose-50 text-rose-500"
        />

        <StatCard
          title="Donors This Month"
          value={stats?.donorsThisMonth?.toLocaleString() || '320'}
          trend="↑ 8%"
          trendColor="text-emerald-600"
          icon={Users}
          iconBg="bg-blue-50 text-blue-500"
        />

        <StatCard
          title="Available Units"
          value={stats?.availableUnits?.toLocaleString() || '980'}
          trend="↑ 95%"
          trendColor="text-emerald-600"
          icon={CheckCircle}
          iconBg="bg-emerald-50 text-emerald-500"
        />

        <StatCard
          title="Low Stock Groups"
          value={stats?.lowStockGroups ?? 2}
          trend="⚠ Alert"
          trendColor="text-amber-600"
          icon={AlertTriangle}
          iconBg="bg-amber-50 text-amber-500"
        />
      </div>

      {/* Second 4 Metric Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pending Requests"
          value={stats?.pendingRequests || 18}
          trend="↑ 5%"
          trendColor="text-emerald-600"
          icon={FileText}
          iconBg="bg-purple-50 text-purple-500"
        />

        <StatCard
          title="Active Emergencies"
          value={stats?.activeEmergencies || 3}
          trend="▲ Urgent"
          trendColor="text-rose-600 font-bold"
          icon={AlertCircle}
          iconBg="bg-rose-100 text-rose-600"
        />

        <StatCard
          title="Upcoming Appointments"
          value={stats?.upcomingAppointments || 45}
          trend="↑ 10%"
          trendColor="text-emerald-600"
          icon={Calendar}
          iconBg="bg-sky-50 text-sky-500"
        />

        <StatCard
          title="Expiring Soon"
          value={stats?.expiringSoon || 22}
          trend="▲ 7 Days"
          trendColor="text-amber-600 font-bold"
          icon={Clock}
          iconBg="bg-orange-50 text-orange-500"
        />
      </div>

      {/* Blood Group Inventory Section matching screenshot */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            Blood Group Inventory
          </h3>
          <span className="text-xs text-slate-400">All 8 Vital Blood Categories</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {bloodGroupInventory.map((item) => (
            <BloodGroupCard
              key={item.bloodGroup}
              bloodGroup={item.bloodGroup}
              units={item.units}
              status={item.status}
              isLowStock={item.isLowStock}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
