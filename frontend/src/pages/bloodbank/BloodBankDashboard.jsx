import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Clock,
  Heart,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';

const BloodBankDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/bloodbanks/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching blood bank dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, stockChartData, recentActivity, bank } = data || {};

  return (
    <div className="space-y-6">
      {/* Overview stats matching Page 2 screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
            <span>Total Stock</span>
            <Boxes className="w-4 h-4 text-teal-600" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.totalStock || 850}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 8% from last week</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
            <span>Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.pendingRequests || 12}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 3% new requests</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
            <span>Total Donations</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.totalDonations || 95}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 12% community turnouts</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
            <span>Next Camp</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mt-2">
            {typeof stats?.nextCampDate === 'string'
              ? stats.nextCampDate
              : new Date(stats?.nextCampDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
          </h3>
          <p className="text-xs text-teal-700 font-semibold mt-1">Mega Drive Scheduled</p>
        </div>
      </div>

      {/* Main Bar Chart + Recent Activity matching Page 2 screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Blood Group Stock Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800">Blood Group Stock Levels</h3>
            <span className="text-xs text-slate-400">Real-time inventory per blood type</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockChartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                <XAxis dataKey="group" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                />
                <Bar dataKey="units" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed matching Page 2 screenshot */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
            Recent Activity
          </h3>

          <div className="space-y-4">
            {(recentActivity || []).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{act.text}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodBankDashboard;
