import React, { useState } from 'react';
import { useApp, MainSection, PlatformLandscape } from '../../context/AppContext';
import {
  KeyRound,
  Folder,
  Users,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  AlertTriangle,
  Scale,
  Cookie,
  Layers,
  FileCheck2,
  Building,
  Shield,
  Briefcase,
  Building2,
  Globe,
  LayoutDashboard,
  Network,
  GitFork,
} from 'lucide-react';

interface NavSectionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    setActiveSubTab,
    appMode,
    setAppMode,
    platformLandscape,
    setPlatformLandscape,
    platformSubTab,
    setPlatformSubTab,
    currentCompanyId,
    companies,
  } = useApp();

  // Accordion state: which section is currently expanded
  const [expandedLandscape, setExpandedLandscape] = useState<string | null>('admin');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const selectedCompany = companies.find((c) => c.id === currentCompanyId);

  // Administration items matching Image 5
  const ADMIN_MENU_ITEMS: NavSectionItem[] = [
    {
      id: 'admin-panel',
      label: 'Admin Panel',
      icon: <KeyRound className="h-4 w-4" />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Folder className="h-4 w-4" />,
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 'prompts',
      label: 'Prompts',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: 'pending-case-laws',
      label: 'Pending case laws',
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  const COMPANY_ITEMS: NavSectionItem[] = [
    { id: 'profile', label: 'Company Profile', icon: <Building2 className="h-4 w-4" /> },
    { id: 'framework', label: 'Global Framework', icon: <Globe className="h-4 w-4" /> },
    { id: 'dashboard', label: 'Governance Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'lineage', label: 'Data Lineage', icon: <Network className="h-4 w-4" /> },
    { id: 'workspace', label: 'Workspace', icon: <Briefcase className="h-4 w-4" /> },
  ];

  const DEPARTMENT_ITEMS: NavSectionItem[] = [
    { id: 'discovery', label: 'Discovery & RoPA', icon: <GitFork className="h-4 w-4" /> },
    { id: 'vendors', label: 'Vendors', icon: <Building className="h-4 w-4" /> },
    { id: 'evidence', label: 'Evidence Bank', icon: <FileCheck2 className="h-4 w-4" /> },
  ];

  const RISK_ITEMS: NavSectionItem[] = [
    { id: 'org-gap', label: 'Org-Wide Gap Assessment', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'gaps', label: 'Gap Analysis', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'register', label: 'Risk Register', icon: <Shield className="h-4 w-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="h-4 w-4" /> },
  ];

  const TRUST_ITEMS: NavSectionItem[] = [
    { id: 'compliance-log', label: 'Compliance Log', icon: <FileCheck2 className="h-4 w-4" /> },
    { id: 'policy', label: 'Policy Centre', icon: <Building className="h-4 w-4" /> },
    { id: 'regulatory', label: 'Regulatory Intelligence', icon: <Scale className="h-4 w-4" /> },
  ];

  const CONSENT_ITEMS: NavSectionItem[] = [
    { id: 'cookie', label: 'Cookie Consent', icon: <Cookie className="h-4 w-4" /> },
    { id: 'universal', label: 'Universal Consent', icon: <Layers className="h-4 w-4" /> },
  ];

  const toggleSection = (sectionName: string) => {
    setExpandedLandscape((prev) => (prev === sectionName ? null : sectionName));
  };

  const handleAdminItemClick = (id: string) => {
    setAppMode('admin');
    setActiveSection(id as MainSection);
    if (id === 'admin-panel') {
      setActiveSubTab('companies');
    } else if (id === 'users') {
      setActiveSubTab('all');
    }
  };

  const handleLandscapeItemClick = (landscape: PlatformLandscape, subTab: string) => {
    setAppMode('platform');
    setPlatformLandscape(landscape);
    setPlatformSubTab(subTab);
  };

  if (isSidebarCollapsed) {
    return (
      <aside className="w-14 flex-shrink-0 border-r border-slate-200 bg-white text-slate-700 flex flex-col justify-between py-4 items-center select-none">
        <div className="space-y-4">
          <span className="text-sm font-black tracking-tighter text-slate-900">dutro</span>
          <div className="h-px w-6 bg-slate-200" />
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-60 flex-shrink-0 border-r border-slate-200 bg-white text-slate-700 flex flex-col justify-between select-none">
      <div className="p-3.5 space-y-4 overflow-y-auto">
        {/* Brand Logo & Active Company matching Image 1 */}
        <div className="px-2 pt-1 pb-1">
          <div className="text-xl font-bold tracking-tight text-slate-900">dutro</div>

          <div className="mt-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ACTIVE COMPANY
            </div>
            <div className="text-xs font-semibold text-slate-800 truncate mt-0.5">
              {selectedCompany?.name || 'Demo Company'}
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-2 pt-1">
          {/* A. COMPANY LANDSCAPE */}
          <div className="space-y-0.5">
            <button
              onClick={() => toggleSection('company')}
              className="flex w-full items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <span>COMPANY LANDSCAPE</span>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 transition-transform ${
                  expandedLandscape === 'company' ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {expandedLandscape === 'company' && (
              <div className="space-y-0.5 pl-1 pt-0.5">
                {COMPANY_ITEMS.map((item) => {
                  const isActive = appMode === 'platform' && platformLandscape === 'company' && platformSubTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLandscapeItemClick('company', item.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                        isActive
                          ? 'text-blue-600 font-medium'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* B. DEPARTMENT LANDSCAPE */}
          <div className="space-y-0.5">
            <button
              onClick={() => toggleSection('department')}
              className="flex w-full items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <span>DEPARTMENT LANDSCAPE</span>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 transition-transform ${
                  expandedLandscape === 'department' ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {expandedLandscape === 'department' && (
              <div className="space-y-0.5 pl-1 pt-0.5">
                {DEPARTMENT_ITEMS.map((item) => {
                  const isActive = appMode === 'platform' && platformLandscape === 'department' && platformSubTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLandscapeItemClick('department', item.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                        isActive
                          ? 'text-blue-600 font-medium'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 1. RISK LANDSCAPE */}
          <div className="space-y-0.5">
            <button
              onClick={() => toggleSection('risk')}
              className="flex w-full items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <span>RISK LANDSCAPE</span>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 transition-transform ${
                  expandedLandscape === 'risk' ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {expandedLandscape === 'risk' && (
              <div className="space-y-0.5 pl-1 pt-0.5">
                {RISK_ITEMS.map((item) => {
                  const isActive = appMode === 'platform' && platformLandscape === 'risk' && platformSubTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLandscapeItemClick('risk', item.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                        isActive
                          ? 'text-blue-600 font-medium'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. TRUST LANDSCAPE */}
          <div className="space-y-0.5">
            <button
              onClick={() => toggleSection('trust')}
              className="flex w-full items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <span>TRUST LANDSCAPE</span>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 transition-transform ${
                  expandedLandscape === 'trust' ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {expandedLandscape === 'trust' && (
              <div className="space-y-0.5 pl-1 pt-0.5">
                {TRUST_ITEMS.map((item) => {
                  const isActive = appMode === 'platform' && platformLandscape === 'trust' && platformSubTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLandscapeItemClick('trust', item.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                        isActive
                          ? 'text-blue-600 font-medium'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. CONSENT LANDSCAPE */}
          <div className="space-y-0.5">
            <button
              onClick={() => toggleSection('consent')}
              className="flex w-full items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <span>CONSENT LANDSCAPE</span>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 transition-transform ${
                  expandedLandscape === 'consent' ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {expandedLandscape === 'consent' && (
              <div className="space-y-0.5 pl-1 pt-0.5">
                {CONSENT_ITEMS.map((item) => {
                  const isActive = appMode === 'platform' && platformLandscape === 'consent' && platformSubTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLandscapeItemClick('consent', item.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                        isActive
                          ? 'text-blue-600 font-medium'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. ADMINISTRATION (Exact match to Image 5) */}
          <div className="space-y-0.5">
            <button
              onClick={() => toggleSection('admin')}
              className="flex w-full items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <span>ADMINISTRATION</span>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 transition-transform ${
                  expandedLandscape === 'admin' ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {expandedLandscape === 'admin' && (
              <div className="space-y-0.5 pl-1 pt-0.5">
                {ADMIN_MENU_ITEMS.map((item) => {
                  const isItemActive = appMode === 'admin' && activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleAdminItemClick(item.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                        isItemActive
                          ? 'text-blue-600 font-medium'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className={isItemActive ? 'text-blue-600' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Area: Settings & Collapse Button matching Image 1 */}
      <div className="border-t border-slate-100 p-2">
        <button
          type="button"
          onClick={() => {
            setAppMode('admin');
            setActiveSection('admin-panel');
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
        >
          <Settings className="h-4 w-4 text-slate-400" />
          <span>Settings</span>
        </button>

        <div className="flex items-center justify-between pt-2 px-2.5">
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[10px] text-slate-400 font-mono">v2.4</span>
        </div>
      </div>
    </aside>
  );
};
