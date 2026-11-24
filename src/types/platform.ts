import { RoleType, ActionType, PermissionReach, LandscapeType } from './index';

// ==========================================
// 1. COMPANY LANDSCAPE TYPES
// ==========================================

export interface StatutoryKpis {
  legalEntitiesCount: number;
  departmentsCount: number;
  operatingJurisdictionsCount: number;
  industryCount: number;
  primaryDpoEmail: string;
  programOwnerEmail: string;
}

export interface CompanyDetailsProfile {
  companyName: string;
  employeeCount: number;
  natureOfBusiness: string;
  specialCategoryData: string;
  industry: string[];
  operatingRegions: string[];
  hqLocation: string;
  websiteUrl: string;
  complianceNotes: string;
}

export interface GlobalControl {
  id: string; // e.g. "1.1.1"
  domainId: number;
  domainName: string; // e.g. "Governance, Accountability & DPO"
  title: string;
  businessRequirement: string;
  description: string;
  status: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Started';
  mappedRegulations: {
    law: string; // "India DPDPA 2023", "EU GDPR 2016", "California CCPA/CPRA", "Brazil LGPD 2018"
    articleCitation: string; // "s. 8(1), s. 10(2)(a)", "Art. 24, Art. 37", "Art. 41"
  }[];
  mappedDepartments: string[]; // e.g. ["Legal", "Analytics", "HR"]
  evidenceArtifactsCount: number;
}

export interface WorkspaceChannel {
  id: string;
  name: string;
  isPrivate: boolean;
  memberCount: number;
  unreadCount?: number;
  description: string;
  isDepartmentChannel?: boolean;
}

export interface WorkspaceMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderRole: string;
  senderEmail: string;
  timestamp: string;
  text: string;
  attachments?: {
    name: string;
    size: string;
    fileType: 'image' | 'pdf' | 'document' | 'spreadsheet';
    url: string;
    linkedControlId?: string;
  }[];
  threadRepliesCount?: number;
}

// ==========================================
// 2. DEPARTMENT LANDSCAPE TYPES
// ==========================================

export interface DiscoveryQuestion {
  id: string;
  questionNumber: number;
  prompt: string;
  guidanceText?: string;
  answer: string;
  status: 'Answered' | 'In Progress' | 'Pending Review';
  evidenceCount: number;
}

export interface StorageEndpoint {
  id: string;
  name: string;
  endpointType: string; // "Cloud Data Warehouse", "Encrypted S3 Bucket", "Cold Archive"
  dataElementsStored: string[];
  retentionPeriod: string; // e.g. "24 Months", "7 Years"
  deletesAfterRetention: boolean;
  deletionMechanism: string;
}

export interface BusinessProcessRecord {
  id: string; // e.g. "bp-a-1"
  code: string; // e.g. "business_process_A_1"
  name: string;
  companyId: string;
  companyName: string;
  departmentId: string;
  departmentName: string;
  ownerName: string;
  ownerEmail: string;
  status: 'Active' | 'Draft' | 'Under Review';
  riskLevel: 'Low' | 'Medium' | 'High';
  revalidationDate: string;
  aiUsage: boolean;
  aiUsageDescription?: string;
  description: string;
  dataSubjectsVolumeBand: string; // e.g. "10,000 - 50,000"

  // Controllers & Processors
  applicableLaws: string[];
  entityRoles: {
    entityName: string;
    statutoryRole: 'Data Fiduciary / Controller' | 'Data Processor' | 'Joint Controller';
    isInternal: boolean;
  }[];

  // Data Subjects & Elements
  dataSubjectCategories: string[]; // "Employees", "Users / Customers", "Vendors"
  dataCategories: string[]; // "Identity", "Contact", "Financial", "Technical Usage"
  personalDataElements: string[]; // "Full Name", "Email Address", "IP Address", "Device ID"
  purposeOfProcessing: string;
  sourcesOfPersonalData: string[];
  collectionModes: string[];
  legalBasis: string[]; // "Consent", "Legitimate Uses (s. 4 DPDP)", "Contract Performance"

  // Data Retention
  storageLocations: StorageEndpoint[];

  // Transfers
  interDeptTransfers: {
    enabled: boolean;
    receivingDepartments: string[];
    purpose: string;
    mechanism: string;
    frequency: string;
    isCrossBorder: boolean;
  };
  vendorTransfers: {
    enabled: boolean;
    vendorNames: string[];
    transferredElements: string[];
    isCrossBorder: boolean;
    destinationCountry?: string;
    safeguards?: string;
  };

  // Security Measures
  securityMeasures: {
    encryptionAtRest: string; // "AES-256"
    encryptionInTransit: string; // "TLS 1.3"
    trainingAndAwareness: string;
    policiesInPlace: string[];
    accessGovernance: string;
    vendorSecurityManagement: string;
  };

  // Mapped Controls count & Gaps count
  mappedControlsCount: number;
  openGapsCount: number;
}

export interface PersonalDataInventoryItem {
  id: string;
  departmentName: string;
  dataElement: string;
  businessProcessCode: string;
  businessProcessName: string;
  dataSubjectCategory: string;
  dataCategory: string;
  purpose: string;
  legalBasis: string;
  source: string;
  collectionMode: string;
  transfers: string;
  retentionSchedule: string;
}

export interface ThirdPartyVendor {
  id: string;
  code: string; // e.g. "Vendor A_1"
  name: string;
  departmentName: string;
  departmentId: string;
  linkedProcesses: string[];
  aiUsage: boolean;
  computedRiskScore: number; // 0.00 to 3.00
  computedRiskTier: 'Low' | 'Medium' | 'High';
  lastUpdated: string;
  dpaStatus: 'Signed' | 'Under Review' | 'Conditionally Approved' | 'Missing';
  websiteUrl: string;
  industry: string;
  country: string;
  statutoryRole: 'Data Processor' | 'Joint Controller' | 'Independent Third Party';
  dpoContactName: string;
  dpoContactEmail: string;

  // Assessment Wizard tabs
  certifications: string[]; // ["ISO 27001 (ISMS)", "SOC 2 Type II", "ISO 27701 (PIMS)"]
  policyControls: string[];
  technicalSafeguards: string[];
  incidentResponseGuaranteedHours: number;
  dataBreachLast12Months: boolean;

  // Subprocessors
  usesSubProcessors: boolean;
  subProcessorsList: {
    name: string;
    service: string;
    location: string;
    dataCategories: string[];
    hasFlowDownAgreements: boolean;
  }[];

  // Risk weighting scores (0-3)
  riskBreakdown: {
    dataRisk: number; // 25%
    exposureRisk: number; // 20%
    transferRisk: number; // 25%
    controlRisk: number; // 20%
    legalRisk: number; // 10%
  };
}

export interface EvidenceBankItem {
  id: string;
  title: string;
  departmentName: string;
  ownerName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  expiryDate?: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Expiring Soon' | 'Expired';
  linkedControls: string[];
  version: string;
}

// ==========================================
// 3. RISK LANDSCAPE TYPES
// ==========================================

export interface GapAnalysisItem {
  id: string; // e.g. "GAP-A-001"
  title: string;
  description: string;
  source: 'Business Process' | 'Vendor';
  sourceName: string;
  departmentName: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Accepted' | 'Closed';
  assignedOwner: string;
  dueDate: string;
  residualRisk: 'Low after remediation' | 'Medium' | 'High';
  gapType: 'Compliance' | 'Security' | 'Operational' | 'Vendor';
  applicableLaws: string[];
  remediationActions: {
    id: string;
    title: string;
    assignedTo: string;
    dueDate: string;
    completed: boolean;
  }[];
  dpoGate: {
    isSignedOff: boolean;
    signedOffBy?: string;
    signedOffAt?: string;
    residualRiskAccepted: boolean;
    evidenceNotes?: string;
  };
}

export interface MinutesOfMeetingRecord {
  id: string;
  meetingTitle: string;
  departmentName: string;
  generatedDate: string;
  clientName: string;
  attendees: string[];
  agenda: string[];
  discussionPoints: string[];
  decisionsAndActionItems: string[];
}

// ==========================================
// 4. TRUST LANDSCAPE TYPES
// ==========================================

export interface ComplianceLogEvent {
  id: string;
  timestamp: string;
  relativeTime: string;
  stream: 'Assessments' | 'Gaps' | 'Risks' | 'Policies' | 'Vendors' | 'Evidence Bank' | 'User Management';
  significance: 'Critical' | 'High' | 'Medium' | 'Low';
  outcome: 'Completed' | 'In Progress' | 'Recorded' | 'Failed' | 'Pending Approval';
  actorName: string;
  actorRole: string;
  narrative: string;
  departmentName: string;
  // Audit trail forensic fields
  httpMethod: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  endpointUri: string;
  clientIp: string;
  payloadHash: string;
}

export interface PrivacyLegislation {
  id: string;
  shortName: string; // e.g. "India DPDPA 2023"
  fullName: string;
  jurisdiction: string;
  enactedYear: number;
  totalSections: number;
  chapters: {
    id: string;
    number: string;
    title: string;
    sections: {
      id: string;
      number: string;
      title: string;
      verbatimLegalText: string;
      commentary: string;
      decisions: string;
    }[];
  }[];
}

export interface CaseLawRecord {
  id: string;
  caseNumber: string; // e.g. "C-526/24"
  title: string; // "AB v Datenschutzbehörde"
  court: string; // "CJEU - Court of Justice"
  judgmentDate: string; // "15 Jan 2026"
  significance: 'Landmark' | 'Major' | 'Standard';
  articlesCited: string[]; // ["Art. 12", "Art. 15"]
  theme: string; // "Right of Access & Abuse of Rights"
  summary: string;
  legalPrinciple: string;
}

// ==========================================
// 5. CONSENT LANDSCAPE TYPES
// ==========================================

export interface CookieItem {
  id: string;
  name: string;
  domain: string;
  provider: string;
  category: 'Advertising' | 'Analytical' | 'Attribution' | 'Functional' | 'Strictly Necessary';
  duration: string; // e.g. "12 Months", "Session"
  reviewState: 'Confirmed' | 'Pending Review' | 'Needs Review';
  sourcePage: string;
}

export interface TechnicalFindingItem {
  id: string;
  resourceName: string;
  type: 'Scripts & Tags' | 'Pixels' | 'Embedded Content & SDKs' | 'Browser Storage & Others';
  provider: string;
  category: string;
  reviewedPurpose: string;
  status: 'Pending' | 'Approved' | 'Blocked';
}

export interface CookieBannerConfig {
  template: 'bottom-bar' | 'center-modal' | 'corner-panel' | 'website-style';
  placement: 'Bottom left' | 'Bottom right' | 'Center' | 'Full width bottom';
  maxWidth: number;
  contentAlignment: 'Left' | 'Center';
  headlineText: string;
  bodyText: string;
  acceptAllText: string;
  rejectAllText: string;
  managePreferencesText: string;
  brandColor: string;
  isPublished: boolean;
}

export interface UniversalConsentPurpose {
  id: string;
  code: string;
  name: string;
  linkedBusinessProcessCode: string;
  linkedBusinessProcessName: string;
  personalDataElements: string[];
  legalBasis: string;
  validityMonths: number;
  touchpoints: string[];
}
