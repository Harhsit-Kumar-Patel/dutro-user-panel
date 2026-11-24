import { PermissionDefinition, RoleType, LandscapeType, ActionType, PermissionReach } from '../types';

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  // 1. Landscape: Company
  {
    id: 'perm-comp-view',
    landscape: 'Company',
    module: 'Company Profile',
    feature: 'General Details & HQ Info',
    action: 'View',
    defaultReach: 'Own company',
    description: 'View company registration, legal status, and executive oversight',
  },
  {
    id: 'perm-comp-edit',
    landscape: 'Company',
    module: 'Company Profile',
    feature: 'General Details & HQ Info',
    action: 'Edit',
    defaultReach: 'Own company',
    description: 'Update company address, jurisdiction, and contact numbers',
  },
  {
    id: 'perm-comp-letterhead',
    landscape: 'Company',
    module: 'Branding & Letterhead',
    feature: 'Official Letterhead & Seals',
    action: 'Create',
    defaultReach: 'Everywhere',
    description: 'Upload and configure company official letterhead (Strictly Enterprise Admin)',
    isEnterpriseAdminOnly: true,
  },
  {
    id: 'perm-comp-entities',
    landscape: 'Company',
    module: 'Legal Entities',
    feature: 'Entity Management',
    action: 'Create',
    defaultReach: 'Own company',
    description: 'Register subsidiary entities and regional business units',
  },
  {
    id: 'perm-comp-entities-del',
    landscape: 'Company',
    module: 'Legal Entities',
    feature: 'Entity Management',
    action: 'Delete',
    defaultReach: 'Everywhere',
    description: 'Dissolve or decommission legal entities',
    isEnterpriseAdminOnly: true,
  },

  // 2. Landscape: Department
  {
    id: 'perm-dept-view',
    landscape: 'Department',
    module: 'Department Structure',
    feature: 'Department Rosters',
    action: 'View',
    defaultReach: 'Own department',
    description: 'View members, assigned business processes, and team leads',
  },
  {
    id: 'perm-dept-proc-edit',
    landscape: 'Department',
    module: 'Business Processes',
    feature: 'Process Register & Data Flow',
    action: 'Edit',
    defaultReach: 'Own department',
    description: 'Maintain data processing activities, categories, and retention periods',
  },
  {
    id: 'perm-dept-vendor-add',
    landscape: 'Department',
    module: 'Vendor Management',
    feature: 'Third-party Processors',
    action: 'Create',
    defaultReach: 'Own department',
    description: 'Register sub-processors, cloud tools, and data sharing agreements',
  },
  {
    id: 'perm-dept-evidence',
    landscape: 'Department',
    module: 'Compliance Evidence',
    feature: 'Audit Artifacts & Evidence',
    action: 'Submit for review',
    defaultReach: 'Own department',
    description: 'Submit proof of control enforcement and departmental compliance evidence',
  },

  // 3. Landscape: Risk
  {
    id: 'perm-risk-view',
    landscape: 'Risk',
    module: 'Risk Register',
    feature: 'Privacy Threat Catalog',
    action: 'View',
    defaultReach: 'Own company',
    description: 'Inspect calculated risk scores, vulnerabilities, and severity ratings',
  },
  {
    id: 'perm-risk-dpia-create',
    landscape: 'Risk',
    module: 'DPIA',
    feature: 'Privacy Impact Assessment',
    action: 'Create',
    defaultReach: 'Own company',
    description: 'Draft new Privacy Impact Assessments for high-risk processing',
  },
  {
    id: 'perm-risk-dpia-ai',
    landscape: 'Risk',
    module: 'DPIA',
    feature: 'AI PIA Synthesizer & Gap Agent',
    action: 'Run AI agent',
    defaultReach: 'Own company',
    description: 'Trigger autonomous AI agents for control mapping and gap analysis (Restricted from DPO)',
    isRestrictedForDPO: true,
  },
  {
    id: 'perm-risk-control-map-ai',
    landscape: 'Risk',
    module: 'Control Mapping',
    feature: 'AI Control Matcher',
    action: 'Run AI agent',
    defaultReach: 'Own company',
    description: 'Run automated AI correlation of ISO 27701, GDPR, and DPDP controls (Restricted from DPO)',
    isRestrictedForDPO: true,
  },
  {
    id: 'perm-risk-approve',
    landscape: 'Risk',
    module: 'DPIA & Risk Acceptance',
    feature: 'Formal Risk Sign-off',
    action: 'Approve',
    defaultReach: 'Own company',
    description: 'Formally accept residual risk or approve DPIA filing (Cannot approve own submission)',
  },

  // 4. Landscape: Trust
  {
    id: 'perm-trust-view',
    landscape: 'Trust',
    module: 'Trust Center',
    feature: 'Security & Compliance Posture',
    action: 'View',
    defaultReach: 'Everywhere',
    description: 'Browse public-facing trust certifications, SOC2, and ISO status',
  },
  {
    id: 'perm-trust-legal-lib',
    landscape: 'Trust',
    module: 'Legal Library',
    feature: 'Global Privacy Legislation',
    action: 'View',
    defaultReach: 'Everywhere',
    description: 'Consult cross-border privacy laws, articles, and supervisory authority guidance',
  },
  {
    id: 'perm-trust-export',
    landscape: 'Trust',
    module: 'Reporting',
    feature: 'Executive Compliance Report',
    action: 'Export or download',
    defaultReach: 'Own company',
    description: 'Generate PDF/CSV executive summaries and RoPA reports',
  },

  // 5. Landscape: Consent
  {
    id: 'perm-consent-banner-edit',
    landscape: 'Consent',
    module: 'Cookie Consent',
    feature: 'Banner Configuration',
    action: 'Edit',
    defaultReach: 'Own company',
    description: 'Configure cookie categories, scripts, banners, and geolocation rules',
  },
  {
    id: 'perm-consent-publish',
    landscape: 'Consent',
    module: 'Consent Programs',
    feature: 'Preference Centers & Notice',
    action: 'Publish',
    defaultReach: 'Own company',
    description: 'Publish live privacy notices and customer consent management widgets',
  },
  {
    id: 'perm-consent-approve',
    landscape: 'Consent',
    module: 'Consent Programs',
    feature: 'Subject Consent Workflow',
    action: 'Approve',
    defaultReach: 'Own company',
    description: 'Review and approve customer consent collection programmes',
  },

  // 6. Landscape: Administration
  {
    id: 'perm-admin-users-view',
    landscape: 'Administration',
    module: 'User Management',
    feature: 'Employee Directory',
    action: 'View',
    defaultReach: 'Own company',
    description: 'Access employee directory and personnel listings',
  },
  {
    id: 'perm-admin-users-manage',
    landscape: 'Administration',
    module: 'User Management',
    feature: 'User Accounts & Provisioning',
    action: 'Create',
    defaultReach: 'Everywhere',
    description: 'Invite users, edit profiles, suspend/reactivate accounts (Enterprise Admin Only)',
    isEnterpriseAdminOnly: true,
  },
  {
    id: 'perm-admin-roles-manage',
    landscape: 'Administration',
    module: 'Access Control',
    feature: 'Roles & Permission Matrix',
    action: 'Edit',
    defaultReach: 'Everywhere',
    description: 'Configure role definitions and assign enterprise roles (Enterprise Admin Only)',
    isEnterpriseAdminOnly: true,
  },
  {
    id: 'perm-admin-governance',
    landscape: 'Administration',
    module: 'Access Governance',
    feature: 'Access Reviews & Audit Trails',
    action: 'Approve',
    defaultReach: 'Everywhere',
    description: 'Conduct periodic entitlement reviews and sign off on access governance',
    isEnterpriseAdminOnly: true,
  },

  // 7. Landscape: Account
  {
    id: 'perm-account-profile',
    landscape: 'Account',
    module: 'Personal Settings',
    feature: 'Profile & Credentials',
    action: 'Edit',
    defaultReach: 'Can open only',
    description: 'Manage personal password, MFA tokens, and UI language',
  },
  {
    id: 'perm-account-notif',
    landscape: 'Account',
    module: 'Notifications',
    feature: 'Alert Preferences',
    action: 'Edit',
    defaultReach: 'Can open only',
    description: 'Configure email alerts, digest frequency, and system notifications',
  },
];

export interface RoleDetailSpec {
  role: RoleType;
  description: string;
  scopeSummary: string;
  allowedLandscapeList: LandscapeType[];
  canAccessAdminPanel: boolean;
  canManageUsers: boolean;
  canManageOrg: boolean;
  canRunAiAgents: boolean;
  canApproveConsent: boolean;
  canUploadLetterhead: boolean;
  notes: string[];
}

export const ROLE_SPECS: Record<RoleType, RoleDetailSpec> = {
  'Enterprise Admin': {
    role: 'Enterprise Admin',
    description:
      'Global access. Full platform access, including creating and managing users, projects, and companies across the entire Dutro instance.',
    scopeSummary: 'Global access',
    allowedLandscapeList: ['Company', 'Department', 'Risk', 'Trust', 'Consent', 'Administration', 'Account'],
    canAccessAdminPanel: true,
    canManageUsers: true,
    canManageOrg: true,
    canRunAiAgents: true,
    canApproveConsent: true,
    canUploadLetterhead: true,
    notes: [
      'Sole role authorized to manage users, invitations, and registrations.',
      'Sole role authorized to upload official company letterhead.',
      'Sole role authorized to delete enterprise projects.',
      'Full access across all companies and legal entities.',
    ],
  },
  Consultant: {
    role: 'Consultant',
    description:
      'Project-level access. Runs compliance work for every company in an assigned project: company profiles, control frameworks, discovery, risk registers and vendor management. Does not include user administration.',
    scopeSummary: 'Project-level access',
    allowedLandscapeList: ['Company', 'Department', 'Risk', 'Trust', 'Account'],
    canAccessAdminPanel: true,
    canManageUsers: false,
    canManageOrg: true,
    canRunAiAgents: true,
    canApproveConsent: false,
    canUploadLetterhead: false,
    notes: [
      'Project-level access across every company in an assigned project.',
      'Does not include user administration.',
    ],
  },
  'Data Protection Officer': {
    role: 'Data Protection Officer',
    description:
      'Company-level access. Acts as the Data Protection Officer for a company: reviews compliance work, manages data-flow diagrams and cookie consent, and adds notes and evidence.',
    scopeSummary: 'Company-level access',
    allowedLandscapeList: ['Company', 'Department', 'Risk', 'Trust', 'Consent', 'Account'],
    canAccessAdminPanel: false,
    canManageUsers: false,
    canManageOrg: false,
    canRunAiAgents: false,
    canApproveConsent: true,
    canUploadLetterhead: false,
    notes: [
      'Company-level access for statutory oversight.',
      'Reviews compliance work, manages data-flow diagrams and cookie consent.',
    ],
  },
  'Program Owner': {
    role: 'Program Owner',
    description:
      'Company-level access. Owns the privacy programme for a company: reviews compliance work, runs gap analyses and impact assessments, and adds notes and evidence.',
    scopeSummary: 'Company-level access',
    allowedLandscapeList: ['Company', 'Department', 'Risk', 'Trust', 'Consent', 'Account'],
    canAccessAdminPanel: false,
    canManageUsers: false,
    canManageOrg: false,
    canRunAiAgents: true,
    canApproveConsent: true,
    canUploadLetterhead: false,
    notes: [
      'Company-level access for overall privacy programme ownership.',
      'Runs gap analyses and impact assessments.',
    ],
  },
  'Department Owner': {
    role: 'Department Owner',
    description:
      'Department-level access. Manages privacy for a single department: business processes, vendors, risks and policies, with no visibility into other departments.',
    scopeSummary: 'Department-level access',
    allowedLandscapeList: ['Department', 'Risk', 'Trust', 'Account'],
    canAccessAdminPanel: false,
    canManageUsers: false,
    canManageOrg: false,
    canRunAiAgents: false,
    canApproveConsent: false,
    canUploadLetterhead: false,
    notes: [
      'Department-level access strictly within assigned department.',
      'No visibility into other departments.',
    ],
  },
  'Department POC': {
    role: 'Department POC',
    description:
      'Department-level access. The point of contact for a department: supplies department information, completes data-mapping questionnaires, and uploads supporting documents.',
    scopeSummary: 'Department-level access',
    allowedLandscapeList: ['Department', 'Risk', 'Trust', 'Account'],
    canAccessAdminPanel: false,
    canManageUsers: false,
    canManageOrg: false,
    canRunAiAgents: false,
    canApproveConsent: false,
    canUploadLetterhead: false,
    notes: [
      'Department-level point of contact.',
      'Supplies department info and completes data-mapping questionnaires.',
    ],
  },
  Customer: {
    role: 'Customer',
    description:
      'Company-level access. Read-only visibility into the companies they are assigned, for reviewing status without making changes.',
    scopeSummary: 'Company-level access',
    allowedLandscapeList: ['Trust', 'Account'],
    canAccessAdminPanel: false,
    canManageUsers: false,
    canManageOrg: false,
    canRunAiAgents: false,
    canApproveConsent: false,
    canUploadLetterhead: false,
    notes: [
      'Company-level access with read-only visibility.',
      'Status review without making changes.',
    ],
  },
  User: {
    role: 'User',
    description:
      'No access. The default role assigned on sign-up; the account gains no module access until an administrator or consultant assigns one of the roles above.',
    scopeSummary: 'No access',
    allowedLandscapeList: ['Account'],
    canAccessAdminPanel: false,
    canManageUsers: false,
    canManageOrg: false,
    canRunAiAgents: false,
    canApproveConsent: false,
    canUploadLetterhead: false,
    notes: [
      'Default role assigned on sign-up.',
      'No module access until an administrator or consultant assigns a role.',
    ],
  },
};

/**
 * Calculates whether a role by default has permission for a specific definition.
 */
export function getRolePermissionStatus(
  role: RoleType,
  permission: PermissionDefinition
): { hasAccess: boolean; reach: PermissionReach; reason?: string } {
  const spec = ROLE_SPECS[role];

  // Enterprise Admin has everything everywhere
  if (role === 'Enterprise Admin') {
    return { hasAccess: true, reach: 'Everywhere' };
  }

  // Enterprise Admin only features
  if (permission.isEnterpriseAdminOnly) {
    return { hasAccess: false, reach: 'Can open only', reason: 'Restricted: Enterprise Admin exclusive' };
  }

  // DPO AI restriction rule
  if (role === 'Data Protection Officer' && permission.isRestrictedForDPO) {
    return {
      hasAccess: false,
      reach: 'Can open only',
      reason: 'Rule Violation: DPO is prohibited from running AI agents for control mapping, gap analysis, or PIA',
    };
  }

  // Check if landscape is allowed
  if (!spec.allowedLandscapeList.includes(permission.landscape)) {
    return { hasAccess: false, reach: 'Can open only', reason: 'Landscape outside role scope' };
  }

  // Consultant specific permissions
  if (role === 'Consultant') {
    if (permission.landscape === 'Administration') {
      if (permission.action === 'View' && permission.feature === 'Employee Directory') {
        return { hasAccess: true, reach: 'Own company', reason: 'Consultant read-only directory view' };
      }
      return { hasAccess: false, reach: 'Can open only', reason: 'Consultants cannot manage users or permissions' };
    }
    if (permission.landscape === 'Company' || permission.landscape === 'Department') {
      if (permission.action === 'Delete') return { hasAccess: false, reach: 'Can open only' };
      return { hasAccess: true, reach: 'Own company' };
    }
    return { hasAccess: true, reach: 'Own company' };
  }

  // DPO permissions
  if (role === 'Data Protection Officer') {
    if (permission.action === 'Delete') return { hasAccess: false, reach: 'Can open only' };
    if (permission.action === 'Approve') return { hasAccess: true, reach: 'Own company' };
    if (permission.landscape === 'Consent') return { hasAccess: true, reach: 'Own company' };
    if (permission.landscape === 'Risk' || permission.landscape === 'Trust') {
      return { hasAccess: true, reach: 'Own company' };
    }
    return { hasAccess: true, reach: 'Own company' };
  }

  // Program Owner permissions
  if (role === 'Program Owner') {
    if (permission.action === 'Delete') return { hasAccess: false, reach: 'Can open only' };
    return { hasAccess: true, reach: 'Own company' };
  }

  // Department Owner permissions
  if (role === 'Department Owner') {
    if (permission.landscape === 'Department') {
      return { hasAccess: true, reach: 'Own department' };
    }
    if (permission.landscape === 'Risk' && permission.action === 'View') {
      return { hasAccess: true, reach: 'Own department' };
    }
    return { hasAccess: false, reach: 'Can open only', reason: 'Exceeds departmental scope' };
  }

  // Customer permissions
  if (role === 'Customer') {
    if (permission.landscape === 'Trust' && (permission.action === 'View' || permission.action === 'Export or download')) {
      return { hasAccess: true, reach: 'Own company' };
    }
    if (permission.landscape === 'Account') {
      return { hasAccess: true, reach: 'Can open only' };
    }
    return { hasAccess: false, reach: 'Can open only', reason: 'Customer view-only limits' };
  }

  // Standard User
  if (role === 'User') {
    if (permission.landscape === 'Account') {
      return { hasAccess: true, reach: 'Can open only' };
    }
    if (permission.id === 'perm-trust-legal-lib') {
      return { hasAccess: true, reach: 'Everywhere' };
    }
    return { hasAccess: false, reach: 'Can open only', reason: 'Base user baseline' };
  }

  return { hasAccess: false, reach: 'Can open only' };
}

