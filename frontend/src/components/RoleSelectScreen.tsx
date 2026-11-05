import React from 'react';
import { 
  Building2, 
  Stethoscope, 
  UserCheck, 
  Activity, 
  Bed, 
  Ambulance, 
  Headphones, 
  User, 
  Wrench,
  ArrowLeft
} from 'lucide-react';
import { Role } from '../types';

interface RoleSelectScreenProps {
  onSelectRole: (role: Role) => void;
  onBackToLogin: () => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ onSelectRole, onBackToLogin }) => {
  const roles = [
    {
      id: 'ADMINISTRATOR' as Role,
      title: 'Hospital Administrator',
      desc: 'Facility status, capacity, and system controls',
      icon: Building2,
      bg: 'bg-blue-600 hover:bg-blue-700',
      badge: 'Admin Access',
    },
    {
      id: 'DOCTOR' as Role,
      title: 'Doctor',
      desc: 'Procedures, delay tracking, voice assistant',
      icon: Stethoscope,
      bg: 'bg-emerald-600 hover:bg-emerald-700',
      badge: 'Clinical Lead',
    },
    {
      id: 'NURSE' as Role,
      title: 'Nurse',
      desc: 'Ward 3B updates, patient observations, issues',
      icon: UserCheck,
      bg: 'bg-purple-600 hover:bg-purple-700',
      badge: 'Ward Staff',
    },
    {
      id: 'ICU_STAFF' as Role,
      title: 'ICU Staff',
      desc: 'Critical bed capacity, ventilators, surge alerts',
      icon: Activity,
      bg: 'bg-rose-600 hover:bg-rose-700',
      badge: 'Critical Care',
    },
    {
      id: 'BED_MANAGER' as Role,
      title: 'Bed Manager',
      desc: 'Bed turnover, availability, and admission queue',
      icon: Bed,
      bg: 'bg-orange-600 hover:bg-orange-700',
      badge: 'Logistics',
    },
    {
      id: 'AMBULANCE_CREW' as Role,
      title: 'Ambulance Driver',
      desc: 'GPS ETA, nearby facility readiness, arrival alerts',
      icon: Ambulance,
      bg: 'bg-sky-500 hover:bg-sky-600',
      badge: 'Mobile App',
    },
    {
      id: 'AMBULANCE_COORDINATOR' as Role,
      title: 'Ambulance Coordinator',
      desc: 'Inter-hospital referrals, dispatch & triage handoffs',
      icon: Headphones,
      bg: 'bg-teal-600 hover:bg-teal-700',
      badge: 'Dispatch Hub',
    },
    {
      id: 'RECEPTIONIST' as Role,
      title: 'Receptionist',
      desc: 'Patient intake, check-in, triage registry',
      icon: User,
      bg: 'bg-indigo-600 hover:bg-indigo-700',
      badge: 'Front Desk',
    },
    {
      id: 'EQUIPMENT_MANAGER' as Role,
      title: 'Equipment Manager',
      desc: 'Ventilators, monitors, maintenance tracking',
      icon: Wrench,
      bg: 'bg-slate-700 hover:bg-slate-800',
      badge: 'Biomedical',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 sm:p-10">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">MediSync Operational Gateway</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Select Your Role
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Choose your role to continue into the role-specific emergency coordination workspace.
          </p>
        </div>

        {/* 3x3 Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectRole(item.id)}
                className={`group p-6 rounded-2xl text-white text-left transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between h-44 shadow-md ${item.bg}`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20 text-white/90">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-0.5 group-hover:translate-x-0.5 transition-transform">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="mt-10 text-center text-xs text-slate-600">
          Role-based security enforced. Clinical documentation requires human clinician sign-off.
        </div>
      </div>
    </div>
  );
};

