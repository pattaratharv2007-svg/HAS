import React from 'react';
import { 
  Building2, 
  Activity, 
  Bed, 
  Ambulance, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  History, 
  Settings, 
  MapPin, 
  Mic, 
  UserCheck, 
  LogOut,
  Stethoscope
} from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: Role;
  hospitalName?: string;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  hospitalName = 'City General Hospital',
  onLogout,
  onSwitchRole,
}) => {
  // Navigation tabs adapted to role (per PDF Role-Based Navigation)
  const getNavItems = () => {
    switch (userRole) {
      case 'DOCTOR':
        return [
          { id: 'doctor-dash', label: 'Doctor Dashboard', icon: Stethoscope },
          { id: 'voice-transcription', label: 'Voice Assistant', icon: Mic },
          { id: 'procedures', label: 'Procedure Delays', icon: AlertTriangle },
          { id: 'departments', label: 'Department Status', icon: Activity },
          { id: 'notifications', label: 'Notifications', icon: FileText },
        ];
      case 'NURSE':
        return [
          { id: 'nurse-dash', label: 'Nurse Dashboard (Ward 3B)', icon: UserCheck },
          { id: 'voice-transcription', label: 'Voice Notes', icon: Mic },
          { id: 'departments', label: 'Department Status', icon: Activity },
          { id: 'notifications', label: 'Notifications', icon: FileText },
        ];
      case 'AMBULANCE_CREW':
        return [
          { id: 'ambulance-driver', label: 'Ambulance Driver App', icon: Ambulance },
          { id: 'network-map', label: 'Hospital Network Map', icon: MapPin },
          { id: 'notifications', label: 'Arrival Alerts', icon: FileText },
        ];
      case 'AMBULANCE_COORDINATOR':
        return [
          { id: 'ambulance-coord', label: 'Coordinator Dispatch', icon: Ambulance },
          { id: 'network-map', label: 'Hospital Network Map', icon: MapPin },
          { id: 'notifications', label: 'Incoming Alerts', icon: FileText },
        ];
      default: // ADMINISTRATOR, BED_MANAGER, etc.
        return [
          { id: 'overview', label: 'Overview', icon: Building2 },
          { id: 'hospital-status', label: 'Hospital Status', icon: Activity },
          { id: 'departments', label: 'Departments', icon: Bed },
          { id: 'network-map', label: 'Network Overview', icon: MapPin },
          { id: 'ambulance-coord', label: 'Ambulance Coordination', icon: Ambulance },
          { id: 'ai-predictions', label: 'AI Predictions', icon: TrendingUp },
          { id: 'crisis-simulation', label: 'Crisis Simulation', icon: AlertTriangle },
          { id: 'voice-transcription', label: 'Voice Transcription', icon: Mic },
          { id: 'notifications', label: 'Notifications & Audits', icon: History },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-[#0a192f] text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20">
          <span className="text-xl leading-none font-black">+</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white leading-tight">MediSync</h1>
          <p className="text-xs text-slate-400 truncate max-w-[150px]">{hospitalName}</p>
        </div>
      </div>

      {/* Role Pill Switcher */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300 capitalize">{userRole.toLowerCase().replace('_', ' ')}</span>
        </div>
        <button
          onClick={onSwitchRole}
          className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition-colors"
        >
          Switch Role
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

