import React, { useState } from 'react';
import { INITIAL_THIRD_PARTY_VENDORS } from '../../../data/platformMockData';
import { ThirdPartyVendor } from '../../../types/platform';
import {
  Server,
  Search,
  Filter,
  Plus,
  FileText,
  Upload,
  Download,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  X,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const VendorsView: React.FC = () => {
  const [vendors, setVendors] = useState<ThirdPartyVendor[]>(INITIAL_THIRD_PARTY_VENDORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<ThirdPartyVendor | null>(null);
  const [wizardTab, setWizardTab] = useState<number>(1);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);

  // New Vendor Form State
  const [newVendorForm, setNewVendorForm] = useState({
    code: 'Vendor A_8',
    name: '',
    departmentName: 'IT',
    websiteUrl: 'https://',
    industry: 'Cloud Infrastructure',
    country: 'United States',
    statutoryRole: 'Data Processor' as const,
    dpoContactName: 'Privacy Officer',
    dpoContactEmail: 'dpo@vendor.example.com',
  });

  const wizardTabs = [
    { id: 1, name: 'Vendor Profile' },
    { id: 2, name: 'Data Processing Details' },
    { id: 3, name: 'Certifications & Controls' },
    { id: 4, name: 'Legal & Compliance' },
    { id: 5, name: 'Sub-Processor Management' },
    { id: 6, name: 'Risk Assessment' },
  ];

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Department Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Third-Party Risk Governance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Vendors</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate external data processors, manage executed DPAs, audit supply chain sub-processors, and calculate
            weighted risk scores.
          </p>
        </div>

        <button
          onClick={() => setIsAddVendorOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor code, name, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Vendors Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Linked Processes</th>
                <th className="py-3 px-4">DPA Status</th>
                <th className="py-3 px-4 text-center">Computed Risk</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => {
                    setSelectedVendor(v);
                    setWizardTab(1);
                  }}
                  className="hover:bg-blue-50/30 transition cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {v.code}
                      </span>
                      <span>{v.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{v.industry}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{v.departmentName}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {v.linkedProcesses.map((p, idx) => (
                        <span key={idx} className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        v.dpaStatus === 'Signed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : v.dpaStatus === 'Conditionally Approved'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {v.dpaStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold text-[11px] ${
                        v.computedRiskTier === 'Low'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.computedRiskTier === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {v.computedRiskScore.toFixed(2)} / 3.00 • {v.computedRiskTier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{v.lastUpdated}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        title="Upload Signed DPA / MSA"
                        onClick={() => alert(`Upload signed DPA for ${v.code} (${v.name})`)}
                        className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                      <button
                        title="Open Assessment Wizard"
                        onClick={() => {
                          setSelectedVendor(v);
                          setWizardTab(1);
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6-TAB VENDOR ASSESSMENT WIZARD DRAWER */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {selectedVendor.code}
                    </span>
                    <span className="text-xs text-slate-500">Department: {selectedVendor.departmentName}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedVendor.name}</h2>
                  <p className="text-xs text-slate-500">Third-Party Vendor Assessment Wizard & Risk Scoring</p>
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Wizard Tab Navigation */}
              <div className="border-b border-slate-200 bg-white px-6 overflow-x-auto select-none no-scrollbar">
                <div className="flex items-center gap-6 min-w-max">
                  {wizardTabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setWizardTab(t.id)}
                      className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
                        wizardTab === t.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wizard Content Body */}
              <div className="p-6 space-y-5 text-xs">
                {/* TAB 1: VENDOR PROFILE */}
                {wizardTab === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                        <span className="text-slate-400 font-medium block">Canonical Website Domain</span>
                        <a
                          href={selectedVendor.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {selectedVendor.websiteUrl}
                        </a>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                        <span className="text-slate-400 font-medium block">Statutory Role</span>
                        <span className="font-bold text-slate-800">{selectedVendor.statutoryRole}</span>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                        <span className="text-slate-400 font-medium block">Operating Country / Region</span>
                        <span className="font-semibold text-slate-800">{selectedVendor.country}</span>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                        <span className="text-slate-400 font-medium block">Vendor Privacy Contact</span>
                        <span className="font-semibold text-slate-800">
                          {selectedVendor.dpoContactName} ({selectedVendor.dpoContactEmail})
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: DATA PROCESSING DETAILS */}
                {wizardTab === 2 && (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-blue-50 p-3.5 border border-blue-100 text-blue-900">
                      <span className="font-bold block">Scope & Processing Nature</span>
                      <p className="text-slate-700 mt-1">
                        Processes pseudonymized analytics logs, interaction clickstream, and device metadata under
                        business_process_A_2.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-slate-200 p-3">
                        <span className="text-slate-400 block font-medium">Record Volume Band</span>
                        <span className="font-bold text-slate-800 text-sm">10,000 - 50,000 Data Subjects</span>
                      </div>
                      <div className="rounded-lg border border-slate-200 p-3">
                        <span className="text-slate-400 block font-medium">Transfer Frequency & Transport</span>
                        <span className="font-bold text-slate-800 text-sm">Daily Scheduled API over TLS 1.3</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CERTIFICATIONS & CONTROLS */}
                {wizardTab === 3 && (
                  <div className="space-y-4">
                    <div>
                      <span className="font-bold text-slate-800 block mb-2">Audited Security Frameworks</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedVendor.certifications.map((cert, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 font-semibold"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-800 block mb-2">Technical Safeguards</span>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedVendor.technicalSafeguards.map((tg, idx) => (
                          <div key={idx} className="rounded-lg border border-slate-200 p-2.5 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-slate-800">{tg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: LEGAL & COMPLIANCE */}
                {wizardTab === 4 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800">Data Processing Agreement (DPA)</span>
                        <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold">
                          {selectedVendor.dpaStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800">Breach Notification SLA</span>
                        <span className="font-mono font-bold text-slate-800">
                          Within {selectedVendor.incidentResponseGuaranteedHours} Hours
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800">Legal Transfer Safeguards</span>
                        <span className="font-medium text-slate-700">Standard Contractual Clauses (SCCs 2021)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: SUB-PROCESSOR MANAGEMENT */}
                {wizardTab === 5 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Downstream 4th-Party Processors</span>
                      <span className="rounded bg-slate-100 text-slate-700 font-mono px-2 py-0.5">
                        {selectedVendor.subProcessorsList.length} registered
                      </span>
                    </div>

                    <div className="space-y-2">
                      {selectedVendor.subProcessorsList.map((sp, idx) => (
                        <div key={idx} className="rounded-lg border border-slate-200 p-3 space-y-1">
                          <div className="flex justify-between">
                            <span className="font-bold text-slate-900">{sp.name}</span>
                            <span className="text-slate-500">{sp.location}</span>
                          </div>
                          <p className="text-slate-600">{sp.service}</p>
                          <span className="text-[10px] text-emerald-700 font-semibold block">
                            Flow-down contract verified with equivalent security obligations.
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 6: RISK ASSESSMENT */}
                {wizardTab === 6 && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                          Overall Composite Risk Score
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-3xl font-extrabold text-slate-900">
                            {selectedVendor.computedRiskScore.toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-400">/ 3.00</span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                          selectedVendor.computedRiskTier === 'Low'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedVendor.computedRiskTier} Risk Tier
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-slate-800 block">Weighted Risk Dimension Breakdown</span>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2.5 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-semibold text-slate-800 block">Data Risk (25% Weight)</span>
                            <span className="text-[11px] text-slate-400">Pseudonymized telemetry and session logs</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-600">
                            {selectedVendor.riskBreakdown.dataRisk.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-semibold text-slate-800 block">Exposure Risk (20% Weight)</span>
                            <span className="text-[11px] text-slate-400">Limited to web/mobile application users</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-600">
                            {selectedVendor.riskBreakdown.exposureRisk.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-semibold text-slate-800 block">Transfer Risk (25% Weight)</span>
                            <span className="text-[11px] text-slate-400">Cross-border transfer with SCCs</span>
                          </div>
                          <span className="font-mono font-bold text-amber-600">
                            {selectedVendor.riskBreakdown.transferRisk.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-semibold text-slate-800 block">Control Risk (20% Weight)</span>
                            <span className="text-[11px] text-slate-400">ISO 27001, SOC 2 Type II certified</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-600">
                            {selectedVendor.riskBreakdown.controlRisk.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-semibold text-slate-800 block">Legal Risk (10% Weight)</span>
                            <span className="text-[11px] text-slate-400">Signed DPA with 24-hr breach notification</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-600">
                            {selectedVendor.riskBreakdown.legalRisk.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => alert(`Generated PDF Vendor Risk Dossier for ${selectedVendor.name}`)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </button>
              <button
                onClick={() => setSelectedVendor(null)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD VENDOR MODAL */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Third-Party Vendor</h3>
              <button
                onClick={() => setIsAddVendorOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vendor Systematic Code</label>
                <input
                  type="text"
                  value={newVendorForm.code}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, code: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Database Inc"
                  value={newVendorForm.name}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Managing Department</label>
                <select
                  value={newVendorForm.departmentName}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, departmentName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 outline-none bg-white cursor-pointer"
                >
                  <option value="IT">IT</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={newVendorForm.websiteUrl}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, websiteUrl: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAddVendorOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newVendorForm.name.trim()) return;
                  const created: ThirdPartyVendor = {
                    id: `ven-${Date.now()}`,
                    code: newVendorForm.code,
                    name: newVendorForm.name,
                    departmentName: newVendorForm.departmentName,
                    departmentId: 'dept-1',
                    linkedProcesses: ['business_process_A_2'],
                    aiUsage: false,
                    computedRiskScore: 1.5,
                    computedRiskTier: 'Low',
                    lastUpdated: new Date().toISOString().split('T')[0],
                    dpaStatus: 'Under Review',
                    websiteUrl: newVendorForm.websiteUrl,
                    industry: newVendorForm.industry,
                    country: newVendorForm.country,
                    statutoryRole: newVendorForm.statutoryRole,
                    dpoContactName: newVendorForm.dpoContactName,
                    dpoContactEmail: newVendorForm.dpoContactEmail,
                    certifications: ['ISO 27001 (ISMS)', 'SOC 2 Type II'],
                    policyControls: ['Information Security Policy'],
                    technicalSafeguards: ['AES-256 Encryption at Rest', 'TLS 1.3'],
                    incidentResponseGuaranteedHours: 48,
                    dataBreachLast12Months: false,
                    usesSubProcessors: false,
                    subProcessorsList: [],
                    riskBreakdown: {
                      dataRisk: 1.2,
                      exposureRisk: 1.2,
                      transferRisk: 2.0,
                      controlRisk: 1.0,
                      legalRisk: 1.5,
                    },
                  };
                  setVendors([created, ...vendors]);
                  setIsAddVendorOpen(false);
                  setNewVendorForm({
                    code: `Vendor A_${vendors.length + 2}`,
                    name: '',
                    departmentName: 'IT',
                    websiteUrl: 'https://',
                    industry: 'Cloud Infrastructure',
                    country: 'United States',
                    statutoryRole: 'Data Processor',
                    dpoContactName: 'Privacy Officer',
                    dpoContactEmail: 'dpo@vendor.example.com',
                  });
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Save Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
