import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AccessDeniedScreen } from './components/layout/AccessDeniedScreen';

// --- DUTRO ADMIN VIEWS (Matching Product Screenshots) ---
import { AdminPanelView } from './components/admin/AdminPanelView';
import { UserManagementView } from './components/admin/UserManagementView';
import { ProjectsView } from './components/admin/ProjectsView';
import { PromptsView } from './components/admin/PromptsView';
import { PendingCaseLawsView } from './components/admin/PendingCaseLawsView';

// --- DUTRO PLATFORM: 5 LANDSCAPES ---
// 1. Company Landscape
import { CompanyProfileView } from './components/platform/company/CompanyProfileView';
import { GlobalFrameworkView } from './components/platform/company/GlobalFrameworkView';
import { DashboardView } from './components/platform/company/DashboardView';
import { DataLineageView } from './components/platform/company/DataLineageView';
import { WorkspaceView } from './components/platform/company/WorkspaceView';

// 2. Department Landscape
import { DepartmentWorkspaceView } from './components/platform/department/DepartmentWorkspaceView';
import { VendorsView } from './components/platform/department/VendorsView';
import { EvidenceBankView } from './components/platform/department/EvidenceBankView';

// 3. Risk Landscape
import { GapAnalysisView } from './components/platform/risk/GapAnalysisView';
import { RiskRegisterView } from './components/platform/risk/RiskRegisterView';
import { ReportsView } from './components/platform/risk/ReportsView';

// 4. Trust Landscape
import { ComplianceLogView } from './components/platform/trust/ComplianceLogView';
import { PolicyCentreView } from './components/platform/trust/PolicyCentreView';
import { RegulatoryIntelligenceView } from './components/platform/trust/RegulatoryIntelligenceView';

// 5. Consent Landscape
import { CookieConsentView } from './components/platform/consent/CookieConsentView';
import { UniversalConsentView } from './components/platform/consent/UniversalConsentView';

import { ChevronRight, Shield } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    appMode,
    platformLandscape,
    platformSubTab,
    activeSection,
    currentRole,
  } = useApp();

  // Enforce access boundaries for Admin mode:
  // Only Enterprise Admin and Consultant (with permitted limits) can enter Admin panel
  if (appMode === 'admin') {
    const isBlockedRole =
      currentRole !== 'Enterprise Admin' && currentRole !== 'Consultant';

    if (isBlockedRole) {
      return <AccessDeniedScreen />;
    }

    // Administration Views matching the product screenshots
    switch (activeSection) {
      case 'admin-panel':
      case 'organisation':
        return <AdminPanelView />;
      case 'users':
        return <UserManagementView />;
      case 'projects':
        return <ProjectsView />;
      case 'prompts':
        return <PromptsView />;
      case 'pending-case-laws':
        return <PendingCaseLawsView />;
      default:
        return <AdminPanelView />;
    }
  }

  // --------------------------------------------------------------------------
  // PLATFORM MODE RENDERER
  // --------------------------------------------------------------------------
  const platformLandscapeTitles: Record<string, string> = {
    company: 'Company Landscape',
    department: 'Department Landscape',
    risk: 'Risk Landscape',
    trust: 'Trust Landscape',
    consent: 'Consent Landscape',
  };

  const platformSubTabTitles: Record<string, string> = {
    profile: 'Company Profile',
    framework: 'Global Framework',
    dashboard: 'Governance Dashboard',
    lineage: 'Data Lineage',
    workspace: 'Workspace & Documents',
    discovery: 'Discovery & RoPA',
    vendors: 'Vendors Directory & Risk Assessment',
    evidence: 'Evidence Bank',
    gaps: 'Gap Analysis & DPO Gate',
    register: 'Risk Register',
    reports: 'Compliance & RoPA Reports & MoM',
    'compliance-log': 'Compliance Log & Audit Trail',
    policy: 'Policy Centre',
    regulatory: 'Regulatory Intelligence & Knowledge Base',
    cookie: 'Cookie Consent CMP',
    universal: 'Universal Consent Governance',
  };

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
          <Shield className="h-3.5 w-3.5 text-blue-600" />
          <span>Dutro Platform</span>
        </span>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className="text-slate-700 font-semibold">
          {platformLandscapeTitles[platformLandscape] || platformLandscape}
        </span>
        {platformSubTab && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-slate-900 font-bold uppercase tracking-wider text-[11px] bg-slate-200/70 px-2 py-0.5 rounded">
              {platformSubTabTitles[platformSubTab] || platformSubTab}
            </span>
          </>
        )}
      </nav>

      {/* 1. COMPANY LANDSCAPE */}
      {platformLandscape === 'company' && (
        <div className="space-y-6">
          {platformSubTab === 'profile' && <CompanyProfileView />}
          {platformSubTab === 'framework' && <GlobalFrameworkView />}
          {platformSubTab === 'dashboard' && <DashboardView />}
          {platformSubTab === 'lineage' && <DataLineageView />}
          {platformSubTab === 'workspace' && <WorkspaceView />}
        </div>
      )}

      {/* 2. DEPARTMENT LANDSCAPE */}
      {platformLandscape === 'department' && (
        <div className="space-y-6">
          {platformSubTab === 'discovery' && <DepartmentWorkspaceView />}
          {platformSubTab === 'vendors' && <VendorsView />}
          {platformSubTab === 'evidence' && <EvidenceBankView />}
        </div>
      )}

      {/* 3. RISK LANDSCAPE */}
      {platformLandscape === 'risk' && (
        <div className="space-y-6">
          {platformSubTab === 'gaps' && <GapAnalysisView />}
          {platformSubTab === 'register' && <RiskRegisterView />}
          {platformSubTab === 'reports' && <ReportsView />}
        </div>
      )}

      {/* 4. TRUST LANDSCAPE */}
      {platformLandscape === 'trust' && (
        <div className="space-y-6">
          {platformSubTab === 'compliance-log' && <ComplianceLogView />}
          {platformSubTab === 'policy' && <PolicyCentreView />}
          {platformSubTab === 'regulatory' && <RegulatoryIntelligenceView />}
        </div>
      )}

      {/* 5. CONSENT LANDSCAPE */}
      {platformLandscape === 'consent' && (
        <div className="space-y-6">
          {platformSubTab === 'cookie' && <CookieConsentView />}
          {platformSubTab === 'universal' && <UniversalConsentView />}
        </div>
      )}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-white font-sans">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <MainContent />
        </div>
      </div>
    </AppProvider>
  );
}
