# MediSync CareLink - Multi-Hospital & Ambulance Coordination System

A full-stack real-time emergency healthcare and hospital bed coordination platform built according to the **CareLink Project Documentation & UI Specification**.

---

## 📁 Project Architecture

```
HAS/
├── backend/                  # Java 21 + Spring Boot REST APIs
│   ├── src/main/java/com/example/HAS/
│   │   ├── config/           # CORS, GlobalExceptionHandler, DataInitializer
│   │   ├── controller/       # 13 REST Controllers
│   │   ├── dto/              # API Request/Response Data Transfer Objects
│   │   ├── entity/           # JPA Entities & Enums (PostgreSQL / H2)
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   └── service/          # Business logic, audit logging, & validations
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                 # React 18 + TypeScript + Tailwind CSS + Vite
    ├── src/
    │   ├── components/       # Exact UI screens matching the design specification
    │   │   ├── LoginScreen.tsx                 # Screen 1: Login & Welcome Back
    │   │   ├── RoleSelectScreen.tsx            # Screen 2: Role Selection 3x3 Grid
    │   │   ├── HospitalOverview.tsx            # Screen 3: Administrator Dashboard
    │   │   ├── HospitalStatusModal.tsx         # Screen 4: Central Status Modal
    │   │   ├── DepartmentStatusView.tsx        # Screen 5: Department Status Table
    │   │   ├── DoctorDashboard.tsx             # Screen 6: Doctor Workspace & Delays
    │   │   ├── VoiceTranscriptionView.tsx      # Screen 7 & 8: AI Voice Dictation & Clinician Review
    │   │   ├── NurseDashboard.tsx              # Screen 9: Ward 3B Active Dashboard
    │   │   ├── AmbulanceDriverView.tsx         # Screen 10: Mobile Phone View for Drivers
    │   │   ├── AmbulanceCoordinatorView.tsx    # Screen 11: Dispatch & Referral Triage
    │   │   ├── AiPredictionsView.tsx           # Screen 12: Predictive Demand Forecasting
    │   │   ├── CrisisSimulationView.tsx        # Screen 13: Isolated Surge Stress Testing
    │   │   ├── NotificationsAndAuditView.tsx   # Screen 14: Alert Feeds & Immutable Audit Logs
    │   │   ├── NetworkOverviewMapView.tsx      # Screen 15: Regional GIS Hospital Map
    │   │   ├── Navbar.tsx                      # Header with status pill & unread alert bell
    │   │   └── Sidebar.tsx                     # MediSync Role-Based Navigation
    │   ├── api.ts            # Type-safe API client communicating with backend
    │   ├── types.ts          # TypeScript interfaces for all models
    │   ├── App.tsx           # Main application state and screen router
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts        # Built-in proxy to backend port 8080
```

---

## ⚡ Quick Start Guide

### 1. Start the Backend (Port 8080)
```powershell
cd HAS\backend
mvn spring-boot:run
```
* **API Base:** `http://localhost:8080/api`
* **H2 Database Console:** `http://localhost:8080/h2-console`
  * JDBC URL: `jdbc:h2:mem:carelinkdb`
  * User: `sa` | Password: *(blank)*

### 2. Start the Frontend (Port 3000)
```powershell
cd HAS\frontend
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 👥 Default Demo Credentials & Roles

| Role | Username | Password | Dedicated View |
| :--- | :--- | :--- | :--- |
| **Hospital Administrator** | `admin` | `admin123` | Hospital Overview, Central Status, Simulation |
| **Doctor (Cardiology)** | `doctor.priya` | `doctor123` | Doctor Dashboard, Procedure Delays, Voice Dictation |
| **Nurse (Ward 3B)** | `nurse.rahul` | `nurse123` | Ward 3B Roster, Patient Observations, Voice Notes |
| **Bed Manager** | `bedmanager.anil` | `bed123` | Department Status, Capacity Updating |
| **Ambulance Driver** | `crew.unit104` | `crew123` | Mobile Phone Frame, Nearby Hospitals, Send Alert |
| **Ambulance Coordinator**| `coordinator.sarah` | `coord123`| Dispatch Hub, Referral Handoff Acceptance/Decline |

---

## 🔒 Key Design Guarantees Implemented
* **One Trusted Operational Picture:** All roles read and write to the same transactional state.
* **Role-Specific Access:** The sidebar and actionable buttons filter strictly according to user authorization.
* **Delivery is Not Acceptance:** Referrals follow an explicit multi-step lifecycle: `SENT` $\rightarrow$ `DELIVERED` $\rightarrow$ `ACKNOWLEDGED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `ACCEPTED` / `DECLINED` $\rightarrow$ `COMPLETED`.
* **Isolated Crisis Simulations:** "What-if" simulations are strictly quarantined from production records with the `"SIMULATION — NOT LIVE HOSPITAL DATA"` watermark.
* **Medication Safety & Clinician Sign-Off:** AI voice transcription drafts cannot become official medical records without human clinician verification and authentication.

