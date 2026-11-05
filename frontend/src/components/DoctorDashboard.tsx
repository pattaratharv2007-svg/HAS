import React, { useState } from 'react';
import { 
  Users, 
  Mic, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  HeartPulse 
} from 'lucide-react';
import { ProcedureRecord } from '../types';

interface DoctorDashboardProps {
  doctorName?: string;
  departmentName?: string;
  procedures: ProcedureRecord[];
  onOpenVoiceAssistant: () => void;
  onLogDelay: (procedureId: number, delayMinutes: number, reason: string) => Promise<void>;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctorName = 'Dr. Priya Sharma',
  departmentName = 'Cardiology & Intensive Care',
  procedures,
  onOpenVoiceAssistant,
  onLogDelay,
}) => {
  const [selectedProc, setSelectedProc] = useState<ProcedureRecord | null>(null);
  const [delayMinutes, setDelayMinutes] = useState(20);
  const [delayReason, setDelayReason] = useState('Operating Room prep delayed by emergency case');
  const [reporting, setReporting] = useState(false);

  // Fallback demo procedures if empty
  const displayProcedures = procedures.length > 0 ? procedures : [
    {
      id: 1,
      procedureName: 'Emergency Angioplasty',
      patientReference: 'PT-CARD-8821',
      responsibleTeam: 'Dr. Priya Sharma (Lead)',
      status: 'IN_PROGRESS' as const,
      scheduledStartTime: '2026-11-04T10:00',
      scheduledEndTime: '2026-11-04T11:15',
      delayDurationMinutes: 0,
      delayThresholdMinutes: 20,
      delayAlertTriggered: false,
      lastUpdated: new Date().toISOString(),
      hospitalId: 1,
      departmentId: 1,
    },
    {
      id: 2,
      procedureName: 'Transesophageal Echocardiogram',
      patientReference: 'PT-CARD-9014',
      responsibleTeam: 'Cardiology Diagnostics Team 2',
      status: 'PLANNED' as const,
      scheduledStartTime: '2026-11-04T11:30',
      scheduledEndTime: '2026-11-04T12:30',
      delayDurationMinutes: 0,
      delayThresholdMinutes: 20,
      delayAlertTriggered: false,
      lastUpdated: new Date().toISOString(),
      hospitalId: 1,
      departmentId: 1,
    },
    {
      id: 3,
      procedureName: 'Cardiac Catheterization',
      patientReference: 'PT-TRAUMA-991',
      responsibleTeam: 'Surgical Team Beta',
      status: 'DELAYED' as const,
      scheduledStartTime: '2026-11-04T14:00',
      scheduledEndTime: '2026-11-04T15:30',
      delayDurationMinutes: 25,
      delayReason: 'Pending pre-op blood crossmatch verification',
      delayThresholdMinutes: 20,
      delayAlertTriggered: true,
      lastUpdated: new Date().toISOString(),
      hospitalId: 1,
      departmentId: 1,
    },
  ];

  const handleDelaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProc) return;
    setReporting(true);
    try {
      await onLogDelay(selectedProc.id, delayMinutes, delayReason);
      setSelectedProc(null);
    } finally {
      setReporting(false);
    }
  };

  const delayCount = displayProcedures.filter(p => p.status === 'DELAYED').length;

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Good Morning, {doctorName}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {departmentName} • Clinical Workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-600">On Duty • Trauma Pager Active</span>
        </div>
      </div>

      {/* 3 Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Patient List */}
        <button className="p-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 text-left transition transform hover:-translate-y-0.5 flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/20">Active Roster</span>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Patient List</h3>
            <p className="text-xs text-white/80 mt-0.5">8 Patients Assigned (2 Critical)</p>
          </div>
        </button>

        {/* Voice Assistant */}
        <button
          onClick={onOpenVoiceAssistant}
          className="p-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 text-left transition transform hover:-translate-y-0.5 flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/20">AI Speech-to-Text</span>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Voice Assistant</h3>
            <p className="text-xs text-white/80 mt-0.5">Dictate & Review Clinical Notes</p>
          </div>
        </button>

        {/* Procedure Delays */}
        <button
          onClick={() => {
            if (displayProcedures.length > 0) setSelectedProc(displayProcedures[0]);
          }}
          className="p-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 text-left transition transform hover:-translate-y-0.5 flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/20">
              {delayCount} Alert{delayCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Procedure Delays</h3>
            <p className="text-xs text-white/80 mt-0.5">Report OR Delays & Auto-Alert Teams</p>
          </div>
        </button>
      </div>

      {/* Upcoming Procedures Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Upcoming Procedures</h3>
            <p className="text-xs text-slate-500">Scheduled surgery and catheterization lab slots</p>
          </div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
            {displayProcedures.length} Procedures Scheduled
          </span>
        </div>

        <div className="space-y-3">
          {displayProcedures.map((proc) => {
            const isDelayed = proc.status === 'DELAYED';
            const isDone = proc.status === 'COMPLETED';
            return (
              <div
                key={proc.id}
                className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isDelayed ? 'bg-amber-100 text-amber-800' : 'bg-sky-50 text-sky-700'
                  }`}>
                    {proc.scheduledStartTime ? new Date(proc.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{proc.procedureName}</h4>
                    <p className="text-xs text-slate-500">
                      Patient: <span className="font-semibold text-slate-700">{proc.patientReference}</span> • Team: {proc.responsibleTeam}
                    </p>
                    {isDelayed && (
                      <p className="text-[11px] font-semibold text-amber-700 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Delayed by {proc.delayDurationMinutes}m: {proc.delayReason}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    isDelayed
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-sky-50 text-sky-700 border-sky-200'
                  }`}>
                    {proc.status}
                  </span>
                  <button
                    onClick={() => setSelectedProc(proc)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    Log Delay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Incoming Patients</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">2</p>
            <p className="text-[11px] text-slate-400">ETA &lt;15 mins via Ambulance</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            +
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Department Status</p>
            <p className="text-lg font-black text-emerald-600 mt-0.5">Ready</p>
            <p className="text-[11px] text-slate-400">Trauma bays staffed</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Recent Updates</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">3</p>
            <p className="text-[11px] text-slate-400">Lab & echo reports verified</p>
          </div>
          <HeartPulse className="w-6 h-6 text-sky-500" />
        </div>
      </div>

      {/* Log Procedure Delay Modal */}
      {selectedProc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Report Procedure Delay
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Procedure: <span className="font-semibold text-slate-700">{selectedProc.procedureName}</span> ({selectedProc.patientReference})
            </p>

            <form onSubmit={handleDelaySubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Delay Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 border rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Reason for Delay</label>
                <textarea
                  rows={3}
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-xs"
                  placeholder="Explain why the procedure is postponed (e.g. pending anesthesia, pre-op labs)..."
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] font-medium">
                Note: Delays exceeding 20 minutes automatically trigger operational alerts to coordinator & bed management teams.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedProc(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reporting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                >
                  {reporting ? 'Recording...' : 'Broadcast Delay Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

