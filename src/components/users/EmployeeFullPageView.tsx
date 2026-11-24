import React, { useState, useMemo } from 'react';
import { User, RoleType, ResourceAssignment, CustomPermissionGrant } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Building2,
  Building,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  Filter,
  Check,
  ChevronDown,
  Sliders,
  Shield,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { NarrowScopeModal } from '../access/NarrowScopeModal';

interface EmployeeFullPageViewProps {
  user: User;
  onBack: () => void;
  onOpenCustomGrantModal?: (user: User) => void;
  onOpenResourceAssignModal?: (user: User) => void;
  onOpenNarrowScopeModal?: (user: User) => void;
  onOpenEdit?: (user: User) => void;
}

type TabKey = 'assignments' | 'effective-permissions' | 'custom-grants' | 'test-access';

interface ActionDefinition {
  code: string;
  area: string;
  title: string;
  description: string;
  minRole: 'all' | 'customer' | 'dept' | 'company' | 'admin';
  adminOnly?: boolean;
}

// Comprehensive granular actions mapping to Dutro's real permission areas
const DUTRO_ACTIONS: ActionDefinition[] = [
  // 1. Audit Event (1)
  {
    code: 'audit_event:view',
    area: 'Audit Event',
    title: 'View the compliance audit/event log',
    description: 'Inspect full immutable compliance events and administrative activity log',
    minRole: 'customer',
  },

  // 2. Business Process (4)
  {
    code: 'business_process:create',
    area: 'Business Process',
    title: 'Create a business process record',
    description: 'Register new personal data processing activity or departmental RoPA entry',
    minRole: 'dept',
  },
  {
    code: 'business_process:delete',
    area: 'Business Process',
    title: 'Delete a business process record',
    description: 'Remove obsolete processing activities from the departmental roster',
    minRole: 'dept',
  },
  {
    code: 'business_process:edit',
    area: 'Business Process',
    title: 'Edit a business process record',
    description: 'Update processing categories, lawful basis, data subjects, and retention periods',
    minRole: 'dept',
  },
  {
    code: 'business_process:view',
    area: 'Business Process',
    title: 'View business process records',
    description: 'Read-only access to inspect mapped business process records and attributes',
    minRole: 'all',
  },

  // 3. Channel (1)
  {
    code: 'channel:create',
    area: 'Channel',
    title: 'Create a workspace channel',
    description: 'Establish shared collaboration channels between departments and external DPOs',
    minRole: 'dept',
  },

  // 4. Company (6)
  {
    code: 'company:assign_roles',
    area: 'Company',
    title: 'Assign user roles within a company',
    description: 'Grant or alter role assignments and permission scopes across company members',
    minRole: 'company',
    adminOnly: true,
  },
  {
    code: 'company:create_department',
    area: 'Company',
    title: 'Create a department under a company',
    description: 'Add new organizational departments and assign department owners',
    minRole: 'company',
  },
  {
    code: 'company:create_entity',
    area: 'Company',
    title: 'Create a registered entity under a company',
    description: 'Register subsidiary corporate entities and legal structures',
    minRole: 'company',
  },
  {
    code: 'company:delete',
    area: 'Company',
    title: 'Delete a company',
    description: 'Decommission an entire tenant company structure and archive its data',
    minRole: 'admin',
    adminOnly: true,
  },
  {
    code: 'company:edit',
    area: 'Company',
    title: 'Edit company details',
    description: 'Update company address, registration numbers, jurisdiction, and official letterhead',
    minRole: 'company',
  },
  {
    code: 'company:view',
    area: 'Company',
    title: 'View company details',
    description: 'Inspect company overview, executives, DPO contact, and registered entities',
    minRole: 'all',
  },

  // 5. Consent (5)
  {
    code: 'consent:configure_cookies',
    area: 'Consent',
    title: 'Configure cookie banners',
    description: 'Design cookie banners, categorize scripts, and publish consent notices',
    minRole: 'company',
  },
  {
    code: 'consent:manage_purposes',
    area: 'Consent',
    title: 'Manage universal consent purposes',
    description: 'Define consent purposes, processing grounds, and consent withdrawal triggers',
    minRole: 'company',
  },
  {
    code: 'consent:view_analytics',
    area: 'Consent',
    title: 'View consent analytics and telemetry',
    description: 'Analyze opt-in rates, consent compliance percentages, and geographic metrics',
    minRole: 'customer',
  },
  {
    code: 'consent:export_audit',
    area: 'Consent',
    title: 'Export consent audit trail',
    description: 'Generate timestamped export of individual consent records for regulatory inspection',
    minRole: 'customer',
  },
  {
    code: 'consent:update_preferences',
    area: 'Consent',
    title: 'Update user consent preferences',
    description: 'Modify user opt-in/opt-out status across registered communication channels',
    minRole: 'dept',
  },

  // 6. Department (4)
  {
    code: 'department:view',
    area: 'Department',
    title: 'View department records',
    description: 'Inspect departmental roster, data flows, and assigned compliance leads',
    minRole: 'all',
  },
  {
    code: 'department:edit',
    area: 'Department',
    title: 'Edit department details',
    description: 'Modify department name, code, description, and primary point of contact',
    minRole: 'dept',
  },
  {
    code: 'department:assign_personnel',
    area: 'Department',
    title: 'Assign departmental personnel',
    description: 'Allocate users to departmental roles (Department Owner or Department POC)',
    minRole: 'company',
  },
  {
    code: 'department:delete',
    area: 'Department',
    title: 'Delete department structure',
    description: 'Archive department and reassign active business processes',
    minRole: 'company',
  },

  // 7. Discovery (3)
  {
    code: 'discovery:run',
    area: 'Discovery',
    title: 'Run automated discovery scanner',
    description: 'Initiate automated scanning across cloud data lakes, databases, and APIs',
    minRole: 'company',
  },
  {
    code: 'discovery:review',
    area: 'Discovery',
    title: 'Review discovered data assets',
    description: 'Classify discovered PII assets and confirm automated schema mappings',
    minRole: 'dept',
  },
  {
    code: 'discovery:configure',
    area: 'Discovery',
    title: 'Configure discovery sources',
    description: 'Set up connectors, credentials, and scan frequencies for data systems',
    minRole: 'company',
  },

  // 8. Evidence Bank (3)
  {
    code: 'evidence:upload',
    area: 'Evidence Bank',
    title: 'Upload compliance evidence',
    description: 'Upload audit proof, screenshots, policies, and control implementation evidence',
    minRole: 'dept',
  },
  {
    code: 'evidence:verify',
    area: 'Evidence Bank',
    title: 'Verify submitted evidence artifact',
    description: 'Review and certify departmental evidence against compliance requirements',
    minRole: 'company',
  },
  {
    code: 'evidence:archive',
    area: 'Evidence Bank',
    title: 'Archive evidence records',
    description: 'Decommission expired audit evidence items and update retention schedules',
    minRole: 'company',
  },

  // 9. Gap Analysis (4)
  {
    code: 'gap_analysis:run',
    area: 'Gap Analysis',
    title: 'Initiate gap assessment sprint',
    description: 'Execute privacy and security benchmark tests against regulatory frameworks',
    minRole: 'company',
  },
  {
    code: 'gap_analysis:map_controls',
    area: 'Gap Analysis',
    title: 'Map controls against frameworks',
    description: 'Correlate internal safeguards with ISO 27001, GDPR, and DPDP mandates',
    minRole: 'company',
  },
  {
    code: 'gap_analysis:approve',
    area: 'Gap Analysis',
    title: 'Approve remediation roadmap',
    description: 'Sign off on corrective action items and timeline milestones',
    minRole: 'company',
  },
  {
    code: 'gap_analysis:export',
    area: 'Gap Analysis',
    title: 'Export gap analysis report',
    description: 'Generate board-level compliance summary documents and remediation plans',
    minRole: 'customer',
  },

  // 10. Policy (5)
  {
    code: 'policy:create',
    area: 'Policy',
    title: 'Draft compliance policy',
    description: 'Create new privacy, security, data handling, and AI usage policy drafts',
    minRole: 'company',
  },
  {
    code: 'policy:edit',
    area: 'Policy',
    title: 'Edit published policy',
    description: 'Revise active clauses, responsibilities, and procedural enforcement rules',
    minRole: 'company',
  },
  {
    code: 'policy:publish',
    area: 'Policy',
    title: 'Publish active policy version',
    description: 'Broadcast and enforce updated policy across all company personnel',
    minRole: 'company',
  },
  {
    code: 'policy:review',
    area: 'Policy',
    title: 'Review policy compliance status',
    description: 'Check employee acknowledgement rates and policy exceptions',
    minRole: 'all',
  },
  {
    code: 'policy:archive',
    area: 'Policy',
    title: 'Archive obsolete policies',
    description: 'Deprecate superseded policies and maintain historical version tree',
    minRole: 'company',
  },

  // 11. Regulatory (3)
  {
    code: 'regulatory:view',
    area: 'Regulatory',
    title: 'View regulatory intelligence feed',
    description: 'Access real-time global legal updates, enforcement tracker, and fines',
    minRole: 'all',
  },
  {
    code: 'regulatory:track',
    area: 'Regulatory',
    title: 'Track enforcement actions and penalties',
    description: 'Monitor supervisory authority decisions and court rulings across regions',
    minRole: 'customer',
  },
  {
    code: 'regulatory:subscribe',
    area: 'Regulatory',
    title: 'Subscribe to jurisdiction updates',
    description: 'Configure automated email and slack alerts for regional legislation shifts',
    minRole: 'all',
  },

  // 12. Risk Register (4)
  {
    code: 'risk:create',
    area: 'Risk Register',
    title: 'Log identified privacy risk',
    description: 'Register vulnerabilities, threat vectors, and data protection risks',
    minRole: 'dept',
  },
  {
    code: 'risk:assess',
    area: 'Risk Register',
    title: 'Perform risk scoring and DPIA',
    description: 'Calculate likelihood, impact, residual risk, and run DPIA workflows',
    minRole: 'company',
  },
  {
    code: 'risk:treat',
    area: 'Risk Register',
    title: 'Assign risk treatment plan',
    description: 'Designate risk mitigation actions and assign accountable owners',
    minRole: 'dept',
  },
  {
    code: 'risk:signoff',
    area: 'Risk Register',
    title: 'Sign off on residual risk',
    description: 'Executive acceptance and formal DPO sign-off on residual threat score',
    minRole: 'company',
  },

  // 13. Vendor (4)
  {
    code: 'vendor:create',
    area: 'Vendor',
    title: 'Register third-party processor',
    description: 'Onboard SaaS vendors, cloud service providers, and data sub-processors',
    minRole: 'dept',
  },
  {
    code: 'vendor:assess',
    area: 'Vendor',
    title: 'Assess vendor security posture',
    description: 'Evaluate vendor questionnaires, SOC 2 reports, and DPA agreements',
    minRole: 'company',
  },
  {
    code: 'vendor:view',
    area: 'Vendor',
    title: 'View vendor inventory & contracts',
    description: 'Inspect active third-party relationships, transfer destinations, and DPAs',
    minRole: 'all',
  },
  {
    code: 'vendor:terminate',
    area: 'Vendor',
    title: 'Terminate vendor data sharing agreement',
    description: 'Execute vendor offboarding, data deletion verification, and DPA sunset',
    minRole: 'company',
  },

  // 14. Framework (3)
  {
    code: 'framework:map',
    area: 'Framework',
    title: 'Map regulatory frameworks and controls',
    description: 'Map internal controls directly against GDPR, NIST, ISO 27001, and SOC 2 standards',
    minRole: 'company',
  },
  {
    code: 'framework:view',
    area: 'Framework',
    title: 'View active compliance frameworks',
    description: 'Read-only view of enabled compliance frameworks and control coverage metrics',
    minRole: 'all',
  },
  {
    code: 'framework:export',
    area: 'Framework',
    title: 'Export framework compliance report',
    description: 'Generate compliance audit attestation and export control readiness data',
    minRole: 'customer',
  },

  // 15. Data Flow & RoPA (3)
  {
    code: 'dataflow:create',
    area: 'Data Flow',
    title: 'Generate RoPA data-flow diagram',
    description: 'Create visual lineage and data-flow pipelines between systems and third parties',
    minRole: 'company',
  },
  {
    code: 'dataflow:view',
    area: 'Data Flow',
    title: 'Inspect system data-flow diagrams',
    description: 'View cross-border data transfer routes and system architecture maps',
    minRole: 'all',
  },
  {
    code: 'dataflow:edit',
    area: 'Data Flow',
    title: 'Edit cross-border data transfer routes',
    description: 'Update transfer safeguards, standard contractual clauses (SCCs), and TIA notes',
    minRole: 'company',
  },

  // 16. User Administration (3)
  {
    code: 'user:invite',
    area: 'Administration',
    title: 'Invite team members',
    description: 'Send onboarding invitations and assign initial roles to new personnel',
    minRole: 'admin',
    adminOnly: true,
  },
  {
    code: 'user:suspend',
    area: 'Administration',
    title: 'Suspend user accounts',
    description: 'Temporarily revoke system access and credentials for security or review',
    minRole: 'admin',
    adminOnly: true,
  },
  {
    code: 'user:change_role',
    area: 'Administration',
    title: 'Change user system role',
    description: 'Elevate or restrict system access level and administrative authority',
    minRole: 'admin',
    adminOnly: true,
  },
];

// 9 Role Cards matching Screenshot 2
interface RoleCardItem {
  role: RoleType;
  title: string;
  scopeLabel: string;
  description: string;
}

const ROLE_CARDS: RoleCardItem[] = [
  {
    role: 'Enterprise Admin',
    title: 'Enterprise Admin',
    scopeLabel: 'Global',
    description: 'Full access to everything, including user and project administration.',
  },
  {
    role: 'Consultant',
    title: 'Consultant',
    scopeLabel: 'Project level',
    description:
      'Runs compliance work for every company in a project: profiles, frameworks, discovery, risks and vendors. No user administration.',
  },
  {
    role: 'Data Protection Officer',
    title: 'DPO',
    scopeLabel: 'Company level',
    description:
      'Data Protection Officer for a company. Views compliance work, manages data-flow diagrams and cookie consent, and adds notes and evidence.',
  },
  {
    role: 'Program Owner',
    title: 'Program Owner',
    scopeLabel: 'Company level',
    description:
      'Owns the privacy programme for a company. Views compliance work, runs gap analyses and impact assessments, and adds notes and evidence.',
  },
  {
    role: 'Department Owner',
    title: 'Department Owner',
    scopeLabel: 'Department level',
    description: 'Manages compliance for one department: business processes, vendors, risks and policies.',
  },
  {
    role: 'Department POC',
    title: 'Department POC',
    scopeLabel: 'Department level',
    description: "Keeps one department's vendors, risks and policies up to date and submits evidence.",
  },
  {
    role: 'Customer',
    title: 'Customer',
    scopeLabel: 'Company level',
    description: 'Read-only access to the companies they are given.',
  },
  {
    role: 'User',
    title: 'User',
    scopeLabel: 'No access',
    description: 'Default for new sign-ups. No access until another role is assigned.',
  },
];

export const EmployeeFullPageView: React.FC<EmployeeFullPageViewProps> = ({
  user,
  onBack,
}) => {
  const {
    companies,
    legalEntities,
    departments,
    projects,
    changeUserRole,
    suspendUser,
    reactivateUser,
    addCustomGrant,
    removeCustomGrant,
    removeResourceAssignment,
    addNotification,
  } = useApp();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<TabKey>('assignments');

  // Permission Search Filter (Tab 2)
  const [searchFilter, setSearchFilter] = useState('');

  // Narrow Modal state
  const [narrowingAction, setNarrowingAction] = useState<ActionDefinition | null>(null);

  // Tab 1: Role Assignment selection state
  const [selectedRoleCard, setSelectedRoleCard] = useState<RoleCardItem>(() => {
    return (
      ROLE_CARDS.find((rc) => rc.role === user.role) ||
      ROLE_CARDS.find((rc) => rc.title === user.role) ||
      ROLE_CARDS[1]
    );
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(user.companyId || companies[0]?.id || '');

  // Tab 3: Custom Grant form state
  const [grantEffect, setGrantEffect] = useState<'Allow' | 'Deny'>('Allow');
  const [grantActionCode, setGrantActionCode] = useState<string>('');
  const [grantProjectId, setGrantProjectId] = useState<string>('ANY');
  const [grantCompanyId, setGrantCompanyId] = useState<string>('ANY');
  const [grantEntityId, setGrantEntityId] = useState<string>('ANY');
  const [grantDeptId, setGrantDeptId] = useState<string>('ANY');

  // Tab 4: Test Access form state
  const [testActionCode, setTestActionCode] = useState<string>('');
  const [testProjectId, setTestProjectId] = useState<string>('NA');
  const [testCompanyId, setTestCompanyId] = useState<string>('NA');
  const [testEntityId, setTestEntityId] = useState<string>('NA');
  const [testDeptId, setTestDeptId] = useState<string>('NA');
  const [testEvaluation, setTestEvaluation] = useState<{
    evaluated: boolean;
    allowed: boolean;
    actionTitle: string;
    actionCode: string;
    targetUrn: string;
    reason: string;
    ruleDetail: string;
  } | null>(null);

  // Filter legal entities based on chosen company in Custom Grant
  const grantAvailableEntities = useMemo(() => {
    if (grantCompanyId === 'ANY') return [];
    return legalEntities.filter((e) => e.companyId === grantCompanyId);
  }, [legalEntities, grantCompanyId]);

  // Filter departments based on chosen entity in Custom Grant
  const grantAvailableDepts = useMemo(() => {
    if (grantEntityId === 'ANY' || grantCompanyId === 'ANY') return [];
    return departments.filter(
      (d) => d.companyId === grantCompanyId && d.legalEntityId === grantEntityId
    );
  }, [departments, grantCompanyId, grantEntityId]);

  // Filter entities & depts for Test Access
  const testAvailableEntities = useMemo(() => {
    if (testCompanyId === 'NA') return [];
    return legalEntities.filter((e) => e.companyId === testCompanyId);
  }, [legalEntities, testCompanyId]);

  const testAvailableDepts = useMemo(() => {
    if (testEntityId === 'NA' || testCompanyId === 'NA') return [];
    return departments.filter(
      (d) => d.companyId === testCompanyId && d.legalEntityId === testEntityId
    );
  }, [departments, testCompanyId, testEntityId]);

  // Check which actions are effectively permitted for this user
  const effectiveActions = useMemo(() => {
    return DUTRO_ACTIONS.filter((act) => {
      // 1. Check custom grants first: Deny overrides everything
      const denyGrant = user.customGrants?.find(
        (cg) => cg.permissionId === act.code && (cg.reach === 'Can open only' || cg.grantType === 'NARROW')
      );
      if (denyGrant) return false;

      // 2. Custom allow grant
      const allowGrant = user.customGrants?.find(
        (cg) => cg.permissionId === act.code && cg.grantType === 'GRANT'
      );
      if (allowGrant) return true;

      // 3. User role baseline
      if (user.role === 'Enterprise Admin') return true;

      if (user.role === 'Consultant') {
        // Consultant has access to all compliance modules, but not user/admin delete
        if (act.adminOnly) return false;
        return true;
      }

      if (user.role === 'Data Protection Officer' || user.role === 'Program Owner') {
        if (act.adminOnly) return false;
        return true;
      }

      if (user.role === 'Department Owner' || user.role === 'Department POC') {
        if (act.minRole === 'admin' || act.minRole === 'company') return false;
        return true;
      }

      if (user.role === 'Customer') {
        return act.minRole === 'all' || act.minRole === 'customer';
      }

      if (user.role === 'User') {
        return act.minRole === 'all';
      }

      return false;
    });
  }, [user]);

  // Filter effective permissions by search input
  const filteredActions = useMemo(() => {
    if (!searchFilter.trim()) return effectiveActions;
    const q = searchFilter.toLowerCase();
    return effectiveActions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.area.toLowerCase().includes(q)
    );
  }, [effectiveActions, searchFilter]);

  // Group actions by area for Tab 2
  const groupedActions = useMemo(() => {
    const map = new Map<string, ActionDefinition[]>();
    filteredActions.forEach((act) => {
      const list = map.get(act.area) || [];
      list.push(act);
      map.set(act.area, list);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredActions]);

  // Derive URN preview for Custom Grant
  const grantUrn = useMemo(() => {
    let urn = 'urn:dutient';
    if (grantProjectId !== 'ANY') {
      urn += `:project:${grantProjectId}`;
    }
    if (grantCompanyId !== 'ANY') {
      urn += `:company:${grantCompanyId}`;
      if (grantEntityId !== 'ANY') {
        urn += `:entity:${grantEntityId}`;
        if (grantDeptId !== 'ANY') {
          urn += `:department:${grantDeptId}`;
        }
      }
    }
    if (grantProjectId === 'ANY' && grantCompanyId === 'ANY') {
      return {
        label: 'Every project and company',
        code: 'urn:dutient:system/*',
      };
    }
    return {
      label:
        grantCompanyId !== 'ANY'
          ? `${companies.find((c) => c.id === grantCompanyId)?.name || 'Company'} and components below`
          : 'Project-wide scope',
      code: `${urn}/*`,
    };
  }, [grantProjectId, grantCompanyId, grantEntityId, grantDeptId, companies]);

  // Derive URN preview for Test Access
  const testUrn = useMemo(() => {
    if (testCompanyId === 'NA' && testProjectId === 'NA') {
      return {
        label: 'System level (no specific company)',
        code: 'urn:dutient:system',
      };
    }
    let urn = 'urn:dutient';
    if (testCompanyId !== 'NA') {
      urn += `:company:${testCompanyId}`;
      if (testEntityId !== 'NA') {
        urn += `:entity:${testEntityId}`;
        if (testDeptId !== 'NA') {
          urn += `:department:${testDeptId}`;
        }
      }
    }
    return {
      label:
        testCompanyId !== 'NA'
          ? `Company level - ${companies.find((c) => c.id === testCompanyId)?.name || 'Selected Company'}`
          : 'Project scope',
      code: urn,
    };
  }, [testCompanyId, testProjectId, testEntityId, testDeptId, companies]);

  // Initials generator
  const getInitials = (text: string) => {
    return text
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Handle Tab 1 Assign Role
  const handleAssignRole = () => {
    changeUserRole(user.id, selectedRoleCard.role);
    addNotification(
      'Role Updated',
      `Assigned role ${selectedRoleCard.title} to ${user.name}`,
      'success'
    );
  };

  // Handle Tab 3 Add Custom Grant
  const handleAddGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantActionCode) return;

    const actionObj = DUTRO_ACTIONS.find((a) => a.code === grantActionCode);
    if (!actionObj) return;

    addCustomGrant(user.id, {
      permissionId: actionObj.code,
      landscape: 'Administration',
      module: actionObj.area,
      feature: actionObj.title,
      action: grantEffect === 'Allow' ? 'Approve' : 'Delete',
      reach: grantEffect === 'Allow' ? 'Everywhere' : 'Can open only',
      grantType: grantEffect === 'Allow' ? 'GRANT' : 'NARROW',
      reason: `Custom ${grantEffect} grant applied at ${grantUrn.code}`,
    });

    addNotification(
      'Custom Grant Added',
      `${grantEffect} grant applied for ${actionObj.title} (${actionObj.code})`,
      'success'
    );

    // Reset form
    setGrantActionCode('');
  };

  // Handle Tab 4 Check Access
  const handleCheckAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testActionCode) return;

    const actionObj = DUTRO_ACTIONS.find((a) => a.code === testActionCode);
    if (!actionObj) return;

    // Evaluate
    if (user.status === 'Suspended') {
      setTestEvaluation({
        evaluated: true,
        allowed: false,
        actionTitle: actionObj.title,
        actionCode: actionObj.code,
        targetUrn: testUrn.code,
        reason: 'User account is currently suspended. All system actions are blocked.',
        ruleDetail: 'Account Status: Suspended',
      });
      return;
    }

    // Check custom grants
    const explicitDeny = user.customGrants?.find(
      (cg) => cg.permissionId === actionObj.code && (cg.reach === 'Can open only' || cg.grantType === 'NARROW')
    );
    if (explicitDeny) {
      setTestEvaluation({
        evaluated: true,
        allowed: false,
        actionTitle: actionObj.title,
        actionCode: actionObj.code,
        targetUrn: testUrn.code,
        reason: `Explicit Deny override exists: "${explicitDeny.reason}"`,
        ruleDetail: 'Custom Grant: Explicit DENY',
      });
      return;
    }

    const explicitAllow = user.customGrants?.find(
      (cg) => cg.permissionId === actionObj.code && cg.grantType === 'GRANT'
    );
    if (explicitAllow) {
      setTestEvaluation({
        evaluated: true,
        allowed: true,
        actionTitle: actionObj.title,
        actionCode: actionObj.code,
        targetUrn: testUrn.code,
        reason: `Explicit Allow grant permits this action: "${explicitAllow.reason}"`,
        ruleDetail: 'Custom Grant: Explicit ALLOW',
      });
      return;
    }

    // Role-based check
    if (user.role === 'Enterprise Admin') {
      setTestEvaluation({
        evaluated: true,
        allowed: true,
        actionTitle: actionObj.title,
        actionCode: actionObj.code,
        targetUrn: testUrn.code,
        reason: 'Enterprise Admin has unrestricted tenant-wide authorization across all resources and scopes.',
        ruleDetail: 'Role: Enterprise Admin (Tenant-Wide Authority)',
      });
      return;
    }

    if (user.role === 'Consultant') {
      if (actionObj.adminOnly) {
        setTestEvaluation({
          evaluated: true,
          allowed: false,
          actionTitle: actionObj.title,
          actionCode: actionObj.code,
          targetUrn: testUrn.code,
          reason: 'Consultants cannot execute tenant or user administration actions.',
          ruleDetail: 'Role Restriction: Consultant has no administrative permissions',
        });
      } else {
        setTestEvaluation({
          evaluated: true,
          allowed: true,
          actionTitle: actionObj.title,
          actionCode: actionObj.code,
          targetUrn: testUrn.code,
          reason: `Consultant is authorized to perform compliance action '${actionObj.title}' across assigned project and company scopes.`,
          ruleDetail: 'Role: Consultant (Compliance Scope Allowed)',
        });
      }
      return;
    }

    if (user.role === 'Customer') {
      const isAllowed = actionObj.minRole === 'all' || actionObj.minRole === 'customer';
      setTestEvaluation({
        evaluated: true,
        allowed: isAllowed,
        actionTitle: actionObj.title,
        actionCode: actionObj.code,
        targetUrn: testUrn.code,
        reason: isAllowed
          ? 'Customer role allows read-only visibility into trust artifacts and reports.'
          : 'Customer role is restricted to read-only access and cannot perform modifications.',
        ruleDetail: `Role: Customer (${isAllowed ? 'Allowed' : 'Restricted'})`,
      });
      return;
    }

    if (user.role === 'User') {
      setTestEvaluation({
        evaluated: true,
        allowed: false,
        actionTitle: actionObj.title,
        actionCode: actionObj.code,
        targetUrn: testUrn.code,
        reason: 'Default User role has no access until an administrative or operational role is assigned.',
        ruleDetail: 'Role: User (No Access Baseline)',
      });
      return;
    }

    // Default allowed for other roles
    setTestEvaluation({
      evaluated: true,
      allowed: true,
      actionTitle: actionObj.title,
      actionCode: actionObj.code,
      targetUrn: testUrn.code,
      reason: `User with role ${user.role} possesses authorized operational scope.`,
      ruleDetail: `Role: ${user.role}`,
    });
  };

  // Accessible assignments count
  const assignmentsCount = 1 + (user.resourceAssignments?.length || 0);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* =========================================================================
          TOP PROFILE BANNER & NAVIGATION TABS (Matching Screenshots 1-4)
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 px-6 pt-5 pb-0 shadow-2xs space-y-4">
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Users</span>
          </button>
        </div>

        {/* User Identity & Top Right Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0 border border-blue-200">
              {getInitials(user.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900">{user.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500 font-mono">{user.email}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {user.role}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    user.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : user.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  ● {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                changeUserRole(user.id, 'User');
                addNotification('Role Reset', `${user.name} has been reset to User role`, 'info');
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              Reset to User
            </button>

            {user.status === 'Suspended' ? (
              <button
                type="button"
                onClick={() => {
                  reactivateUser(user.id);
                  addNotification('User Reactivated', `${user.name} account has been reactivated`, 'success');
                }}
                className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
              >
                Reactivate
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  suspendUser(user.id, 'Admin suspended via Access Management');
                  addNotification('User Suspended', `${user.name} account is now suspended`, 'warning');
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                Suspend
              </button>
            )}
          </div>
        </div>

        {/* 4 Tabs Bar */}
        <div className="flex items-center gap-8 border-b border-slate-200 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'assignments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Assignments</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[11px] font-semibold ${
                activeTab === 'assignments' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {assignmentsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('effective-permissions')}
            className={`pb-3 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'effective-permissions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Effective Permissions</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[11px] font-semibold ${
                activeTab === 'effective-permissions'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {effectiveActions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom-grants')}
            className={`pb-3 text-xs font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'custom-grants'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Custom Grants</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[11px] font-semibold ${
                activeTab === 'custom-grants' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {user.customGrants?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('test-access')}
            className={`pb-3 text-xs font-semibold cursor-pointer border-b-2 transition-colors ${
              activeTab === 'test-access'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Test Access
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: ASSIGNMENTS (Matching Screenshot 2)
         ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-7">
          {/* Section: Current Assignments */}
          <div className="space-y-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Current Assignments</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The roles {user.name} holds and where each one applies.
              </p>
            </div>

            {/* Assignments List */}
            <div className="divide-y divide-slate-100 border-t border-b border-slate-100 py-1">
              {/* Primary Role Assignment */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-xs text-slate-900">{user.companyName}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    changeUserRole(user.id, 'User');
                    addNotification('Assignment Revoked', `Revoked primary role assignment for ${user.name}`, 'info');
                  }}
                  className="text-xs font-medium text-slate-600 hover:text-rose-600 transition cursor-pointer"
                >
                  Revoke
                </button>
              </div>

              {/* Additional Resource Assignments */}
              {user.resourceAssignments?.map((ra) => (
                <div key={ra.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-xs text-slate-900">{ra.resourceName}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      {ra.accessLevel}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeResourceAssignment(user.id, ra.id);
                      addNotification('Assignment Revoked', `Revoked assignment for ${ra.resourceName}`, 'info');
                    }}
                    className="text-xs font-medium text-slate-600 hover:text-rose-600 transition cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Add or Change a Role */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add or Change a Role</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pick a role, then choose where it applies.
              </p>
            </div>

            {/* 9 Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ROLE_CARDS.map((rc, idx) => {
                const isSelected = selectedRoleCard.title === rc.title;
                return (
                  <label
                    key={`${rc.title}-${idx}`}
                    onClick={() => setSelectedRoleCard(rc)}
                    className={`relative p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role-selection"
                      checked={isSelected}
                      onChange={() => setSelectedRoleCard(rc)}
                      className="mt-1 h-3.5 w-3.5 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-slate-900">{rc.title}</span>
                        <span className="text-[11px] text-slate-500 shrink-0 font-medium">
                          {rc.scopeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {rc.description}
                      </p>

                      {rc.role === 'Enterprise Admin' && isSelected && user.role !== 'Enterprise Admin' && (
                        <div className="mt-2.5 pt-2 border-t border-blue-200 flex items-center justify-between">
                          <span className="text-[11px] text-blue-700 font-medium">
                            Tenant-wide global access
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              changeUserRole(user.id, 'Enterprise Admin');
                              addNotification(
                                'Role Updated',
                                `Assigned Enterprise Admin to ${user.name}`,
                                'success'
                              );
                            }}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                          >
                            Assign Enterprise Admin
                          </button>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section: Where it applies */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Where it applies
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedRoleCard.role === 'Enterprise Admin'
                  ? 'Enterprise Admin has unrestricted global access across all projects and companies. Scoping does not apply.'
                  : 'Give access to every company in a project, or only to the companies you pick.'}
              </p>
            </div>

            {selectedRoleCard.role === 'Enterprise Admin' ? (
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Global Tenant Scope:</strong> Enterprise Admin automatically applies across all {companies.length} companies and projects tenant-wide. Scoping to a specific project is not needed.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    PROJECT
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  >
                    <option value="">-- select project --</option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRoleCard.scopeLabel.includes('Company') && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      COMPANY
                    </label>
                    <select
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Bar: Action */}
            <div className="flex items-center justify-end gap-4 pt-3">
              {selectedRoleCard.role === 'Enterprise Admin' ? (
                <span className="text-xs text-slate-400 italic">
                  Not required for Enterprise Admin (Global Access)
                </span>
              ) : !selectedProjectId ? (
                <span className="text-xs text-slate-400">Select a project</span>
              ) : null}

              <button
                type="button"
                disabled={selectedRoleCard.role === 'Enterprise Admin' || !selectedProjectId}
                onClick={handleAssignRole}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:border disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
              >
                Assign {selectedRoleCard.title}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: EFFECTIVE PERMISSIONS (Matching Screenshot 1)
         ========================================================================= */}
      {activeTab === 'effective-permissions' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          {/* Subtitle */}
          <div>
            <p className="text-xs text-slate-500">
              Every action this user is allowed, grouped by area, and where it applies. Narrow a permission to keep it in one place only.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter permissions..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>

          {/* Grouped Areas */}
          <div className="space-y-6 divide-y divide-slate-100">
            {groupedActions.map(([area, actions]) => (
              <div key={area} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-slate-900">{area}</h3>
                  <span className="text-xs text-slate-500 font-semibold">{actions.length}</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {actions.map((act) => (
                    <div
                      key={act.code}
                      className="flex items-center justify-between py-2.5 hover:bg-slate-50/50 px-2 rounded-lg transition"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-xs text-slate-900">{act.title}</div>
                        <div className="font-mono text-[11px] text-slate-400">{act.code}</div>
                        <div className="text-xs text-slate-500">
                          Applies to {user.companyName} and everything below
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setNarrowingAction(act)}
                        className="px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs shrink-0"
                      >
                        Narrow...
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {groupedActions.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-500">
                No permissions matched your search query.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CUSTOM GRANTS (Matching Screenshot 3)
         ========================================================================= */}
      {activeTab === 'custom-grants' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-7">
          {/* Subtitle & Active Custom Grants */}
          <div className="space-y-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Custom Grants</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                One-off Allow or Deny rules for {user.name}, separate from their roles.
              </p>
            </div>

            {/* List of Grants or Empty State */}
            {(!user.customGrants || user.customGrants.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-2">
                No custom grants. Add one below to allow or deny a single action.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {user.customGrants.map((cg) => (
                  <div key={cg.id} className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 transition">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            cg.grantType === 'GRANT'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {cg.grantType === 'GRANT' ? 'Allow' : 'Deny'}
                        </span>
                        <span className="font-semibold text-xs text-slate-900">{cg.feature || cg.permissionId}</span>
                        <span className="font-mono text-[11px] text-slate-400">({cg.permissionId})</span>
                      </div>
                      <div className="text-xs text-slate-500">{cg.reason}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        removeCustomGrant(user.id, cg.id);
                        addNotification('Grant Revoked', `Revoked custom grant from ${user.name}`, 'info');
                      }}
                      className="text-xs font-medium text-slate-600 hover:text-rose-600 transition cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Add a Grant */}
          <form onSubmit={handleAddGrant} className="space-y-5 pt-3 border-t border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Add a Grant
              </h3>
            </div>

            {/* EFFECT: Allow / Deny Toggle */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                EFFECT
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGrantEffect('Allow')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    grantEffect === 'Allow'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Allow
                </button>
                <button
                  type="button"
                  onClick={() => setGrantEffect('Deny')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    grantEffect === 'Deny'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Deny
                </button>
              </div>
            </div>

            {/* ACTION Selector */}
            <div className="space-y-1.5 max-w-xl">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ACTION
              </label>
              <select
                value={grantActionCode}
                onChange={(e) => setGrantActionCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                <option value="">Select an action...</option>
                {DUTRO_ACTIONS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.title} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            {/* SCOPE Selectors (2x2 Grid) */}
            <div className="space-y-3 max-w-2xl">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                SCOPE
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* PROJECT */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    PROJECT
                  </span>
                  <select
                    value={grantProjectId}
                    onChange={(e) => setGrantProjectId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  >
                    <option value="ANY">Any</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COMPANY */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    COMPANY
                  </span>
                  <select
                    value={grantCompanyId}
                    onChange={(e) => {
                      setGrantCompanyId(e.target.value);
                      setGrantEntityId('ANY');
                      setGrantDeptId('ANY');
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  >
                    <option value="ANY">Any</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ENTITY */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    ENTITY
                  </span>
                  <select
                    value={grantEntityId}
                    disabled={grantCompanyId === 'ANY'}
                    onChange={(e) => {
                      setGrantEntityId(e.target.value);
                      setGrantDeptId('ANY');
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {grantCompanyId === 'ANY' ? (
                      <option value="ANY">Select a company first</option>
                    ) : (
                      <>
                        <option value="ANY">Any</option>
                        {grantAvailableEntities.map((ent) => (
                          <option key={ent.id} value={ent.id}>
                            {ent.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* DEPARTMENT */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    DEPARTMENT
                  </span>
                  <select
                    value={grantDeptId}
                    disabled={grantEntityId === 'ANY'}
                    onChange={(e) => setGrantDeptId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {grantEntityId === 'ANY' ? (
                      <option value="ANY">Select an entity first</option>
                    ) : (
                      <>
                        <option value="ANY">Any</option>
                        {grantAvailableDepts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Applies To URN Preview */}
            <div className="pt-2 text-xs">
              <span className="font-semibold text-slate-900">Applies to: </span>
              <span className="text-slate-700">{grantUrn.label}</span>
              <div className="font-mono text-slate-400 text-[11px] mt-0.5">{grantUrn.code}</div>
            </div>

            {/* Bottom Bar: Action */}
            <div className="flex items-center justify-end gap-4 pt-3">
              {!grantActionCode && <span className="text-xs text-slate-400">Select an action</span>}
              <button
                type="submit"
                disabled={!grantActionCode}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              >
                Add Grant
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TEST ACCESS (Matching Screenshot 4)
         ========================================================================= */}
      {activeTab === 'test-access' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          {/* Subtitle */}
          <div>
            <p className="text-xs text-slate-500">
              Check whether {user.name} would be allowed an action at a specific place, and why.
            </p>
          </div>

          <form onSubmit={handleCheckAccess} className="space-y-5">
            {/* ACTION Selector */}
            <div className="space-y-1.5 max-w-xl">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ACTION
              </label>
              <select
                value={testActionCode}
                onChange={(e) => setTestActionCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                <option value="">Select an action...</option>
                {DUTRO_ACTIONS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.title} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            {/* WHERE Selectors (2x2 Grid) */}
            <div className="space-y-3 max-w-2xl">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                WHERE
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* PROJECT */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    PROJECT
                  </span>
                  <select
                    value={testProjectId}
                    onChange={(e) => setTestProjectId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  >
                    <option value="NA">N/A</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COMPANY */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    COMPANY
                  </span>
                  <select
                    value={testCompanyId}
                    onChange={(e) => {
                      setTestCompanyId(e.target.value);
                      setTestEntityId('NA');
                      setTestDeptId('NA');
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  >
                    <option value="NA">N/A</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ENTITY */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    ENTITY
                  </span>
                  <select
                    value={testEntityId}
                    disabled={testCompanyId === 'NA'}
                    onChange={(e) => {
                      setTestEntityId(e.target.value);
                      setTestDeptId('NA');
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {testCompanyId === 'NA' ? (
                      <option value="NA">Select a company first</option>
                    ) : (
                      <>
                        <option value="NA">N/A</option>
                        {testAvailableEntities.map((ent) => (
                          <option key={ent.id} value={ent.id}>
                            {ent.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* DEPARTMENT */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    DEPARTMENT
                  </span>
                  <select
                    value={testDeptId}
                    disabled={testEntityId === 'NA'}
                    onChange={(e) => setTestDeptId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {testEntityId === 'NA' ? (
                      <option value="NA">Select an entity first</option>
                    ) : (
                      <>
                        <option value="NA">N/A</option>
                        {testAvailableDepts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Target URN Preview */}
            <div className="pt-2 text-xs">
              <span className="font-semibold text-slate-900">Target: </span>
              <span className="text-slate-700">{testUrn.label}</span>
              <div className="font-mono text-slate-400 text-[11px] mt-0.5">{testUrn.code}</div>
            </div>

            {/* Bottom Bar: Action */}
            <div className="flex items-center justify-end gap-4 pt-3 border-t border-slate-100">
              {!testActionCode && <span className="text-xs text-slate-400">Select an action</span>}
              <button
                type="submit"
                disabled={!testActionCode}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              >
                Check Access
              </button>
            </div>
          </form>

          {/* Test Evaluation Result Banner */}
          {testEvaluation?.evaluated && (
            <div
              className={`p-4 rounded-xl border mt-4 space-y-3 ${
                testEvaluation.allowed
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {testEvaluation.allowed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-sm">
                    {testEvaluation.allowed ? 'ACCESS ALLOWED' : 'ACCESS DENIED'}
                  </span>
                  <p className="text-xs mt-0.5 opacity-90">{testEvaluation.reason}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-current/10 text-[11px] space-y-1 font-mono">
                <div>
                  <span className="opacity-70">Action: </span>
                  <span className="font-semibold">
                    {testEvaluation.actionTitle} ({testEvaluation.actionCode})
                  </span>
                </div>
                <div>
                  <span className="opacity-70">Target Scope: </span>
                  <span>{testEvaluation.targetUrn}</span>
                </div>
                <div>
                  <span className="opacity-70">Policy Rule: </span>
                  <span>{testEvaluation.ruleDetail}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Narrow Scope Modal for Tab 2 */}
      {narrowingAction && (
        <NarrowScopeModal
          user={user}
          isOpen={!!narrowingAction}
          onClose={() => setNarrowingAction(null)}
          defaultPermissionId={narrowingAction.code}
        />
      )}
    </div>
  );
};
