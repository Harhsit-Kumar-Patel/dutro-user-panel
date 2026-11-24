import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronDown,
  Bell,
  Check,
  Moon,
  Target,
  Copy,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { RoleType } from '../../types';

export const Header: React.FC = () => {
  const {
    appMode,
    activeSection,
    platformLandscape,
    platformSubTab,
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationRead,
    clearNotifications,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length || 6;

  // Resolve Header Title & Subtitle based on navigation
  const getHeaderTitles = () => {
    if (appMode === 'admin') {
      switch (activeSection) {
        case 'admin-panel':
          return {
            title: 'Admin Panel',
            subtitle: 'WELCOME HOME, HARSHIT PATEL',
          };
        case 'users':
          return {
            title: 'User Management',
            subtitle: 'MANAGE ROLES, STATUS, SYSTEM ACCESS',
          };
        case 'projects':
          return {
            title: 'Projects',
            subtitle: 'MANAGE COMPLIANCE PROJECTS',
          };
        case 'prompts':
          return {
            title: 'Prompts',
            subtitle: 'WORDING FOR CONTROL MAPPING, GAP ANALYSIS, AND MINUTES OF MEETING',
          };
        case 'pending-case-laws':
          return {
            title: 'Pending case laws',
            subtitle: 'FETCH OFFICIAL HITS, THEN ACCEPT INTO CASE LAWS',
          };
        default:
          return {
            title: 'Admin Panel',
            subtitle: 'WELCOME HOME, HARSHIT PATEL',
          };
      }
    }

    // Platform mode
    switch (platformLandscape) {
      case 'company':
        return {
          title: 'Company Landscape',
          subtitle: 'CORPORATE ENTITY & GLOBAL PRIVACY FRAMEWORK',
        };
      case 'department':
        return {
          title: 'Department Landscape',
          subtitle: 'DISCOVERY, VENDORS & ROPA REPOSITORY',
        };
      case 'risk':
        return {
          title: 'Risk Landscape',
          subtitle: 'GAP ANALYSIS & DPO RISK GOVERNANCE',
        };
      case 'trust':
        return {
          title: 'Trust Landscape',
          subtitle: 'COMPLIANCE AUDIT TRAIL & REGULATORY INTELLIGENCE',
        };
      case 'consent':
        return {
          title: 'Consent Landscape',
          subtitle: 'COOKIE CONSENT & UNIVERSAL CMP',
        };
      default:
        return {
          title: 'Dutro Enterprise',
          subtitle: 'GLOBAL DATA PRIVACY & COMPLIANCE',
        };
    }
  };

  const { title, subtitle } = getHeaderTitles();

  const availableRoles: RoleType[] = [
    'Enterprise Admin',
    'Consultant',
    'Data Protection Officer',
    'Program Owner',
    'Department Owner',
    'Department POC',
    'Customer',
    'User',
  ];

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-8 select-none shrink-0 z-20">
      {/* Left: Page Title & Uppercase Tracking Subtitle matching Image 1 */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Right: Quick Action Icons & User Persona Profile */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          type="button"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          title="Toggle theme"
        >
          <Moon className="h-4 w-4" />
        </button>

        {/* Target icon */}
        <button
          type="button"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          title="Targets"
        >
          <Target className="h-4 w-4" />
        </button>

        {/* Copy / Window icon */}
        <button
          type="button"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          title="Window overview"
        >
          <Copy className="h-4 w-4" />
        </button>

        {/* Notifications Bell with count badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white py-2 shadow-xl z-50">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className="p-3 hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="font-semibold text-slate-800">{n.title}</div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar matching Image 1 */}
        <div className="relative pl-1">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-slate-100 transition cursor-pointer"
          >
            {/* Avatar Circle HP */}
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              HP
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                Harshit Patel
              </div>
              <div className="text-[10px] text-slate-400 leading-none flex items-center gap-0.5 mt-0.5">
                <span>{currentRole}</span>
                <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
              </div>
            </div>
          </button>

          {/* Persona Switcher Dropdown */}
          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Switch Active Persona
                </div>
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setCurrentRole(role);
                      setProfileDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 transition hover:bg-slate-50 cursor-pointer ${
                      currentRole === role ? 'bg-blue-50/80 text-blue-700 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <span>{role}</span>
                    {currentRole === role && <Check className="h-3 w-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
