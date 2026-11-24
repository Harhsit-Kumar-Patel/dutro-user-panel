import { RoleType, ActionType, LandscapeType } from '../types';

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  isEnterpriseAdminOnly?: boolean;
  isRestrictedForDPO?: boolean;
}

/**
 * Checks if the current role is allowed to perform a specific action within a landscape and feature.
 */
export function checkRolePermission(
  role: RoleType,
  landscape: LandscapeType,
  action: ActionType,
  featureName?: string
): PermissionCheckResult {
  // 1. Enterprise Admin has unrestricted access everywhere
  if (role === 'Enterprise Admin') {
    return { allowed: true };
  }

  // 2. DPO Restrictions: DPO is strictly prohibited from running AI agents for control mapping, gap analysis, or PIA
  if (role === 'Data Protection Officer') {
    if (action === 'Run AI agent') {
      return {
        allowed: false,
        reason:
          'Data Protection Officer (DPO) is prohibited from running AI agents (Control Mapping, Gap Analysis, PIA) to maintain independent supervisory oversight per Dutro governance rules.',
        isRestrictedForDPO: true,
      };
    }
    if (landscape === 'Administration') {
      return {
        allowed: false,
        reason: 'Data Protection Officer does not manage the administrative user panel.',
      };
    }
    // DPO can view everything in their company, and can approve DPO gates / DPIAs
    return { allowed: true };
  }

  // 3. Consultant: Scoped to their assigned company, read-only user directory, can run AI agents and edit RoPA
  if (role === 'Consultant') {
    if (featureName === 'Branding & Letterhead' && action === 'Create') {
      return {
        allowed: false,
        reason: 'Only Enterprise Admin can upload official company letterhead.',
        isEnterpriseAdminOnly: true,
      };
    }
    if (landscape === 'Administration' && action === 'Delete') {
      return {
        allowed: false,
        reason: 'Consultants cannot delete companies, legal entities, or enterprise users.',
        isEnterpriseAdminOnly: true,
      };
    }
    return { allowed: true };
  }

  // 4. Program Owner: Leads company privacy program; can run AI agents, view all landscapes, but cannot access admin panel
  if (role === 'Program Owner') {
    if (landscape === 'Administration') {
      return {
        allowed: false,
        reason: 'Program Owners do not have access to the central administration panel.',
      };
    }
    if (featureName === 'Branding & Letterhead' && action === 'Create') {
      return {
        allowed: false,
        reason: 'Only Enterprise Admin can upload official company letterhead.',
        isEnterpriseAdminOnly: true,
      };
    }
    return { allowed: true };
  }

  // 5. Department Owner: Scoped only to their assigned department
  if (role === 'Department Owner') {
    if (landscape === 'Administration') {
      return {
        allowed: false,
        reason: 'Department Owners do not have administrative access.',
      };
    }
    if (action === 'Run AI agent') {
      return {
        allowed: true, // Can run on their own department processes
      };
    }
    return { allowed: true };
  }

  // 6. Customer: View-only and report export
  if (role === 'Customer') {
    if (action !== 'View' && action !== 'Export or download') {
      return {
        allowed: false,
        reason: 'Customer accounts have view-only access and cannot modify compliance records.',
      };
    }
    if (landscape === 'Administration') {
      return {
        allowed: false,
        reason: 'Customer accounts cannot access administration settings.',
      };
    }
    return { allowed: true };
  }

  // 7. General User: Can view knowledge base / case laws and personal account
  if (role === 'User') {
    if (landscape === 'Trust' && (featureName === 'Legal Library' || featureName === 'Global Privacy Legislation')) {
      return { allowed: true };
    }
    if (landscape === 'Account') {
      return { allowed: true };
    }
    if (action === 'View' && (landscape === 'Company' || landscape === 'Department')) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'General users have read-only access to basic reference libraries and their personal profile.',
    };
  }

  return { allowed: true };
}
