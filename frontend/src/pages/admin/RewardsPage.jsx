import React, { useState, useEffect } from 'react';
import { Award, Trophy, Medal, Star, ShieldCheck, Heart } from 'lucide-react';
import api from '../../services/api';

const RewardsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await api.get('/rewards');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching rewards', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-teal-700/70 text-teal-200 text-xs font-semibold rounded-full uppercase tracking-wider">
            Verified Impact System
          </span>
          <h2 className="text-xl font-extrabold mt-2">Donor Rewards & Community Leaderboard</h2>
          <p className="text-xs text-teal-100/80 mt-0.5 max-w-xl">
            Points and honors are granted strictly upon verified blood donation sessions to uphold safety and recognition standards.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
          <Trophy className="w-8 h-8 text-amber-300" />
          <div>
            <p className="text-[11px] text-teal-200 uppercase font-semibold">1 Verified Donation</p>
            <p className="text-lg font-black text-white">+50 Reward Pts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leaderboard Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800">Top Donors Leaderboard</h3>
            </div>
            <span className="text-xs text-slate-400">All-time life savers</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {(data?.leaderboard || []).map((donor) => (
              <div
                key={donor.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/60 transition px-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      donor.rank === 1
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : donor.rank === 2
                        ? 'bg-slate-200 text-slate-700'
                        : donor.rank === 3
                        ? 'bg-amber-700/20 text-amber-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {donor.rank}
                  </div>

                  <div>
                    <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <span>{donor.name}</span>
                      <span className="px-1.5 py-0.2 bg-red-50 text-red-600 font-extrabold text-[10px] rounded">
                        {donor.bloodGroup}
                      </span>
                    </p>
                    <p className="text-slate-400 text-[11px]">{donor.city} • {donor.donationCount} verified donations</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-teal-800 text-sm block">
                    {donor.rewardPoints} pts
                  </span>
                  <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold text-[10px] rounded-full">
                    {donor.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-800">Honor Badges & Milestones</h3>
          </div>

          <div className="space-y-3">
            {(data?.availableBadges || []).map((badge) => (
              <div
                key={badge.name}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-teal-200 transition flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                  <Star className="w-5 h-5 fill-teal-600 text-teal-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-xs">{badge.name}</h4>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                      {badge.points} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
