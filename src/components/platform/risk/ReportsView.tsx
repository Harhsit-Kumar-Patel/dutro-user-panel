import React, { useState } from 'react';
import {
  INITIAL_GLOBAL_CONTROLS,
  INITIAL_BUSINESS_PROCESSES,
  INITIAL_THIRD_PARTY_VENDORS,
  INITIAL_MOM_RECORDS,
} from '../../../data/platformMockData';
import { MinutesOfMeetingRecord } from '../../../types/platform';
import {
  FileText,
  Download,
  Search,
  Filter,
  Plus,
  Sparkles,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  X,
  Calendar,
  Users,
  Building,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<'controls' | 'processes' | 'vendors' | 'mom'>('mom');

  // MoM State
  const [momRecords, setMomRecords] = useState<MinutesOfMeetingRecord[]>(INITIAL_MOM_RECORDS);
  const [selectedMomForView, setSelectedMomForView] = useState<MinutesOfMeetingRecord | null>(null);
  const [isGenerateMomOpen, setIsGenerateMomOpen] = useState(false);
  const [momRenamingId, setMomRenamingId] = useState<string | null>(null);
  const [renamedTitle, setRenamedTitle] = useState('');

  // Generate MoM Form State
  const [newMomForm, setNewMomForm] = useState({
    departmentName: 'Analytics',
    meetingTitle: 'Monthly Privacy & Data Protection Review',
    transcriptText: '',
  });

  // Business Process Report filter
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('Analytics');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          <span>Risk Landscape</span>
          <span>/</span>
          <span className="text-slate-500">Compliance Analytics & Exports</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Reports</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate statutory audit-ready reports, export RoPA records, and synthesize AI Minutes of Meeting (MoM).
        </p>
      </div>

      {/* 4 Primary Report Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-8 select-none overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveReportTab('controls')}
          className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeReportTab === 'controls'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Controls Compliance
        </button>
        <button
          onClick={() => setActiveReportTab('processes')}
          className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeReportTab === 'processes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Business Processes (RoPA)
        </button>
        <button
          onClick={() => setActiveReportTab('vendors')}
          className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeReportTab === 'vendors'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Vendors Report
        </button>
        <button
          onClick={() => setActiveReportTab('mom')}
          className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeReportTab === 'mom'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          Minutes of Meeting (MoM)
        </button>
      </div>

      {/* TAB 1: CONTROLS COMPLIANCE */}
      {activeReportTab === 'controls' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Controls Detail (155 Controls Flattened)</span>
            <button
              onClick={() => alert('Exported entire framework matrix to CSV.')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Control ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Framework</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_GLOBAL_CONTROLS.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{c.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.title}</td>
                    <td className="py-3 px-4 text-slate-600">{c.mappedRegulations[0]?.law}</td>
                    <td className="py-3 px-4 text-slate-600">{c.domainName}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-[10px] font-bold">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BUSINESS PROCESSES (ROPA) */}
      {activeReportTab === 'processes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Department:</span>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="Analytics">Analytics</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <button
              onClick={() => alert('Download statutory RoPA PDF with official company letterhead.')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF (RoPA)
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Process</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-4 text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_BUSINESS_PROCESSES.map((bp) => (
                  <tr key={bp.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-blue-700 font-bold block">{bp.code}</span>
                      <span className="font-semibold text-slate-800">{bp.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{bp.ownerName}</td>
                    <td className="py-3.5 px-4">
                      <span className="rounded-full bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                        {bp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{bp.riskLevel}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Downloading PDF RoPA for ${bp.code}`)}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VENDORS REPORT */}
      {activeReportTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Third-Party Vendors Privacy Assessment Reports</span>
            <button
              onClick={() => alert('Download comprehensive vendors assessment dossier.')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Download All Vendor Reports
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Risk Rating</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_THIRD_PARTY_VENDORS.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-blue-700 font-bold block">{v.code}</span>
                      <span className="font-semibold text-slate-800">{v.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{v.departmentName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {v.computedRiskScore.toFixed(2)} ({v.computedRiskTier})
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                        {v.dpaStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Downloading vendor risk report for ${v.name}`)}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MINUTES OF MEETING (MoM) */}
      {activeReportTab === 'mom' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Minutes of Meeting (MoM)</h3>
              <p className="text-xs text-slate-500">
                AI-powered governance synthesis tool for statutory oversight and DPO-lead consultations.
              </p>
            </div>

            <button
              onClick={() => setIsGenerateMomOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Generate MoM
            </button>
          </div>

          {/* Generated Meetings List */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Meeting Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Generated Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {momRecords.map((mom) => (
                  <tr key={mom.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      {momRenamingId === mom.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={renamedTitle}
                            onChange={(e) => setRenamedTitle(e.target.value)}
                            className="rounded border border-blue-500 px-2 py-1 text-xs outline-none"
                          />
                          <button
                            onClick={() => {
                              setMomRecords(
                                momRecords.map((m) => (m.id === mom.id ? { ...m, meetingTitle: renamedTitle } : m))
                              );
                              setMomRenamingId(null);
                            }}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Save
                          </button>
                          <button onClick={() => setMomRenamingId(null)} className="text-xs text-slate-400">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-900">{mom.meetingTitle}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{mom.departmentName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{mom.generatedDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-xs">
                        <button
                          onClick={() => setSelectedMomForView(mom)}
                          className="font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setMomRenamingId(mom.id);
                            setRenamedTitle(mom.meetingTitle);
                          }}
                          className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => alert(`Downloaded MoM PDF for "${mom.meetingTitle}"`)}
                          className="font-semibold text-slate-600 hover:text-blue-600 cursor-pointer"
                        >
                          Download
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

      {/* GENERATE MOM SLIDE-OUT DRAWER */}
      {isGenerateMomOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Generate Minutes of Meeting</h3>
                  <p className="text-xs text-slate-500">AI compliance intelligence engine synthesizes raw transcripts</p>
                </div>
                <button
                  onClick={() => setIsGenerateMomOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Department</label>
                  <select
                    value={newMomForm.departmentName}
                    onChange={(e) => setNewMomForm({ ...newMomForm, departmentName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white outline-none cursor-pointer"
                  >
                    <option value="Analytics">Analytics</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Infosec">Infosec</option>
                    <option value="IT">IT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meeting Title (Optional)</label>
                  <input
                    type="text"
                    value={newMomForm.meetingTitle}
                    onChange={(e) => setNewMomForm({ ...newMomForm, meetingTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Raw Meeting Transcript</label>
                  <textarea
                    rows={6}
                    placeholder="Paste meeting transcript here, or type discussion notes..."
                    value={newMomForm.transcriptText}
                    onChange={(e) => setNewMomForm({ ...newMomForm, transcriptText: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsGenerateMomOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const created: MinutesOfMeetingRecord = {
                    id: `mom-${Date.now()}`,
                    meetingTitle: newMomForm.meetingTitle,
                    departmentName: newMomForm.departmentName,
                    generatedDate: new Date().toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }),
                    clientName: 'Company A',
                    attendees: ['DPO User', 'Consultant User', `${newMomForm.departmentName} Lead User`],
                    agenda: [
                      '1. Review quarterly telemetry retention and statutory obligations',
                      '2. Resolve open gap remediation tickets',
                    ],
                    discussionPoints: [
                      'Agreed that Snowflake storage retention complies with DPDPA Section 8.',
                      'Confirmed cross-border Standard Contractual Clauses are active.',
                    ],
                    decisionsAndActionItems: ['Execute updated vendor addendum by end of month.'],
                  };
                  setMomRecords([created, ...momRecords]);
                  setIsGenerateMomOpen(false);
                  setSelectedMomForView(created);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                <Sparkles className="h-4 w-4" />
                Generate Minutes of Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MOM DETAILS MODAL */}
      {selectedMomForView && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Minutes of Meeting Report
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedMomForView.meetingTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedMomForView(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Department</span>
                  <span className="font-bold text-slate-800">{selectedMomForView.departmentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date & Time</span>
                  <span className="font-semibold text-slate-800">{selectedMomForView.generatedDate}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Attendees</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMomForView.attendees.map((att, idx) => (
                    <span key={idx} className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 font-medium">
                      {att}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Agenda</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {selectedMomForView.agenda.map((ag, idx) => (
                    <li key={idx}>{ag}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Discussion & Updates</span>
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50 space-y-1.5 text-slate-700">
                  {selectedMomForView.discussionPoints.map((pt, idx) => (
                    <p key={idx}>• {pt}</p>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Decisions & Action Items</span>
                <div className="rounded-lg border border-emerald-200 p-3 bg-emerald-50/40 space-y-1 text-emerald-900 font-medium">
                  {selectedMomForView.decisionsAndActionItems.map((dec, idx) => (
                    <p key={idx}>✓ {dec}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => alert('Download Boardroom-ready PDF MoM record.')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
              <button
                onClick={() => setSelectedMomForView(null)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
