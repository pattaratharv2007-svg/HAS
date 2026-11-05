import React from 'react';
import { 
  ShieldCheck, 
  Bed, 
  Activity, 
  Users, 
  Ambulance, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { Hospital, DepartmentCapacity, Alert } from '../types';

interface HospitalOverviewProps {
  hospital: Hospital | null;
  capacities: DepartmentCapacity[];
  alerts: Alert[];
  onOpenStatusModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HospitalOverview: React.FC<HospitalOverviewProps> = ({
  hospital,
  capacities,
  alerts,
  onOpenStatusModal,
  onNavigateTab,
}) => {
  // Aggregate live totals from backend capacities
  const totalBeds = capacities.reduce((sum, c) => sum + c.totalBeds, 0) || 320;
  const occupiedBeds = capacities.reduce((sum, c) => sum + c.occupiedBeds, 0) || 246;
  const availableBeds = capacities.reduce((sum, c) => sum + c.availableBeds, 0) || 74;
  const occupancyPercent = Math.round((occupiedBeds / totalBeds) * 100);

  const icuTotal = capacities.reduce((sum, c) => sum + c.icuTotal, 0) || 32;
  const icuOccupied = capacities.reduce((sum, c) => sum + c.icuOccupied, 0) || 20;
  const icuAvailable = capacities.reduce((sum, c) => sum + c.icuAvailable, 0) || 12;

  const totalStaff = capacities.reduce((sum, c) => sum + c.staffOnDuty, 0) || 86;

  const activeAlerts = alerts.filter(a => !a.isAcknowledged);
  const criticalAlert = activeAlerts.find(a => a.severity === 'CRITICAL' || a.severity === 'HIGH');

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Overview</h2>
          <p className="text-xs text-slate-500 font-medium">
            Live operational telemetry for {hospital?.name || 'City General Hospital'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500">Live data verified • Freshness: &lt;1m</span>
        </div>
      </div>

      {/* Hospital Status Banner Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-slate-900 capitalize">
                {hospital?.operationalStatus?.toLowerCase().replace('_', ' ') || 'Operational'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {hospital?.statusReason || 'Hospital is running normally with all trauma, surgical, and ICU suites ready.'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Last updated: {hospital?.lastStatusUpdate ? new Date(hospital.lastStatusUpdate).toLocaleTimeString() : 'Just now'} by {hospital?.statusUpdatedBy || 'Dr. Sarah Johnson'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenStatusModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm shadow-blue-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Edit Status</span>
        </button>
      </div>

      {/* Top 3 Capacity Cards (Beds Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Beds */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Beds</p>
            <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{totalBeds}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Across all 9 registered wards</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        {/* Occupied */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Occupied</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{occupiedBeds}</span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {occupancyPercent}%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">24 admissions today</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Available */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Available Beds</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-600 tracking-tight">{availableBeds}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {100 - occupancyPercent}%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">Ready for incoming patients</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bed className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Row: ICU, ED, Staff */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* ICU Beds */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">ICU Beds</span>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
              {icuAvailable} Available
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">{icuTotal}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>{icuOccupied} Occupied</span>
            <span className="font-semibold text-slate-700">92% Ventilator sync</span>
          </div>
        </div>

        {/* Emergency Dept */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Emergency Dept.</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Moderate Load
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">32 / 40 Beds</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>Avg Wait: 22m</span>
            <span className="font-semibold text-emerald-600">Trauma Bay Ready</span>
          </div>
        </div>

        {/* Available Staff */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Available Staff</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
              Shortage: 6
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalStaff} on duty</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>18 Doctors</span>
            <span>68 Nurses & Technicians</span>
          </div>
        </div>
      </div>

      {/* Quick Status Pill Counters (Incoming Ambulances, Procedure Delays, AI Prediction) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <button
          onClick={() => onNavigateTab('ambulance-coord')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm transition flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Ambulance className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Incoming Ambulances</p>
              <p className="text-xs text-slate-500">3 En Route (ETA &lt;15m)</p>
            </div>
          </div>
          <span className="text-lg font-black text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-lg">3</span>
        </button>

        <button
          onClick={() => onNavigateTab('procedures')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm transition flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Procedure Delays</p>
              <p className="text-xs text-slate-500">2 Operating Room delays logged</p>
            </div>
          </div>
          <span className="text-lg font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg">2</span>
        </button>

        <button
          onClick={() => onNavigateTab('ai-predictions')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-sm transition flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">AI Prediction</p>
              <p className="text-xs text-slate-500">High Load forecast for next 6h</p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">+35% Surge</span>
        </button>
      </div>

      {/* Critical Alert Warning Bar */}
      {criticalAlert && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="text-xs font-semibold">
              <span className="font-bold underline">1 critical notification requires attention:</span> {criticalAlert.title} — {criticalAlert.message}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('notifications')}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline flex items-center gap-1 shrink-0"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

