import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Building2,
  Globe,
  Briefcase,
  Mail,
  Shield,
  Edit2,
  Plus,
  Trash2,
  Eye,
  Search,
  Filter,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { LegalEntity, Department } from '../../../types';
import { checkRolePermission } from '../../../utils/permissionChecker';
import { DataLineageView } from './DataLineageView';
import { GitFork } from 'lucide-react';

export const CompanyProfileView: React.FC = () => {
  const {
    companies,
    currentCompanyId,
    legalEntities,
    departments,
    currentRole,
    createLegalEntity,
    updateLegalEntity,
    deleteLegalEntity,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    updateCompany,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'entities' | 'departments' | 'lineage'>('overview');

  // Active company (default to first or current)
  const currentCompany =
    companies.find((c) => c.id === currentCompanyId) || companies[0] || {
      id: 'comp-demo',
      name: 'Demo Company',
      registrationNumber: 'US-DEMO-001',
      jurisdiction: 'United States & Global',
      headquarters: '100 Enterprise Way, Suite 400, San Francisco, CA',
      dpoName: 'Harshit Patel',
      dpoEmail: 'harshit.patel@dutient.ai',
      employeeCount: 350,
    };

  const companyEntities = legalEntities.filter((e) => e.companyId === currentCompany.id || currentCompanyId === 'ALL');
  const companyDepts = departments.filter((d) => d.companyId === currentCompany.id || currentCompanyId === 'ALL');

  // Search & Filters
  const [entitySearch, setEntitySearch] = useState('');
  const [entityJurisdictionFilter, setEntityJurisdictionFilter] = useState('ALL');
  const [deptSearch, setDeptSearch] = useState('');

  // Drawers & Modals
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [editCompanyForm, setEditCompanyForm] = useState({
    name: currentCompany.name,
    employeeCount: currentCompany.employeeCount,
    headquarters: currentCompany.headquarters,
    jurisdiction: currentCompany.jurisdiction,
    dpoName: currentCompany.dpoName,
    dpoEmail: currentCompany.dpoEmail,
    natureOfBusiness: 'AI risk, data privacy, and compliance consulting',
    websiteUrl: 'https://dutro.ai',
    industry: ['Information Technology and Services', 'Cybersecurity & Compliance'],
    operatingRegions: ['India', 'United States of America', 'Germany', 'Brazil', 'United Kingdom'],
    complianceNotes: 'Enterprise Tier Multi-Tenant Privacy Workspace',
  });

  // Entity Drawers
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
  const [viewingEntity, setViewingEntity] = useState<LegalEntity | null>(null);
  const [editingEntity, setEditingEntity] = useState<LegalEntity | null>(null);
  const [deleteEntityConfirm, setDeleteEntityConfirm] = useState<LegalEntity | null>(null);
  const [deleteInputText, setDeleteInputText] = useState('');

  // Department Drawers
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // New Entity Form State
  const [newEntity, setNewEntity] = useState({
    name: '',
    country: 'India',
    address: '',
    registrationNumber: '',
  });

  // New Department Form State
  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    legalEntityId: companyEntities[0]?.id || '',
    description: '',
  });

  // Permission Checks
  const editCompanyPerm = checkRolePermission(currentRole, 'Company', 'Edit', 'General Details & HQ Info');
  const createEntityPerm = checkRolePermission(currentRole, 'Company', 'Create', 'Entity Management');
  const deleteEntityPerm = checkRolePermission(currentRole, 'Company', 'Delete', 'Entity Management');

  const filteredEntities = companyEntities.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(entitySearch.toLowerCase()) ||
      e.country.toLowerCase().includes(entitySearch.toLowerCase()) ||
      e.registrationNumber.toLowerCase().includes(entitySearch.toLowerCase());
    const matchJurisdiction = entityJurisdictionFilter === 'ALL' || e.country === entityJurisdictionFilter;
    return matchSearch && matchJurisdiction;
  });

  const filteredDepts = companyDepts.filter((d) =>
    d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.code.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.legalEntityName.toLowerCase().includes(deptSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Company Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Jurisdictional Configuration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Company Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage corporate identity, statutory subsidiaries, operational departments, and executive oversight for{' '}
            <span className="font-semibold text-slate-800">{currentCompany.name}</span>.
          </p>
        </div>

        {/* Action Button for Enterprise Admin */}
        {activeTab === 'entities' && (
          <button
            onClick={() => setIsAddEntityOpen(true)}
            disabled={!createEntityPerm.allowed}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Entity
          </button>
        )}
        {activeTab === 'departments' && (
          <button
            onClick={() => setIsAddDeptOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        )}
      </div>

      {/* 4 Balanced KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Legal Entities</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold text-slate-900">{companyEntities.length}</span>
            <span className="text-xs text-slate-500">subsidiaries</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Departments</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold text-slate-900">{companyDepts.length}</span>
            <span className="text-xs text-slate-500">operational units</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Operating Regions</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold text-slate-900">{editCompanyForm.operatingRegions.length || 6}</span>
            <span className="text-xs text-slate-500">jurisdictions</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Governance Status</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-base font-bold text-emerald-600">Active Oversight</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5" title={currentCompany.dpoEmail}>
            DPO: {currentCompany.dpoEmail}
          </p>
        </div>
      </div>

      {/* Secondary Tab Bar */}
      <div className="border-b border-slate-200 flex items-center gap-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('entities')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'entities'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="h-4 w-4" />
          Legal Entities ({companyEntities.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'departments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Departments ({companyDepts.length})
        </button>
        <button
          onClick={() => setActiveTab('lineage')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'lineage'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitFork className="h-4 w-4" />
          Data Lineage
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Company Details</h2>
              <p className="text-xs text-slate-500">Official statutory registered parameters and operating footprint.</p>
            </div>
            {editCompanyPerm.allowed && (
              <button
                onClick={() => setIsEditCompanyOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Company Name</span>
              <span className="font-semibold text-slate-800">{currentCompany.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Employee Count</span>
              <span className="font-semibold text-slate-800">{currentCompany.employeeCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Nature of Business</span>
              <span className="font-semibold text-slate-800">{editCompanyForm.natureOfBusiness}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Special Category Data</span>
              <span className="font-semibold text-slate-500">—</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Industry</span>
              <span className="font-semibold text-slate-800">{editCompanyForm.industry.join(', ')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Operating Regions</span>
              <span className="font-semibold text-slate-800">{editCompanyForm.operatingRegions.join(', ')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-400 font-medium">HQ Location</span>
              <span className="font-semibold text-slate-800">{currentCompany.headquarters}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Website URL</span>
              <a
                href={editCompanyForm.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-600 hover:underline"
              >
                {editCompanyForm.websiteUrl}
              </a>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50 md:col-span-2">
              <span className="text-slate-400 font-medium">Compliance Notes</span>
              <span className="font-semibold text-slate-700">{editCompanyForm.complianceNotes}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEGAL ENTITIES */}
      {activeTab === 'entities' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search entities by name or country..."
                value={entitySearch}
                onChange={(e) => setEntitySearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={entityJurisdictionFilter}
                onChange={(e) => setEntityJurisdictionFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 bg-white outline-none cursor-pointer"
              >
                <option value="ALL">All Jurisdictions</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Germany">Germany</option>
                <option value="Sweden">Sweden</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>

          {/* Legal Entities Data Grid */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Entity Name</th>
                  <th className="py-3 px-4">Applicable Jurisdictions</th>
                  <th className="py-3 px-4">Registration #</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntities.map((ent) => (
                  <tr key={ent.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{ent.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        {ent.country}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{ent.registrationNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs">{ent.address}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingEntity(ent)}
                          title="View Entity Specifications"
                          className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingEntity(ent)}
                          title="Edit Legal Entity"
                          className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteEntityConfirm(ent);
                            setDeleteInputText('');
                          }}
                          disabled={!deleteEntityPerm.allowed}
                          title={
                            deleteEntityPerm.allowed
                              ? 'Delete Entity'
                              : 'Enterprise Admin only'
                          }
                          className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENTS */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search departments by name or code..."
              value={deptSearch}
              onChange={(e) => setDeptSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Legal Entity</th>
                  <th className="py-3 px-4">Owner / Lead</th>
                  <th className="py-3 px-4">Members</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepts.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{d.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px]">
                        {d.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{d.legalEntityName}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{d.ownerName || 'Unassigned'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{d.memberCount} members</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingDept(d)}
                          className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteDepartment(d.id)}
                          className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DATA LINEAGE */}
      {activeTab === 'lineage' && <DataLineageView />}

      {/* EDIT COMPANY DRAWER */}
      {isEditCompanyOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Company Details</h3>
                  <p className="text-xs text-slate-500">Update statutory information for {currentCompany.name}</p>
                </div>
                <button
                  onClick={() => setIsEditCompanyOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={editCompanyForm.name}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Employee Count</label>
                    <input
                      type="number"
                      value={editCompanyForm.employeeCount}
                      onChange={(e) =>
                        setEditCompanyForm({ ...editCompanyForm, employeeCount: parseInt(e.target.value) || 0 })
                      }
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                    <input
                      type="text"
                      value={editCompanyForm.websiteUrl}
                      onChange={(e) => setEditCompanyForm({ ...editCompanyForm, websiteUrl: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nature of Business</label>
                  <input
                    type="text"
                    value={editCompanyForm.natureOfBusiness}
                    onChange={(e) =>
                      setEditCompanyForm({ ...editCompanyForm, natureOfBusiness: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HQ Location</label>
                  <input
                    type="text"
                    value={editCompanyForm.headquarters}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, headquarters: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary DPO Email</label>
                  <input
                    type="email"
                    value={editCompanyForm.dpoEmail}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, dpoEmail: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={() => setIsEditCompanyOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateCompany(currentCompany.id, {
                    name: editCompanyForm.name,
                    employeeCount: editCompanyForm.employeeCount,
                    headquarters: editCompanyForm.headquarters,
                    dpoEmail: editCompanyForm.dpoEmail,
                  });
                  setIsEditCompanyOpen(false);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD LEGAL ENTITY DRAWER */}
      {isAddEntityOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Legal Entity</h3>
                  <p className="text-xs text-slate-500">Register new statutory subsidiary under {currentCompany.name}</p>
                </div>
                <button
                  onClick={() => setIsAddEntityOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Entity Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Legal Entity A_4"
                    value={newEntity.name}
                    onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Applicable Country / Jurisdiction</label>
                  <select
                    value={newEntity.country}
                    onChange={(e) => setNewEntity({ ...newEntity, country: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="India">India (DPDPA 2023)</option>
                    <option value="United States">United States (CCPA/CPRA)</option>
                    <option value="United Kingdom">United Kingdom (UK GDPR)</option>
                    <option value="Germany">Germany (EU GDPR)</option>
                    <option value="Brazil">Brazil (LGPD 2018)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration / Incorporation Number</label>
                  <input
                    type="text"
                    placeholder="e.g. REG-IND-482019"
                    value={newEntity.registrationNumber}
                    onChange={(e) => setNewEntity({ ...newEntity, registrationNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registered Address</label>
                  <textarea
                    rows={3}
                    placeholder="Physical legal address..."
                    value={newEntity.address}
                    onChange={(e) => setNewEntity({ ...newEntity, address: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={() => setIsAddEntityOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newEntity.name.trim()) return;
                  createLegalEntity({
                    companyId: currentCompany.id,
                    companyName: currentCompany.name,
                    name: newEntity.name,
                    country: newEntity.country,
                    address: newEntity.address || 'Standard Registered Address',
                    registrationNumber: newEntity.registrationNumber || 'REG-PENDING',
                  });
                  setIsAddEntityOpen(false);
                  setNewEntity({ name: '', country: 'India', address: '', registrationNumber: '' });
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Save Entity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW LEGAL ENTITY DRAWER */}
      {viewingEntity && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingEntity.name}</h3>
                  <p className="text-xs text-slate-500">Statutory Legal Entity Overview</p>
                </div>
                <button
                  onClick={() => setViewingEntity(null)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Entity Type</span>
                    <span className="font-semibold text-slate-800">Data Controller / Fiduciary</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jurisdiction</span>
                    <span className="font-semibold text-blue-700">{viewingEntity.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registration Number</span>
                    <span className="font-mono font-semibold text-slate-800">{viewingEntity.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Parent Company</span>
                    <span className="font-semibold text-slate-800">{viewingEntity.companyName}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-1">Registered Address</span>
                    <p className="text-slate-700">{viewingEntity.address}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Mapped Privacy Regulations</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded bg-indigo-50 text-indigo-700 px-2 py-0.5 text-[11px] font-medium">
                      Digital Personal Data Protection Act (DPDPA) 2023
                    </span>
                    <span className="rounded bg-indigo-50 text-indigo-700 px-2 py-0.5 text-[11px] font-medium">
                      EU GDPR 2016
                    </span>
                    <span className="rounded bg-indigo-50 text-indigo-700 px-2 py-0.5 text-[11px] font-medium">
                      ISO/IEC 27001
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingEntity(viewingEntity);
                  setViewingEntity(null);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Edit this entity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ENTITY WARNING MODAL */}
      {deleteEntityConfirm && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete "{deleteEntityConfirm.name}"?</h3>
                <p className="text-xs text-red-600 font-medium">Permanent Deletion of Operational Data</p>
              </div>
            </div>

            <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 text-xs text-red-700 leading-relaxed">
              <strong>[HIGH-RISK WARNING]</strong> Deleting a legal entity triggers a permanent system-wide cascade:
              every operational department mapped to that entity — along with its associated business processes,
              questionnaire assessments, evidence attachments, and data lineage nodes — is permanently erased.
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-700 font-medium">
                TYPE <span className="font-bold text-slate-900">{deleteEntityConfirm.name}</span> TO CONFIRM:
              </label>
              <input
                type="text"
                placeholder={deleteEntityConfirm.name}
                value={deleteInputText}
                onChange={(e) => setDeleteInputText(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteEntityConfirm(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deleteInputText !== deleteEntityConfirm.name}
                onClick={() => {
                  deleteLegalEntity(deleteEntityConfirm.id);
                  setDeleteEntityConfirm(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                Delete entity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
