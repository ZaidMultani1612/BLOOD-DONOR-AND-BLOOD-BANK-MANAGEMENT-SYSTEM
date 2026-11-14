import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Phone, Hospital, MapPin, CheckCircle, Clock } from 'lucide-react';
import Modal from '../../components/Modal';
import api from '../../services/api';

const EmergencyPage = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O-',
    units: 2,
    hospitalName: '',
    location: '',
    city: 'Surat',
    contactPhone: '',
    urgencyLevel: 'Critical',
    additionalNotes: '',
  });

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/emergencies');
      if (res.data.success) {
        setEmergencies(res.data.emergencies);
      }
    } catch (err) {
      console.error('Error fetching emergencies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await api.post('/emergencies', formData);
      setModalOpen(false);
      fetchEmergencies();
    } catch (err) {
      alert(err.response?.data?.message || 'Error broadcasting emergency');
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.put(`/emergencies/${id}/resolve`);
      fetchEmergencies();
    } catch (err) {
      alert('Error resolving emergency');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-red-50 border border-red-200 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-red-900">Emergency SOS Response System</h2>
            <p className="text-xs text-red-700">
              Active urgent blood requests requiring immediate community and bank dispatch
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-red-600/30 transition active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast Urgent SOS</span>
        </button>
      </div>

      {/* Emergencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            Checking emergency signals...
          </div>
        ) : emergencies.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Active Emergencies</h3>
            <p className="text-xs text-slate-500 mt-1">
              All blood requirements are currently stabilized within normal procedures.
            </p>
          </div>
        ) : (
          emergencies.map((em) => (
            <div
              key={em._id}
              className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>

              <div className="flex justify-between items-start pl-1">
                <div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-extrabold uppercase rounded-full">
                    {em.urgencyLevel}
                  </span>
                  <h4 className="text-base font-bold text-slate-800 mt-1.5">
                    {em.patientName}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Hospital className="w-3.5 h-3.5 text-slate-400" />
                    <span>{em.hospitalName}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-red-600 block">
                    {em.bloodGroup}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {em.units} Units
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600 pl-3">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{em.location}, {em.city}</span>
                </p>
                <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{em.contactPhone}</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Active Now</span>
                </span>

                <button
                  onClick={() => handleResolve(em._id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast SOS Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Emergency SOS Request"
      >
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Patient Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Blood Group Needed
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Required Units
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
              Hospital & Location
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Civil Hospital, Majura Gate, Surat"
              value={formData.hospitalName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hospitalName: e.target.value,
                  location: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/30 transition"
          >
            Send High-Priority Broadcast
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EmergencyPage;
