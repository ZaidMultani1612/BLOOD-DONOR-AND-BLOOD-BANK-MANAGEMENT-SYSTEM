import React, { useState, useEffect } from 'react';
import { Hospital, Droplet, Clock, CheckCircle2, Plus, MessageSquare, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';
import api from '../../services/api';

const HospitalDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [requestForm, setRequestForm] = useState({
    patientName: '',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'High',
    hospitalName: 'Civil Hospital Surat',
    contactPhone: '9876530001',
    notes: '',
  });

  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hospitals/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching hospital dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/requests', requestForm);
      setModalOpen(false);
      fetchHospitalData();
      alert('Hospital blood request broadcasted!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, hospital, requests } = data || {};

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-teal-700 text-teal-200 text-xs font-semibold rounded-full uppercase tracking-wider">
            Verified Hospital Account
          </span>
          <h2 className="text-xl font-extrabold mt-2">{hospital?.name || 'Civil Hospital Surat'}</h2>
          <p className="text-xs text-teal-100/80 mt-0.5">
            📍 {hospital?.address || 'Majura Gate, Surat'} • 📞 {hospital?.phone}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/chats"
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl text-xs shadow transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Bank Chat</span>
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl text-xs shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Emergency Request</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Total Requests
          </span>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
            {stats?.totalRequests || 0}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Pending Dispatch
          </span>
          <h3 className="text-3xl font-extrabold text-amber-600 mt-1">
            {stats?.pendingRequests || 0}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Fulfilled Batches
          </span>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">
            {stats?.fulfilledRequests || 0}
          </h3>
        </div>
      </div>

      {/* Hospital Request Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
          Blood Request Log
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {(requests || []).length === 0 ? (
            <p className="text-slate-400 py-6 text-center">No blood requests submitted yet.</p>
          ) : (
            requests.map((r) => (
              <div key={r._id} className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{r.patientName} <span className="text-teal-800">[{r.bloodGroup}]</span></p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{r.requestId} • {r.units} units required</p>
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700">
                    {r.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Emergency Request Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Hospital Blood Unit Request"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">Patient Name</label>
            <input
              type="text"
              required
              value={requestForm.patientName}
              onChange={(e) => setRequestForm({ ...requestForm, patientName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">Blood Group</label>
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
              <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">Units</label>
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

          <button
            type="submit"
            className="w-full py-2.5 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-lg text-sm font-bold shadow transition"
          >
            Submit Blood Request
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default HospitalDashboard;
