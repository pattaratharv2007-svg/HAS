import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Send, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Bed, 
  Activity, 
  ArrowLeft,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { Hospital, AmbulanceUnit } from '../types';

interface AmbulanceDriverViewProps {
  hospitals: Hospital[];
  ambulance: AmbulanceUnit | null;
  onSendAlert: (referralData: any) => Promise<void>;
  onUpdateGps: (unitId: number, lat: number, lng: number, eta: number) => Promise<void>;
}

export const AmbulanceDriverView: React.FC<AmbulanceDriverViewProps> = ({
  hospitals,
  ambulance,
  onSendAlert,
  onUpdateGps,
}) => {
  const [activeTab, setActiveTab] = useState<'List' | 'Map'>('List');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [patientRef, setPatientRef] = useState('PT-TRAUMA-402');
  const [summary, setSummary] = useState('MVA victim with severe chest trauma, hypotension, tachycardic. Requires trauma bay & emergent CT.');
  const [selectedServices, setSelectedServices] = useState<string[]>(['Trauma', 'ICU', 'Emergency Surgery']);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Fallback demo hospitals with distances if list is empty
  const hospitalList = hospitals.length > 0 ? hospitals : [
    {
      id: 1,
      name: 'City General Hospital',
      code: 'CGH-01',
      address: 'Central City, 2.4 km',
      latitude: 12.9716,
      longitude: 77.5946,
      contactPhone: '+1-800-555-0101',
      contactEmail: 'operations@citygeneral.org',
      participationStatus: 'ACTIVE',
      operationalStatus: 'OPERATIONAL' as const,
      lastStatusUpdate: new Date().toISOString(),
      capabilitiesSummary: 'Trauma, ICU, Cardiology, Surgery',
    },
    {
      id: 2,
      name: 'Riverside Medical Center',
      code: 'RMC-03',
      address: 'South Sector, 5.1 km',
      latitude: 12.955,
      longitude: 77.58,
      contactPhone: '+1-800-555-0103',
      contactEmail: 'er@riverdalemed.org',
      participationStatus: 'ACTIVE',
      operationalStatus: 'HIGH_WORKLOAD' as const,
      lastStatusUpdate: new Date().toISOString(),
      capabilitiesSummary: 'Trauma, Surgery, Neonatal',
    },
    {
      id: 3,
      name: 'Sunrise Hospital',
      code: 'SH-04',
      address: 'East Corridor, 7.1 km',
      latitude: 12.99,
      longitude: 77.62,
      contactPhone: '+1-800-555-0104',
      contactEmail: 'admissions@sunrise.org',
      participationStatus: 'ACTIVE',
      operationalStatus: 'OPERATIONAL' as const,
      lastStatusUpdate: new Date().toISOString(),
      capabilitiesSummary: 'General Surgery, ICU, Dialysis',
    },
    {
      id: 4,
      name: 'Metro Memorial Hospital',
      code: 'MMH-02',
      address: 'North District, 10.3 km',
      latitude: 12.981,
      longitude: 77.6,
      contactPhone: '+1-800-555-0102',
      contactEmail: 'admissions@metromemorial.org',
      participationStatus: 'ACTIVE',
      operationalStatus: 'LIMITED_CAPACITY' as const,
      lastStatusUpdate: new Date().toISOString(),
      capabilitiesSummary: 'Cardiology, Surgery',
    },
  ];

  const handleSendArrivalAlert = async () => {
    if (!selectedHospital) return;
    setSending(true);
    try {
      await onSendAlert({
        ambulanceUnitId: ambulance?.id || 1,
        ambulanceUnitNumber: ambulance?.unitNumber || 'AMB-104',
        destinationHospitalId: selectedHospital.id,
        patientDeIdentifiedReference: patientRef,
        clinicalOperationalSummary: summary,
        urgencyLevel: 'CRITICAL',
        requiredServices: selectedServices.join(', '),
        estimatedArrivalMinutes: 12,
      });
      setSentSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Error sending referral alert');
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'HIGH_WORKLOAD':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LIMITED_CAPACITY':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Smartphone Outer Shell */}
      <div className="w-full max-w-[390px] bg-slate-950 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700">
        {/* Dynamic Island / Speaker notch */}
        <div className="h-6 w-full flex items-center justify-center relative mb-2">
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Smartphone Screen Glass */}
        <div className="bg-slate-50 rounded-[34px] overflow-hidden flex flex-col h-[740px] text-slate-900 border border-slate-200 relative">
          {/* Mobile Header */}
          <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-sky-600 text-white font-black text-xs flex items-center justify-center">
                +
              </div>
              <span className="font-extrabold text-sm tracking-tight">MediSync Mobile</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
              <Radio className="w-3 h-3 text-sky-500 animate-ping" />
              <span>{ambulance?.unitNumber || 'AMB-104'}</span>
            </div>
          </div>

          {/* Screen Content: Either Detail View or Nearby List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {selectedHospital ? (
              /* Hospital Detail & Arrival Alert Screen */
              <div className="space-y-4 animate-in fade-in duration-200">
                <button
                  onClick={() => { setSelectedHospital(null); setSentSuccess(false); }}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Nearby Facilities</span>
                </button>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-slate-900 text-base">{selectedHospital.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(selectedHospital.operationalStatus)}`}>
                      {selectedHospital.operationalStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-sky-600" />
                    <span>2.4 km • Est. Transit: 12 min</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-medium">ICU Beds</p>
                      <p className="text-sm font-black text-slate-900">4 / 12 Free</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-medium">General Beds</p>
                      <p className="text-sm font-black text-slate-900">18 / 40 Free</p>
                    </div>
                  </div>
                </div>

                {/* Patient Summary Input Form */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <h4 className="font-bold text-slate-800">Dispatch Emergency Referral</h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Patient Ref</label>
                    <input
                      type="text"
                      value={patientRef}
                      onChange={(e) => setPatientRef(e.target.value)}
                      className="w-full p-2 border rounded-lg font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Clinical Summary</label>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full p-2 border rounded-lg text-slate-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Required Services</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Trauma', 'ICU', 'Cardiology', 'Surgery', 'Pediatrics'].map((srv) => {
                        const isSelected = selectedServices.includes(srv);
                        return (
                          <button
                            key={srv}
                            type="button"
                            onClick={() => {
                              setSelectedServices(prev =>
                                isSelected ? prev.filter(s => s !== srv) : [...prev, srv]
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                              isSelected
                                ? 'bg-sky-600 text-white border-sky-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {srv}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {sentSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold">Referral Alert Broadcasted!</p>
                    <p className="text-[11px] text-emerald-700">
                      Receiving facility notified. ETA 12 mins broadcasted to hospital triage board.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleSendArrivalAlert}
                      disabled={sending}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{sending ? 'Broadcasting...' : 'Send Arrival Alert'}</span>
                    </button>

                    <button
                      onClick={() => alert(`Calling ${selectedHospital.name} at ${selectedHospital.contactPhone}...`)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>Contact Hospital: {selectedHospital.contactPhone}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Nearby Hospitals List */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900">Nearby Hospitals</h3>
                  <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      onClick={() => setActiveTab('List')}
                      className={`px-3 py-1 rounded-md transition ${activeTab === 'List' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
                    >
                      List
                    </button>
                    <button
                      onClick={() => setActiveTab('Map')}
                      className={`px-3 py-1 rounded-md transition ${activeTab === 'Map' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
                    >
                      Map
                    </button>
                  </div>
                </div>

                {activeTab === 'Map' ? (
                  /* Map view simulated placeholder */
                  <div className="h-64 rounded-2xl bg-slate-200 relative overflow-hidden border border-slate-300 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 to-emerald-100/60" />
                    <div className="relative text-center p-4">
                      <MapPin className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
                      <p className="text-xs font-bold text-slate-700 mt-2">Live GPS Tracking Enabled</p>
                      <p className="text-[10px] text-slate-500">Unit AMB-104 en route (45 km/h)</p>
                    </div>
                  </div>
                ) : null}

                {/* Hospital Cards */}
                {hospitalList.map((hosp, idx) => (
                  <div
                    key={hosp.id}
                    onClick={() => setSelectedHospital(hosp)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md cursor-pointer transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{hosp.name}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Navigation className="w-3 h-3 text-sky-600" />
                          <span>{idx === 0 ? '2.4 km • 12 min' : idx === 1 ? '5.1 km • 18 min' : idx === 2 ? '7.1 km • 20 min' : '10.3 km • 30 min'}</span>
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(hosp.operationalStatus)}`}>
                        {hosp.operationalStatus.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span>ED: <strong className="text-slate-800">{idx === 0 ? 'High Load' : 'Available'}</strong></span>
                      <span>ICU: <strong className="text-emerald-600">{idx === 0 ? '4/12' : '2/8'}</strong></span>
                      <span className="text-sky-600 font-bold hover:underline">Select &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Smartphone Bottom Home Bar */}
          <div className="h-6 bg-white flex items-center justify-center">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

