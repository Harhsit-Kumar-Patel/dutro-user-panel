export type RoleType =
  | 'Enterprise Admin'
  | 'Consultant'
  | 'Data Protection Officer'
  | 'Program Owner'
  | 'Department Owner'
  | 'Department POC'
  | 'Customer'
  | 'User';

export type AccountStatus = 'Active' | 'Suspended' | 'Waiting for approval' | 'Pending';

export type InvitationStatus = 'Pending' | 'Accepted' | 'Expired' | 'Revoked';

export type LandscapeType =
  | 'Company'
  | 'Department'
  | 'Risk'
  | 'Trust'
  | 'Consent'
  | 'Administration'
  | 'Account';

export type ActionType =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Submit for review'
  | 'Approve'
  | 'Publish'
  | 'Run AI agent'
  | 'Export or download';

export type PermissionReach =
  | 'Everywhere'
  | 'Own company'
  | 'Own department'
  | 'Can open only';

export interface PermissionDefinition {
  id: string;
  landscape: LandscapeType;
  module: string;
  feature: string;
  action: ActionType;
  defaultReach: PermissionReach;
  description: string;
  isRestrictedForDPO?: boolean; // e.g. DPO cannot run AI agents for control mapping/gap analysis/PIA
  isEnterpriseAdminOnly?: boolean; // e.g. letterhead upload, project deletion, user management
}

export interface RoleDefinition {
  id: string;
  role: RoleType;
  description: string;
  userCount: number;
  allowedActions: string[]; // Permission IDs or rule summaries
  reachSummary: string;
  restrictions: string[];
}

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  jurisdiction: string;
  headquarters: string;
  dpoName: string;
  dpoEmail: string;
  employeeCount: number;
  letterheadUrl?: string;
  createdAt: string;
  projectName?: string;
  peopleAssigned?: number;
  isCurrent?: boolean;
}

export interface LegalEntity {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  registrationNumber: string;
  country: string;
  address: string;
  createdAt: string;
}

export interface Department {
  id: string;
  companyId: string;
  companyName: string;
  legalEntityId: string;
  legalEntityName: string;
  name: string;
  code: string;
  ownerId?: string;
  ownerName?: string;
  memberCount: number;
  description: string;
  createdAt: string;
}

export interface CustomPermissionGrant {
  id: string;
  permissionId: string;
  landscape: LandscapeType;
  module: string;
  feature: string;
  action: ActionType;
  reach: PermissionReach;
  grantType: 'GRANT' | 'NARROW';
  reason: string;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
}

export interface ResourceAssignment {
  id: string;
  resourceType: 'Company' | 'Department' | 'Project' | 'System';
  resourceId: string;
  resourceName: string;
  accessLevel: 'Read' | 'Read/Write' | 'Admin';
  assignedBy: string;
  assignedAt: string;
}

export interface UserHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'ROLE' | 'STATUS' | 'PERMISSION' | 'RESOURCE' | 'SECURITY';
  performedBy: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
}

export interface UserActivityEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  activityType:
    | 'Login'
    | 'Logout'
    | 'Data Export'
    | 'Consent Update'
    | 'DPIA Execution'
    | 'Permission Change'
    | 'Admin Action'
    | 'Document Review';
  description: string;
  ipAddress: string;
  device: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: RoleType;
  companyId: string;
  companyName: string;
  legalEntityId?: string;
  legalEntityName?: string;
  departmentId?: string;
  departmentName?: string;
  status: AccountStatus;
  createdAt: string;
  lastLogin: string;
  lastStatusChange: string;
  assignedProjectsCount?: number;
  assignedCompaniesCount?: number;
  customGrants: CustomPermissionGrant[];
  resourceAssignments: ResourceAssignment[];
  history: UserHistoryEntry[];
}

export interface Invitation {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  departmentId: string;
  departmentName: string;
  role: RoleType;
  status: InvitationStatus;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  history: {
    action: string;
    timestamp: string;
    actor: string;
  }[];
}

export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  requestedDepartmentId: string;
  requestedDepartmentName: string;
  requestedRole: RoleType;
  submittedAt: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface AccessReviewRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: RoleType;
  companyName: string;
  departmentName: string;
  reviewedItem: string;
  itemType: 'Role' | 'Custom Grant' | 'Resource Scope';
  outcome: 'Retained' | 'Modified' | 'Revoked';
  reviewer: string;
  reviewDate: string;
  notes: string;
  riskFlag?: 'Excessive Access' | 'Dormant Account' | 'Cross-Company Access' | 'Normal';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actionCategory:
    | 'User Management'
    | 'Invitation'
    | 'Registration'
    | 'Role & Permission'
    | 'Organisation'
    | 'Access Review'
    | 'Security';
  affectedUserOrResource: string;
  previousValue?: string;
  newValue?: string;
  actorName: string;
  actorRole: string;
  actorEmail: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
}

export interface ComplianceProject {
  id: string;
  name: string;
  status: 'Active' | 'Archived' | 'Draft';
  assignedCompanies: number;
  createdBy: string;
  lastUpdated: string;
  description?: string;
}

export interface SSOOnboardingClient {
  id: string;
  name: string;
  domain: string;
  protocol: 'OIDC' | 'SAML';
  contactName: string;
  contactEmail: string;
  status: 'Active' | 'Pending';
}

