import React, { useState, useEffect } from 'react';
import { Tent, Plus, Calendar, Clock, MapPin, Users, Phone, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/Modal';
import api from '../../services/api';

const DonationCampsPage = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organizerName: '',
    date: '',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    venue: '',
    city: 'Surat',
    pincode: '395009',
    contactPhone: '',
    targetUnits: 150,
  });

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const res = await api.get('/camps');
      if (res.data.success) {
        setCamps(res.data.camps);
      }
    } catch (err) {
      console.error('Error fetching camps', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/camps', formData);
      setModalOpen(false);
      fetchCamps();
    } catch (err) {
      alert(err.response?.data?.message || 'Error scheduling camp');
    }
  };

  const handleRegisterDonor = async (campId) => {
    try {
      await api.post(`/camps/${campId}/register`);
      alert('Successfully registered for this donation camp!');
      fetchCamps();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Donation Camps & Community Drives</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize and participate in verified public blood donation events
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#115E59] hover:bg-[#0F766E] text-white font-bold rounded-xl text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Camp</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading camps...</div>
        ) : (
          camps.map((camp) => (
            <div
              key={camp._id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-bold rounded-full border border-teal-200">
                    {camp.status}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-2">{camp.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Organized by {camp.organizerName}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Tent className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{camp.description}</p>

              <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-700" />
                  <span className="font-semibold text-slate-800">
                    {new Date(camp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-slate-400">•</span>
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{camp.startTime} - {camp.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{camp.venue}, {camp.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{camp.contactPhone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-4 h-4 text-teal-700" />
                  <span>{camp.registeredDonors?.length || 0} registered donors</span>
                </div>

                <button
                  onClick={() => handleRegisterDonor(camp._id)}
                  className="px-4 py-1.5 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-lg text-xs font-bold transition"
                >
                  Register to Donate
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Camp Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Donation Camp"
      >
        <form onSubmit={handleCreateCamp} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
              Camp Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mega City Blood Drive"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                placeholder="9876540001"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
              Venue Address
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Indoor Stadium, Surat"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-lg text-sm font-bold shadow transition"
          >
            Publish Donation Camp
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default DonationCampsPage;
