import React, { useState, useEffect } from 'react';
import {
  Search,
  Droplet,
  CheckCircle2,
  Clock,
  Heart,
  Plus,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';
import api from '../../services/api';

const RecipientDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchGroup, setSearchGroup] = useState('B+');
  const [searchCity, setSearchCity] = useState('Surat');
  const [modalOpen, setModalOpen] = useState(false);

  const [requestForm, setRequestForm] = useState({
    patientName: '',
    bloodGroup: 'B+',
    units: 1,
    urgency: 'Medium',
    hospitalName: '',
    contactPhone: '',
    notes: '',
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recipients/dashboard');
      if (res.data.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Error fetching recipient dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/requests', requestForm);
      setModalOpen(false);
      fetchDashboard();
      alert('Blood request submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting request');
    }
  };

  const { stats, recentRequests, availableBloodBanks } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Top 3 Stat Cards matching Page 2 screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              My Requests
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
              {stats?.totalRequests || 3}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Droplet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Successful
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
              {stats?.successfulRequests || 2}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Pending
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
              {stats?.pendingRequests || 1}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Content Grid matching Page 2 screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Search Blood + Recent Requests */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Search Blood Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800">Search Blood</h3>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Request</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={searchGroup}
                onChange={(e) => setSearchGroup(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>

              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
              >
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>

              <Link
                to={`/admin/map?city=${searchCity}&bloodGroup=${searchGroup}`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </Link>
            </div>
          </div>

          {/* My Recent Requests Table matching screenshot */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              My Recent Requests
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {(recentRequests || []).length === 0 ? (
                <p className="text-slate-400 py-4 text-center">No recent blood requests.</p>
              ) : (
                recentRequests.map((req) => (
                  <div key={req._id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-800">{req.requestId || '#BR001'}</span>
                      <span className="ml-2 font-bold text-teal-800">[{req.bloodGroup}]</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{req.patientName}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Fulfilled'
                            ? 'bg-teal-50 text-teal-800'
                            : req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : req.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available Blood Banks matching screenshot */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Available Blood Banks
            </h3>

            <div className="space-y-3">
              {(availableBloodBanks || []).slice(0, 3).map((bank) => (
                <div
                  key={bank.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-teal-700" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{bank.name}</h4>
                      <p className="text-[11px] text-slate-500">{bank.city} - {bank.availableUnits || 100} units</p>
                    </div>
                  </div>

                  <Link
                    to="/admin/map"
                    className="px-3 py-1 bg-white border border-slate-200 text-teal-800 hover:bg-teal-50 rounded-lg text-xs font-bold transition"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Donate Blood Save Lives Banner matching Page 2 screenshot */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#E2F7F2] to-[#C9EEE4] p-8 rounded-3xl border border-teal-100 text-center flex flex-col items-center justify-between min-h-[460px]">
          <div>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white shadow-md flex items-center justify-center text-red-500 mb-4">
              <Heart className="w-10 h-10 fill-red-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800">Donate Blood</h3>
            <p className="text-2xl font-extrabold text-red-600 mt-1">Save Lives</p>
            <p className="text-xs text-slate-600 mt-3 max-w-[220px] mx-auto leading-relaxed">
              Every voluntary blood donation can save up to 3 patient lives in emergencies.
            </p>
          </div>

          <Link
            to="/admin/camps"
            className="w-full py-3 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Find Donation Camps
          </Link>
        </div>

      </div>

      {/* Submit Request Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Blood Request"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">
              Patient Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={requestForm.patientName}
              onChange={(e) => setRequestForm({ ...requestForm, patientName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Blood Group
              </label>
              <select
                value={requestForm.bloodGroup}
                onChange={(e) => setRequestForm({ ...requestForm, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Units Required
              </label>
              <input
                type="number"
                min="1"
                required
                value={requestForm.units}
                onChange={(e) => setRequestForm({ ...requestForm, units: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Urgency Level
              </label>
              <select
                value={requestForm.urgency}
                onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={requestForm.contactPhone}
                onChange={(e) => setRequestForm({ ...requestForm, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">
              Hospital Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Civil Hospital Surat"
              value={requestForm.hospitalName}
              onChange={(e) => setRequestForm({ ...requestForm, hospitalName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-lg text-sm font-bold shadow transition"
          >
            Submit Request
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default RecipientDashboard;
