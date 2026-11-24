import React, { useState, useMemo } from 'react';
import { Company, LegalEntity, Department, User, RoleType, AccountStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Search,
  Building2,
  Users,
  Building,
  Shield,
  Layers,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Filter,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { EditAccessModal } from './EditAccessModal';
import { EmployeeFullPageView } from '../users/EmployeeFullPageView';
import { CustomGrantModal } from '../access/CustomGrantModal';
import { NarrowScopeModal } from '../access/NarrowScopeModal';
import { ResourceAssignModal } from '../access/ResourceAssignModal';

interface CompanyStructureDetailViewProps {
  company: Company;
  onBack: () => void;
  onSelectUser?: (user: User) => void;
  onOpenEditAccess?: (user: User) => void;
}

export const CompanyStructureDetailView: React.FC<CompanyStructureDetailViewProps> = ({
  company,
  onBack,
  onSelectUser,
  onOpenEditAccess,
}) => {
  const {
    legalEntities,
    departments,
    users,
    reactivateUser,
    suspendUser,
    deleteUser,
    addNotification,
  } = useApp();

  // Selected filters for scalability
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ALL');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Pending' | 'Suspended'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Layout View mode: 'grid' (3-4 names per row) vs 'table' (dense paginated table)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Pagination for large employee scale
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(48);

  const hasActiveFilters =
    selectedEntityId !== 'ALL' ||
    selectedDeptId !== 'ALL' ||
    roleFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    searchQuery.trim() !== '';

  const handleResetAllFilters = () => {
    setSelectedEntityId('ALL');
    setSelectedDeptId('ALL');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Local modals and deep-dive page
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [selectedUserForFullPage, setSelectedUserForFullPage] = useState<User | null>(null);

  // Deep dive modals for full page
  const [customGrantUser, setCustomGrantUser] = useState<User | null>(null);
  const [narrowScopeUser, setNarrowScopeUser] = useState<User | null>(null);
  const [resourceAssignUser, setResourceAssignUser] = useState<User | null>(null);

  // Entities and Depts under this specific company
  const companyEntities = useMemo(() => {
    return legalEntities.filter((e) => e.companyId === company.id);
  }, [legalEntities, company.id]);

  const companyDepartments = useMemo(() => {
    return departments.filter((d) => d.companyId === company.id);
  }, [departments, company.id]);

  // All employees belonging to this company
  const companyUsers = useMemo(() => {
    return users.filter(
      (u) => u.companyId === company.id || u.companyName === company.name
    );
  }, [users, company.id, company.name]);

  // Filtered employees based on Entity, Department, Role, Status, and Search
  const filteredEmployees = useMemo(() => {
    return companyUsers.filter((u) => {
      // Entity filter
      if (selectedEntityId !== 'ALL' && u.legalEntityId !== selectedEntityId) {
        return false;
      }
      // Department filter
      if (selectedDeptId !== 'ALL' && u.departmentId !== selectedDeptId) {
        return false;
      }
      // Role filter
      if (roleFilter !== 'ALL' && u.role !== roleFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'Pending') {
          if (u.status !== 'Pending' && u.status !== 'Waiting for approval') return false;
        } else if (u.status !== statusFilter) {
          return false;
        }
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        (u.departmentName && u.departmentName.toLowerCase().includes(q))
      );
    });
  }, [companyUsers, selectedEntityId, selectedDeptId, roleFilter, statusFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Reset page when filter changes
  const handleFilterChange = (setter: (val: any) => void, val: any) => {
    setter(val);
    setCurrentPage(1);
  };

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const activeCount = companyUsers.filter((u) => u.status === 'Active').length;
  const pendingCount = companyUsers.filter(
    (u) => u.status === 'Pending' || u.status === 'Waiting for approval'
  ).length;
  const suspendedCount = companyUsers.filter((u) => u.status === 'Suspended').length;

  const handleEditUser = (user: User) => {
    if (onOpenEditAccess) {
      onOpenEditAccess(user);
    } else {
      setSelectedUserForEdit(user);
    }
  };

  const handleOpenUserFullPage = (user: User) => {
    if (onSelectUser) {
      onSelectUser(user);
    } else {
      setSelectedUserForFullPage(user);
    }
  };

  // --------------------------------------------------------------------------
  // FULL PAGE EMPLOYEE DEEP DIVE VIEW (IF SELECTED)
  // --------------------------------------------------------------------------
  if (selectedUserForFullPage) {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden select-none">
        <div className="flex-1 overflow-y-auto px-8 py-5">
          <EmployeeFullPageView
            user={selectedUserForFullPage}
            onBack={() => setSelectedUserForFullPage(null)}
            onOpenCustomGrantModal={(u) => setCustomGrantUser(u)}
            onOpenNarrowScopeModal={(u) => setNarrowScopeUser(u)}
            onOpenResourceAssignModal={(u) => setResourceAssignUser(u)}
            onOpenEdit={(u) => setSelectedUserForEdit(u)}
          />
        </div>

        <EditAccessModal
          user={selectedUserForEdit}
          isOpen={!!selectedUserForEdit}
          onClose={() => setSelectedUserForEdit(null)}
        />
        <CustomGrantModal
          user={customGrantUser}
          isOpen={!!customGrantUser}
          onClose={() => setCustomGrantUser(null)}
        />
        <NarrowScopeModal
          user={narrowScopeUser}
          isOpen={!!narrowScopeUser}
          onClose={() => setNarrowScopeUser(null)}
        />
        <ResourceAssignModal
          user={resourceAssignUser}
          isOpen={!!resourceAssignUser}
          onClose={() => setResourceAssignUser(null)}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN SCALABLE COMPANY STRUCTURE DETAIL VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden select-none">
      {/* 1. Top Navigation Bar with Back Button */}
      <div className="px-8 pt-5 pb-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Return to companies list"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* Company Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 uppercase border border-blue-100">
              {getInitials(company.name)}
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                {company.name}
              </h1>
              {company.projectName && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                  Project: {company.projectName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Mode Toggle: Grid (matching Image 3) vs Table */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 text-blue-600" />
              <span>Grid View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Table View</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Scalable Structure Metrics Bar */}
      <div className="px-8 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between text-xs shrink-0 flex-wrap gap-4">
        <div className="flex items-center gap-6 divide-x divide-slate-200">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 font-medium">Legal Entities:</span>
            <strong className="text-slate-900 font-bold">{companyEntities.length}</strong>
          </div>
          <div className="pl-6 flex items-center gap-2">
            <Building className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 font-medium">Departments:</span>
            <strong className="text-slate-900 font-bold">{companyDepartments.length}</strong>
          </div>
          <div className="pl-6 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 font-medium">Total Personnel:</span>
            <strong className="text-slate-900 font-bold">{companyUsers.length}</strong>
          </div>
          <div className="pl-6 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {activeCount} Active
            </span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {pendingCount} Pending
              </span>
            )}
            {suspendedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {suspendedCount} Suspended
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-slate-700">{filteredEmployees.length}</strong> of{' '}
          {companyUsers.length} total people
        </div>
      </div>

      {/* 3. Main Workspace: Scalable Filter Controls & Employee Content */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
        {/* Scalable Search & Multidimensional Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full lg:w-64 xl:w-72 shrink-0">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-all"
            />
          </div>

          {/* Multidimensional Dropdown Filters - Always single row without wrapping */}
          <div className="flex items-center gap-2 flex-nowrap overflow-x-auto pb-1 lg:pb-0 shrink-0">
            {/* Legal Entity Filter */}
            {companyEntities.length > 0 && (
              <div className="relative inline-flex items-center group shrink-0">
                <Building2
                  className={`h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    selectedEntityId !== 'ALL'
                      ? 'text-blue-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <select
                  value={selectedEntityId}
                  onChange={(e) => handleFilterChange(setSelectedEntityId, e.target.value)}
                  className={`appearance-none pl-7 pr-7 py-1.5 rounded-lg border text-xs cursor-pointer transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shrink-0 whitespace-nowrap ${
                    selectedEntityId !== 'ALL'
                      ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-semibold'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <option value="ALL">All Legal Entities</option>
                  {companyEntities.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`h-3.5 w-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    selectedEntityId !== 'ALL'
                      ? 'text-blue-500'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
              </div>
            )}

            {/* Department Filter */}
            {companyDepartments.length > 0 && (
              <div className="relative inline-flex items-center group shrink-0">
                <Building
                  className={`h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    selectedDeptId !== 'ALL'
                      ? 'text-blue-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <select
                  value={selectedDeptId}
                  onChange={(e) => handleFilterChange(setSelectedDeptId, e.target.value)}
                  className={`appearance-none pl-7 pr-7 py-1.5 rounded-lg border text-xs cursor-pointer transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shrink-0 whitespace-nowrap ${
                    selectedDeptId !== 'ALL'
                      ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-semibold'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <option value="ALL">All Departments</option>
                  {companyDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`h-3.5 w-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    selectedDeptId !== 'ALL'
                      ? 'text-blue-500'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
              </div>
            )}

            {/* Role Filter */}
            <div className="relative inline-flex items-center group shrink-0">
              <Shield
                className={`h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                  roleFilter !== 'ALL'
                    ? 'text-blue-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <select
                value={roleFilter}
                onChange={(e) => handleFilterChange(setRoleFilter, e.target.value)}
                className={`appearance-none pl-7 pr-7 py-1.5 rounded-lg border text-xs cursor-pointer transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shrink-0 whitespace-nowrap ${
                  roleFilter !== 'ALL'
                    ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-semibold'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700 font-medium'
                }`}
              >
                <option value="ALL">All Roles</option>
                <option value="Enterprise Admin">Enterprise Admin</option>
                <option value="Consultant">Consultant</option>
                <option value="Data Protection Officer">Data Protection Officer</option>
                <option value="Program Owner">Program Owner</option>
                <option value="Department Owner">Department Owner</option>
                <option value="Department POC">Department POC</option>
                <option value="Customer">Customer</option>
                <option value="User">Standard User</option>
              </select>
              <ChevronDown
                className={`h-3.5 w-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                  roleFilter !== 'ALL'
                    ? 'text-blue-500'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            </div>

            {/* Status Filter */}
            <div className="relative inline-flex items-center group shrink-0">
              <Filter
                className={`h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                  statusFilter !== 'ALL'
                    ? 'text-blue-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(setStatusFilter, e.target.value as any)}
                className={`appearance-none pl-7 pr-7 py-1.5 rounded-lg border text-xs cursor-pointer transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shrink-0 whitespace-nowrap ${
                  statusFilter !== 'ALL'
                    ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-semibold'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700 font-medium'
                }`}
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
              <ChevronDown
                className={`h-3.5 w-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                  statusFilter !== 'ALL'
                    ? 'text-blue-500'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            </div>

            {/* Reset All Filters Pill */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-slate-200 shrink-0 whitespace-nowrap"
                title="Reset all filters"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* C. Scalable Employee Display: GRID (3 to 4 names per row) OR TABLE */}
        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 italic bg-white rounded-xl border border-slate-200">
            No personnel found matching the specified entity, department, or filter criteria.
          </div>
        ) : viewMode === 'grid' ? (
          /* ================= GRID VIEW: 3 to 4 Names Per Row (Names Only) ================= */
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {paginatedEmployees.map((member) => {
                const isPending =
                  member.status === 'Pending' || member.status === 'Waiting for approval';
                const isSuspended = member.status === 'Suspended';

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleOpenUserFullPage(member)}
                    className="px-3.5 py-3 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-400 rounded-lg text-left transition-all duration-150 flex items-center justify-between group cursor-pointer shadow-2xs"
                    title={`View modules and permissions for ${member.name}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          member.status === 'Active'
                            ? 'bg-emerald-500'
                            : isPending
                            ? 'bg-amber-400'
                            : 'bg-slate-300'
                        }`}
                      />
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                        {member.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= TABLE VIEW: Dense Scalable Format ================= */
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/40">
                  <th className="py-2.5 px-4">EMPLOYEE</th>
                  <th className="py-2.5 px-4">LEGAL ENTITY</th>
                  <th className="py-2.5 px-4">DEPARTMENT</th>
                  <th className="py-2.5 px-4">ROLE</th>
                  <th className="py-2.5 px-4">STATUS</th>
                  <th className="py-2.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedEmployees.map((member) => {
                  const isPending =
                    member.status === 'Pending' || member.status === 'Waiting for approval';
                  const isSuspended = member.status === 'Suspended';

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Employee Column */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleOpenUserFullPage(member)}
                          className="flex items-center gap-3 text-left group cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 uppercase border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 transition">
                            {getInitials(member.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                              {member.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {member.email}
                            </div>
                          </div>
                        </button>
                      </td>

                      {/* Legal Entity Column */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {member.legalEntityName || 'Main Corporate Entity'}
                      </td>

                      {/* Department Column */}
                      <td className="py-3 px-4 text-slate-600">
                        {member.departmentName || '—'}
                      </td>

                      {/* Role Column */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                          {member.role}
                        </span>
                      </td>

                      {/* Status Column */}
                      <td className="py-3 px-4">
                        {isPending ? (
                          <span className="text-amber-600 font-semibold">Pending</span>
                        ) : isSuspended ? (
                          <span className="text-slate-400 font-semibold">Suspended</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">Active</span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleEditUser(member)}
                          className="px-3 py-1 rounded border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer mr-2"
                        >
                          Edit access
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenUserFullPage(member)}
                          className="px-2.5 py-1 rounded text-xs font-medium text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        >
                          Profile →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* D. Scalable Pagination Navigation Controls */}
        {totalPages > 1 && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
            <div>
              Showing{' '}
              <strong className="text-slate-700">
                {(currentPage - 1) * pageSize + 1} -{' '}
                {Math.min(currentPage * pageSize, filteredEmployees.length)}
              </strong>{' '}
              of <strong className="text-slate-700">{filteredEmployees.length}</strong> people
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-3 py-1 font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
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

