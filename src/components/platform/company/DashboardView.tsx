import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { INITIAL_COMPLIANCE_LOG_EVENTS, INITIAL_BUSINESS_PROCESSES, INITIAL_GAPS } from '../../../data/platformMockData';
import { ComplianceLogEvent } from '../../../types/platform';
import {
  TrendingUp,
  AlertCircle,
  Shield,
  Clock,
  ArrowRight,
  ExternalLink,
  X,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  ChevronRight,
} from 'lucide-react';

export const DashboardView: React.FC<{ onNavigateToDepartment?: (deptName: string) => void }> = ({
  onNavigateToDepartment,
}) => {
  const { currentCompanyId, companies } = useApp();
  const currentCompany = companies.find((c) => c.id === currentCompanyId) || companies[0] || { name: 'Company A' };

  const [isComplianceLogDrawerOpen, setIsComplianceLogDrawerOpen] = useState(false);
  const [logFilterStream, setLogFilterStream] = useState('ALL');
  const [logViewMode, setLogViewMode] = useState<'activity' | 'audit'>('activity');

  const DEPARTMENTS_MATRIX = [
    { name: 'Analytics', processes: 6, vendors: 1, pia: '—', gaps: 2, risks: '—', evidence: 4 },
    { name: 'HR', processes: 2, vendors: 1, pia: '—', gaps: 0, risks: '—', evidence: 31 },
    { name: 'Finance', processes: 2, vendors: 1, pia: '—', gaps: 1, risks: '—', evidence: 2 },
    { name: 'Data Engineering', processes: 10, vendors: 1, pia: '—', gaps: 0, risks: '—', evidence: 4 },
    { name: 'IT', processes: 1, vendors: 1, pia: '—', gaps: 0, risks: '—', evidence: 1 },
    { name: 'Infosec', processes: 1, vendors: 0, pia: '—', gaps: 1, risks: '—', evidence: 2 },
    { name: 'Legal', processes: 1, vendors: 0, pia: '—', gaps: 0, risks: '—', evidence: 1 },
    { name: 'Marketing', processes: 1, vendors: 1, pia: '—', gaps: 0, risks: '—', evidence: 0 },
    { name: 'Operations', processes: 1, vendors: 1, pia: '—', gaps: 0, risks: '—', evidence: 0 },
    { name: 'Platform', processes: 1, vendors: 1, pia: '—', gaps: 0, risks: '—', evidence: 0 },
    { name: 'Product', processes: 0, vendors: 1, pia: '—', gaps: 0, risks: '—', evidence: 0 },
    { name: 'SRE/DevOps', processes: 1, vendors: 1, pia: '—', gaps: 0, risks: '—', evidence: 0 },
    { name: 'Other dept', processes: 0, vendors: 0, pia: '—', gaps: 0, risks: '—', evidence: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          <span>Company Landscape</span>
          <span>/</span>
          <span className="text-slate-500">Executive Posture</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Governance Overview</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time strategic compliance readiness and cross-department privacy posture for{' '}
          <span className="font-semibold text-slate-800">{currentCompany.name}</span>.
        </p>
      </div>

      {/* 4 Strategic KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PCF Compliant</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">1%</span>
            <span className="text-xs text-slate-400">1 of 155 controls</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '1%' }} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Gaps</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-red-600">11</span>
            <span className="text-xs text-slate-400">0 critical</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '45%' }} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Risks</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-800">0</span>
            <span className="text-xs text-slate-400">No risks recorded</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-slate-300 h-1.5 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-800">0</span>
            <span className="text-xs text-slate-400">Awaiting your review</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>
      </div>

      {/* Module Completion Meter */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Module Completion</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Company</span>
              <span className="text-emerald-600 font-bold">100%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="text-[11px] text-slate-400">6 of 6 fields filled</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Department</span>
              <span className="text-blue-600 font-bold">9%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '9%' }} />
            </div>
            <p className="text-[11px] text-slate-400">13 depts tracked</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Risk</span>
              <span className="text-slate-400">—</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }} />
            </div>
            <p className="text-[11px] text-slate-400">Coming soon</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Trust</span>
              <span className="text-slate-400">—</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }} />
            </div>
            <p className="text-[11px] text-slate-400">Coming soon</p>
          </div>
        </div>
      </div>

      {/* Compliance Feed Widget */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Compliance Feed</h2>
            <p className="text-xs text-slate-400">Real-time statutory activity across all business units</p>
          </div>
          <button
            onClick={() => setIsComplianceLogDrawerOpen(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {INITIAL_COMPLIANCE_LOG_EVENTS.slice(0, 4).map((evt) => (
            <div
              key={evt.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/60 transition"
            >
              <div
                className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  evt.stream === 'Gaps'
                    ? 'bg-red-100 text-red-700'
                    : evt.stream === 'Assessments'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {evt.stream[0]}
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 uppercase tracking-wider text-[10px]">
                    {evt.stream} • {evt.departmentName}
                  </span>
                  <span className="text-slate-400 text-[11px]">{evt.relativeTime}</span>
                </div>
                <p className="text-slate-700 mt-1">{evt.narrative}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Landscape Matrix Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Department Landscape</h2>
            <p className="text-xs text-slate-500">Cross-department discovery, RoPA readiness, and risk rollup</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Processing Activities</th>
                <th className="py-3 px-4 text-center">Vendors</th>
                <th className="py-3 px-4 text-center">PIA / DPIA</th>
                <th className="py-3 px-4 text-center">Gaps</th>
                <th className="py-3 px-4 text-center">Risks</th>
                <th className="py-3 px-4 text-center">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEPARTMENTS_MATRIX.map((dept, idx) => (
                <tr
                  key={idx}
                  onClick={() => onNavigateToDepartment && onNavigateToDepartment(dept.name)}
                  className="hover:bg-blue-50/40 transition cursor-pointer"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900">{dept.name}</td>
                  <td className="py-3 px-4 text-center font-medium text-slate-700">{dept.processes}</td>
                  <td className="py-3 px-4 text-center font-medium text-slate-700">{dept.vendors}</td>
                  <td className="py-3 px-4 text-center text-slate-400">{dept.pia}</td>
                  <td className="py-3 px-4 text-center">
                    {dept.gaps > 0 ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-red-100 text-red-700 font-bold px-2 py-0.5 text-[11px]">
                        {dept.gaps}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400">{dept.risks}</td>
                  <td className="py-3 px-4 text-center font-medium text-slate-700">{dept.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE COMPLIANCE LOG SLIDE-OUT DRAWER */}
      {isComplianceLogDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Compliance Log</h3>
                  <p className="text-xs text-slate-500">Immutable chronological compliance stream and audit trace</p>
                </div>
                <button
                  onClick={() => setIsComplianceLogDrawerOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* View Mode Toggle: Activity vs Audit Trail */}
              <div className="flex items-center justify-between gap-3 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setLogViewMode('activity')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                    logViewMode === 'activity' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Activity View
                </button>
                <button
                  onClick={() => setLogViewMode('audit')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                    logViewMode === 'audit' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Audit Trail View
                </button>
              </div>

              {/* Stream filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={logFilterStream}
                  onChange={(e) => setLogFilterStream(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 bg-white outline-none cursor-pointer"
                >
                  <option value="ALL">All Streams</option>
                  <option value="Assessments">Assessments</option>
                  <option value="Gaps">Gaps</option>
                  <option value="Vendors">Vendors</option>
                  <option value="Risks">Risks</option>
                  <option value="Evidence Bank">Evidence Bank</option>
                </select>
              </div>

              {/* Log Items */}
              <div className="space-y-3">
                {INITIAL_COMPLIANCE_LOG_EVENTS.filter(
                  (evt) => logFilterStream === 'ALL' || evt.stream === logFilterStream
                ).map((evt) => (
                  <div key={evt.id} className="rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            evt.stream === 'Gaps'
                              ? 'bg-red-50 text-red-700'
                              : evt.stream === 'Assessments'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {evt.stream}
                        </span>
                        <span className="font-semibold text-slate-800">{evt.departmentName}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{evt.relativeTime}</span>
                    </div>

                    <p className="text-slate-800 font-medium">{evt.narrative}</p>

                    {logViewMode === 'audit' && (
                      <div className="rounded-lg bg-slate-900 text-slate-300 p-3 font-mono text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Endpoint:</span>
                          <span className="text-emerald-400">
                            {evt.httpMethod} {evt.endpointUri}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Client IP:</span>
                          <span className="text-slate-200">{evt.clientIp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Actor:</span>
                          <span className="text-slate-200">
                            {evt.actorName} ({evt.actorRole})
                          </span>
                        </div>
                        <div className="truncate text-slate-500 pt-1">SHA-256: {evt.payloadHash}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsComplianceLogDrawerOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
