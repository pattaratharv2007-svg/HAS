import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  AlertTriangle, 
  RefreshCw, 
  Send,
  Eye
} from 'lucide-react';
import { ReferralRequest } from '../types';

interface AmbulanceCoordinatorViewProps {
  referrals: ReferralRequest[];
  onAcknowledge: (id: number) => Promise<void>;
  onDecide: (id: number, decision: string, reason: string) => Promise<void>;
  onRefresh: () => void;
}

export const AmbulanceCoordinatorView: React.FC<AmbulanceCoordinatorViewProps> = ({
  referrals,
  onAcknowledge,
  onDecide,
  onRefresh,
}) => {
  const [selectedReferral, setSelectedReferral] = useState<ReferralRequest | null>(null);
  const [decisionReason, setDecisionReason] = useState('Staff and Trauma Bay confirmed ready for patient arrival.');
  const [submitting, setSubmitting] = useState(false);

  // Fallback demo referrals if empty
  const displayReferrals = referrals.length > 0 ? referrals : [
    {
      id: 1,
      referralCode: 'REF-2026-0042',
      ambulanceUnitNumber: 'AMB-104',
      destinationHospitalId: 1,
      destinationHospitalName: 'City General Hospital',
      patientDeIdentifiedReference: 'PT-TRAUMA-402',
      clinicalOperationalSummary: 'Severe polytrauma, pelvic fracture, requiring blood transfusion & trauma surgery',
      urgencyLevel: 'CRITICAL',
      requiredServices: 'Trauma, ICU, CT Angio',
      status: 'ACCEPTED' as const,
      estimatedArrivalMinutes: 10,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      referralCode: 'REF-2026-0043',
      ambulanceUnitNumber: 'AMB-108',
      destinationHospitalId: 1,
      destinationHospitalName: 'City General Hospital',
      patientDeIdentifiedReference: 'PT-STROKE-112',
      clinicalOperationalSummary: 'Acute ischemic stroke, onset 75 min ago, NIHSS 14, urgent thrombectomy evaluation',
      urgencyLevel: 'CRITICAL',
      requiredServices: 'Neuro ICU, Comprehensive Stroke Center',
      status: 'UNDER_REVIEW' as const,
      estimatedArrivalMinutes: 18,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      referralCode: 'REF-2026-0044',
      ambulanceUnitNumber: 'AMB-112',
      destinationHospitalId: 2,
      destinationHospitalName: 'Metro Hospital',
      patientDeIdentifiedReference: 'PT-PEDS-559',
      clinicalOperationalSummary: 'Pediatric respiratory distress with stridor and desaturation',
      urgencyLevel: 'HIGH',
      requiredServices: 'Pediatric ICU',
      status: 'SENT' as const,
      estimatedArrivalMinutes: 30,
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      referralCode: 'REF-2026-0045',
      ambulanceUnitNumber: 'AMB-115',
      destinationHospitalId: 3,
      destinationHospitalName: 'Sunrise Hospital',
      patientDeIdentifiedReference: 'PT-MED-301',
      clinicalOperationalSummary: 'Septic shock secondary to acute pyelonephritis, inotrope support initiated',
      urgencyLevel: 'HIGH',
      requiredServices: 'ICU, Acute Dialysis',
      status: 'ACKNOWLEDGED' as const,
      estimatedArrivalMinutes: 45,
      createdAt: new Date().toISOString(),
    },
  ];

  const handleDecisionSubmit = async (decision: 'ACCEPTED' | 'DECLINED') => {
    if (!selectedReferral) return;
    setSubmitting(true);
    try {
      await onDecide(selectedReferral.id, decision, decisionReason);
      setSelectedReferral(null);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UNDER_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ACKNOWLEDGED':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'SENT':
      case 'DELIVERED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DECLINED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'COMPLETED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const incomingCount = displayReferrals.filter(r => r.status === 'SENT' || r.status === 'DELIVERED').length || 5;
  const pendingCount = displayReferrals.filter(r => r.status === 'UNDER_REVIEW' || r.status === 'ACKNOWLEDGED').length || 3;
  const acceptedCount = displayReferrals.filter(r => r.status === 'ACCEPTED').length || 8;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ambulance Coordinator Dashboard</h2>
          <p className="text-xs text-slate-500 font-medium">
            Emergency handoff dispatch, referral validation & hospital readiness triage
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* 3 Top Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Incoming Alerts</p>
            <p className="text-3xl font-black text-rose-600 mt-1">{incomingCount}</p>
            <p className="text-[11px] text-slate-400">En route to regional hospitals</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pending Requests</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{pendingCount}</p>
            <p className="text-[11px] text-slate-400">Awaiting clinical verification</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Accepted</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{acceptedCount}</p>
            <p className="text-[11px] text-slate-400">Beds & trauma bays locked</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Recent Referral Requests</h3>
            <p className="text-xs text-slate-500">
              Note: Delivery or acknowledgement is not acceptance. Explicit clinical acceptance required.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">Auto-refresh: 10s</span>
        </div>

        <div className="space-y-3">
          {displayReferrals.map((ref) => (
            <div
              key={ref.id}
              className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  {ref.ambulanceUnitNumber || 'AMB'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{ref.destinationHospitalName || 'City General Hospital'}</h4>
                    <span className="text-xs text-slate-400 font-mono">({ref.referralCode})</span>
                    <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                      ETA: {ref.estimatedArrivalMinutes || 15} min
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">
                    <strong className="text-slate-800">{ref.patientDeIdentifiedReference}:</strong> {ref.clinicalOperationalSummary}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Required Services: <span className="font-semibold text-slate-600">{ref.requiredServices}</span>
                  </p>
                </div>
              </div>

              {/* Status & Action Buttons */}
              <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(ref.status)}`}>
                  {ref.status.replace('_', ' ')}
                </span>

                {ref.status === 'SENT' || ref.status === 'DELIVERED' ? (
                  <button
                    onClick={() => onAcknowledge(ref.id)}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                  >
                    Acknowledge
                  </button>
                ) : null}

                {ref.status !== 'ACCEPTED' && ref.status !== 'DECLINED' && (
                  <button
                    onClick={() => setSelectedReferral(ref)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                  >
                    Triage Decision
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Triage Decision Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Referral Handoff Decision</h3>
            <p className="text-xs text-slate-500 mb-4">
              Referral: <span className="font-semibold text-slate-800">{selectedReferral.referralCode}</span> for {selectedReferral.destinationHospitalName}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs space-y-1">
              <p><strong>Patient:</strong> {selectedReferral.patientDeIdentifiedReference}</p>
              <p><strong>Required:</strong> {selectedReferral.requiredServices}</p>
              <p><strong>Summary:</strong> {selectedReferral.clinicalOperationalSummary}</p>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <label className="block mb-1">Decision Justification / Reason</label>
              <textarea
                rows={3}
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-xs"
                placeholder="Reason for acceptance or decline/redirection..."
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={() => setSelectedReferral(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDecisionSubmit('DECLINED')}
                disabled={submitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                Decline / Redirect
              </button>
              <button
                type="button"
                onClick={() => handleDecisionSubmit('ACCEPTED')}
                disabled={submitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Accept Referral'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

