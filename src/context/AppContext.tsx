import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoleType,
  Company,
  LegalEntity,
  Department,
  User,
  Invitation,
  RegistrationRequest,
  AccessReviewRecord,
  UserActivityEntry,
  AuditLogEntry,
  CustomPermissionGrant,
  ResourceAssignment,
  ComplianceProject,
  SSOOnboardingClient,
} from '../types';
import {
  INITIAL_COMPANIES,
  INITIAL_LEGAL_ENTITIES,
  INITIAL_DEPARTMENTS,
  INITIAL_USERS,
  INITIAL_INVITATIONS,
  INITIAL_REGISTRATIONS,
  INITIAL_ACCESS_REVIEWS,
  INITIAL_USER_ACTIVITIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPLIANCE_PROJECTS,
  INITIAL_SSO_CLIENTS,
} from '../data/mockData';

export type MainSection =
  | 'admin-panel'
  | 'projects'
  | 'users'
  | 'prompts'
  | 'pending-case-laws'
  | 'organisation'
  | 'roles'
  | 'access'
  | 'governance';

export type AppMode = 'platform' | 'admin';
export type PlatformLandscape = 'company' | 'department' | 'risk' | 'trust' | 'consent';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  // Current active persona & boundaries
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  currentCompanyId: string; // 'ALL' or specific companyId
  setCurrentCompanyId: (companyId: string) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  platformLandscape: PlatformLandscape;
  setPlatformLandscape: (land: PlatformLandscape) => void;
  platformSubTab: string;
  setPlatformSubTab: (tab: string) => void;
  selectedDepartmentName: string;
  setSelectedDepartmentName: (dept: string) => void;
  activeSection: MainSection;
  setActiveSection: (sec: MainSection) => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;

  // Selected entities for deep view
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  selectedRoleId: RoleType | null;
  setSelectedRoleId: (role: RoleType | null) => void;

  // Data Collections
  companies: Company[];
  legalEntities: LegalEntity[];
  departments: Department[];
  users: User[];
  invitations: Invitation[];
  registrations: RegistrationRequest[];
  accessReviews: AccessReviewRecord[];
  userActivities: UserActivityEntry[];
  auditLogs: AuditLogEntry[];

  // User Actions
  updateUser: (id: string, partial: Partial<User>) => void;
  suspendUser: (id: string, reason: string) => void;
  reactivateUser: (id: string) => void;
  deleteUser: (id: string) => void;
  changeUserRole: (id: string, newRole: RoleType) => void;
  addCustomGrant: (id: string, grant: Omit<CustomPermissionGrant, 'id' | 'grantedAt' | 'grantedBy'>) => void;
  removeCustomGrant: (userId: string, grantId: string) => void;
  addResourceAssignment: (userId: string, assignment: Omit<ResourceAssignment, 'id' | 'assignedAt' | 'assignedBy'>) => void;
  removeResourceAssignment: (userId: string, assignmentId: string) => void;
  assignUserDepartment: (userId: string, departmentId: string) => void;

  // Invitation Actions
  sendInvitation: (data: { name: string; email: string; companyId: string; departmentId: string; role: RoleType }) => void;
  sendBulkInvitations: (invites: { name: string; email: string; companyId: string; departmentId: string; role: RoleType }[]) => { successCount: number; failedEmails: string[] };
  resendInvitation: (id: string) => void;
  revokeInvitation: (id: string) => void;

  // Registration Actions
  approveRegistration: (id: string, notes?: string) => void;
  rejectRegistration: (id: string, notes?: string) => void;

  // Organisation Actions
  createCompany: (company: Omit<Company, 'id' | 'createdAt' | 'employeeCount'>) => void;
  updateCompany: (id: string, partial: Partial<Company>) => void;
  createLegalEntity: (entity: Omit<LegalEntity, 'id' | 'createdAt'>) => void;
  updateLegalEntity: (id: string, partial: Partial<LegalEntity>) => void;
  deleteLegalEntity: (id: string) => { success: boolean; error?: string };
  createDepartment: (dept: Omit<Department, 'id' | 'createdAt' | 'memberCount'>) => void;
  updateDepartment: (id: string, partial: Partial<Department>) => void;
  deleteDepartment: (id: string) => { success: boolean; error?: string };

  projects: ComplianceProject[];
  setProjects: React.Dispatch<React.SetStateAction<ComplianceProject[]>>;
  ssoClients: SSOOnboardingClient[];
  setSsoClients: React.Dispatch<React.SetStateAction<SSOOnboardingClient[]>>;

  // Governance & Review Actions
  recordAccessReview: (review: Omit<AccessReviewRecord, 'id' | 'reviewer' | 'reviewDate'>) => void;

  // System & Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
  resetToSeedData: () => void;
  exportAuditLogs: (format: 'csv' | 'json') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'DUTRO_USER_PANEL_STORE_V10';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Personas
  const [currentRole, setCurrentRoleState] = useState<RoleType>('Enterprise Admin');
  const [currentCompanyId, setCurrentCompanyIdState] = useState<string>('comp-demo');
  const [appMode, setAppMode] = useState<AppMode>('admin');
  const [platformLandscape, setPlatformLandscape] = useState<PlatformLandscape>('company');
  const [platformSubTab, setPlatformSubTab] = useState<string>('profile');
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>('Analytics');
  const [activeSection, setActiveSection] = useState<MainSection>('admin-panel');
  const [activeSubTab, setActiveSubTab] = useState<string>('companies');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<RoleType | null>(null);

  // Entities
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_companies`);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [projects, setProjects] = useState<ComplianceProject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
    return saved ? JSON.parse(saved) : INITIAL_COMPLIANCE_PROJECTS;
  });

  const [ssoClients, setSsoClients] = useState<SSOOnboardingClient[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sso`);
    return saved ? JSON.parse(saved) : INITIAL_SSO_CLIENTS;
  });

  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_entities`);
    return saved ? JSON.parse(saved) : INITIAL_LEGAL_ENTITIES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_departments`);
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [invitations, setInvitations] = useState<Invitation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invitations`);
    return saved ? JSON.parse(saved) : INITIAL_INVITATIONS;
  });

  const [registrations, setRegistrations] = useState<RegistrationRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_registrations`);
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [accessReviews, setAccessReviews] = useState<AccessReviewRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_ACCESS_REVIEWS;
  });

  const [userActivities, setUserActivities] = useState<UserActivityEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
    return saved ? JSON.parse(saved) : INITIAL_USER_ACTIVITIES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Registration Requests Pending',
      message: '3 registration requests require Enterprise Admin review and sign-off.',
      type: 'info',
      timestamp: '2026-11-10T08:15:00Z',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Q4 Access Review Campaign',
      message: 'Access entitlement review is due for high-privilege accounts.',
      type: 'warning',
      timestamp: '2026-11-09T14:00:00Z',
      read: false,
    },
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_entities`, JSON.stringify(legalEntities));
  }, [legalEntities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_departments`, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_invitations`, JSON.stringify(invitations));
  }, [invitations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_registrations`, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(accessReviews));
  }, [accessReviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(userActivities));
  }, [userActivities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Consultant role boundary: locked to their own company!
  const setCurrentRole = (role: RoleType) => {
    setCurrentRoleState(role);
    if (role === 'Consultant') {
      setCurrentCompanyIdState('comp-demo'); // Locked to assigned company
    }
  };

  const setCurrentCompanyId = (companyId: string) => {
    if (currentRole === 'Consultant' && companyId !== 'comp-demo') {
      addNotification(
        'Access Restricted',
        'Consultants can only access their assigned company (Demo Company).',
        'warning'
      );
      return;
    }
    setCurrentCompanyIdState(companyId);
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const recordAudit = (
    action: string,
    actionCategory: AuditLogEntry['actionCategory'],
    affectedUserOrResource: string,
    previousValue?: string,
    newValue?: string
  ) => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      actionCategory,
      affectedUserOrResource,
      previousValue,
      newValue,
      actorName: 'Marcus Vance',
      actorRole: currentRole,
      actorEmail: 'marcus.vance@acmeprivacy.com',
      ipAddress: '198.51.100.44',
      status: 'Success',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // User methods
  const updateUser = (id: string, partial: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, ...partial };
          return updated;
        }
        return u;
      })
    );
    recordAudit(
      'Updated User Information',
      'User Management',
      `User ID: ${id}`,
      'Previous Profile Details',
      JSON.stringify(partial)
    );
    addNotification('User Updated', 'User profile information updated successfully.', 'success');
  };

  const suspendUser = (id: string, reason: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const now = new Date().toISOString();
    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: now,
      action: 'Account Suspended',
      category: 'STATUS' as const,
      performedBy: 'Marcus Vance (Enterprise Admin)',
      previousValue: target.status,
      newValue: 'Suspended',
      notes: reason,
    };

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: 'Suspended',
              lastStatusChange: now,
              history: [historyEntry, ...u.history],
            }
          : u
      )
    );

    recordAudit('Account Suspended', 'User Management', `${target.name} (${target.email})`, 'Active', 'Suspended');
    addNotification('Account Suspended', `${target.name}'s account has been suspended.`, 'warning');
  };

  const reactivateUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const now = new Date().toISOString();
    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: now,
      action: 'Account Reactivated',
      category: 'STATUS' as const,
      performedBy: 'Marcus Vance (Enterprise Admin)',
      previousValue: target.status,
      newValue: 'Active',
      notes: 'Administrative reactivation approved.',
    };

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: 'Active',
              lastStatusChange: now,
              history: [historyEntry, ...u.history],
            }
          : u
      )
    );

    recordAudit('Account Reactivated', 'User Management', `${target.name} (${target.email})`, 'Suspended', 'Active');
    addNotification('Account Reactivated', `${target.name}'s account is now active.`, 'success');
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (selectedUserId === id) setSelectedUserId(null);

    recordAudit('Account Permanently Deleted', 'User Management', `${target.name} (${target.email})`, 'Active/Suspended', 'Deleted');
    addNotification('Account Deleted', `Account for ${target.name} permanently removed.`, 'warning');
  };

  const changeUserRole = (id: string, newRole: RoleType) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const now = new Date().toISOString();
    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: now,
      action: `Role changed to ${newRole}`,
      category: 'ROLE' as const,
      performedBy: 'Marcus Vance (Enterprise Admin)',
      previousValue: target.role,
      newValue: newRole,
    };

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              role: newRole,
              history: [historyEntry, ...u.history],
            }
          : u
      )
    );

    recordAudit('User Role Changed', 'Role & Permission', `${target.name} (${target.email})`, target.role, newRole);
    addNotification('Role Updated', `Changed ${target.name}'s role to ${newRole}.`, 'success');
  };

  const addCustomGrant = (id: string, grant: Omit<CustomPermissionGrant, 'id' | 'grantedAt' | 'grantedBy'>) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const now = new Date().toISOString();
    const newGrant: CustomPermissionGrant = {
      ...grant,
      id: `grant-${Date.now()}`,
      grantedAt: now,
      grantedBy: 'Marcus Vance (Enterprise Admin)',
    };

    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: now,
      action: `Custom ${grant.grantType === 'GRANT' ? 'Grant Added' : 'Scope Narrowed'}: ${grant.feature} (${grant.action})`,
      category: 'PERMISSION' as const,
      performedBy: 'Marcus Vance (Enterprise Admin)',
      newValue: `${grant.grantType}: ${grant.action} on ${grant.feature} [Reach: ${grant.reach}]`,
      notes: grant.reason,
    };

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              customGrants: [...u.customGrants, newGrant],
              history: [historyEntry, ...u.history],
            }
          : u
      )
    );

    recordAudit(
      grant.grantType === 'GRANT' ? 'Custom Grant Added' : 'Scope Narrowed',
      'Role & Permission',
      `${target.name} (${target.email})`,
      'Role Baseline',
      `${grant.action} on ${grant.feature}`
    );
    addNotification(
      grant.grantType === 'GRANT' ? 'Custom Grant Assigned' : 'Scope Narrowed',
      `Custom access rule applied to ${target.name}.`,
      'success'
    );
  };

  const removeCustomGrant = (userId: string, grantId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const grant = target.customGrants.find((g) => g.id === grantId);
    const now = new Date().toISOString();

    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: now,
      action: `Custom Grant Revoked: ${grant?.feature || grantId}`,
      category: 'PERMISSION' as const,
      performedBy: 'Marcus Vance (Enterprise Admin)',
    };

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              customGrants: u.customGrants.filter((g) => g.id !== grantId),
              history: [historyEntry, ...u.history],
            }
          : u
      )
    );

    recordAudit('Custom Grant Removed', 'Role & Permission', `${target.name}`, grant?.feature, 'Revoked');
    addNotification('Grant Removed', `Custom grant removed for ${target.name}.`, 'info');
  };

  const addResourceAssignment = (
    userId: string,
    assignment: Omit<ResourceAssignment, 'id' | 'assignedAt' | 'assignedBy'>
  ) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const now = new Date().toISOString();
    const newAssignment: ResourceAssignment = {
      ...assignment,
      id: `res-${Date.now()}`,
      assignedAt: now,
      assignedBy: 'Marcus Vance (Enterprise Admin)',
    };

    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: now,
      action: `Resource Assigned: ${assignment.resourceName} (${assignment.accessLevel})`,
      category: 'RESOURCE' as const,
      performedBy: 'Marcus Vance (Enterprise Admin)',
    };

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              resourceAssignments: [...u.resourceAssignments, newAssignment],
              history: [historyEntry, ...u.history],
            }
          : u
      )
    );

    recordAudit('Resource Assigned', 'Role & Permission', `${target.name}`, 'None', assignment.resourceName);
    addNotification('Resource Assigned', `${assignment.resourceName} assigned to ${target.name}.`, 'success');
  };

  const removeResourceAssignment = (userId: string, assignmentId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const res = target.resourceAssignments.find((r) => r.id === assignmentId);
    const now = new Date().toISOString();

    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: now,
      action: `Resource Access Revoked: ${res?.resourceName || assignmentId}`,
      category: 'RESOURCE' as const,
      performedBy: 'Marcus Vance (Enterprise Admin)',
    };

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              resourceAssignments: u.resourceAssignments.filter((r) => r.id !== assignmentId),
              history: [historyEntry, ...u.history],
            }
          : u
      )
    );

    recordAudit('Resource Revoked', 'Role & Permission', `${target.name}`, res?.resourceName, 'Revoked');
    addNotification('Resource Revoked', `Resource assignment removed for ${target.name}.`, 'info');
  };

  const assignUserDepartment = (userId: string, departmentId: string) => {
    const target = users.find((u) => u.id === userId);
    const dept = departments.find((d) => d.id === departmentId);
    if (!target || !dept) return;

    const prevDept = target.departmentName || 'None';
    const now = new Date().toISOString();
    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: now,
      action: `Transferred to department: ${dept.name}`,
      category: 'ROLE' as const,
      performedBy: 'Marcus Vance (Enterprise Admin)',
      previousValue: prevDept,
      newValue: dept.name,
    };

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              departmentId: dept.id,
              departmentName: dept.name,
              legalEntityId: dept.legalEntityId,
              legalEntityName: dept.legalEntityName,
              companyId: dept.companyId,
              companyName: dept.companyName,
              history: [historyEntry, ...u.history],
            }
          : u
      )
    );

    // Update department member counts
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === departmentId) return { ...d, memberCount: d.memberCount + 1 };
        if (d.id === target.departmentId) return { ...d, memberCount: Math.max(0, d.memberCount - 1) };
        return d;
      })
    );

    recordAudit('Department Assignment', 'Organisation', `${target.name}`, prevDept, dept.name);
    addNotification('Department Assigned', `${target.name} reassigned to ${dept.name}.`, 'success');
  };

  // Invitation methods
  const sendInvitation = (data: {
    name: string;
    email: string;
    companyId: string;
    departmentId: string;
    role: RoleType;
  }) => {
    // Check duplicate email
    const existingUser = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    const existingInvite = invitations.find(
      (i) => i.email.toLowerCase() === data.email.toLowerCase() && i.status === 'Pending'
    );
    if (existingUser || existingInvite) {
      addNotification('Duplicate Email', `An account or pending invite for ${data.email} already exists.`, 'error');
      return;
    }

    const company = companies.find((c) => c.id === data.companyId);
    const department = departments.find((d) => d.id === data.departmentId);
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newInvite: Invitation = {
      id: `inv-${Date.now()}`,
      name: data.name,
      email: data.email,
      companyId: data.companyId,
      companyName: company?.name || 'Acme Global Privacy Corp',
      departmentId: data.departmentId,
      departmentName: department?.name || 'General Operations',
      role: data.role,
      status: 'Pending',
      invitedBy: 'Marcus Vance',
      invitedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      history: [
        {
          action: 'Invitation created and dispatched',
          timestamp: now.toISOString(),
          actor: 'Marcus Vance (Enterprise Admin)',
        },
      ],
    };

    setInvitations((prev) => [newInvite, ...prev]);
    recordAudit('Invitation Dispatched', 'Invitation', `${data.name} (${data.email})`, 'None', `Role: ${data.role}`);
    addNotification('Invitation Sent', `Sent onboarding invitation to ${data.email}.`, 'success');
  };

  const sendBulkInvitations = (
    invites: { name: string; email: string; companyId: string; departmentId: string; role: RoleType }[]
  ) => {
    let successCount = 0;
    const failedEmails: string[] = [];
    const newItems: Invitation[] = [];

    invites.forEach((inv) => {
      const emailLower = inv.email.trim().toLowerCase();
      const duplicate =
        users.some((u) => u.email.toLowerCase() === emailLower) ||
        invitations.some((i) => i.email.toLowerCase() === emailLower && i.status === 'Pending') ||
        newItems.some((n) => n.email.toLowerCase() === emailLower);

      if (duplicate || !emailLower.includes('@')) {
        failedEmails.push(inv.email);
      } else {
        const company = companies.find((c) => c.id === inv.companyId);
        const department = departments.find((d) => d.id === inv.departmentId);
        const now = new Date();
        const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        newItems.push({
          id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: inv.name.trim() || emailLower.split('@')[0],
          email: emailLower,
          companyId: inv.companyId,
          companyName: company?.name || 'Acme Global Privacy Corp',
          departmentId: inv.departmentId,
          departmentName: department?.name || 'General Operations',
          role: inv.role,
          status: 'Pending',
          invitedBy: 'Marcus Vance',
          invitedAt: now.toISOString(),
          expiresAt: expires.toISOString(),
          history: [
            {
              action: 'Bulk invitation dispatched',
              timestamp: now.toISOString(),
              actor: 'Marcus Vance (Enterprise Admin)',
            },
          ],
        });
        successCount++;
      }
    });

    if (newItems.length > 0) {
      setInvitations((prev) => [...newItems, ...prev]);
      recordAudit(
        'Bulk Invitations Dispatched',
        'Invitation',
        `${successCount} users`,
        'None',
        newItems.map((i) => i.email).join(', ')
      );
      addNotification(
        'Bulk Invitations Sent',
        `Successfully sent ${successCount} invitations.${failedEmails.length > 0 ? ` (${failedEmails.length} skipped)` : ''}`,
        'success'
      );
    }

    return { successCount, failedEmails };
  };

  const resendInvitation = (id: string) => {
    const target = invitations.find((i) => i.id === id);
    if (!target) return;
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setInvitations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'Pending',
              expiresAt: expires.toISOString(),
              history: [
                {
                  action: 'Invitation re-sent and token renewed',
                  timestamp: now.toISOString(),
                  actor: 'Marcus Vance (Enterprise Admin)',
                },
                ...i.history,
              ],
            }
          : i
      )
    );

    recordAudit('Invitation Resent', 'Invitation', `${target.name} (${target.email})`, target.status, 'Pending');
    addNotification('Invitation Resent', `Re-sent invitation token to ${target.email}.`, 'info');
  };

  const revokeInvitation = (id: string) => {
    const target = invitations.find((i) => i.id === id);
    if (!target) return;
    const now = new Date().toISOString();

    setInvitations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'Revoked',
              history: [
                {
                  action: 'Invitation revoked by administrator',
                  timestamp: now,
                  actor: 'Marcus Vance (Enterprise Admin)',
                },
                ...i.history,
              ],
            }
          : i
      )
    );

    recordAudit('Invitation Revoked', 'Invitation', `${target.name} (${target.email})`, 'Pending', 'Revoked');
    addNotification('Invitation Revoked', `Revoked invitation for ${target.email}.`, 'warning');
  };

  // Registration methods
  const approveRegistration = (id: string, notes?: string) => {
    const req = registrations.find((r) => r.id === id);
    if (!req) return;
    const now = new Date().toISOString();

    // Move to users
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: req.name,
      email: req.email,
      role: req.requestedRole,
      companyId: req.companyId,
      companyName: req.companyName,
      departmentId: req.requestedDepartmentId,
      departmentName: req.requestedDepartmentName,
      status: 'Active',
      createdAt: now,
      lastLogin: 'Never',
      lastStatusChange: now,
      customGrants: [],
      resourceAssignments: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: now,
          action: 'Self-registration approved by Enterprise Admin',
          category: 'STATUS',
          performedBy: 'Marcus Vance (Enterprise Admin)',
          notes: notes || req.reason,
        },
      ],
    };

    setUsers((prev) => [newUser, ...prev]);

    // Update registration request status
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Approved',
              reviewedBy: 'Marcus Vance',
              reviewedAt: now,
              reviewNotes: notes,
            }
          : r
      )
    );

    recordAudit(
      'Registration Approved',
      'Registration',
      `${req.name} (${req.email})`,
      'Pending Approval',
      `Active (Role: ${req.requestedRole})`
    );
    addNotification('Registration Approved', `${req.name} has been approved and provisioned into the User Directory.`, 'success');
  };

  const rejectRegistration = (id: string, notes?: string) => {
    const req = registrations.find((r) => r.id === id);
    if (!req) return;
    const now = new Date().toISOString();

    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Rejected',
              reviewedBy: 'Marcus Vance',
              reviewedAt: now,
              reviewNotes: notes,
            }
          : r
      )
    );

    recordAudit(
      'Registration Rejected',
      'Registration',
      `${req.name} (${req.email})`,
      'Pending Approval',
      'Rejected'
    );
    addNotification('Registration Rejected', `Registration request for ${req.name} rejected.`, 'info');
  };

  // Organisation methods
  const createCompany = (companyData: Omit<Company, 'id' | 'createdAt' | 'employeeCount'>) => {
    const newComp: Company = {
      ...companyData,
      id: `comp-${Date.now()}`,
      employeeCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCompanies((prev) => [...prev, newComp]);
    recordAudit('Company Created', 'Organisation', newComp.name, 'None', newComp.jurisdiction);
    addNotification('Company Registered', `Company ${newComp.name} registered.`, 'success');
  };

  const updateCompany = (id: string, partial: Partial<Company>) => {
    const target = companies.find((c) => c.id === id);
    if (!target) return;
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...partial } : c)));
    recordAudit('Company Updated', 'Organisation', target.name, 'Previous details', JSON.stringify(partial));
    addNotification('Company Updated', `Updated company profile for ${target.name}.`, 'success');
  };

  const createLegalEntity = (entityData: Omit<LegalEntity, 'id' | 'createdAt'>) => {
    const newEnt: LegalEntity = {
      ...entityData,
      id: `ent-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLegalEntities((prev) => [...prev, newEnt]);
    recordAudit('Legal Entity Created', 'Organisation', newEnt.name, 'None', newEnt.country);
    addNotification('Legal Entity Created', `Created entity ${newEnt.name}.`, 'success');
  };

  const updateLegalEntity = (id: string, partial: Partial<LegalEntity>) => {
    const target = legalEntities.find((e) => e.id === id);
    if (!target) return;
    setLegalEntities((prev) => prev.map((e) => (e.id === id ? { ...e, ...partial } : e)));
    recordAudit('Legal Entity Updated', 'Organisation', target.name, 'Previous details', JSON.stringify(partial));
    addNotification('Legal Entity Updated', `Updated legal entity ${target.name}.`, 'success');
  };

  const deleteLegalEntity = (id: string) => {
    const target = legalEntities.find((e) => e.id === id);
    if (!target) return { success: false, error: 'Entity not found' };

    // Check if any departments belong to this entity
    const linkedDepts = departments.filter((d) => d.legalEntityId === id);
    if (linkedDepts.length > 0) {
      return {
        success: false,
        error: `Cannot delete entity while ${linkedDepts.length} department(s) are associated with it.`,
      };
    }

    setLegalEntities((prev) => prev.filter((e) => e.id !== id));
    recordAudit('Legal Entity Deleted', 'Organisation', target.name, target.country, 'Deleted');
    addNotification('Legal Entity Deleted', `Entity ${target.name} removed.`, 'warning');
    return { success: true };
  };

  const createDepartment = (deptData: Omit<Department, 'id' | 'createdAt' | 'memberCount'>) => {
    const newDept: Department = {
      ...deptData,
      id: `dept-${Date.now()}`,
      memberCount: 0,
      createdAt: new Date().toISOString(),
    };
    setDepartments((prev) => [...prev, newDept]);
    recordAudit('Department Created', 'Organisation', `${newDept.name} (${newDept.code})`, 'None', newDept.companyName);
    addNotification('Department Created', `Department ${newDept.name} created.`, 'success');
  };

  const updateDepartment = (id: string, partial: Partial<Department>) => {
    const target = departments.find((d) => d.id === id);
    if (!target) return;
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...partial } : d)));
    recordAudit('Department Updated', 'Organisation', target.name, 'Previous details', JSON.stringify(partial));
    addNotification('Department Updated', `Updated department ${target.name}.`, 'success');
  };

  const deleteDepartment = (id: string) => {
    const target = departments.find((d) => d.id === id);
    if (!target) return { success: false, error: 'Department not found' };

    // Check if users exist in this department
    const linkedUsers = users.filter((u) => u.departmentId === id);
    if (linkedUsers.length > 0) {
      return {
        success: false,
        error: `Cannot delete department while ${linkedUsers.length} employee(s) belong to it.`,
      };
    }

    setDepartments((prev) => prev.filter((d) => d.id !== id));
    recordAudit('Department Deleted', 'Organisation', target.name, target.code, 'Deleted');
    addNotification('Department Deleted', `Department ${target.name} removed.`, 'warning');
    return { success: true };
  };

  // Access review method
  const recordAccessReview = (review: Omit<AccessReviewRecord, 'id' | 'reviewer' | 'reviewDate'>) => {
    const now = new Date().toISOString();
    const newRecord: AccessReviewRecord = {
      ...review,
      id: `rev-${Date.now()}`,
      reviewer: 'Marcus Vance (Enterprise Admin)',
      reviewDate: now,
    };
    setAccessReviews((prev) => [newRecord, ...prev]);

    recordAudit(
      'Access Review Recorded',
      'Access Review',
      `${review.userName} - ${review.reviewedItem}`,
      'Pending Review',
      `${review.outcome}: ${review.notes}`
    );
    addNotification('Review Recorded', `Access review recorded for ${review.userName} (${review.outcome}).`, 'success');
  };

  // Export audit logs
  const exportAuditLogs = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `dutro_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = ['Timestamp', 'Action', 'Category', 'Affected Target', 'Actor', 'Role', 'Status', 'IP'];
      const rows = auditLogs.map((log) => [
        `"${log.timestamp}"`,
        `"${log.action}"`,
        `"${log.actionCategory}"`,
        `"${log.affectedUserOrResource.replace(/"/g, '""')}"`,
        `"${log.actorName}"`,
        `"${log.actorRole}"`,
        `"${log.status}"`,
        `"${log.ipAddress}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `dutro_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    addNotification('Export Complete', `Exported ${auditLogs.length} audit log entries as ${format.toUpperCase()}.`, 'success');
  };

  // Reset demo store
  const resetToSeedData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_companies`);
    localStorage.removeItem(`${STORAGE_KEY}_entities`);
    localStorage.removeItem(`${STORAGE_KEY}_departments`);
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_invitations`);
    localStorage.removeItem(`${STORAGE_KEY}_registrations`);
    localStorage.removeItem(`${STORAGE_KEY}_reviews`);
    localStorage.removeItem(`${STORAGE_KEY}_activities`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);

    setCompanies(INITIAL_COMPANIES);
    setLegalEntities(INITIAL_LEGAL_ENTITIES);
    setDepartments(INITIAL_DEPARTMENTS);
    setUsers(INITIAL_USERS);
    setInvitations(INITIAL_INVITATIONS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setAccessReviews(INITIAL_ACCESS_REVIEWS);
    setUserActivities(INITIAL_USER_ACTIVITIES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentRoleState('Enterprise Admin');
    setCurrentCompanyIdState('ALL');
    setSelectedUserId(null);

    addNotification('System Reset', 'All demonstration state reset to pristine seed data.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentCompanyId,
        setCurrentCompanyId,
        appMode,
        setAppMode,
        platformLandscape,
        setPlatformLandscape,
        platformSubTab,
        setPlatformSubTab,
        selectedDepartmentName,
        setSelectedDepartmentName,
        activeSection,
        setActiveSection,
        activeSubTab,
        setActiveSubTab,
        selectedUserId,
        setSelectedUserId,
        selectedRoleId,
        setSelectedRoleId,
        companies,
        legalEntities,
        departments,
        users,
        projects,
        setProjects,
        ssoClients,
        setSsoClients,
        invitations,
        registrations,
        accessReviews,
        userActivities,
        auditLogs,
        updateUser,
        suspendUser,
        reactivateUser,
        deleteUser,
        changeUserRole,
        addCustomGrant,
        removeCustomGrant,
        addResourceAssignment,
        removeResourceAssignment,
        assignUserDepartment,
        sendInvitation,
        sendBulkInvitations,
        resendInvitation,
        revokeInvitation,
        approveRegistration,
        rejectRegistration,
        createCompany,
        updateCompany,
        createLegalEntity,
        updateLegalEntity,
        deleteLegalEntity,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        recordAccessReview,
        notifications,
        markNotificationRead,
        clearNotifications,
        addNotification,
        resetToSeedData,
        exportAuditLogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

