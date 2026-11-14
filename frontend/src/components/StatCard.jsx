import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendColor = 'text-emerald-600', iconBg = 'bg-rose-50 text-rose-500' }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
          <span className={trendColor}>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
