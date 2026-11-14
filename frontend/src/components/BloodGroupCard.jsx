import React from 'react';
import { Check, AlertTriangle, Droplet } from 'lucide-react';

const BloodGroupCard = ({ bloodGroup, units, status = 'Normal', isLowStock = false }) => {
  const isAlert = isLowStock || status === 'Low Stock' || status === 'Critical';

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-teal-200 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Droplet className={`w-4 h-4 ${isAlert ? 'fill-red-500 text-red-500' : 'fill-teal-600 text-teal-600'}`} />
          <span className="text-xl font-extrabold text-slate-800">{bloodGroup}</span>
        </div>
      </div>

      <div className="my-2">
        <span className="text-sm font-semibold text-slate-600">{units} units</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold">
        {isAlert ? (
          <span className="text-rose-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock</span>
          </span>
        ) : (
          <span className="text-emerald-600 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Normal</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default BloodGroupCard;
