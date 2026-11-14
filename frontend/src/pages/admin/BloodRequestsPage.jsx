import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Modal from '../../components/Modal';
import api from '../../services/api';

const BloodRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All Blood Groups');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusNote, setStatusNote] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/requests', {
        params: {
          search,
          status: statusFilter !== 'All Status' ? statusFilter : undefined,
          bloodGroup: bloodGroupFilter !== 'All Blood Groups' ? bloodGroupFilter : undefined,
        },
      });
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Error fetching blood requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [search, statusFilter, bloodGroupFilter]);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedRequest) return;
    try {
      await api.put(`/requests/${selectedRequest._id}/status`, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus}`,
      });
      setSelectedRequest(null);
      setStatusNote('');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'High':
      case 'Critical':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Processing':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Fulfilled':
        return 'bg-teal-50 text-teal-800 border-teal-200 font-bold';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions matching screenshot */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:ring-2 focus:ring-teal-500"
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Processing">Processing</option>
            <option value="Fulfilled">Fulfilled</option>
            <option value="Rejected">Rejected</option>
          </select>

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
        </div>

        {/* Export Button matching screenshot */}
        <button
          onClick={() => alert('Exporting Blood Requests dataset to CSV...')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Requests Table matching screenshot */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Patient Name</th>
                <th className="py-3.5 px-6">Blood Group</th>
                <th className="py-3.5 px-6">Units</th>
                <th className="py-3.5 px-6">Urgency</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No requests found.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-slate-800">{r.patientName}</p>
                      <p className="text-[11px] text-slate-400">{r.requestId || '#BR001'} • {r.hospitalName || 'General Hospital'}</p>
                    </td>
                    <td className="py-3.5 px-6 font-extrabold text-slate-800">
                      {r.bloodGroup}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-700">
                      {r.units}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getUrgencyBadge(r.urgency)}`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedRequest(r)}
                        className="p-1.5 text-teal-600 hover:bg-teal-50 rounded transition"
                        title="View / Manage Request"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1-{requests.length} of 45 requests</span>
          <div className="flex items-center gap-1">
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-400">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 py-1 bg-teal-700 text-white font-bold rounded text-xs">1</span>
            <button className="px-2.5 py-1 hover:bg-slate-50 rounded text-xs text-slate-600">2</button>
            <button className="px-2.5 py-1 hover:bg-slate-50 rounded text-xs text-slate-600">3</button>
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal View / Manage Blood Request */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Blood Request ${selectedRequest.requestId}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-teal-50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-slate-800">{selectedRequest.patientName}</p>
                <p className="text-slate-500 mt-0.5">Hospital: {selectedRequest.hospitalName || 'Civil Hospital'}</p>
                <p className="text-slate-500">Contact: {selectedRequest.contactPhone}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-teal-800">{selectedRequest.bloodGroup}</span>
                <p className="text-[11px] font-semibold text-slate-600">{selectedRequest.units} units required</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Update Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Approved')}
                  className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Processing')}
                  className="py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition"
                >
                  Processing
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Fulfilled')}
                  className="py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-lg transition"
                >
                  Fulfill
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Rejected')}
                  className="py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BloodRequestsPage;
