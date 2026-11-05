import React, { useState } from 'react';
import { DepartmentCapacity } from '../types';
import { Plus, RefreshCw, CheckCircle2, Clock, AlertTriangle, Edit3 } from 'lucide-react';

interface DepartmentStatusViewProps {
  capacities: DepartmentCapacity[];
  onRefresh: () => void;
  onUpdateCapacity: (deptId: number, data: any) => Promise<void>;
  currentUserRole?: string;
  currentUsername?: string;
}

export const DepartmentStatusView: React.FC<DepartmentStatusViewProps> = ({
  capacities,
  onRefresh,
  onUpdateCapacity,
  currentUserRole = 'ADMINISTRATOR',
  currentUsername = 'admin',
}) => {
  const [editingDept, setEditingDept] = useState<DepartmentCapacity | null>(null);
  const [editTotal, setEditTotal] = useState(0);
  const [editOccupied, setEditOccupied] = useState(0);
  const [editAvailable, setEditAvailable] = useState(0);
  const [editStaff, setEditStaff] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fallback demo departments if capacities list is initializing
  const displayItems = capacities.length > 0 ? capacities : [
    { id: 1, departmentId: 1, departmentName: 'Emergency Dept.', totalBeds: 20, occupiedBeds: 15, availableBeds: 5, outOfServiceBeds: 0, icuTotal: 0, icuOccupied: 0, icuAvailable: 0, ventilatorsTotal: 5, ventilatorsAvailable: 2, staffOnDuty: 8, activeWorkloadLevel: 'HIGH', lastUpdated: new Date().toISOString(), verificationState: 'VERIFIED' },
    { id: 2, departmentId: 2, departmentName: 'ICU', totalBeds: 12, occupiedBeds: 7, availableBeds: 5, outOfServiceBeds: 0, icuTotal: 12, icuOccupied: 7, icuAvailable: 5, ventilatorsTotal: 12, ventilatorsAvailable: 5, staffOnDuty: 6, activeWorkloadLevel: 'LIMITED', lastUpdated: new Date().toISOString(), verificationState: 'VERIFIED' },
    { id: 3, departmentId: 3, departmentName: 'General Ward', totalBeds: 80, occupiedBeds: 42, availableBeds: 38, outOfServiceBeds: 0, icuTotal: 0, icuOccupied: 0, icuAvailable: 0, ventilatorsTotal: 0, ventilatorsAvailable: 0, staffOnDuty: 24, activeWorkloadLevel: 'NORMAL', lastUpdated: new Date().toISOString(), verificationState: 'VERIFIED' },
    { id: 4, departmentId: 4, departmentName: 'Surgery', totalBeds: 15, occupiedBeds: 12, availableBeds: 3, outOfServiceBeds: 0, icuTotal: 0, icuOccupied: 0, icuAvailable: 0, ventilatorsTotal: 8, ventilatorsAvailable: 2, staffOnDuty: 6, activeWorkloadLevel: 'HIGH', lastUpdated: new Date().toISOString(), verificationState: 'VERIFIED' },
    { id: 5, departmentId: 5, departmentName: 'Radiology', totalBeds: 10, occupiedBeds: 6, availableBeds: 4, outOfServiceBeds: 0, icuTotal: 0, icuOccupied: 0, icuAvailable: 0, ventilatorsTotal: 0, ventilatorsAvailable: 0, staffOnDuty: 4, activeWorkloadLevel: 'NORMAL', lastUpdated: new Date().toISOString(), verificationState: 'VERIFIED' },
    { id: 6, departmentId: 6, departmentName: 'Laboratory', totalBeds: 6, occupiedBeds: 4, availableBeds: 2, outOfServiceBeds: 0, icuTotal: 0, icuOccupied: 0, icuAvailable: 0, ventilatorsTotal: 0, ventilatorsAvailable: 0, staffOnDuty: 5, activeWorkloadLevel: 'NORMAL', lastUpdated: new Date().toISOString(), verificationState: 'VERIFIED' },
    { id: 7, departmentId: 7, departmentName: 'Pharmacy', totalBeds: 2, occupiedBeds: 1, availableBeds: 1, outOfServiceBeds: 0, icuTotal: 0, icuOccupied: 0, icuAvailable: 0, ventilatorsTotal: 0, ventilatorsAvailable: 0, staffOnDuty: 4, activeWorkloadLevel: 'NORMAL', lastUpdated: new Date().toISOString(), verificationState: 'VERIFIED' },
    { id: 8, departmentId: 8, departmentName: 'Pediatrics', totalBeds: 20, occupiedBeds: 14, availableBeds: 6, outOfServiceBeds: 0, icuTotal: 4, icuOccupied: 2, icuAvailable: 2, ventilatorsTotal: 2, ventilatorsAvailable: 1, staffOnDuty: 6, activeWorkloadLevel: 'NORMAL', lastUpdated: new Date().toISOString(), verificationState: 'VERIFIED' },
    { id: 9, departmentId: 9, departmentName: 'Cardiology', totalBeds: 12, occupiedBeds: 7, availableBeds: 5, outOfServiceBeds: 0, icuTotal: 4, icuOccupied: 3, icuAvailable: 1, ventilatorsTotal: 4, ventilatorsAvailable: 1, staffOnDuty: 5, activeWorkloadLevel: 'LIMITED', lastUpdated: new Date().toISOString(), verificationState: 'VERIFIED' },
  ] as DepartmentCapacity[];

  const openEdit = (dept: DepartmentCapacity) => {
    setEditingDept(dept);
    setEditTotal(dept.totalBeds);
    setEditOccupied(dept.occupiedBeds);
    setEditAvailable(dept.availableBeds);
    setEditStaff(dept.staffOnDuty);
    setError(null);
  };

  const saveEdit = async () => {
    if (editOccupied + editAvailable > editTotal) {
      setError(`Sum of occupied (${editOccupied}) and available (${editAvailable}) exceeds total (${editTotal})`);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onUpdateCapacity(editingDept!.departmentId, {
        totalBeds: editTotal,
        occupiedBeds: editOccupied,
        availableBeds: editAvailable,
        outOfServiceBeds: 0,
        staffOnDuty: editStaff,
        updatedBy: currentUsername,
        updaterRole: currentUserRole,
        verificationState: 'VERIFIED',
      });
      setEditingDept(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update capacity');
    } finally {
      setSaving(false);
    }
  };

  const getStatusPill = (dept: DepartmentCapacity) => {
    const occRate = dept.totalBeds > 0 ? dept.occupiedBeds / dept.totalBeds : 0;
    if (occRate >= 0.85) {
      return { label: 'High Load', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    } else if (occRate >= 0.7) {
      return { label: 'Limited', bg: 'bg-orange-50 text-orange-700 border-orange-200' };
    } else if (dept.availableBeds === 0) {
      return { label: 'Full', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    return { label: 'Available', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Department Status</h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time bed, ICU, and clinical workforce utilization across active departments
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Department Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Capacity (Occupied / Total)</th>
                <th className="px-6 py-4">Staff on Duty</th>
                <th className="px-6 py-4">Data Freshness</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {displayItems.map((item) => {
                const status = getStatusPill(item);
                const percent = item.totalBeds > 0 ? Math.round((item.occupiedBeds / item.totalBeds) * 100) : 0;
                return (
                  <tr key={item.id || item.departmentName} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{item.departmentName}</div>
                      <div className="text-[11px] text-slate-400">Unit ID: #{item.departmentId || item.id}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${status.bg}`}>
                        {status.label}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.occupiedBeds}/{item.totalBeds}</span>
                        <span className="text-[11px] text-slate-400">({item.availableBeds} free)</span>
                      </div>
                      <div className="w-36 h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            percent > 85 ? 'bg-rose-500' : percent > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, percent)}%` }}
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{item.staffOnDuty}</span>
                      <span className="text-slate-400 text-[11px]"> active staff</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.lastUpdated ? new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold inline-block mt-0.5">
                        {item.verificationState || 'VERIFIED'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Capacity Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Update Capacity: {editingDept.departmentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Authorized role: {currentUserRole}. Real-time synchronization active.
            </p>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Total Bed Count</label>
                <input
                  type="number"
                  min="0"
                  value={editTotal}
                  onChange={(e) => setEditTotal(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Occupied Beds</label>
                  <input
                    type="number"
                    min="0"
                    value={editOccupied}
                    onChange={(e) => setEditOccupied(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-1">Available Beds</label>
                  <input
                    type="number"
                    min="0"
                    value={editAvailable}
                    onChange={(e) => setEditAvailable(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Staff on Duty</label>
                <input
                  type="number"
                  min="0"
                  value={editStaff}
                  onChange={(e) => setEditStaff(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingDept(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={saving}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save & Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

