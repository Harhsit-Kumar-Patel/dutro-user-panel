import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType, User } from '../../types';
import { StatusBadge } from '../common/Badge';
import {
  ArrowLeft,
  Search,
  Building2,
  Users,
  Building,
  Shield,
  LayoutGrid,
  List,
  ChevronDown,
  RotateCcw,
  Filter,
} from 'lucide-react';
import { ROLES_LIST } from './RolesPermissionsView';

interface RoleStructureDetailViewProps {
  role: RoleType;
  onBack: () => void;
  onSelectUser: (user: User) => void;
  onOpenEditAccess?: (user: User) => void;
}

export const RoleStructureDetailView: React.FC<RoleStructureDetailViewProps> = ({
  role,
  onBack,
  onSelectUser,
  onOpenEditAccess,
}) => {
  const { users, companies, changeUserRole, addNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Inline role-change dropdown per user in table
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRoleForUser, setNewRoleForUser] = useState<RoleType>(role);

  const roleConfig = useMemo(() => {
    return (
      ROLES_LIST.find((r) => r.role === role) || {
        role,
        description: 'System access role and scope.',
        scopeSummary: 'Standard access',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      }
    );
  }, [role]);

  // Personnel in the currently selected role
  const roleMembers = useMemo(() => {
    return users.filter((u) => u.role === role);
  }, [users, role]);

  // Filtered personnel within the dedicated role view
  const filteredRoleMembers = useMemo(() => {
    return roleMembers.filter((u) => {
      // Company filter
      if (companyFilter !== 'ALL' && u.companyId !== companyFilter && u.companyName !== companyFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && u.status !== statusFilter) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.companyName && u.companyName.toLowerCase().includes(q)) ||
        (u.departmentName && u.departmentName.toLowerCase().includes(q))
      );
    });
  }, [roleMembers, companyFilter, statusFilter, searchQuery]);

  const activeCount = roleMembers.filter((u) => u.status === 'Active').length;
  const pendingCount = roleMembers.filter(
    (u) => u.status === 'Pending' || u.status === 'Waiting for approval'
  ).length;
  const suspendedCount = roleMembers.filter((u) => u.status === 'Suspended').length;

  const hasActiveFilters =
    companyFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery.trim() !== '';

  const handleResetAllFilters = () => {
    setCompanyFilter('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
  };

  const handleUpdateRole = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target && newRoleForUser !== target.role) {
      changeUserRole(userId, newRoleForUser);
      addNotification(
        'Role Changed',
        `Updated ${target.name}'s role to ${newRoleForUser}.`,
        'success'
      );
    }
    setEditingUserId(null);
  };

  const getRoleInitials = (text: string) => {
    return text
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden select-none">
      {/* 1. Top Navigation Bar with Back Button (Matching Image 1 / CompanyStructureDetailView) */}
      <div className="px-8 pt-5 pb-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Return to roles list"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* Role Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 uppercase border border-blue-100">
              {getRoleInitials(role)}
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">{role}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                Scope: {roleConfig.scopeSummary}
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle: Grid vs Table */}
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
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 font-medium">Total Personnel:</span>
            <strong className="text-slate-900 font-bold">{roleMembers.length}</strong>
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
          Showing <strong className="text-slate-700">{filteredRoleMembers.length}</strong> of{' '}
          {roleMembers.length} total people
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or company..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-all"
            />
          </div>

          {/* Multidimensional Dropdown Filters - Always single row */}
          <div className="flex items-center gap-2 flex-nowrap overflow-x-auto pb-1 lg:pb-0 shrink-0">
            {/* Company Filter */}
            <div className="relative inline-flex items-center group shrink-0">
              <Building2
                className={`h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                  companyFilter !== 'ALL'
                    ? 'text-blue-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className={`appearance-none pl-7 pr-7 py-1.5 rounded-lg border text-xs cursor-pointer transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shrink-0 whitespace-nowrap ${
                  companyFilter !== 'ALL'
                    ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-semibold'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700 font-medium'
                }`}
              >
                <option value="ALL">All Companies</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`h-3.5 w-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                  companyFilter !== 'ALL'
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
                onChange={(e) => setStatusFilter(e.target.value)}
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

        {/* 4. Scalable Employee Display: GRID (Names Only) OR TABLE */}
        {filteredRoleMembers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 italic bg-white rounded-xl border border-slate-200">
            No personnel found matching the specified role or filter criteria.
          </div>
        ) : viewMode === 'grid' ? (
          /* ================= GRID VIEW: 3 to 4 Names Per Row (Names Only) ================= */
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {filteredRoleMembers.map((member) => {
                const isPending =
                  member.status === 'Pending' || member.status === 'Waiting for approval';

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => onSelectUser(member)}
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
                  <th className="py-2.5 px-4">COMPANY & ACCESS SCOPE</th>
                  <th className="py-2.5 px-4">DEPARTMENT</th>
                  <th className="py-2.5 px-4">STATUS</th>
                  <th className="py-2.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRoleMembers.map((member) => {
                  const isEditing = editingUserId === member.id;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Employee Identity */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => onSelectUser(member)}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition">
                            {getRoleInitials(member.name)}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition block">
                              {member.name}
                            </span>
                            <span className="text-slate-400 text-[11px] font-mono block">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Company & Access Scope */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        <span className="block text-slate-900 font-semibold">
                          {member.companyName}
                        </span>
                        <span className="block text-[11px] text-blue-600 font-bold">
                          {member.role === 'Enterprise Admin'
                            ? 'Global (All 16 Companies)'
                            : `${member.assignedCompaniesCount || 1} company access`}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-600">
                        {member.departmentName || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={member.status} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={newRoleForUser}
                              onChange={(e) => setNewRoleForUser(e.target.value as RoleType)}
                              className="rounded border border-slate-300 py-1 px-2 text-[11px] text-slate-800 bg-white"
                            >
                              <option value="Enterprise Admin">Enterprise Admin</option>
                              <option value="Consultant">Consultant</option>
                              <option value="Data Protection Officer">Data Protection Officer</option>
                              <option value="Program Owner">Program Owner</option>
                              <option value="Department Owner">Department Owner</option>
                              <option value="Department POC">Department POC</option>
                              <option value="Customer">Customer</option>
                              <option value="User">Standard User</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleUpdateRole(member.id)}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingUserId(null)}
                              className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingUserId(member.id);
                                setNewRoleForUser(member.role);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                              Change role
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectUser(member)}
                              className="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition cursor-pointer"
                            >
                              Edit access
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

