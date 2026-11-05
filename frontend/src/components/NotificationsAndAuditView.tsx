import React, { useState } from 'react';
import { 
  Bell, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Filter, 
  Search, 
  Clock 
} from 'lucide-react';
import { Alert, AuditEvent } from '../types';

interface NotificationsAndAuditViewProps {
  alerts: Alert[];
  audits: AuditEvent[];
  onAcknowledgeAlert: (id: number) => Promise<void>;
  onRefresh: () => void;
}

export const NotificationsAndAuditView: React.FC<NotificationsAndAuditViewProps> = ({
  alerts,
  audits,
  onAcknowledgeAlert,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'audits'>('notifications');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback demo alerts if empty
  const displayAlerts = alerts.length > 0 ? alerts : [
    {
      id: 1,
      title: 'Ambulance Arrival Alert',
      message: 'Ambulance AMB-104 with critical trauma patient is 5 min away. Trauma Bay 1 assigned.',
      severity: 'HIGH' as const,
      alertType: 'AMBULANCE_INCOMING',
      isAcknowledged: false,
      escalated: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Hospital Status Change',
      message: 'Department Modified: Cardiology workload elevated to High Workload.',
      severity: 'MEDIUM' as const,
      alertType: 'CAPACITY_OVERLOAD',
      isAcknowledged: false,
      escalated: false,
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    },
    {
      id: 3,
      title: 'Procedure Delay Logged',
      message: 'Cardiology: Emergency Angioplasty delayed by 25 min due to pre-op prep.',
      severity: 'MEDIUM' as const,
      alertType: 'PROCEDURE_DELAY',
      isAcknowledged: false,
      escalated: false,
      createdAt: new Date(Date.now() - 55 * 60000).toISOString(),
    },
    {
      id: 4,
      title: 'Equipment Maintenance Notice',
      message: 'CT Scanner Suite 2 scheduled for calibration cycle at 14:00.',
      severity: 'LOW' as const,
      alertType: 'SYSTEM',
      isAcknowledged: true,
      escalated: false,
      acknowledgedBy: 'Dr. Sarah Johnson',
      createdAt: new Date(Date.now() - 110 * 60000).toISOString(),
    },
    {
      id: 5,
      title: 'AI Predictor Surge Warning',
      message: 'Increased ED volume predicted for 14:00 - 18:00 window (+35% increase).',
      severity: 'LOW' as const,
      alertType: 'SYSTEM',
      isAcknowledged: true,
      escalated: false,
      acknowledgedBy: 'admin',
      createdAt: new Date(Date.now() - 160 * 60000).toISOString(),
    },
  ];

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredAlerts = displayAlerts.filter((a) => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifications & Audit Logs</h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time event feed, escalation tracking & immutable regulatory audit history
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'notifications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'audits' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {activeTab === 'notifications' ? (
        /* Notifications View */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Severity:</span>
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                    filterSeverity === sev
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-56"
              />
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  alert.isAcknowledged ? 'bg-slate-50/60 border-slate-200' : 'bg-white border-slate-200/90 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    alert.severity === 'HIGH' || alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      {alert.escalated && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                          ESCALATED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{alert.message}</p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(alert.createdAt).toLocaleString()}</span>
                      {alert.isAcknowledged && (
                        <span className="text-emerald-700 font-semibold">• Acknowledged by {alert.acknowledgedBy || 'User'}</span>
                      )}
                    </p>
                  </div>
                </div>

                {!alert.isAcknowledged && (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition self-end sm:self-center shrink-0"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Audit Trail View (PDF T1.5, T9.2) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Immutable Audit Event Ledger</h3>
              <p className="text-xs text-slate-500">Every operational and clinical decision carries timestamp, actor, and before/after values</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Read-Only
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Actor / Role</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Target</th>
                  <th className="px-5 py-3">Operational Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {audits.map((aud) => (
                  <tr key={aud.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(aud.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-slate-900">{aud.actor}</span>
                      <span className="text-slate-400 text-[11px] block">{aud.actorRole}</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-blue-700">
                      {aud.action}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {aud.targetType} #{aud.targetId}
                    </td>
                    <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                      {aud.details || aud.afterValue || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
