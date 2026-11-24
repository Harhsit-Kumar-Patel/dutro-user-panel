import React, { useState, useMemo } from 'react';
import { User, RoleType, ResourceAssignment } from '../../types';
import { useApp } from '../../context/AppContext';
import { RoleBadge, StatusBadge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  ArrowLeft,
  Building2,
  Building,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Key,
  X,
  GitBranch,
} from 'lucide-react';

interface EmployeeFullPageViewProps {
  user: User;
  onBack: () => void;
  onOpenCustomGrantModal?: (user: User) => void;
  onOpenResourceAssignModal?: (user: User) => void;
  onOpenNarrowScopeModal?: (user: User) => void;
  onOpenEdit?: (user: User) => void;
}

const BUSINESS_PROCESSES_LIST = [
  'All Business Processes',
  'Payroll Processing & Benefits Administration',
  'Employee Performance & Talent Management',
  'Candidate Recruitment & Background Vetting',
  'Customer Support Ticketing & Dispute Handling',
  'Vendor Due Diligence & Security Assessments',
  'Marketing Campaigns & Analytics Telemetry',
  'Platform User Authentication & Session Security',
  'Financial Fraud Monitoring & AML Screening',
  'Discovery & RoPA Inventories',
  'Cookie & Universal Consent Governance',
];

export const EmployeeFullPageView: React.FC<EmployeeFullPageViewProps> = ({
  user,
  onBack,
}) => {
  const {
    companies,
    legalEntities,
    departments,
    currentRole,
    changeUserRole,
    addResourceAssignment,
    removeResourceAssignment,
    addNotification,
  } = useApp();

  const isConsultant = currentRole === 'Consultant';

  // Role switching
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType>(user.role);

  // In-Screen Collapsible Custom Grant State
  const [isGrantOpen, setIsGrantOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const [selectedEntityId, setSelectedEntityId] = useState('ALL');
  const [selectedDeptId, setSelectedDeptId] = useState('ALL');
  const [selectedProcess, setSelectedProcess] = useState(BUSINESS_PROCESSES_LIST[0]);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<'Admin' | 'Read/Write' | 'Read'>('Read');

  // Popover / Modal state for viewing assigned department details
  const [viewingDepartmentInfo, setViewingDepartmentInfo] = useState<{
    companyName: string;
    departmentName: string;
    departmentCode?: string;
    legalEntityName?: string;
  } | null>(null);

  // Filter legal entities based on chosen company in Custom Grant
  const availableEntities = useMemo(() => {
    return legalEntities.filter((e) => e.companyId === selectedCompanyId);
  }, [legalEntities, selectedCompanyId]);

  // Filter departments based on chosen company and chosen legal entity
  const availableDepts = useMemo(() => {
    return departments.filter((d) => {
      if (d.companyId !== selectedCompanyId) return false;
      if (selectedEntityId !== 'ALL' && d.legalEntityId !== selectedEntityId) return false;
      return true;
    });
  }, [departments, selectedCompanyId, selectedEntityId]);

  // Handle saving role
  const handleSaveRole = () => {
    changeUserRole(user.id, selectedRole);
    setIsChangingRole(false);
    addNotification('Role Updated', `Role updated to ${selectedRole} for ${user.name}`, 'success');
  };

  // Handle adding custom grant
  const handleApplyCustomGrant = (e: React.FormEvent) => {
    e.preventDefault();

    const comp = companies.find((c) => c.id === selectedCompanyId);
    const ent = legalEntities.find((e) => e.id === selectedEntityId);
    const dept = departments.find((d) => d.id === selectedDeptId);

    // Build hierarchy breadcrumb string: Company -> Entity -> Dept -> Process
    const parts: string[] = [comp ? comp.name : 'All Companies'];
    if (selectedEntityId !== 'ALL' && ent) {
      parts.push(ent.name);
    } else if (selectedEntityId === 'ALL') {
      parts.push('All Entities');
    }

    if (selectedDeptId !== 'ALL' && dept) {
      parts.push(dept.name);
    } else if (selectedDeptId === 'ALL') {
      parts.push('All Departments');
    }

    if (selectedProcess && selectedProcess !== 'All Business Processes') {
      parts.push(selectedProcess);
    } else {
      parts.push('All Processes');
    }

    const hierarchyPath = parts.join(' → ');

    const newAssignment: ResourceAssignment = {
      id: `grant-${Date.now()}`,
      resourceType: 'Company',
      resourceId: selectedCompanyId,
      resourceName: hierarchyPath,
      accessLevel: selectedAccessLevel,
      assignedAt: new Date().toISOString().split('T')[0],
      assignedBy: 'Enterprise Admin',
    };

    addResourceAssignment(user.id, newAssignment);
    setIsGrantOpen(false);
    addNotification('Custom Grant Added', `Added custom grant for ${user.name}`, 'success');
  };

  // Handle revoking custom grant
  const handleRevokeGrant = (assignmentId: string, grantName: string) => {
    removeResourceAssignment(user.id, assignmentId);
    addNotification('Custom Grant Revoked', `Revoked grant "${grantName}" from ${user.name}`, 'info');
  };

  // Compute companies accessible by this user
  const accessibleCompanyList = useMemo<
    Array<{
      companyId: string;
      companyName: string;
      role: RoleType;
      isEnterpriseAdmin: boolean;
      scopeDescription: string;
      hasDepartmentButton: boolean;
      departmentName?: string;
      departmentId?: string;
      legalEntityName?: string;
    }>
  >(() => {
    if (user.role === 'Enterprise Admin') {
      // Enterprise Admin has tenant-wide access to all 16 companies
      return companies.map((c) => ({
        companyId: c.id,
        companyName: c.name,
        role: 'Enterprise Admin' as RoleType,
        isEnterpriseAdmin: true,
        scopeDescription: 'All Departments (Unrestricted Tenant-Wide Access)',
        hasDepartmentButton: false,
      }));
    }

    // For other roles: include primary company + any resource assignments
    const list: Array<{
      companyId: string;
      companyName: string;
      role: RoleType;
      isEnterpriseAdmin: boolean;
      scopeDescription: string;
      hasDepartmentButton: boolean;
      departmentName?: string;
      departmentId?: string;
      legalEntityName?: string;
    }> = [];

    // Primary company entry
    const isUnrestrictedScope = user.role === 'Consultant' || user.role === 'Data Protection Officer';
    list.push({
      companyId: user.companyId,
      companyName: user.companyName,
      role: user.role,
      isEnterpriseAdmin: false,
      scopeDescription: isUnrestrictedScope
        ? 'Company-wide (All Legal Entities & Departments)'
        : user.departmentName || 'General Operations',
      hasDepartmentButton: !isUnrestrictedScope,
      departmentName: user.departmentName || 'General Operations',
      departmentId: user.departmentId || 'DEPT-01',
      legalEntityName: user.legalEntityName || 'Global Operating Entity',
    });

    // Check additional company assignments from resourceAssignments
    if (user.resourceAssignments) {
      user.resourceAssignments.forEach((ra) => {
        const matchingCompany = companies.find((c) => c.id === ra.resourceId || ra.resourceName.includes(c.name));
        if (matchingCompany && matchingCompany.name !== user.companyName && !list.some((item) => item.companyName === matchingCompany.name)) {
          list.push({
            companyId: matchingCompany.id,
            companyName: matchingCompany.name,
            role: user.role,
            isEnterpriseAdmin: false,
            scopeDescription: `Custom Grant: ${ra.accessLevel}`,
            hasDepartmentButton: false,
          });
        }
      });
    }

    return list;
  }, [user, companies]);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* 1. Clean Top Header (matching Image 2 without redundant right-side company/department clutter) */}
      <div className="bg-white rounded-xl border border-slate-200 px-6 py-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Identity */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-bold text-sm border border-blue-200">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                  user.status === 'Active'
                    ? 'bg-emerald-500'
                    : user.status === 'Pending'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                title={`Status: ${user.status}`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900">{user.name}</span>
                <RoleBadge role={user.role} size="sm" />
                <StatusBadge status={user.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scalable Company Access & Roles Section (replaces rigid 3-box container) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Company Access & Roles
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Companies accessible by this user and their assigned authorization scope.
            </p>
          </div>

          {!isConsultant && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => setIsChangingRole(!isChangingRole)}
              className="cursor-pointer gap-1.5 font-semibold text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <span>{isChangingRole ? 'Cancel' : 'Change Role'}</span>
            </Button>
          )}
        </div>

        {/* Change Role Selector */}
        {isChangingRole && (
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 flex flex-wrap items-center gap-3 animate-subtle-expand">
            <span className="text-xs font-semibold text-slate-800 shrink-0">Select Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as RoleType)}
              className="rounded-lg border border-slate-300 py-1.5 px-3 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="Enterprise Admin">Enterprise Admin</option>
              <option value="Consultant">Consultant</option>
              <option value="Data Protection Officer">Data Protection Officer</option>
              <option value="Program Owner">Program Owner</option>
              <option value="Department Owner">Department Owner</option>
              <option value="Department POC">Department POC</option>
              <option value="Customer">Customer</option>
              <option value="User">User</option>
            </select>
            <Button variant="primary" size="xs" onClick={handleSaveRole} className="cursor-pointer">
              Save Role
            </Button>
          </div>
        )}

        {/* Enterprise Admin Tenant-Wide Scope Banner */}
        {user.role === 'Enterprise Admin' && (
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-900">
            <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold">Enterprise Admin Privileges:</span> This user possesses tenant-wide administrative authority across all {companies.length} companies listed on the platform.
            </div>
          </div>
        )}

        {/* Scalable Companies List & Assigned Roles */}
        <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-4">Company</th>
                <th className="py-2.5 px-4">Role Assigned</th>
                <th className="py-2.5 px-4">Scope / Department</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {accessibleCompanyList.map((item) => (
                <tr key={item.companyId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 uppercase border border-blue-100">
                        {item.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{item.companyName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <RoleBadge role={item.role} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {item.hasDepartmentButton ? (
                      <button
                        type="button"
                        onClick={() =>
                          setViewingDepartmentInfo({
                            companyName: item.companyName,
                            departmentName: item.departmentName || 'General Operations',
                            departmentCode: item.departmentId || 'DEPT-01',
                            legalEntityName: item.legalEntityName || 'Global Operating Entity',
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition cursor-pointer shadow-2xs"
                      >
                        <Building className="h-3.5 w-3.5 text-blue-600" />
                        <span>View Assigned Department</span>
                      </button>
                    ) : (
                      <span className="font-medium text-slate-600">{item.scopeDescription}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={user.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Level-Wise Custom Grant Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Custom Grant
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure hierarchical access level-wise across specific companies, legal entities, departments, and business processes.
            </p>
          </div>

          {!isConsultant && (
            <Button
              variant={isGrantOpen ? 'outline' : 'primary'}
              size="xs"
              onClick={() => setIsGrantOpen(!isGrantOpen)}
              className="cursor-pointer gap-1.5 shadow-2xs"
            >
              {isGrantOpen ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel Grant</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Custom Grant</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Level-Wise Collapsible Expansion on the Same Screen */}
        {isGrantOpen && (
          <form
            onSubmit={handleApplyCustomGrant}
            className="p-5 rounded-xl border-2 border-blue-200 bg-blue-50/30 space-y-4 text-xs animate-subtle-expand"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
              <GitBranch className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Level-Wise Access Hierarchy Configuration
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Level 1: Company */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  1. Company
                </label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => {
                    setSelectedCompanyId(e.target.value);
                    setSelectedEntityId('ALL');
                    setSelectedDeptId('ALL');
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level 2: Legal Entity */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  2. Legal Entity
                </label>
                <select
                  value={selectedEntityId}
                  onChange={(e) => {
                    setSelectedEntityId(e.target.value);
                    setSelectedDeptId('ALL');
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Legal Entities (Company-wide)</option>
                  {availableEntities.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level 3: Department */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  3. Department
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Departments (Entity-wide)</option>
                  {availableDepts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level 4: Business Process */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  4. Business Process
                </label>
                <select
                  value={selectedProcess}
                  onChange={(e) => setSelectedProcess(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {BUSINESS_PROCESSES_LIST.map((bp) => (
                    <option key={bp} value={bp}>
                      {bp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Access Permission Level & Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-blue-100">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Permission Level:
                </span>
                <div className="flex items-center gap-1.5">
                  {(['Admin', 'Read/Write', 'Read'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setSelectedAccessLevel(lvl)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold border transition cursor-pointer ${
                        selectedAccessLevel === lvl
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl === 'Admin' ? 'Admin (Full)' : lvl === 'Read/Write' ? 'Read & Write' : 'Read Only'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="xs" onClick={() => setIsGrantOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="xs" type="submit">
                  Apply Custom Grant
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Active Custom Grant Table */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Custom Grant ({user.resourceAssignments?.length || 0})
            </span>
          </div>

          {(!user.resourceAssignments || user.resourceAssignments.length === 0) ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center text-xs text-slate-500">
              No extra custom grants assigned. This user operates within their assigned company scope.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Level Hierarchy (Company → Entity → Dept → Process)</th>
                    <th className="py-2.5 px-4">Permission</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {user.resourceAssignments.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                          <span>{res.resourceName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold px-2.5 py-0.5 rounded text-[11px] border ${
                            res.accessLevel === 'Admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : res.accessLevel === 'Read/Write'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {res.accessLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isConsultant && (
                          <button
                            type="button"
                            onClick={() => handleRevokeGrant(res.id, res.resourceName)}
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 transition p-1 rounded cursor-pointer font-semibold"
                            title="Revoke Custom Grant"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="text-[11px]">Revoke</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Popover / Modal: Assigned Department Scope Details */}
      {viewingDepartmentInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-subtle-expand">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Assigned Department Scope</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingDepartmentInfo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company</span>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{viewingDepartmentInfo.companyName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Department</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-slate-900 text-sm">{viewingDepartmentInfo.departmentName}</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {viewingDepartmentInfo.departmentCode}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Legal Entity</span>
                <p className="text-slate-700 font-medium mt-0.5">{viewingDepartmentInfo.legalEntityName}</p>
              </div>
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-slate-600 text-[11px] leading-relaxed">
                User access is strictly scoped to workflows, data reviews, and gap analysis items originating from this department.
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button variant="primary" size="xs" onClick={() => setViewingDepartmentInfo(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
