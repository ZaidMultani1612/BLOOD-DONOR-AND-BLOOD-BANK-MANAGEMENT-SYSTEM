import React, { useState, useEffect } from 'react';
import {
  Heart,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const DonorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/donors/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching donor dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonorData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, donor, donations, appointments, upcomingCamps } = data || {};

  return (
    <div className="space-y-6">
      {/* Donor Card Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-teal-700 text-teal-200 text-xs font-semibold rounded-full uppercase tracking-wider">
            Verified Life Saver
          </span>
          <h2 className="text-xl font-extrabold mt-2">Welcome Back, Donor!</h2>
          <p className="text-xs text-teal-100/80 mt-0.5">
            Your blood group: <span className="font-extrabold text-white text-sm bg-teal-700/80 px-2 py-0.5 rounded">{donor?.bloodGroup || 'O+'}</span> • Registered City: {donor?.city || 'Surat'}
          </p>
        </div>

        <Link
          to="/admin/appointments"
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl text-xs shadow transition"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment</span>
        </Link>
      </div>

      {/* 4 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
            <span>Total Donations</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.totalDonations || 0}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Verified Sessions</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
            <span>Reward Points</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.rewardPoints || 0}</h3>
          <p className="text-xs text-teal-700 font-semibold mt-1">Life Saver Rank</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
            <span>Lives Saved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats?.livesSaved || 0}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Estimated Impact</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
            <span>Next Eligible Date</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mt-2">
            {typeof stats?.nextEligibleDate === 'string'
              ? stats.nextEligibleDate
              : new Date(stats?.nextEligibleDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
          </h3>
          <p className="text-xs text-teal-700 font-semibold mt-1">Health & Recovery Window</p>
        </div>
      </div>

      {/* Grid: Donations History & Upcoming Camps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
            Verified Donation Records
          </h3>

          <div className="space-y-3">
            {(donations || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No donations recorded yet.</p>
            ) : (
              donations.map((d) => (
                <div
                  key={d._id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex justify-between items-center text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-800">{d.bloodBank?.name || 'Surat City Blood Bank'}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(d.donationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-teal-800">+{d.pointsAwarded || 50} pts</span>
                    <span className="block text-[10px] text-emerald-600 font-bold uppercase">{d.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Donation Camps */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Nearby Donation Camps</h3>
            <Link to="/admin/camps" className="text-xs text-teal-700 font-bold hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {(upcomingCamps || []).map((camp) => (
              <div
                key={camp._id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5 text-xs"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">{camp.title}</h4>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-bold text-[10px] rounded-full">
                    {camp.city}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span>{camp.venue}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
