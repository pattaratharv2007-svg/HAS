export type Role = 
  | 'ADMINISTRATOR' 
  | 'DOCTOR' 
  | 'NURSE' 
  | 'BED_MANAGER' 
  | 'AMBULANCE_CREW' 
  | 'AMBULANCE_COORDINATOR'
  | 'ICU_STAFF'
  | 'RECEPTIONIST'
  | 'EQUIPMENT_MANAGER';

export type HospitalStatus = 
  | 'OPERATIONAL' 
  | 'HIGH_WORKLOAD' 
  | 'LIMITED_CAPACITY' 
  | 'CRITICAL_CAPACITY' 
  | 'TEMPORARILY_RESTRICTED';

export type VerificationState = 'VERIFIED' | 'UNVERIFIED' | 'AGING' | 'STALE';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  role: Role;
  hospitalId?: number;
  ambulanceUnitId?: number;
}

export interface Hospital {
  id: number;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail: string;
  participationStatus: string;
  operationalStatus: HospitalStatus;
  statusReason?: string;
  statusUpdatedBy?: string;
  lastStatusUpdate: string;
  capabilitiesSummary?: string;
}

export interface Department {
  id: number;
  hospitalId: number;
  name: string;
  code: string;
  departmentType: string;
  contactPhone?: string;
  headOfDepartment?: string;
  active: boolean;
}

export interface DepartmentCapacity {
  id: number;
  hospitalId: number;
  departmentId: number;
  departmentName: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  outOfServiceBeds: number;
  icuTotal: number;
  icuOccupied: number;
  icuAvailable: number;
  ventilatorsTotal: number;
  ventilatorsAvailable: number;
  staffOnDuty: number;
  activeWorkloadLevel: string;
  lastUpdated: string;
  updatedBy?: string;
  updaterRole?: string;
  verificationState: VerificationState;
  verificationNotes?: string;
}

export interface AmbulanceUnit {
  id: number;
  unitNumber: string;
  licensePlate: string;
  crewLeadName: string;
  crewContactPhone: string;
  capabilities: string;
  status: 'AVAILABLE' | 'DISPATCHED' | 'EN_ROUTE_TO_HOSPITAL' | 'AT_HOSPITAL' | 'OUT_OF_SERVICE';
  currentLatitude?: number;
  currentLongitude?: number;
  speedKmH?: number;
  destinationHospitalId?: number;
  destinationHospitalName?: string;
  estimatedArrivalMinutes?: number;
  lastLocationUpdate?: string;
  locationAvailable: boolean;
}

export interface ReferralRequest {
  id: number;
  referralCode: string;
  ambulanceUnitId?: number;
  ambulanceUnitNumber?: string;
  destinationHospitalId: number;
  destinationHospitalName?: string;
  originHospitalId?: number;
  originHospitalName?: string;
  patientDeIdentifiedReference: string;
  clinicalOperationalSummary: string;
  urgencyLevel: string;
  requiredServices: string;
  estimatedArrivalMinutes?: number;
  status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'ACKNOWLEDGED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
  decisionReason?: string;
  redirectedHospitalId?: number;
  redirectedHospitalName?: string;
  sentAt?: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  decisionAt?: string;
  decisionBy?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Alert {
  id: number;
  hospitalId?: number;
  departmentId?: number;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  alertType: string;
  sourceRecordType?: string;
  sourceRecordId?: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  escalated: boolean;
  escalatedToRole?: string;
  createdAt: string;
}

export interface ForecastRecord {
  id: number;
  hospitalId: number;
  metricName: string;
  timeHorizonHours: number;
  predictedValue: number;
  lowerBound: number;
  upperBound: number;
  confidenceScore: number;
  modelVersion: string;
  generatedAt: string;
  limitations: string;
}

export interface CrisisSimulation {
  id: number;
  scenarioName: string;
  scenarioType: string;
  surgeMultiplier: number;
  durationHours: number;
  staffReductionPercent: number;
  bedReductionPercent: number;
  affectedHospitalIds?: string;
  projectedBedOccupancyPercent: number;
  projectedIcuDeficit: number;
  projectedWaitTimeIncreaseMinutes: number;
  resourcePressureRisk: string;
  simulationDisclaimer: string;
  createdBy: string;
  createdAt: string;
  notes?: string;
}

export interface ProcedureRecord {
  id: number;
  hospitalId: number;
  departmentId: number;
  procedureName: string;
  patientReference: string;
  responsibleTeam: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'DELAYED' | 'COMPLETED';
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  delayDurationMinutes: number;
  delayReason?: string;
  delayThresholdMinutes: number;
  delayAlertTriggered: boolean;
  lastUpdated: string;
}

export interface ClinicalVoiceNote {
  id: number;
  hospitalId?: number;
  departmentId?: number;
  authorClinicianId: number;
  authorClinicianName: string;
  authorRole: 'DOCTOR' | 'NURSE';
  patientReference: string;
  audioDurationSeconds: number;
  transcriptDraft: string;
  isAiDraft: boolean;
  aiConfidenceScore: number;
  processingMetadata: string;
  finalAuthenticatedNote?: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'SIGNED_OFF' | 'REJECTED';
  createdAt: string;
  signedOffAt?: string;
  signedOffBy?: string;
}

export interface AuditEvent {
  id: number;
  actor: string;
  actorRole?: string;
  action: string;
  targetType: string;
  targetId?: string;
  beforeValue?: string;
  afterValue?: string;
  details?: string;
  hospitalId?: number;
  timestamp: string;
}

