import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Users, 
  UserMinus, 
  Bed, 
  Building2, 
  Play, 
  CheckCircle2, 
  ShieldAlert,
  Save,
  BarChart2
} from 'lucide-react';
import { CrisisSimulation } from '../types';

interface CrisisSimulationViewProps {
  simulations: CrisisSimulation[];
  onRunSimulation: (scenarioData: any) => Promise<CrisisSimulation>;
}

export const CrisisSimulationView: React.FC<CrisisSimulationViewProps> = ({
  simulations,
  onRunSimulation,
}) => {
  const [scenarioName, setScenarioName] = useState('Severe Winter Storm Mass Surge');
  const [scenarioType, setScenarioType] = useState('PATIENT_SURGE');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.35); // +35%
  const [durationHours, setDurationHours] = useState(24);
  const [staffReductionPercent, setStaffReductionPercent] = useState(15);
  const [bedReductionPercent, setBedReductionPercent] = useState(10);
  const [notes, setNotes] = useState('Simulation modeling hypothetical transit delays and simultaneous hypothermia/fracture influx.');

  const [running, setRunning] = useState(false);
  const [activeResult, setActiveResult] = useState<CrisisSimulation | null>(null);

  const scenarioTypes = [
    { id: 'PATIENT_SURGE', label: 'Patient Surge', icon: Users, desc: '+35% to +80% trauma/respiratory spike' },
    { id: 'STAFF_SHORTAGE', label: 'Staff Shortage', icon: UserMinus, desc: 'Epidemic sick-leave or transport block' },
    { id: 'BED_ICU_SHORTAGE', label: 'Bed/ICU Shortage', icon: Bed, desc: 'Facility outage or contaminated wing' },
    { id: 'MULTI_HOSPITAL', label: 'Multi-Hospital', icon: Building2, desc: 'Regional mass casualty event' },
  ];

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setRunning(true);
    try {
      const res = await onRunSimulation({
        scenarioName,
        scenarioType,
        surgeMultiplier,
        durationHours,
        staffReductionPercent,
        bedReductionPercent,
        affectedHospitalIds: '1,2,3',
        notes,
      });
      setActiveResult(res);
    } catch (err: any) {
      alert(err.message || 'Error running simulation');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Crisis Simulation & Surge Modeling</h2>
        <p className="text-xs text-slate-500 font-medium">
          Sandbox capacity stress tests • Completely decoupled from live production hospital databases
        </p>
      </div>

      {/* Mandatory Red Simulation Warning Watermark Banner */}
      <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
          <div>
            <p className="font-extrabold text-sm tracking-wide">
              SIMULATION — NOT LIVE HOSPITAL DATA
            </p>
            <p className="text-xs text-rose-700 mt-0.5">
              Parameters and projected outcomes are hypothetical estimates for disaster response drills. Live clinical systems remain unaffected.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-200 text-rose-900 uppercase">
          Sandbox Mode
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Parameter Setup Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Select Scenario Type</h3>
            <p className="text-xs text-slate-500 mb-4">Choose a crisis archetype to model</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenarioTypes.map((t) => {
                const Icon = t.icon;
                const isSelected = scenarioType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setScenarioType(t.id)}
                    className={`p-4 rounded-xl border text-left transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{t.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleRun} className="space-y-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1">Scenario Title</label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-xs"
                required
              />
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label>Surge Multiplier</label>
                  <span className="text-blue-600 font-bold">+{Math.round((surgeMultiplier - 1.0) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.05"
                  value={surgeMultiplier}
                  onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label>Duration (Hours)</label>
                  <span className="text-blue-600 font-bold">{durationHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="72"
                  step="6"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label>Staff Reduction</label>
                  <span className="text-rose-600 font-bold">-{staffReductionPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={staffReductionPercent}
                  onChange={(e) => setStaffReductionPercent(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label>Bed Outage Reduction</label>
                  <span className="text-rose-600 font-bold">-{bedReductionPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={bedReductionPercent}
                  onChange={(e) => setBedReductionPercent(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Simulation Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={running}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 flex items-center gap-2 transition disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{running ? 'Calculating Outcomes...' : 'Run Isolated Simulation'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Projected Impact Outcomes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Projected Outcomes</h3>
              <span className="text-[10px] font-bold text-slate-400">Monte Carlo Sim</span>
            </div>

            <div className="space-y-4">
              {/* Projected Occupancy */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Projected Bed Occupancy</span>
                <p className="text-2xl font-black text-rose-600 mt-1">
                  {activeResult ? `${activeResult.projectedBedOccupancyPercent}%` : '97.2%'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Surpasses 85% safety threshold</p>
              </div>

              {/* ICU Deficit */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Projected ICU Deficit</span>
                <p className="text-2xl font-black text-amber-600 mt-1">
                  {activeResult ? `${activeResult.projectedIcuDeficit} Beds` : '6 Beds'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Ventilator buffer depleted</p>
              </div>

              {/* Wait Time Increase */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">ED Wait Time Increase</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {activeResult ? `+${activeResult.projectedWaitTimeIncreaseMinutes} min` : '+55 min'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Estimated avg total wait: 77m</p>
              </div>

              {/* Overall Risk */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900">Overall System Stress:</span>
                <span className="text-xs font-black text-rose-700 uppercase">
                  {activeResult ? activeResult.resourcePressureRisk : 'CRITICAL'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Results stored in isolated scenario history. Exportable for hospital disaster planning committees.
          </div>
        </div>
      </div>
    </div>
  );
};

