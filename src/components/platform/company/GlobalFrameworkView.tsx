import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { INITIAL_GLOBAL_CONTROLS } from '../../../data/platformMockData';
import { GlobalControl } from '../../../types/platform';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  BookOpen,
  X,
  FileCheck2,
  Trash2,
  Edit2,
  CheckCircle,
} from 'lucide-react';

export const GlobalFrameworkView: React.FC = () => {
  const { currentRole } = useApp();

  const [controls, setControls] = useState<GlobalControl[]>(INITIAL_GLOBAL_CONTROLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<number | 'ALL'>('ALL');
  const [selectedControl, setSelectedControl] = useState<GlobalControl | null>(null);
  const [isAddControlOpen, setIsAddControlOpen] = useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);

  // Expanded categories map
  const [expandedDomains, setExpandedDomains] = useState<Record<number, boolean>>({
    1: true, // Governance by default
    2: true, // Retention & Deletion
    3: false,
    5: false,
  });

  const toggleDomain = (domainId: number) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
  };

  // Group controls by domain
  const domainGroups = [
    { id: 1, name: 'Governance, Accountability & DPO', totalCount: 8 },
    { id: 2, name: 'Retention & Deletion', totalCount: 5 },
    { id: 3, name: 'Security Safeguards', totalCount: 16 },
    { id: 4, name: 'Breach Management', totalCount: 6 },
    { id: 5, name: 'Vendor & Third-Party Management', totalCount: 6 },
    { id: 6, name: 'Data Sharing & Disclosures', totalCount: 6 },
    { id: 7, name: 'Cross-Border Transfers', totalCount: 5 },
    { id: 8, name: 'Privacy by Design (PbD)', totalCount: 4 },
    { id: 9, name: 'DPIA / Risk Assessment', totalCount: 6 },
    { id: 10, name: 'Special / Sensitive Data', totalCount: 6 },
    { id: 11, name: "Children's Data", totalCount: 6 },
    { id: 12, name: 'Policies & Procedures', totalCount: 4 },
    { id: 13, name: 'Cookies', totalCount: 6 },
    { id: 14, name: 'Behavioural & Online Tracking', totalCount: 4 },
  ];

  // Form state for custom control
  const [newControlForm, setNewControlForm] = useState({
    id: '15.1.1',
    domainId: 1,
    domainName: 'Governance, Accountability & DPO',
    title: '',
    businessRequirement: '',
    description: '',
    law: 'India DPDPA 2023',
    articleCitation: 's. 8',
  });

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Control ID,Domain,Title,Requirement,Status,Regulations,Departments'].join(',') +
      '\n' +
      controls
        .map(
          (c) =>
            `"${c.id}","${c.domainName}","${c.title}","${c.businessRequirement.replace(/"/g, '""')}","${c.status}","${c.mappedRegulations.map((r) => r.law).join('; ')}","${c.mappedDepartments.join('; ')}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Dutro_Global_Framework_Controls.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredControls = controls.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.includes(searchQuery) ||
      c.businessRequirement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDomain = selectedDomain === 'ALL' || c.domainId === selectedDomain;
    return matchSearch && matchDomain;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Company Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Framework Library</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Global Framework</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized library of baseline privacy and security safeguards mapped to global statutory mandates.
          </p>
        </div>

        {/* Action button menu */}
        <div className="relative">
          <button
            onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <span>Actions</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isActionsDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-20 text-xs">
              <button
                onClick={() => {
                  handleExportCsv();
                  setIsActionsDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Download className="h-4 w-4 text-blue-600" />
                Export CSV
              </button>
              <button
                onClick={() => {
                  setIsAddControlOpen(true);
                  setIsActionsDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="h-4 w-4 text-emerald-600" />
                Add Custom Control
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={() => {
                  alert('Framework updated from Master DB repository.');
                  setIsActionsDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-purple-600" />
                Import from Master DB
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metric Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Controls</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">155</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Compliant</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">1</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Partially Compliant</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">0</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-500">Non-Compliant</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">0</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Not Started</p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1">154</p>
        </div>
      </div>

      {/* Search and Domain Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search controls, requirement, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 bg-white outline-none cursor-pointer"
          >
            <option value="ALL">All Categories ({domainGroups.length})</option>
            {domainGroups.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id}. {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Collapsible Domain Cards */}
      <div className="space-y-3">
        {domainGroups
          .filter((dg) => selectedDomain === 'ALL' || dg.id === selectedDomain)
          .map((domain) => {
            const domainControls = filteredControls.filter((c) => c.domainId === domain.id);
            const isExpanded = expandedDomains[domain.id];
            const hasControls = domainControls.length > 0;

            return (
              <div key={domain.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                {/* Category Header Bar */}
                <div
                  onClick={() => toggleDomain(domain.id)}
                  className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer select-none border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700 font-bold text-xs">
                      {domain.id}
                    </span>
                    <span className="font-semibold text-sm text-slate-900">{domain.name}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-400 font-medium">
                      {domain.id === 1 ? '1 / 8 compliant' : `0 / ${domain.totalCount} compliant`}
                    </span>
                    <span className="rounded bg-slate-200/80 px-2 py-0.5 font-semibold text-slate-700 text-[11px]">
                      {domain.totalCount} controls
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Sub-Controls Table */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100">
                    {hasControls ? (
                      domainControls.map((ctrl) => (
                        <div
                          key={ctrl.id}
                          onClick={() => setSelectedControl(ctrl)}
                          className="p-4 hover:bg-blue-50/30 transition flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                        >
                          <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                {ctrl.id}
                              </span>
                              <span className="font-semibold text-xs text-slate-900">{ctrl.title}</span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-1">{ctrl.businessRequirement}</p>
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {ctrl.mappedRegulations.map((reg, idx) => (
                                <span
                                  key={idx}
                                  className="rounded bg-slate-100 text-slate-600 px-1.5 py-0.5 text-[10px] font-medium"
                                >
                                  {reg.law} ({reg.articleCitation})
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                ctrl.status === 'Compliant'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {ctrl.status}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {ctrl.evidenceArtifactsCount} artifacts
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-xs text-slate-400 italic">
                        {domain.totalCount} baseline controls configured in Master DB for this domain.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* CONTROL DETAILS SLIDE-OUT DRAWER */}
      {selectedControl && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {selectedControl.id}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {selectedControl.domainName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedControl(null)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedControl.title}</h3>
                  <p className="text-slate-600 mt-1 leading-relaxed">{selectedControl.description}</p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-1">Business Requirement</span>
                  <p className="text-slate-800 leading-relaxed">{selectedControl.businessRequirement}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-700 block">Mapped Global Privacy Regulations</span>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedControl.mappedRegulations.map((reg, idx) => (
                      <div key={idx} className="flex justify-between items-center rounded-lg border border-slate-200 p-2.5">
                        <span className="font-semibold text-slate-800">{reg.law}</span>
                        <span className="font-mono font-medium text-blue-600">{reg.articleCitation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-700 block">Mapped Operational Departments</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedControl.mappedDepartments.map((dept, idx) => (
                      <span key={idx} className="rounded-md bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-50 p-3.5 border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <FileCheck2 className="h-4 w-4" />
                    <span className="font-semibold">Evidence Artifacts</span>
                  </div>
                  <span className="font-bold text-emerald-900">{selectedControl.evidenceArtifactsCount} attached</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setControls((prev) =>
                    prev.map((c) =>
                      c.id === selectedControl.id
                        ? { ...c, status: c.status === 'Compliant' ? 'Not Started' : 'Compliant' }
                        : c
                    )
                  );
                  setSelectedControl(null);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Toggle Status
              </button>

              <button
                onClick={() => setSelectedControl(null)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOM CONTROL DRAWER */}
      {isAddControlOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Custom Control</h3>
                  <p className="text-xs text-slate-500">Define custom organization safeguards in Global Framework</p>
                </div>
                <button
                  onClick={() => setIsAddControlOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category / Domain</label>
                  <select
                    value={newControlForm.domainId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const dg = domainGroups.find((d) => d.id === id);
                      setNewControlForm({
                        ...newControlForm,
                        domainId: id,
                        domainName: dg?.name || '',
                      });
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none bg-white cursor-pointer"
                  >
                    {domainGroups.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.id}. {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Control Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 15.1.1"
                    value={newControlForm.id}
                    onChange={(e) => setNewControlForm({ ...newControlForm, id: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Control Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Model Provenance & LLM Guardrails"
                    value={newControlForm.title}
                    onChange={(e) => setNewControlForm({ ...newControlForm, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Business Requirement</label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific mandatory requirement..."
                    value={newControlForm.businessRequirement}
                    onChange={(e) => setNewControlForm({ ...newControlForm, businessRequirement: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mapped Privacy Regulation</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Law e.g. India DPDPA 2023"
                      value={newControlForm.law}
                      onChange={(e) => setNewControlForm({ ...newControlForm, law: e.target.value })}
                      className="rounded-lg border border-slate-300 p-2 text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Citation e.g. s. 8(5)"
                      value={newControlForm.articleCitation}
                      onChange={(e) => setNewControlForm({ ...newControlForm, articleCitation: e.target.value })}
                      className="rounded-lg border border-slate-300 p-2 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsAddControlOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newControlForm.title.trim()) return;
                  const created: GlobalControl = {
                    id: newControlForm.id || '15.1.1',
                    domainId: newControlForm.domainId,
                    domainName: newControlForm.domainName,
                    title: newControlForm.title,
                    businessRequirement: newControlForm.businessRequirement,
                    description: newControlForm.businessRequirement,
                    status: 'Not Started',
                    mappedRegulations: [
                      {
                        law: newControlForm.law,
                        articleCitation: newControlForm.articleCitation,
                      },
                    ],
                    mappedDepartments: ['Analytics', 'Infosec'],
                    evidenceArtifactsCount: 0,
                  };
                  setControls([created, ...controls]);
                  setIsAddControlOpen(false);
                  setNewControlForm({
                    id: '15.1.2',
                    domainId: 1,
                    domainName: 'Governance, Accountability & DPO',
                    title: '',
                    businessRequirement: '',
                    description: '',
                    law: 'India DPDPA 2023',
                    articleCitation: 's. 8',
                  });
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Save Control
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
