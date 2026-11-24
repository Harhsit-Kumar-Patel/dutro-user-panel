# Dutro — Privacy Management & Compliance User Panel

An enterprise-grade, interactive, and centralized administration panel for **Dutro**, built to manage users, organizational structures, business roles, permissions, individual access overrides, and access governance recertification.

---

## 🌟 Key Architectural Features

### 1. Overall Application Structure
- **Persistent Left Navigation**: 5 primary sections:
  1. `Users` (User Directory, Individual Profiles, Invitations & Registrations Queue)
  2. `Organisation Structure` (Visual Hierarchy Tree, Companies, Legal Entities, Departments)
  3. `Roles & Permissions` (7 Standard Roles Directory, Canonical Permission Matrix)
  4. `Access Management` (Individual Custom Grants, Resource-Level Access, Effective Access Calculator)
  5. `Access Governance` (Access Review Campaigns, User Activity Monitor, Central Audit Log)
- **Top Header Bar**:
  - **Company Scope Switcher**: Toggle between "All Companies (Cross-tenant)" or filter down to a specific tenant company (locked for Consultants).
  - **Role Persona Simulator**: Test role boundaries in real time across all 7 Dutro roles (`Enterprise Admin`, `Consultant`, `Data Protection Officer`, `Program Owner`, `Department Owner`, `Customer`, `User`). Non-admin roles display the Administrative Boundary Enforced screen.
  - **Notification Center**: Alerts for pending registrations, access review campaigns, and audit actions.
  - **Demo Data Reset**: Instant one-click restore to pristine seed demonstration state.

---

### 2. User Roles & Access Boundaries
- **Enterprise Admin**: Full cross-company authority. Can manage users, invitations, registrations, org structures, roles, permissions, individual access, and access governance.
- **Consultant**: Limited visibility. Can view the User Directory filtered by role (read-only); can edit company details and manage legal entities & departments *within their own company* (`comp-1`); prohibited from modifying users or altering governance policies.
- **Data Protection Officer (DPO)**: Compliance overseer within own company. Cannot access the admin panel. Crucial restriction enforced: *DPO does not run AI agents for control mapping, gap analysis, or PIA*.
- **Program Owner**: Leads company program execution. Primarily views, reviews, and triggers AI agents. Cannot access the admin panel.
- **Department Owner**: Day-to-day departmental custodian. Cannot access the admin panel.
- **Customer**: External view-only access and compliance report exporter. Cannot access the admin panel.
- **User**: Standard baseline personal settings and public legal reference library access. Cannot access the admin panel.

---

### 3. Section Deep-Dives

#### Section 1: Users
- **User Directory**: Search by name, email, department, company. Filter by business role, department, company, and account status (`Active`, `Suspended`, `Waiting for approval`). Sorting and pagination.
- **Individual User Profile (Central Pivot)**: Comprehensive modal with 7 tabs:
  - *Overview*: Identity metadata, account creation date, last login, last status change, quick suspend/reactivate/edit actions.
  - *Organisation*: Company assignment, legal entity association, department, and visual reporting hierarchy.
  - *Roles & Permissions*: Assigned role, default permissions, landscape breakdown, actions, and reach.
  - *Individual Access*: Custom permission grants (`+GRANT`), narrowed scopes (`-NARROW`), provenance identification.
  - *Resource Access*: Bound projects, systems, companies, and departments.
  - *Activity*: Live user event stream with IP, client device, and timestamps.
  - *Audit History*: Immutable chronological trail of status transitions, role changes, and grants.
- **Account Lifecycle**: Modal confirmations with safety verification for suspension, reactivation, and permanent deletion (with email verification string).
- **Invitations & Registrations**: Single-user invites, bulk roster onboarding with validation, lifecycle tracking (`Pending`, `Accepted`, `Expired`, `Revoked`), and a self-registration approval queue that provisions approved users directly into the User Directory.

#### Section 2: Organisation Structure
- **Company Management**: View, create, and edit companies. Official letterhead asset upload is strictly restricted to Enterprise Admin.
- **Legal Entity Management**: Multi-national operating units with country, address, and registration numbers. Blocked deletion if dependent departments exist.
- **Department Management**: Department directory, codes, department leads, and team rosters. Assign employees directly to departments.
- **Interactive Hierarchy Tree**: Expandable multi-tier tree mapping Companies → Legal Entities → Departments → Members.

#### Section 3: Roles & Permissions
- **Role Directory & Detailed Inspection**: Inspect assigned employees and default permissions for all 7 roles.
- **Permission Matrix**: 7 canonical Dutro landscapes (`Company`, `Department`, `Risk`, `Trust`, `Consent`, `Administration`, `Account`), 9 action types (`View`, `Create`, `Edit`, `Delete`, `Submit for review`, `Approve`, `Publish`, `Run AI agent`, `Export or download`), and 4 reach levels (`Everywhere`, `Own company`, `Own department`, `Can open only`).
- **Enforced Dutro Rules**:
  - A person cannot approve their own submission.
  - DPO prohibited from running AI agents for control mapping, gap analysis, or PIA.
  - Only Enterprise Admin manages users and the Admin Panel.
  - Only Enterprise Admin can upload company letterhead and delete enterprise projects.

#### Section 4: Access Management
- **Individual Access**: Grant additional permissions or narrow permission scopes for individual employees without altering base roles.
- **Resource-Level Access**: Bind access to specific projects, clinical trial databases, or systems.
- **Effective Access Calculator**: Consolidated view resolving base role + custom grants + scope restrictions + resources, with automated detection of **Excessive Privilege Warnings** and **Redundant Overlaps**.

#### Section 5: Access Governance
- **Access Review Campaigns**: Periodic recertification queue. Record review outcomes (`Retained`, `Modified`, `Revoked`) with mandatory governance justifications.
- **User Activity Monitor**: Real-time event log tracking authentication, DPIA executions, consent banner updates, and RoPA exports.
- **Central Audit History**: Detailed immutable audit trail with functional **CSV Export** and **JSON Export** downloads.

---

## 🚀 Running the Application

```bash
# 1. Install dependencies (already pre-installed)
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

