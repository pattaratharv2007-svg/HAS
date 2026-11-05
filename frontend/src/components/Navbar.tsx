import React from 'react';
import { Bell, ShieldCheck, User } from 'lucide-react';
import { HospitalStatus, User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  hospitalStatus?: HospitalStatus;
  unreadAlertCount: number;
  onOpenNotifications: () => void;
  onOpenStatusModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  hospitalStatus = 'OPERATIONAL',
  unreadAlertCount,
  onOpenNotifications,
  onOpenStatusModal,
}) => {
  const getStatusBadge = () => {
    switch (hospitalStatus) {
      case 'OPERATIONAL':
        return { label: 'Operational', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'HIGH_WORKLOAD':
        return { label: 'High Workload', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'LIMITED_CAPACITY':
        return { label: 'Limited Capacity', bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
      case 'CRITICAL_CAPACITY':
        return { label: 'Critical Capacity', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
      case 'TEMPORARILY_RESTRICTED':
        return { label: 'Temporarily Restricted', bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' };
    }
  };

  const status = getStatusBadge();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Facility Indicator & Status Pill */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenStatusModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xs hover:opacity-90 transition ${status.bg}`}
          title="Click to manage hospital operational status"
        >
          <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{status.label}</span>
        </button>
        <span className="hidden md:inline text-xs text-slate-600 font-medium">
          City General Hospital • Emergency Network Live
        </span>
      </div>

      {/* Right: Notifications & User profile */}
      <div className="flex items-center gap-4">
        {/* Alert Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center font-bold text-sm">
            {user?.fullName?.charAt(0) || <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-sm font-semibold text-slate-800">{user?.fullName || 'Dr. Sarah Johnson'}</p>
            <p className="text-[11px] text-slate-600 font-medium capitalize">{user?.role?.toLowerCase().replace('_', ' ') || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

