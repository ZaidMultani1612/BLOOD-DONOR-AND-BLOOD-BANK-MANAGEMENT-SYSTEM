import React, { useState, useEffect } from 'react';
import { Building2, Search, Phone, Mail, MapPin } from 'lucide-react';
import api from '../../services/api';

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In our backend seed, Civil Hospital was created
    const dummyHospitals = [
      { id: 1, name: 'Civil Hospital Surat', email: 'civil@hospital.com', phone: '9876530001', address: 'Majura Gate, Surat', beds: 800, status: 'Active' },
      { id: 2, name: 'Apollo Trauma Hospital', email: 'apollo@surat.com', phone: '9876541122', address: 'Ring Road, Surat', beds: 450, status: 'Active' },
      { id: 3, name: 'Sunshine Multispeciality', email: 'sunshine@care.org', phone: '9876599112', address: 'Ghod Dod Road, Surat', beds: 300, status: 'Active' },
      { id: 4, name: 'Life Care Emergency Center', email: 'lifecare@hosp.com', phone: '9876599334', address: 'VIP Road, Vesu, Surat', beds: 250, status: 'Active' },
    ];
    setHospitals(dummyHospitals);
    setLoading(false);
  }, []);

  const filtered = hospitals.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search hospitals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filtered.length} Registered Hospitals</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((h) => (
          <div key={h.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{h.name}</h4>
                  <p className="text-[11px] text-emerald-600 font-semibold">{h.status} Institution</p>
                </div>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{h.beds} Beds</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{h.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{h.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{h.email}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalsPage;
