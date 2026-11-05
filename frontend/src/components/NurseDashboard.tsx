import React, { useState } from 'react';
import { 
  Activity, 
  Bed, 
  AlertTriangle, 
  Mic, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Plus 
} from 'lucide-react';

interface NurseDashboardProps {
  onOpenVoiceAssistant: () => void;
  onOpenWardUpdates: () => void;
}

export const NurseDashboard: React.FC<NurseDashboardProps> = ({
  onOpenVoiceAssistant,
  onOpenWardUpdates,
}) => {
  const [patients, setPatients] = useState([
    { bed: 'Bed 3', patientId: 'Patient #4587', status: 'Stable', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', notes: 'Post-op observation Day 1. Vitals normal.' },
    { bed: 'Bed 5', patientId: 'Patient #4621', status: 'Monitoring', statusColor: 'bg-amber-50 text-amber-700 border-amber-200', notes: 'Continuous telemetry. Blood pressure re-check in 30m.' },
    { bed: 'Bed 7', patientId: 'Patient #4890', status: 'Stable', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', notes: 'Scheduled for step-down transfer to general floor.' },
  ]);

  const [recentUpdates, setRecentUpdates] = useState([
    { time: '10:15 AM', type: 'Vitals', title: 'Patient #4587 - Vitals stable', color: 'text-emerald-600 bg-emerald-50' },
    { time: '09:45 AM', type: 'Equipment', title: 'Equipment Check - Ventilator V-12 verified', color: 'text-amber-600 bg-amber-50' },
    { time: '09:28 AM', type: 'Doctor', title: 'Doctor Order - Dr. Priya reviewed Bed 5 chart', color: 'text-blue-600 bg-blue-50' },
  ]);

  const [showObsModal, setShowObsModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState('Bed 3');
  const [observationText, setObservationText] = useState('Patient comfortable, surgical site dry, pain controlled.');

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    setRecentUpdates(prev => [
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Nurse Obs',
        title: `${selectedBed}: ${observationText}`,
        color: 'text-purple-600 bg-purple-50',
      },
      ...prev,
    ]);
    setShowObsModal(false);
    alert('Nursing observation logged and added to patient chart.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ward 3B</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">General Medical & Surgical Step-down Unit</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-4 text-xs font-bold">
            <div>
              <span className="text-slate-400 font-normal">Patients: </span>
              <span className="text-slate-900">12</span>
            </div>
            <div className="border-l pl-4">
              <span className="text-slate-400 font-normal">Available Beds: </span>
              <span className="text-emerald-600">3 (12/15)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Observations */}
        <button
          onClick={() => setShowObsModal(true)}
          className="p-5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 text-left transition transform hover:-translate-y-0.5 flex flex-col justify-between h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Patient Observations</h3>
            <p className="text-[11px] text-white/80">Log Vitals & Nursing Chart</p>
          </div>
        </button>

        {/* Ward Updates */}
        <button
          onClick={onOpenWardUpdates}
          className="p-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 text-left transition transform hover:-translate-y-0.5 flex flex-col justify-between h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Ward Updates</h3>
            <p className="text-[11px] text-white/80">Bed Turnover & Availability</p>
          </div>
        </button>

        {/* Equipment Issues */}
        <button
          onClick={() => alert('Biomedical equipment issue ticket submitted for Biomed inspection.')}
          className="p-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 text-left transition transform hover:-translate-y-0.5 flex flex-col justify-between h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Equipment Issues</h3>
            <p className="text-[11px] text-white/80">Report Monitor / Infusion Pump</p>
          </div>
        </button>

        {/* Voice Assistant */}
        <button
          onClick={onOpenVoiceAssistant}
          className="p-5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 text-left transition transform hover:-translate-y-0.5 flex flex-col justify-between h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Voice Assistant</h3>
            <p className="text-[11px] text-white/80">Dictate Nursing Rounds</p>
          </div>
        </button>
      </div>

      {/* Two Column Section: Patients on Left, Recent Updates on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Patients */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">My Patients (Ward 3B)</h3>
              <p className="text-xs text-slate-500">Active patients assigned to your care shift</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              3 Patients
            </span>
          </div>

          <div className="space-y-3">
            {patients.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black text-xs shrink-0">
                    {p.bed.replace('Bed ', '#')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{p.bed}</h4>
                      <span className="text-xs text-slate-400 font-medium">({p.patientId})</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{p.notes}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${p.statusColor}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Recent Updates</h3>
              <span className="text-xs text-slate-400">Today</span>
            </div>

            <div className="space-y-3.5">
              {recentUpdates.map((u, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${u.color}`}>
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 leading-snug">{u.title}</p>
                    <span className="text-[11px] text-slate-400">{u.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenWardUpdates}
            className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition text-center"
          >
            View All Ward Updates
          </button>
        </div>
      </div>

      {/* Observation Modal */}
      {showObsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Log Patient Observation</h3>
            <p className="text-xs text-slate-500 mb-4">Ward 3B Clinical Documentation</p>

            <form onSubmit={handleAddObservation} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Select Bed</label>
                <select
                  value={selectedBed}
                  onChange={(e) => setSelectedBed(e.target.value)}
                  className="w-full p-2.5 border rounded-lg"
                >
                  <option value="Bed 3">Bed 3 - Patient #4587</option>
                  <option value="Bed 5">Bed 5 - Patient #4621</option>
                  <option value="Bed 7">Bed 7 - Patient #4890</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Clinical Observations</label>
                <textarea
                  rows={3}
                  value={observationText}
                  onChange={(e) => setObservationText(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-xs"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 border rounded-xl text-[11px] text-slate-500 font-medium">
                Note: Per hospital policy, nursing observations cannot issue new medication prescriptions.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowObsModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

