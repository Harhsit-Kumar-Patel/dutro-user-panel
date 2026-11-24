import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, RoleType } from '../../types';
import {
  Shield,
  FileCheck2,
} from 'lucide-react';
import { EditAccessModal } from './EditAccessModal';
import { RolesPermissionsView } from '../roles/RolesPermissionsView';
import { RoleStructureDetailView } from '../roles/RoleStructureDetailView';
import { AuditHistoryView } from '../governance/AuditHistoryView';
import { UserActivityView } from '../governance/UserActivityView';
import { EmployeeFullPageView } from '../users/EmployeeFullPageView';
import { CustomGrantModal } from '../access/CustomGrantModal';
import { ResourceAssignModal } from '../access/ResourceAssignModal';
import { AssignRoleModal } from '../roles/AssignRoleModal';

export const UserManagementView: React.FC = () => {
  const {
    users,
  } = useApp();

  // Top navigation tabs: Roles & Permissions | Audit & Compliance Logs
  const [mainNavTab, setMainNavTab] = useState<'roles' | 'governance'>('roles');

  // Dedicated role full-page view state
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<RoleType | null>(null);

  // Modals & Full page state
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [selectedUserForFullPage, setSelectedUserForFullPage] = useState<User | null>(null);

  // Deep dive modals for full page
  const [customGrantUser, setCustomGrantUser] = useState<User | null>(null);
  const [resourceAssignUser, setResourceAssignUser] = useState<User | null>(null);
  const [roleToAssign, setRoleToAssign] = useState<RoleType | null>(null);

  // Governance sub-pill
  const [governancePill, setGovernancePill] = useState<'audit' | 'activity'>('audit');

  // Resolved user for full-page view from fresh state
  const resolvedFullPageUser = selectedUserForFullPage
    ? users.find((u) => u.id === selectedUserForFullPage.id) || selectedUserForFullPage
    : null;

  // --------------------------------------------------------------------------
  // 1. FULL PAGE EMPLOYEE ACCESS DEEP DIVE VIEW
  // --------------------------------------------------------------------------
  if (resolvedFullPageUser) {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden select-none">
        {/* Full Page Content */}
        <div className="flex-1 overflow-y-auto px-8 py-5">
          <EmployeeFullPageView
            user={resolvedFullPageUser}
            onBack={() => setSelectedUserForFullPage(null)}
            onOpenCustomGrantModal={(u) => setCustomGrantUser(u)}
            onOpenResourceAssignModal={(u) => setResourceAssignUser(u)}
            onOpenEdit={(u) => setSelectedUserForEdit(u)}
          />
        </div>

        {/* Modals triggered from Full Page View */}
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
        <ResourceAssignModal
          user={resourceAssignUser}
          isOpen={!!resourceAssignUser}
          onClose={() => setResourceAssignUser(null)}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. DEDICATED ROLE STRUCTURE DETAIL FULL PAGE VIEW
  // --------------------------------------------------------------------------
  if (selectedRoleForDetail) {
    return (
      <RoleStructureDetailView
        role={selectedRoleForDetail}
        onBack={() => setSelectedRoleForDetail(null)}
        onSelectUser={(u) => setSelectedUserForFullPage(u)}
        onOpenEditAccess={(u) => setSelectedUserForEdit(u)}
      />
    );
  }

  // --------------------------------------------------------------------------
  // 3. UNIFIED USER MANAGEMENT VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden select-none">
      {/* 1. Main Underline Navigation Tabs */}
      <div className="px-8 pt-5 pb-0 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-8 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMainNavTab('roles')}
            className={`pb-3 transition cursor-pointer flex items-center gap-1.5 ${
              mainNavTab === 'roles'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Roles & Permissions</span>
          </button>

          <button
            type="button"
            onClick={() => setMainNavTab('governance')}
            className={`pb-3 transition cursor-pointer flex items-center gap-1.5 ${
              mainNavTab === 'governance'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Audit & Compliance Logs</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Body per Tab */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {/* ==================== TAB 1: ROLES & PERMISSIONS ==================== */}
        {mainNavTab === 'roles' && (
          <RolesPermissionsView
            onSelectUser={(u) => setSelectedUserForFullPage(u)}
            onSelectRole={(r) => setSelectedRoleForDetail(r)}
            onOpenAssignRole={(role) => setRoleToAssign(role)}
          />
        )}

        {/* ==================== TAB 2: AUDIT & COMPLIANCE LOGS ==================== */}
        {mainNavTab === 'governance' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setGovernancePill('audit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  governancePill === 'audit'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Admin Panel Audit History
              </button>
              <button
                type="button"
                onClick={() => setGovernancePill('activity')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  governancePill === 'activity'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Compliance Log
              </button>
            </div>

            {governancePill === 'audit' ? (
              <AuditHistoryView />
            ) : (
              <UserActivityView />
            )}
          </div>
        )}
      </div>

      {/* Edit Access Modal */}
      <EditAccessModal
        user={selectedUserForEdit}
        isOpen={!!selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
      />

      {/* Assign Role Modal */}
      <AssignRoleModal
        role={roleToAssign}
        isOpen={!!roleToAssign}
        onClose={() => setRoleToAssign(null)}
      />
    </div>
  );
};
