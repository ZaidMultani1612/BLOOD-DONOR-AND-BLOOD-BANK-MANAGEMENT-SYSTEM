import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, CheckCircle2, XCircle, Plus, User, Building2 } from 'lucide-react';
import Modal from '../../components/Modal';
import api from '../../services/api';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    bloodBankId: '',
    appointmentDate: '',
    timeSlot: '10:00 AM - 11:00 AM',
    notes: '',
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const [resApp, resBanks] = await Promise.all([
        api.get('/donors/dashboard'),
        api.get('/bloodbanks'),
      ]);
      if (resApp.data.success) {
        setAppointments(resApp.data.appointments || []);
      }
      if (resBanks.data.success) {
        setBloodBanks(resBanks.data.bloodBanks || []);
      }
    } catch (err) {
      console.error('Error fetching appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/donors/appointments', formData);
      setModalOpen(false);
      fetchAppointments();
      alert('Appointment scheduled successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error booking appointment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Donation Appointments</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage scheduled donor collection slots and verification
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#115E59] hover:bg-[#0F766E] text-white font-bold rounded-xl text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Blood Bank</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Time Slot</th>
                <th className="py-3.5 px-6">Blood Group</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">No scheduled appointments.</td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-800">
                      {a.bloodBank?.name || 'Surat City Blood Bank'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {new Date(a.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {a.timeSlot}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-teal-800">
                      {a.bloodGroup}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Donation Appointment"
      >
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
              Select Blood Bank
            </label>
            <select
              required
              value={formData.bloodBankId}
              onChange={(e) => setFormData({ ...formData, bloodBankId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="">-- Choose Blood Bank --</option>
              {bloodBanks.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
              Appointment Date
            </label>
            <input
              type="date"
              required
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
              Preferred Time Slot
            </label>
            <select
              value={formData.timeSlot}
              onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-lg text-sm font-bold shadow transition"
          >
            Confirm Appointment Booking
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
