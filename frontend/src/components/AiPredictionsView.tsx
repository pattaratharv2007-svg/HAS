import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { ForecastRecord } from '../types';

interface AiPredictionsViewProps {
  forecasts: ForecastRecord[];
  onRefresh: () => void;
}

export const AiPredictionsView: React.FC<AiPredictionsViewProps> = ({ forecasts, onRefresh }) => {
  const [horizon, setHorizon] = useState<'6h' | '12h' | '24h' | 'trends'>('6h');

  // Simple stylized SVG trendline component
  const Trendline = ({ color = '#0284c7', isUp = true }: { color?: string; isUp?: boolean }) => (
    <svg className="w-full h-12" viewBox="0 0 160 40" fill="none">
      <path
        d={isUp ? "M0 32 Q 40 28, 80 18 T 160 8" : "M0 12 Q 40 18, 80 25 T 160 30"}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={isUp ? "M0 32 Q 40 28, 80 18 T 160 8 L 160 40 L 0 40 Z" : "M0 12 Q 40 18, 80 25 T 160 30 L 160 40 L 0 40 Z"}
        fill={color}
        fillOpacity="0.08"
      />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Operational Predictions</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Advisory Engine</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Predictive demand forecasting based on historical arrivals, census trends & regional alerts
          </p>
        </div>

        {/* Horizon Tabs */}
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl self-start sm:self-center">
          {(['6h', '12h', '24h', 'trends'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setHorizon(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                horizon === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'trends' ? 'Historical Trends' : `Next ${tab}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Expected Arrivals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500">Expected Patient Arrivals</span>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">+35% Surge</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">18</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Confidence: 89%</p>
          </div>
          <div className="mt-3">
            <Trendline color="#0284c7" isUp={true} />
          </div>
        </div>

        {/* Bed Occupancy Forecast */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500">Bed Occupancy Forecast</span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Critical Threshold</span>
            </div>
            <p className="text-3xl font-black text-rose-600 tracking-tight">78% &rarr; 88%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Est. peak in 4.5 hours</p>
          </div>
          <div className="mt-3">
            <Trendline color="#e11d48" isUp={true} />
          </div>
        </div>

        {/* ED Workload */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500">ED Workload Pressure</span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">High</span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">High Pressure</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Expected wait: 45 min</p>
          </div>
          <div className="mt-3">
            <Trendline color="#f59e0b" isUp={true} />
          </div>
        </div>

        {/* ICU Capacity Risk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500">ICU Capacity Risk</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Moderate</span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">Moderate</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Surge buffer: 2 beds</p>
          </div>
          <div className="mt-3">
            <Trendline color="#f59e0b" isUp={false} />
          </div>
        </div>
      </div>

      {/* Second Row: Staff, Equipment, Overcrowding */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Staff Workload</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Moderate</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">Moderate Ratio</p>
          <p className="text-xs text-slate-400 mt-1">Nurse-to-patient ratio: 1:4</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Equipment Shortage Risk</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Low</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">Low Risk</p>
          <p className="text-xs text-slate-400 mt-1">All ventilators & monitors operational</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Overcrowding Risk</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Low</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">Low Risk</p>
          <p className="text-xs text-slate-400 mt-1">Discharge rate matches intake</p>
        </div>
      </div>

      {/* Advisory Notice Card */}
      <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-900 text-xs flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Advisory Operational Estimates Notice:</p>
          <p className="text-purple-700 mt-0.5 leading-relaxed">
            AI estimates are derived from aggregated historical hospital census trends and ambient emergency signals. Predictions are purely advisory for hospital resource readiness and do not diagnose patients or autonomously allocate beds or clinical staff.
          </p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">
            Last evaluated: 10 Apr 2025, 08:30 AM • Model: CareLink-TimeSeries-v2.1 • Baseline Accuracy: 91.4%
          </p>
        </div>
      </div>
    </div>
  );
};

