import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import Modal from '../../components/Modal';
import api from '../../services/api';

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All Blood Groups');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewDonor, setViewDonor] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'A+',
    location: 'Surat',
    address: '',
  });

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/donors', {
        params: {
          search,
          bloodGroup: bloodGroupFilter,
          location: locationFilter,
        },
      });
      if (res.data.success) {
        setDonors(res.data.donors);
      }
    } catch (err) {
      console.error('Error fetching donors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [search, bloodGroupFilter, locationFilter]);

  const handleAddDonor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/donors', formData);
      setModalOpen(false);
      fetchDonors();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding donor');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions matching screenshot */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search donors by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Blood Group Filter */}
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:ring-2 focus:ring-teal-500"
          >
            <option value="All Blood Groups">All Blood Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:ring-2 focus:ring-teal-500"
          >
            <option value="All Locations">All Locations</option>
            <option value="Surat">Surat</option>
            <option value="Vadodara">Vadodara</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Rajkot">Rajkot</option>
          </select>
        </div>

        {/* Add Donor Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Donor</span>
        </button>
      </div>

      {/* Donors Table matching screenshot */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Blood Group</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Loading donors...
                  </td>
                </tr>
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No donors matching the criteria found.
                  </td>
                </tr>
              ) : (
                donors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                          {donor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{donor.name}</p>
                          <p className="text-[11px] text-slate-400">{donor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">
                      {donor.bloodGroup}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {donor.location}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {donor.phone}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {donor.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setViewDonor(donor)}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 rounded transition"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1-{donors.length} of {donors.length} donors</span>
          <div className="flex items-center gap-1">
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-400">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 py-1 bg-teal-700 text-white font-bold rounded text-xs">
              1
            </span>
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Add Donor */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Donor"
      >
        <form onSubmit={handleAddDonor} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Patel"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="name@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Phone
              </label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Location
              </label>
              <input
                type="text"
                required
                placeholder="Surat"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-lg text-sm font-bold shadow transition"
          >
            Create Donor Profile
          </button>
        </form>
      </Modal>

      {/* Modal View Donor Details */}
      {viewDonor && (
        <Modal
          isOpen={!!viewDonor}
          onClose={() => setViewDonor(null)}
          title="Donor Details"
        >
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-lg">
                {viewDonor.bloodGroup}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{viewDonor.name}</h4>
                <p className="text-xs text-slate-500">{viewDonor.email} • {viewDonor.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 uppercase tracking-wide block font-semibold mb-1">City</span>
                <span className="font-bold text-slate-700">{viewDonor.location}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 uppercase tracking-wide block font-semibold mb-1">Lifetime Donations</span>
                <span className="font-bold text-slate-700">{viewDonor.donationCount || 0} times</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DonorsPage;
