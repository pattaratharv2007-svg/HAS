const BASE_URL = '/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.message || `Request failed with status ${res.status}`);
    }

    const json: ApiResponse<T> = await res.json();
    return json.data;
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Hospitals
  getHospitals: () => request<any[]>('/hospitals'),
  getHospitalById: (id: number) => request<any>(`/hospitals/${id}`),
  updateHospitalStatus: (id: number, operationalStatus: string, reason: string, updatedBy: string) =>
    request<any>(`/hospitals/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ operationalStatus, reason, updatedBy }),
    }),

  // Departments & Capacities
  getDepartments: (hospitalId: number) => request<any[]>(`/departments/hospital/${hospitalId}`),
  getCapacities: (hospitalId: number) => request<any[]>(`/capacity/hospital/${hospitalId}`),
  updateCapacity: (deptId: number, data: any) =>
    request<any>(`/capacity/department/${deptId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Ambulances
  getAmbulances: () => request<any[]>('/ambulances'),
  updateAmbulanceLocation: (unitId: number, data: any) =>
    request<any>(`/ambulances/${unitId}/location-eta`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Referrals
  getReferrals: () => request<any[]>('/referrals'),
  getReferralsForHospital: (hospitalId: number) => request<any[]>(`/referrals/hospital/${hospitalId}`),
  createReferral: (data: any) =>
    request<any>('/referrals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  acknowledgeReferral: (id: number, acknowledgedBy: string) =>
    request<any>(`/referrals/${id}/acknowledge?acknowledgedBy=${encodeURIComponent(acknowledgedBy)}`, {
      method: 'PUT',
    }),
  decideReferral: (id: number, decision: string, reason: string, decidedBy: string) =>
    request<any>(`/referrals/${id}/decide`, {
      method: 'PUT',
      body: JSON.stringify({ decision, reason, decidedBy }),
    }),

  // Alerts
  getAlerts: (hospitalId?: number) =>
    hospitalId ? request<any[]>(`/alerts/hospital/${hospitalId}`) : request<any[]>('/alerts'),
  acknowledgeAlert: (id: number, acknowledgedBy: string) =>
    request<any>(`/alerts/${id}/acknowledge`, {
      method: 'PUT',
      body: JSON.stringify({ acknowledgedBy }),
    }),

  // Forecasts
  getForecasts: (hospitalId: number) => request<any[]>(`/forecasts/hospital/${hospitalId}`),
  refreshForecasts: (hospitalId: number) => request<any[]>(`/forecasts/hospital/${hospitalId}/refresh`, { method: 'POST' }),

  // Crisis Simulations
  getSimulations: () => request<any[]>('/simulations'),
  runSimulation: (data: any) =>
    request<any>('/simulations/run', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Procedures
  getProcedures: (hospitalId: number) => request<any[]>(`/procedures/hospital/${hospitalId}`),
  logProcedureDelay: (id: number, delayMinutes: number, reason: string, updatedBy: string) =>
    request<any>(`/procedures/${id}/delay`, {
      method: 'PUT',
      body: JSON.stringify({ delayDurationMinutes: delayMinutes, delayReason: reason, updatedBy }),
    }),

  // Voice Notes
  dictateVoice: (data: any) =>
    request<any>('/voice-notes/dictate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  signOffVoice: (id: number, finalAuthenticatedNote: string, explicitConfirmation: boolean, signedOffBy: string) =>
    request<any>(`/voice-notes/${id}/sign-off`, {
      method: 'PUT',
      body: JSON.stringify({
        finalAuthenticatedNote,
        explicitClinicianConfirmation: explicitConfirmation,
        signedOffBy,
      }),
    }),

  // Audits & Health
  getAudits: () => request<any[]>('/audits'),
  getOperationalReport: () => request<any>('/admin/reports/operational'),
  getSystemHealth: () => request<any>('/admin/health'),
};

