import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Company, User } from '../../types';
import {
  Search,
  ChevronDown,
  Info,
  Trash2,
  Check,
  X,
  Plus,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { EditAccessModal } from './EditAccessModal';
import { CompanyStructureDetailView } from './CompanyStructureDetailView';

export const AdminPanelView: React.FC = () => {
  const {
    companies,
    legalEntities,
    departments,
    users,
    currentCompanyId,
    setCurrentCompanyId,
    setAppMode,
    setPlatformLandscape,
    setPlatformSubTab,
    approveRegistration,
    rejectRegistration,
    reactivateUser,
    suspendUser,
    deleteUser,
    addNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'companies' | 'approvals' | 'assignments'>('companies');
  const [approvalsSubPill, setApprovalsSubPill] = useState<'signups' | 'sso'>('signups');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Company detail full-page view state
  const [selectedCompanyForDetail, setSelectedCompanyForDetail] = useState<Company | null>(null);

  // Edit Access Modal
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

  // Pending users
  const pendingUsers = useMemo(() => {
    return users.filter((u) => u.status === 'Pending' || u.status === 'Waiting for approval');
  }, [users]);

  // Active users count
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (projectFilter !== 'ALL' && c.projectName !== projectFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.projectName && c.projectName.toLowerCase().includes(q))
      );
    });
  }, [companies, searchQuery, projectFilter]);

  const filteredAssignments = useMemo(() => {
    return users.filter((u) => {
      if (companyFilter !== 'ALL' && u.companyId !== companyFilter && u.companyName !== companyFilter) {
        return false;
      }
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.companyName.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, companyFilter, roleFilter]);

  const handleSwitchCompany = (comp: Company) => {
    setCurrentCompanyId(comp.id);
    setAppMode('platform');
    setPlatformLandscape('company');
    setPlatformSubTab('profile');
    addNotification('Switched Company', `Active tenant changed to ${comp.name}.`, 'info');
  };

  const handleApprove = (u: User) => {
    reactivateUser(u.id);
    addNotification('Approved', `${u.name} approved and given active access.`, 'success');
  };

  const handleReject = (u: User) => {
    suspendUser(u.id, 'Registration rejected');
    addNotification('Rejected', `${u.name} request rejected.`, 'info');
  };

  const handleDelete = (u: User) => {
    if (confirm(`Remove ${u.name}?`)) {
      deleteUser(u.id);
    }
  };

  // Helper initials
  const getInitials = (text: string) => {
    return text
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (selectedCompanyForDetail) {
    return (
      <CompanyStructureDetailView
        company={selectedCompanyForDetail}
        onBack={() => setSelectedCompanyForDetail(null)}
      />
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden select-none">
      {/* 1. Horizontal Underline Tabs matching Image 1 */}
      <div className="px-8 pt-5 pb-0 border-b border-slate-200">
        <div className="flex items-center gap-8 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('companies')}
            className={`pb-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'companies'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Companies</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approvals')}
            className={`pb-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Approvals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'assignments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Assignments</span>
          </button>
        </div>
      </div>

      {/* 3. Tab Content */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {/* ===================== TAB 1: COMPANIES ===================== */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies or projects"
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="appearance-none rounded-md border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="ALL">Project</option>
                    <option value="MEDI ASSIST">MEDI ASSIST</option>
                    <option value="Dutient DPO Program">Dutient DPO Program</option>
                    <option value="Global Compliance Project">Global Compliance Project</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Splashlearn">Splashlearn</option>
                  </select>
                  <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>

              <span className="text-xs text-slate-400 font-medium">
                {filteredCompanies.length} of {companies.length} companies
              </span>
            </div>

            {/* Info Notice Banner matching Image 1 & Scalability requirements */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-blue-50/70 border border-blue-100 text-xs text-blue-900">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                Click any company to open its detailed structure, view all legal entities, departments, and manage personnel access at scale.
              </span>
            </div>

            {/* Concise Clean Table matching Image 1 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/40">
                    <th className="py-2.5 px-4">COMPANY</th>
                    <th className="py-2.5 px-4">PROJECT</th>
                    <th className="py-2.5 px-4">LEGAL ENTITIES</th>
                    <th className="py-2.5 px-4">PEOPLE ASSIGNED</th>
                    <th className="py-2.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCompanies.map((comp) => {
                    const compEntities = legalEntities.filter((e) => e.companyId === comp.id);
                    const compDepts = departments.filter((d) => d.companyId === comp.id);
                    const peopleCount = comp.peopleAssigned ?? 0;

                    return (
                      <tr
                        key={comp.id}
                        onClick={() => setSelectedCompanyForDetail(comp)}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                      >
                        {/* Company Column with Square Initials */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0 uppercase border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 transition">
                              {getInitials(comp.name)}
                            </div>
                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                              {comp.name}
                            </span>
                          </div>
                        </td>

                        {/* Project Column */}
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {comp.projectName || 'Dutient DPO Program'}
                        </td>

                        {/* Legal Entities & Departments */}
                        <td className="py-3 px-4 text-slate-500 font-medium">
                          <span>
                            {compEntities.length} Entities • {compDepts.length} Depts
                          </span>
                        </td>

                        {/* People Assigned */}
                        <td className="py-3 px-4">
                          {peopleCount > 0 ? (
                            <span className="text-blue-600 font-semibold">
                              {peopleCount === 1 ? '1 person' : `${peopleCount} people`}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium">No one assigned</span>
                          )}
                        </td>

                        {/* Actions Column */}
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedCompanyForDetail(comp)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-medium transition cursor-pointer"
                          >
                            <span>View details</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: APPROVALS ===================== */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {/* Sub-Pills Selector matching Image 2 & 3 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setApprovalsSubPill('signups')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  approvalsSubPill === 'signups'
                    ? 'border border-slate-300 bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                User sign-ups
              </button>

              <button
                type="button"
                onClick={() => setApprovalsSubPill('sso')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  approvalsSubPill === 'sso'
                    ? 'border border-slate-300 bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                SSO onboarding
              </button>
            </div>

            {/* Sub-Pill 1: User Sign-ups Table */}
            {approvalsSubPill === 'signups' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative w-80">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email"
                      className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {pendingUsers.length} waiting · oldest first
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/40">
                        <th className="py-2.5 px-4">PERSON</th>
                        <th className="py-2.5 px-4">REQUESTED</th>
                        <th className="py-2.5 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {pendingUsers.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-xs text-slate-400 italic">
                            No pending registrations awaiting approval.
                          </td>
                        </tr>
                      ) : (
                        pendingUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                            {/* Person */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                                  {getInitials(u.name)}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">{u.name}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    {u.email}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Requested Date */}
                            <td className="py-3 px-4 text-slate-600">
                              {new Date(u.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApprove(u)}
                                  className="px-3.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(u)}
                                  className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer"
                                >
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(u)}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                  title="Delete Request"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Pill 2: SSO Onboarding matching Image 3 */}
            {approvalsSubPill === 'sso' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Organization SSO onboarding
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">0 requests need attention</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addNotification('SSO Client', 'SSO onboarding initiated.', 'info')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Onboard new client</span>
                  </button>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Dutient Labs</h4>
                      <p className="text-[11px] text-slate-400 font-mono">dutientlabs.ai · OIDC</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="font-semibold text-slate-800 block">Sudarshan</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        sudarshan@dutientlabs.ai
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: ASSIGNMENTS ===================== */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search people or companies"
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="appearance-none rounded-md border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="ALL">Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="appearance-none rounded-md border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="ALL">Role</option>
                    <option value="Enterprise Admin">Admin</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Data Protection Officer">DPO</option>
                    <option value="Customer">Customer</option>
                    <option value="User">User</option>
                  </select>
                  <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>

              <span className="text-xs text-slate-400 font-medium">
                {filteredAssignments.length} people
              </span>
            </div>

            {/* Assignments Table matching Image 4 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/40">
                    <th className="py-2.5 px-4">PERSON</th>
                    <th className="py-2.5 px-4">ROLE</th>
                    <th className="py-2.5 px-4">ASSIGNED PROJECTS</th>
                    <th className="py-2.5 px-4">ASSIGNED COMPANIES</th>
                    <th className="py-2.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAssignments.map((u) => {
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Person with Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                              {getInitials(u.name)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{u.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {u.role === 'Enterprise Admin'
                            ? 'Admin'
                            : u.role === 'Data Protection Officer'
                            ? 'DPO'
                            : u.role}
                        </td>

                        {/* Assigned Projects */}
                        <td className="py-3 px-4 text-slate-700">
                          {u.assignedProjectsCount || 1}
                        </td>

                        {/* Assigned Companies */}
                        <td className="py-3 px-4 text-slate-700">
                          {u.assignedCompaniesCount || 1}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedUserForEdit(u)}
                            className="px-3 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-medium transition cursor-pointer"
                          >
                            View assignments
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Access Modal */}
      <EditAccessModal
        user={selectedUserForEdit}
        isOpen={!!selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
      />
    </div>
  );
};
