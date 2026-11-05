import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Hospital, HospitalStatus } from '../types';

interface HospitalStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: Hospital | null;
  onStatusUpdated: (updatedHospital: Hospital) => void;
  currentUsername?: string;
}

export const HospitalStatusModal: React.FC<HospitalStatusModalProps> = ({
  isOpen,
  onClose,
  hospital,
  onStatusUpdated,
  currentUsername = 'admin',
}) => {
  if (!isOpen || !hospital) return null;

  const [selectedStatus, setSelectedStatus] = useState<HospitalStatus>(hospital.operationalStatus);
  const [reason, setReason] = useState(hospital.statusReason || '');
  const [effectiveTime, setEffectiveTime] = useState('2026-11-04T13:00');
  const [reviewTime, setReviewTime] = useState('2026-11-04T18:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statuses: { id: HospitalStatus; label: string; color: string; desc: string }[] = [
    { id: 'OPERATIONAL', label: 'Operational', color: 'text-emerald-700 bg-emerald-50 border-emerald-300', desc: 'All services, ICUs, and trauma bays fully staffed and accepting transfers.' },
    { id: 'HIGH_WORKLOAD', label: 'High Workload', color: 'text-amber-700 bg-amber-50 border-amber-300', desc: 'High emergency volume; minor procedure delays anticipated.' },
    { id: 'LIMITED_CAPACITY', label: 'Limited Capacity', color: 'text-orange-700 bg-orange-50 border-orange-300', desc: 'Beds restricted. Priority admission to urgent & trauma cases only.' },
    { id: 'CRITICAL_CAPACITY', label: 'Critical Capacity', color: 'text-rose-700 bg-rose-50 border-rose-300', desc: 'Surge limit reached. Inter-hospital referral diversion activated.' },
    { id: 'TEMPORARILY_RESTRICTED', label: 'Temporarily Restricted', color: 'text-purple-700 bg-purple-50 border-purple-300', desc: 'Critical infrastructure maintenance or temporary intake restriction.' },
  ];

  const handleSave = async () => {
    if (!reason.trim()) {
      setError('Please provide a valid operational reason for the status change.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/hospitals/${hospital.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationalStatus: selectedStatus,
          reason: reason.trim(),
          updatedBy: currentUsername,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Failed to update hospital status');
      }

      const data = await res.json();
      onStatusUpdated(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Hospital Status Management</h3>
            <p className="text-xs text-slate-500">{hospital.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Current Status banner */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs font-semibold text-slate-500">Current Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-900 capitalize">
                {hospital.operationalStatus.toLowerCase().replace('_', ' ')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Last updated: {new Date(hospital.lastStatusUpdate).toLocaleString()} by {hospital.statusUpdatedBy || 'Administrator'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Change Hospital Status options */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Change Hospital Status
            </label>
            <div className="space-y-2">
              {statuses.map((item) => {
                const isSelected = selectedStatus === item.id;
                return (
                  <label
                    key={item.id}
                    onClick={() => setSelectedStatus(item.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hospitalStatus"
                      checked={isSelected}
                      onChange={() => setSelectedStatus(item.id)}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${item.color}`}>
                          {item.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Reason for change */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Change <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the operational situation (e.g. surge in trauma admissions, technical maintenance)..."
              className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Effective Time</label>
              <input
                type="datetime-local"
                value={effectiveTime}
                onChange={(e) => setEffectiveTime(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Review Time</label>
              <input
                type="datetime-local"
                value={reviewTime}
                onChange={(e) => setReviewTime(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

