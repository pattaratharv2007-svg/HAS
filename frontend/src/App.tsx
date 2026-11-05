import React, { useState, useEffect } from 'react';
import { Role, Hospital, DepartmentCapacity, AmbulanceUnit, ReferralRequest, Alert, ForecastRecord, CrisisSimulation, ProcedureRecord, AuditEvent, User } from './types';
import { api } from './api';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { RoleSelectScreen } from './components/RoleSelectScreen';
import { HospitalOverview } from './components/HospitalOverview';
import { HospitalStatusModal } from './components/HospitalStatusModal';
import { DepartmentStatusView } from './components/DepartmentStatusView';
import { DoctorDashboard } from './components/DoctorDashboard';
import { VoiceTranscriptionView } from './components/VoiceTranscriptionView';
import { NurseDashboard } from './components/NurseDashboard';
import { AmbulanceDriverView } from './components/AmbulanceDriverView';
import { AmbulanceCoordinatorView } from './components/AmbulanceCoordinatorView';
import { AiPredictionsView } from './components/AiPredictionsView';
import { CrisisSimulationView } from './components/CrisisSimulationView';
import { NotificationsAndAuditView } from './components/NotificationsAndAuditView';
import { NetworkOverviewMapView } from './components/NetworkOverviewMapView';

export const App: React.FC = () => {
  // Navigation & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 1,
    username: 'admin',
    fullName: 'Dr. Sarah Johnson',
    role: 'ADMINISTRATOR',
    hospitalId: 1,
  });
  const [currentRole, setCurrentRole] = useState<Role>('ADMINISTRATOR');
  const [currentView, setCurrentView] = useState<string>('overview');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [showRoleSelector, setShowRoleSelector] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  // Live Backend Data
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [capacities, setCapacities] = useState<DepartmentCapacity[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>([]);
  const [referrals, setReferrals] = useState<ReferralRequest[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [forecasts, setForecasts] = useState<ForecastRecord[]>([]);
  const [simulations, setSimulations] = useState<CrisisSimulation[]>([]);
  const [procedures, setProcedures] = useState<ProcedureRecord[]>([]);
  const [audits, setAudits] = useState<AuditEvent[]>([]);

  // Fetch initial telemetry from backend
  const loadData = async () => {
    try {
      const hospData = await api.getHospitals().catch(() => []);
      if (hospData && hospData.length > 0) setHospitals(hospData);

      const capData = await api.getCapacities(1).catch(() => []);
      if (capData && capData.length > 0) setCapacities(capData);

      const ambData = await api.getAmbulances().catch(() => []);
      if (ambData && ambData.length > 0) setAmbulances(ambData);

      const refData = await api.getReferrals().catch(() => []);
      if (refData && refData.length > 0) setReferrals(refData);

      const alertData = await api.getAlerts().catch(() => []);
      if (alertData && alertData.length > 0) setAlerts(alertData);

      const procData = await api.getProcedures(1).catch(() => []);
      if (procData && procData.length > 0) setProcedures(procData);

      const audData = await api.getAudits().catch(() => []);
      if (audData && audData.length > 0) setAudits(audData);
    } catch (e) {
      console.warn('Backend loading in offline fallback mode:', e);
    }
  };

  useEffect(() => {
    loadData();
    // Periodic refresh every 15s to keep live operational synchronization
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setCurrentUser(userData);
    setCurrentRole(userData.role);
    setIsLoggedIn(true);

    // Default view for logged-in role
    switch (userData.role) {
      case 'DOCTOR':
        setCurrentView('doctor-dash');
        break;
      case 'NURSE':
        setCurrentView('nurse-dash');
        break;
      case 'AMBULANCE_CREW':
        setCurrentView('ambulance-driver');
        break;
      case 'AMBULANCE_COORDINATOR':
        setCurrentView('ambulance-coord');
        break;
      default:
        setCurrentView('overview');
    }
  };

  const handleRoleSelect = (role: Role) => {
    setCurrentRole(role);
    setShowRoleSelector(false);
    setIsLoggedIn(true);

    // Update current user name to reflect role
    const roleNames: Record<Role, string> = {
      ADMINISTRATOR: 'Dr. Sarah Johnson (Administrator)',
      DOCTOR: 'Dr. Priya Sharma (Cardiology Lead)',
      NURSE: 'Nurse Rahul Patel (Ward 3B)',
      BED_MANAGER: 'Anil Kumar (Bed Operations)',
      AMBULANCE_CREW: 'Mark Jenkins (EMS Unit 104)',
      AMBULANCE_COORDINATOR: 'Sarah Connor (Dispatch)',
      ICU_STAFF: 'Dr. Vance (Critical Care)',
      RECEPTIONIST: 'Emily Watson (Triage Desk)',
      EQUIPMENT_MANAGER: 'Marcus Kane (Biomedical)',
    };

    setCurrentUser(prev => ({
      id: prev?.id || 1,
      username: role.toLowerCase(),
      fullName: roleNames[role] || 'Authorized User',
      role: role,
      hospitalId: 1,
    }));

    switch (role) {
      case 'DOCTOR':
        setCurrentView('doctor-dash');
        break;
      case 'NURSE':
        setCurrentView('nurse-dash');
        break;
      case 'AMBULANCE_CREW':
        setCurrentView('ambulance-driver');
        break;
      case 'AMBULANCE_COORDINATOR':
        setCurrentView('ambulance-coord');
        break;
      default:
        setCurrentView('overview');
    }
  };

  const currentHospital = hospitals[0] || {
    id: 1,
    name: 'City General Hospital',
    code: 'CGH-01',
    address: '124 Medical Enclave, Central City',
    latitude: 12.9716,
    longitude: 77.5946,
    contactPhone: '+1-800-555-0101',
    contactEmail: 'operations@citygeneral.org',
    participationStatus: 'ACTIVE',
    operationalStatus: 'OPERATIONAL' as const,
    lastStatusUpdate: new Date().toISOString(),
    statusReason: 'Hospital is running normally with trauma bays and surgical suites ready.',
    statusUpdatedBy: 'Dr. Sarah Johnson',
  };

  const unreadAlerts = alerts.filter(a => !a.isAcknowledged).length;

  // View Routing: Show Login or Role Selector if not authenticated
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onSelectRoleDirect={(role) => handleRoleSelect(role)}
      />
    );
  }

  if (showRoleSelector) {
    return (
      <RoleSelectScreen
        onSelectRole={handleRoleSelect}
        onBackToLogin={() => {
          setShowRoleSelector(false);
          setIsLoggedIn(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentView}
        setCurrentTab={setCurrentView}
        userRole={currentRole}
        hospitalName={currentHospital.name}
        onLogout={() => setIsLoggedIn(false)}
        onSwitchRole={() => setShowRoleSelector(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          user={currentUser}
          hospitalStatus={currentHospital.operationalStatus}
          unreadAlertCount={unreadAlerts}
          onOpenNotifications={() => setCurrentView('notifications')}
          onOpenStatusModal={() => setShowStatusModal(true)}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'overview' && (
            <HospitalOverview
              hospital={currentHospital}
              capacities={capacities}
              alerts={alerts}
              onOpenStatusModal={() => setShowStatusModal(true)}
              onNavigateTab={(tab) => setCurrentView(tab)}
            />
          )}

          {currentView === 'hospital-status' && (
            <div className="space-y-4">
              <HospitalOverview
                hospital={currentHospital}
                capacities={capacities}
                alerts={alerts}
                onOpenStatusModal={() => setShowStatusModal(true)}
                onNavigateTab={(tab) => setCurrentView(tab)}
              />
            </div>
          )}

          {currentView === 'departments' && (
            <DepartmentStatusView
              capacities={capacities}
              onRefresh={loadData}
              currentUserRole={currentRole}
              currentUsername={currentUser?.username}
              onUpdateCapacity={async (deptId, data) => {
                await api.updateCapacity(deptId, data);
                await loadData();
              }}
            />
          )}

          {currentView === 'doctor-dash' && (
            <DoctorDashboard
              doctorName={currentUser?.fullName || 'Dr. Priya Sharma'}
              procedures={procedures}
              onOpenVoiceAssistant={() => setCurrentView('voice-transcription')}
              onLogDelay={async (procId, delayMins, reason) => {
                await api.logProcedureDelay(procId, delayMins, reason, currentUser?.username || 'doctor');
                await loadData();
              }}
            />
          )}

          {currentView === 'nurse-dash' && (
            <NurseDashboard
              onOpenVoiceAssistant={() => setCurrentView('voice-transcription')}
              onOpenWardUpdates={() => setCurrentView('departments')}
            />
          )}

          {currentView === 'ambulance-driver' && (
            <AmbulanceDriverView
              hospitals={hospitals}
              ambulance={ambulances[0] || null}
              onSendAlert={async (data) => {
                await api.createReferral(data);
                await loadData();
              }}
              onUpdateGps={async (unitId, lat, lng, eta) => {
                await api.updateAmbulanceLocation(unitId, { latitude: lat, longitude: lng, estimatedArrivalMinutes: eta });
                await loadData();
              }}
            />
          )}

          {currentView === 'ambulance-coord' && (
            <AmbulanceCoordinatorView
              referrals={referrals}
              onRefresh={loadData}
              onAcknowledge={async (id) => {
                await api.acknowledgeReferral(id, currentUser?.username || 'coordinator');
                await loadData();
              }}
              onDecide={async (id, decision, reason) => {
                await api.decideReferral(id, decision, reason, currentUser?.username || 'coordinator');
                await loadData();
              }}
            />
          )}

          {currentView === 'voice-transcription' && (
            <VoiceTranscriptionView
              currentRole={currentRole}
              clinicianName={currentUser?.fullName}
              clinicianId={currentUser?.id}
              onSaveAndSignOff={async (noteId, finalText, confirmed) => {
                await api.signOffVoice(noteId, finalText, confirmed, currentUser?.username || 'clinician');
                await loadData();
              }}
            />
          )}

          {currentView === 'ai-predictions' && (
            <AiPredictionsView
              forecasts={forecasts}
              onRefresh={loadData}
            />
          )}

          {currentView === 'crisis-simulation' && (
            <CrisisSimulationView
              simulations={simulations}
              onRunSimulation={async (data) => {
                const res = await api.runSimulation({ ...data, createdBy: currentUser?.username || 'admin' });
                await loadData();
                return res;
              }}
            />
          )}

          {currentView === 'procedures' && (
            <DoctorDashboard
              doctorName={currentUser?.fullName || 'Dr. Priya Sharma'}
              procedures={procedures}
              onOpenVoiceAssistant={() => setCurrentView('voice-transcription')}
              onLogDelay={async (procId, delayMins, reason) => {
                await api.logProcedureDelay(procId, delayMins, reason, currentUser?.username || 'doctor');
                await loadData();
              }}
            />
          )}

          {currentView === 'notifications' && (
            <NotificationsAndAuditView
              alerts={alerts}
              audits={audits}
              onRefresh={loadData}
              onAcknowledgeAlert={async (id) => {
                await api.acknowledgeAlert(id, currentUser?.username || 'admin');
                await loadData();
              }}
            />
          )}

          {currentView === 'network-map' && (
            <NetworkOverviewMapView
              hospitals={hospitals}
              ambulances={ambulances}
              onSelectHospital={(h) => {
                setCurrentView('overview');
              }}
            />
          )}
        </main>
      </div>

      {/* Hospital Status Edit Modal */}
      <HospitalStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        hospital={currentHospital}
        currentUsername={currentUser?.username}
        onStatusUpdated={(updated) => {
          setHospitals(prev => prev.map(h => h.id === updated.id ? updated : h));
          loadData();
        }}
      />
    </div>
  );
};

export default App;

