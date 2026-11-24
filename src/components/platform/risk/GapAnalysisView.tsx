import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { INITIAL_GAPS } from '../../../data/platformMockData';
import { GapAnalysisItem } from '../../../types/platform';
import {
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Lock,
  CheckCircle2,
  Calendar,
  UserCheck,
  FileCheck2,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { checkRolePermission } from '../../../utils/permissionChecker';

export const GapAnalysisView: React.FC = () => {
  const { currentRole } = useApp();

  const [gaps, setGaps] = useState<GapAnalysisItem[]>(INITIAL_GAPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'Business Process' | 'Vendor'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'Critical' | 'High' | 'Medium' | 'Low'>('ALL');
  const [selectedGapForEdit, setSelectedGapForEdit] = useState<GapAnalysisItem | null>(null);
  const [editDrawerTab, setEditDrawerTab] = useState<'overview' | 'remediation' | 'closure'>('overview');
  const [isAddGapOpen, setIsAddGapOpen] = useState(false);
  const [newActionItemTitle, setNewActionItemTitle] = useState('');

  // Add Gap Form State
  const [newGapForm, setNewGapForm] = useState({
    title: '',
    description: '',
    source: 'Business Process' as 'Business Process' | 'Vendor',
    departmentName: 'Analytics',
    severity: 'High' as 'Critical' | 'High' | 'Medium' | 'Low',
    assignedOwner: 'Consultant User',
    dueDate: '2026-12-31',
    gapType: 'Compliance' as 'Compliance' | 'Security' | 'Operational' | 'Vendor',
  });

  const totalCount = gaps.length;
  const openCount = gaps.filter((g) => g.status === 'Open').length;
  const inProgressCount = gaps.filter((g) => g.status === 'In Progress').length;
  const closedCount = gaps.filter((g) => g.status === 'Closed').length;
  const criticalCount = gaps.filter((g) => g.severity === 'Critical').length;

  const filteredGaps = gaps.filter((g) => {
    const matchSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.assignedOwner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSource = sourceFilter === 'ALL' || g.source === sourceFilter;
    const matchSeverity = severityFilter === 'ALL' || g.severity === severityFilter;
    return matchSearch && matchSource && matchSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Risk Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Compliance Deficiencies</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Gap Analysis</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active compliance inbox where statutory non-conformities are detected by AI, triaged by consultants, and
            closed by DPO.
          </p>
        </div>

        <button
          onClick={() => setIsAddGapOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Gap
        </button>
      </div>

      {/* 5 KPI Summary Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Gaps</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-500">Open</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{openCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">In Progress</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{inProgressCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Closed</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{closedCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Critical Severity</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">{criticalCount}</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Gap ID, title, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 outline-none cursor-pointer text-slate-700"
          >
            <option value="ALL">All Sources</option>
            <option value="Business Process">Business Process</option>
            <option value="Vendor">Vendor</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 outline-none cursor-pointer text-slate-700"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Itemized Gap Inventory Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Gap ID</th>
                <th className="py-3 px-4">Title & Context</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGaps.map((gap) => (
                <tr
                  key={gap.id}
                  onClick={() => {
                    setSelectedGapForEdit(gap);
                    setEditDrawerTab('overview');
                  }}
                  className="hover:bg-blue-50/30 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{gap.id}</td>
                  <td className="py-3.5 px-4 max-w-md">
                    <span className="font-bold text-slate-900 block">{gap.title}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{gap.description}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-medium text-slate-800 block">{gap.source}</span>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px] block">
                      {gap.sourceName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{gap.departmentName}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        gap.severity === 'Critical'
                          ? 'bg-red-200 text-red-900'
                          : gap.severity === 'High'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : gap.severity === 'Medium'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        gap.status === 'Open'
                          ? 'bg-blue-50 text-blue-700'
                          : gap.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {gap.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        title="Edit Gap Workflow"
                        onClick={() => {
                          setSelectedGapForEdit(gap);
                          setEditDrawerTab('overview');
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        title="Delete Gap"
                        onClick={() => {
                          if (confirm(`Delete ${gap.id}?`)) {
                            setGaps(gaps.filter((g) => g.id !== gap.id));
                          }
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
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

      {/* EDIT GAP DRAWER (3 TABS) */}
      {selectedGapForEdit && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {selectedGapForEdit.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Department: {selectedGapForEdit.departmentName}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedGapForEdit.title}</h2>
                  <p className="text-xs text-slate-500">Compliance Gap Remediation Lifecycle</p>
                </div>
                <button
                  onClick={() => setSelectedGapForEdit(null)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* System Notice Banner */}
              <div className="mx-6 mt-4 p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                <strong>[SYSTEM NOTICE]</strong> This gap was surfaced by AI analysis. Title, description, and workflow
                fields are editable — the finding's source mapping (source, department, severity, owner, applicable law)
                is immutable.
              </div>

              {/* Drawer Tabs */}
              <div className="border-b border-slate-200 bg-white px-6 mt-3 flex items-center gap-8 select-none">
                <button
                  onClick={() => setEditDrawerTab('overview')}
                  className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                    editDrawerTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setEditDrawerTab('remediation')}
                  className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                    editDrawerTab === 'remediation'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Remediation Plan ({selectedGapForEdit.remediationActions.length})
                </button>
                <button
                  onClick={() => setEditDrawerTab('closure')}
                  className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                    editDrawerTab === 'closure'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  Closure / DPO Gate
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {editDrawerTab === 'overview' && (
                <div className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Finding Title</label>
                    <input
                      type="text"
                      value={selectedGapForEdit.title}
                      onChange={(e) =>
                        setSelectedGapForEdit({ ...selectedGapForEdit, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description Narrative</label>
                    <textarea
                      rows={3}
                      value={selectedGapForEdit.description}
                      onChange={(e) =>
                        setSelectedGapForEdit({ ...selectedGapForEdit, description: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gap Type</label>
                      <select
                        value={selectedGapForEdit.gapType}
                        onChange={(e) =>
                          setSelectedGapForEdit({ ...selectedGapForEdit, gapType: e.target.value as any })
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none bg-white cursor-pointer"
                      >
                        <option value="Compliance">Compliance</option>
                        <option value="Security">Security</option>
                        <option value="Operational">Operational</option>
                        <option value="Vendor">Vendor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status</label>
                      <select
                        value={selectedGapForEdit.status}
                        onChange={(e) =>
                          setSelectedGapForEdit({ ...selectedGapForEdit, status: e.target.value as any })
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none bg-white cursor-pointer"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Remediation Owner</label>
                      <input
                        type="text"
                        value={selectedGapForEdit.assignedOwner}
                        onChange={(e) =>
                          setSelectedGapForEdit({ ...selectedGapForEdit, assignedOwner: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={selectedGapForEdit.dueDate}
                        onChange={(e) =>
                          setSelectedGapForEdit({ ...selectedGapForEdit, dueDate: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none bg-white cursor-pointer"
                      >
                      </input>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">Statutory Citations</span>
                    <p className="font-mono text-slate-600 text-[11px]">{selectedGapForEdit.applicableLaws.join(' • ')}</p>
                  </div>
                </div>
              )}

              {/* TAB 2: REMEDIATION PLAN */}
              {editDrawerTab === 'remediation' && (
                <div className="p-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <span className="font-bold text-slate-800 block">Checklist of Mitigation Items</span>
                      <span className="text-[11px] text-slate-400">
                        Notification reminders sent automatically at 14-day, 3-day, day-of, and 7-day DPO escalation.
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const newAction = {
                          id: `act-${Date.now()}`,
                          title: 'Conduct data flow verification review with engineering team lead',
                          assignedTo: selectedGapForEdit.assignedOwner,
                          dueDate: selectedGapForEdit.dueDate,
                          completed: false,
                        };
                        setSelectedGapForEdit({
                          ...selectedGapForEdit,
                          remediationActions: [...selectedGapForEdit.remediationActions, newAction],
                        });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 text-xs font-semibold hover:bg-blue-100 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Suggest Action
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedGapForEdit.remediationActions.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/50 transition"
                      >
                        <input
                          type="checkbox"
                          checked={act.completed}
                          onChange={(e) => {
                            const updated = selectedGapForEdit.remediationActions.map((a) =>
                              a.id === act.id ? { ...a, completed: e.target.checked } : a
                            );
                            setSelectedGapForEdit({ ...selectedGapForEdit, remediationActions: updated });
                          }}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        <div className="flex-1">
                          <span
                            className={`font-semibold text-slate-800 ${
                              act.completed ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {act.title}
                          </span>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                            <span>Assignee: {act.assignedTo}</span>
                            <span>Due: {act.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CLOSURE / DPO GATE */}
              {editDrawerTab === 'closure' && (
                <div className="p-6 space-y-4 text-xs">
                  {/* Check if all remediation items are done */}
                  {selectedGapForEdit.remediationActions.every((a) => a.completed) ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span>Remediation 100% Completed</span>
                      </div>
                      <p className="text-slate-700">
                        All mitigating controls have been verified. The Data Protection Officer can formally review and
                        sign off this gap.
                      </p>

                      <div className="pt-3 border-t border-emerald-200">
                        <button
                          onClick={() => {
                            setSelectedGapForEdit({
                              ...selectedGapForEdit,
                              status: 'Closed',
                              dpoGate: {
                                isSignedOff: true,
                                signedOffBy: 'DPO User',
                                signedOffAt: new Date().toISOString().split('T')[0],
                                residualRiskAccepted: true,
                              },
                            });
                          }}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                        >
                          DPO Sign-Off & Close Gap
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 mx-auto">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">Close this gap</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        0 of {selectedGapForEdit.remediationActions.length} action items are done. Closing now marks
                        this gap Partially Closed — you need 100% action completion for formal closure.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedGapForEdit({ ...selectedGapForEdit, status: 'Closed' });
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                      >
                        Close Gap
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer committing changes */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedGapForEdit(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setGaps(gaps.map((g) => (g.id === selectedGapForEdit.id ? selectedGapForEdit : g)));
                  setSelectedGapForEdit(null);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Save Gap Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD GAP MODAL */}
      {isAddGapOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Compliance Gap</h3>
              <button
                onClick={() => setIsAddGapOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Finding Title</label>
                <input
                  type="text"
                  placeholder="e.g. Unencrypted Log Storage in Analytics"
                  value={newGapForm.title}
                  onChange={(e) => setNewGapForm({ ...newGapForm, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed narrative of deficiency..."
                  value={newGapForm.description}
                  onChange={(e) => setNewGapForm({ ...newGapForm, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Origin</label>
                  <select
                    value={newGapForm.source}
                    onChange={(e) => setNewGapForm({ ...newGapForm, source: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 outline-none bg-white cursor-pointer"
                  >
                    <option value="Business Process">Business Process</option>
                    <option value="Vendor">Vendor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={newGapForm.severity}
                    onChange={(e) => setNewGapForm({ ...newGapForm, severity: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 outline-none bg-white cursor-pointer"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAddGapOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newGapForm.title.trim()) return;
                  const created: GapAnalysisItem = {
                    id: `GAP-A-00${gaps.length + 1}`,
                    title: newGapForm.title,
                    description: newGapForm.description || 'Manually logged audit finding.',
                    source: newGapForm.source,
                    sourceName: 'business_process_A_2',
                    departmentName: newGapForm.departmentName,
                    severity: newGapForm.severity,
                    status: 'Open',
                    assignedOwner: newGapForm.assignedOwner,
                    dueDate: newGapForm.dueDate,
                    residualRisk: 'Low after remediation',
                    gapType: newGapForm.gapType,
                    applicableLaws: ['India DPDPA s. 8(5)', 'EU GDPR Art. 32'],
                    remediationActions: [
                      {
                        id: `act-${Date.now()}`,
                        title: 'Triage deficiency and assign remediation engineer',
                        assignedTo: newGapForm.assignedOwner,
                        dueDate: newGapForm.dueDate,
                        completed: false,
                      },
                    ],
                    dpoGate: {
                      isSignedOff: false,
                      residualRiskAccepted: false,
                    },
                  };
                  setGaps([created, ...gaps]);
                  setIsAddGapOpen(false);
                  setNewGapForm({
                    title: '',
                    description: '',
                    source: 'Business Process',
                    departmentName: 'Analytics',
                    severity: 'High',
                    assignedOwner: 'Consultant User',
                    dueDate: '2026-12-31',
                    gapType: 'Compliance',
                  });
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Log Gap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
