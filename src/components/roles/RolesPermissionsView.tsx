import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType, User } from '../../types';
import {
  Search,
  ArrowRight,
} from 'lucide-react';
import { RoleStructureDetailView } from './RoleStructureDetailView';

export interface RolesPermissionsViewProps {
  onSelectUser: (user: User) => void;
  onOpenAssignRole?: (role: RoleType) => void;
  onSelectRole?: (role: RoleType) => void;
}

export interface RoleConfig {
  role: RoleType;
  description: string;
  scopeSummary: string;
  badgeColor: string;
}

export const ROLES_LIST: RoleConfig[] = [
  {
    role: 'Enterprise Admin',
    description: 'Global access. Full platform access, including creating and managing users, projects, and companies across the entire Dutro instance.',
    scopeSummary: 'Global access',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    role: 'Consultant',
    description: 'Project-level access. Runs compliance work for every company in an assigned project: company profiles, control frameworks, discovery, risk registers and vendor management. Does not include user administration.',
    scopeSummary: 'Project-level access',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    role: 'Data Protection Officer',
    description: 'Company-level access. Acts as the Data Protection Officer for a company: reviews compliance work, manages data-flow diagrams and cookie consent, and adds notes and evidence.',
    scopeSummary: 'Company-level access',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    role: 'Program Owner',
    description: 'Company-level access. Owns the privacy programme for a company: reviews compliance work, runs gap analyses and impact assessments, and adds notes and evidence.',
    scopeSummary: 'Company-level access',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    role: 'Department Owner',
    description: 'Department-level access. Manages privacy for a single department: business processes, vendors, risks and policies, with no visibility into other departments.',
    scopeSummary: 'Department-level access',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    role: 'Department POC',
    description: 'Department-level access. The point of contact for a department: supplies department information, completes data-mapping questionnaires, and uploads supporting documents.',
    scopeSummary: 'Department-level access',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    role: 'Customer',
    description: 'Company-level access. Read-only visibility into the companies they are assigned, for reviewing status without making changes.',
    scopeSummary: 'Company-level access',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    role: 'User',
    description: 'No access. The default role assigned on sign-up; the account gains no module access until an administrator or consultant assigns one of the roles above.',
    scopeSummary: 'No access',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
  },
];

export const RolesPermissionsView: React.FC<RolesPermissionsViewProps> = ({
  onSelectUser,
  onSelectRole,
}) => {
  const { users } = useApp();

  // Selected role for dedicated full-page view (fallback if onSelectRole not provided)
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  // Search in roles list
  const [rolesSearch, setRolesSearch] = useState('');

  // Filtered roles in main overview
  const displayedRoles = useMemo(() => {
    return ROLES_LIST.filter((r) => {
      if (!rolesSearch.trim()) return true;
      const q = rolesSearch.toLowerCase();
      return (
        r.role.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.scopeSummary.toLowerCase().includes(q)
      );
    });
  }, [rolesSearch]);

  const handleRoleClick = (r: RoleType) => {
    if (onSelectRole) {
      onSelectRole(r);
    } else {
      setSelectedRole(r);
    }
  };

  // Dedicated full-page view for a specific role matching CompanyStructureDetailView
  if (selectedRole) {
    return (
      <RoleStructureDetailView
        role={selectedRole}
        onBack={() => setSelectedRole(null)}
        onSelectUser={onSelectUser}
      />
    );
  }

  // =========================================================================
  // MAIN ROLES OVERVIEW TABLE (Matching Screenshot 1 Design Language)
  // =========================================================================
  return (
    <div className="space-y-4 animate-subtle-expand">
      {/* Search & Info Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={rolesSearch}
            onChange={(e) => setRolesSearch(e.target.value)}
            placeholder="Search roles or descriptions..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-400 text-slate-900"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          {displayedRoles.length} of {ROLES_LIST.length} roles • <strong className="text-slate-700">{users.length}</strong> personnel assigned
        </div>
      </div>

      {/* Roles Table (matching Screenshot 1: COMPANY / PROJECT / PEOPLE ASSIGNED / ACTIONS) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-medium text-[11px] uppercase tracking-wider">
              <th className="py-3 px-5">ROLE</th>
              <th className="py-3 px-5">DESCRIPTION</th>
              <th className="py-3 px-5">PEOPLE ASSIGNED</th>
              <th className="py-3 px-5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {displayedRoles.map((r) => {
              const assignedCount = users.filter((u) => u.role === r.role).length;

              return (
                <tr
                  key={r.role}
                  onClick={() => handleRoleClick(r.role)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  {/* Role */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition">
                        {r.role
                          .split(' ')
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition block">
                          {r.role}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{r.scopeSummary}</span>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-5 text-slate-600 max-w-md">
                    <span className="line-clamp-2">{r.description}</span>
                  </td>

                  {/* People Assigned */}
                  <td className="py-4 px-5 font-semibold text-slate-800">
                    <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-100">
                      {assignedCount} {assignedCount === 1 ? 'person' : 'people'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleClick(r.role);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs group-hover:border-blue-300"
                    >
                      <span>View members</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
