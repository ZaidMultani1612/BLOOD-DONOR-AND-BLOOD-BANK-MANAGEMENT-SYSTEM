import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Building2,
  Users,
  Navigation,
  Droplet,
  Layers,
  List,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';
import Modal from '../../components/Modal';

// Custom Leaflet blood marker icon
const customBloodIcon = new L.DivIcon({
  className: 'custom-blood-marker',
  html: `<div style="background-color:#EF4444; width:30px; height:30px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.3); border:2px solid white;"><div style="transform:rotate(45deg); color:white; font-size:12px; font-weight:bold;">🩸</div></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -28],
});

const BloodStockMapPage = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All Blood Groups');
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  const fetchBloodBanks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bloodbanks', {
        params: {
          search,
          city: cityFilter !== 'All Cities' ? cityFilter : undefined,
          bloodGroup: bloodGroupFilter !== 'All Blood Groups' ? bloodGroupFilter : undefined,
        },
      });
      if (res.data.success) {
        setBloodBanks(res.data.bloodBanks);
      }
    } catch (err) {
      console.error('Error fetching blood banks for map', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, [cityFilter, bloodGroupFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBloodBanks();
  };

  // Center on Surat
  const mapCenter = [21.1702, 72.8311];

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar matching screenshot */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col sm:flex-row gap-3 items-center bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs"
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by city, pincode or blood bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-teal-500"
        >
          <option value="All Cities">All Cities</option>
          <option value="Surat">Surat</option>
          <option value="Vadodara">Vadodara</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Rajkot">Rajkot</option>
        </select>

        <select
          value={bloodGroupFilter}
          onChange={(e) => setBloodGroupFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-teal-500"
        >
          <option value="All Blood Groups">All Blood Groups</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold shadow transition"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Find Nearby</span>
        </button>
      </form>

      {/* Four Stat Pills matching screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center font-bold">
            <Droplet className="w-5 h-5 fill-red-500 text-red-500" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">25</h4>
            <p className="text-xs text-slate-400 font-medium">Blood Banks</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">1200+</h4>
            <p className="text-xs text-slate-400 font-medium">Total Units</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">50+</h4>
            <p className="text-xs text-slate-400 font-medium">Active Donors</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">12</h4>
            <p className="text-xs text-slate-400 font-medium">Cities Covered</p>
          </div>
        </div>
      </div>

      {/* Main Split Section matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Map Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-slate-800">Blood Banks Near You</h3>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                  viewMode === 'map' ? 'bg-[#115E59] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                  viewMode === 'list' ? 'bg-[#115E59] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Box */}
          <div className="h-[460px] w-full rounded-xl overflow-hidden border border-slate-100 relative shadow-inner">
            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {bloodBanks.map((bank) => {
                const lat = bank.coordinates?.lat || 21.1702;
                const lng = bank.coordinates?.lng || 72.8311;
                return (
                  <Marker
                    key={bank.id}
                    position={[lat, lng]}
                    icon={customBloodIcon}
                  >
                    <Popup>
                      <div className="p-1 space-y-2 text-xs">
                        <h4 className="font-bold text-slate-900 text-sm">{bank.name}</h4>
                        <p className="text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" />
                          <span>{bank.area || bank.city}, Surat</span>
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'O+'].map((bg) => (
                            <span key={bg} className="px-1.5 py-0.5 bg-slate-100 text-[10px] font-bold rounded">
                              {bg}
                            </span>
                          ))}
                        </div>
                        <p className="text-emerald-700 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{bank.totalUnits || 300} Units Available</span>
                        </p>
                        <button
                          onClick={() => setSelectedBank(bank)}
                          className="w-full mt-1 py-1.5 bg-[#115E59] text-white text-center font-bold rounded text-xs"
                        >
                          View Details →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Right: Available Blood Banks List matching screenshot */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-800">Available Blood Banks</h3>
            </div>
            <span className="text-xs text-teal-700 font-semibold cursor-pointer hover:underline">
              View All →
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {bloodBanks.map((bank, index) => (
              <div
                key={bank.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-teal-200 transition shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">
                    {bank.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>{bank.area || 'City Center'}, {bank.city}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {['A+', 'A-', 'B+', 'B-'].slice(0, 3).map((bg) => (
                      <span key={bg} className="px-1.5 py-0.5 bg-white border border-slate-200 text-[9px] font-bold text-slate-700 rounded">
                        {bg}
                      </span>
                    ))}
                    <span className="px-1.5 py-0.5 bg-teal-50 text-[9px] font-bold text-teal-800 rounded">
                      +4
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-1 rounded-lg text-center mb-1.5">
                    <span className="block text-xs font-extrabold">{bank.totalUnits || 300}</span>
                    <span className="block text-[9px] font-semibold uppercase">Units</span>
                  </div>
                  <button
                    onClick={() => setSelectedBank(bank)}
                    className="px-3 py-1 bg-[#115E59] hover:bg-[#0F766E] text-white rounded text-[11px] font-bold transition"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Blood Bank Details Modal */}
      {selectedBank && (
        <Modal
          isOpen={!!selectedBank}
          onClose={() => setSelectedBank(null)}
          title={selectedBank.name}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-teal-50 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-800">{selectedBank.name}</p>
                <p className="text-slate-500 mt-1">{selectedBank.address}</p>
                <p className="text-slate-600 font-semibold mt-1">📞 {selectedBank.phone}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-teal-800">{selectedBank.totalUnits || 300}</span>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Total Stock Units</p>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-700 mb-2 uppercase tracking-wide">Available Blood Groups</h5>
              <div className="grid grid-cols-4 gap-2 text-center">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <div key={bg} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 text-sm block">{bg}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Available</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-[11px]">
              ⚠️ Transfusion suitability must be verified by hospital blood banking professionals.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BloodStockMapPage;
