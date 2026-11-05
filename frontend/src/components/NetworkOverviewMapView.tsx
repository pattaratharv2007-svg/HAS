import React, { useState } from 'react';
import { MapPin, Navigation, Building2, Search, Filter, ShieldCheck, Ambulance } from 'lucide-react';
import { Hospital, AmbulanceUnit } from '../types';

interface NetworkOverviewMapViewProps {
  hospitals: Hospital[];
  ambulances: AmbulanceUnit[];
  onSelectHospital?: (hospital: Hospital) => void;
}

export const NetworkOverviewMapView: React.FC<NetworkOverviewMapViewProps> = ({
  hospitals,
  ambulances,
  onSelectHospital,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const hospitalList = hospitals.length > 0 ? hospitals : [
    { id: 1, name: 'City General Hospital', code: 'CGH-01', operationalStatus: 'OPERATIONAL' as const, address: 'Central City • 2.4 km', latitude: 12.9716, longitude: 77.5946, contactPhone: '+1-800-555-0101', contactEmail: 'ops@citygeneral.org', participationStatus: 'ACTIVE', lastStatusUpdate: new Date().toISOString() },
    { id: 2, name: 'Riverside Medical Center', code: 'RMC-03', operationalStatus: 'HIGH_WORKLOAD' as const, address: 'South Sector • 5.1 km', latitude: 12.955, longitude: 77.58, contactPhone: '+1-800-555-0103', contactEmail: 'er@riverdalemed.org', participationStatus: 'ACTIVE', lastStatusUpdate: new Date().toISOString() },
    { id: 3, name: 'Sunrise Hospital', code: 'SH-04', operationalStatus: 'OPERATIONAL' as const, address: 'East Corridor • 7.1 km', latitude: 12.99, longitude: 77.62, contactPhone: '+1-800-555-0104', contactEmail: 'info@sunrise.org', participationStatus: 'ACTIVE', lastStatusUpdate: new Date().toISOString() },
    { id: 4, name: 'Metro Memorial Hospital', code: 'MMH-02', operationalStatus: 'LIMITED_CAPACITY' as const, address: 'North District • 10.3 km', latitude: 12.981, longitude: 77.6, contactPhone: '+1-800-555-0102', contactEmail: 'ops@metromemorial.org', participationStatus: 'ACTIVE', lastStatusUpdate: new Date().toISOString() },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return { text: 'Operational', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'HIGH_WORKLOAD':
        return { text: 'High Load', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'LIMITED_CAPACITY':
        return { text: 'Limited', bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
      default:
        return { text: 'Critical', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
    }
  };

  const filteredHospitals = hospitalList.filter(h => {
    if (selectedStatus !== 'ALL' && h.operationalStatus !== selectedStatus) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.address.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Network Overview & Map</h2>
          <p className="text-xs text-slate-500 font-medium">
            Live geographic GIS view of participating hospital facilities, ambulances en route & regional bed availability
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="HIGH_WORKLOAD">High Workload</option>
            <option value="LIMITED_CAPACITY">Limited Capacity</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Map Visual on Left, Hospital List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 relative overflow-hidden h-[540px] flex flex-col justify-between border border-slate-800 shadow-lg">
          {/* Stylized Grid/Road Network Graphics */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>

          {/* Hospital Map Nodes */}
          <div className="relative z-10 w-full h-full">
            {/* Hospital Pin 1 (City General) */}
            <div className="absolute top-24 left-28 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-white text-[11px] font-bold mt-1.5 whitespace-nowrap shadow-md">
                City General Hospital
                <span className="block text-[9px] text-emerald-400 font-normal">Operational • 74 Beds</span>
              </div>
            </div>

            {/* Hospital Pin 2 (Riverside) */}
            <div className="absolute bottom-28 left-48 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-white text-[11px] font-bold mt-1.5 whitespace-nowrap shadow-md">
                Riverside Medical Center
                <span className="block text-[9px] text-amber-400 font-normal">High Load • 8 Beds</span>
              </div>
            </div>

            {/* Hospital Pin 3 (Metro) */}
            <div className="absolute top-36 right-36 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center text-orange-300 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-white text-[11px] font-bold mt-1.5 whitespace-nowrap shadow-md">
                Metro Memorial Hospital
                <span className="block text-[9px] text-orange-400 font-normal">Limited • 5 Beds</span>
              </div>
            </div>

            {/* Ambulance Moving Node */}
            <div className="absolute top-44 left-64 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/50 animate-pulse">
                <Ambulance className="w-4 h-4" />
              </div>
              <div className="bg-sky-950/90 px-2 py-0.5 rounded text-[10px] font-bold text-sky-200 border border-sky-600 mt-1">
                AMB-104 (12m to CGH)
              </div>
            </div>
          </div>

          {/* Map Status Legend at Bottom */}
          <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-white">Status Key:</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Operational</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>High Load</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <span>Limited</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>Critical</span>
              </span>
            </div>
          </div>
        </div>

        {/* Hospital Facility Cards List on Right */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-[540px]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Participating Hospitals</h3>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                {filteredHospitals.length} Facilities
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
              {filteredHospitals.map((hosp) => {
                const badge = getStatusBadge(hosp.operationalStatus);
                return (
                  <div
                    key={hosp.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{hosp.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{hosp.address}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.text}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span>ED: <strong className="text-slate-800">Available</strong></span>
                      <span>ICU: <strong className="text-emerald-600">3 Beds</strong></span>
                      <button
                        onClick={() => onSelectHospital?.(hosp)}
                        className="text-xs font-bold text-sky-600 hover:text-sky-800"
                      >
                        View &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t text-center text-xs text-slate-400">
            Emergency network auto-dispatches alerts based on road proximity.
          </div>
        </div>
      </div>
    </div>
  );
};

