import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Phone, Mail, MapPin } from 'lucide-react';
import api from '../../services/api';

const RecipientsPage = () => {
  const [recipients, setRecipients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setRecipients([
      { id: 1, name: 'John Doe', email: 'john@recipient.com', phone: '9876520001', location: 'Surat', bloodGroup: 'B+', requestsCount: 3, status: 'Active' },
      { id: 2, name: 'Kavita Joshi', email: 'kavita@patient.org', phone: '9876599902', location: 'Surat', bloodGroup: 'AB-', requestsCount: 1, status: 'Active' },
      { id: 3, name: 'Vikram Mehta', email: 'vikram@patient.org', phone: '9876599903', location: 'Surat', bloodGroup: 'A-', requestsCount: 2, status: 'Active' },
      { id: 4, name: 'Sneha Patel', email: 'sneha@mail.com', phone: '9876500122', location: 'Vadodara', bloodGroup: 'O+', requestsCount: 1, status: 'Active' },
    ]);
  }, []);

  const filtered = recipients.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search recipients by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filtered.length} Registered Recipients</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Blood Group</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Requests Made</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-6 font-bold text-slate-800">
                    <p>{r.name}</p>
                    <p className="text-[11px] text-slate-400">{r.email}</p>
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-teal-800">
                    {r.bloodGroup}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">
                    {r.location}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">
                    {r.phone}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    {r.requestsCount}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecipientsPage;
