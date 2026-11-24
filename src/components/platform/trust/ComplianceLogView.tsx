import React, { useState } from 'react';
import { INITIAL_COMPLIANCE_LOG_EVENTS } from '../../../data/platformMockData';
import { ComplianceLogEvent } from '../../../types/platform';
import { Search, Shield, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const ComplianceLogView: React.FC = () => {
  const [logEvents] = useState<ComplianceLogEvent[]>(INITIAL_COMPLIANCE_LOG_EVENTS);
  const [viewMode, setViewMode] = useState<'activity' | 'audit'>('activity');
  const [searchQuery, setSearchQuery] = useState('');
  const [streamFilter, setStreamFilter] = useState('ALL');

  const filteredLogs = logEvents.filter((evt) => {
    const matchSearch =
      evt.narrative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.actorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStream = streamFilter === 'ALL' || evt.stream === streamFilter;
    return matchSearch && matchStream;
  });

  return (
    <div className="space-y-6">
      {/* Header: Title, Description, and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Trust Landscape</span>
            <span>/</span>
            <span className="text-slate-400">Compliance Log</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Compliance Log</h1>
          <p className="text-sm text-slate-500 mt-1">
            An automated, immutable record of compliance events, assessments, and policy updates across the organization.
          </p>
        </div>

        {/* View Switchers: Activity vs. Audit Trail */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium select-none shadow-2xs">
          <button
            onClick={() => setViewMode('activity')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              viewMode === 'activity' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Activity View
          </button>
          <button
            onClick={() => setViewMode('audit')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              viewMode === 'audit' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {/* Streamlined Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search activity narrative, actor, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="w-full sm:w-52">
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Event Streams</option>
            <option value="Assessments">Assessments</option>
            <option value="Gaps">Gaps & Findings</option>
            <option value="Risks">Risks</option>
            <option value="Policies">Policies</option>
            <option value="Vendors">Vendors</option>
            <option value="Evidence Bank">Evidence Bank</option>
          </select>
        </div>
      </div>

      {/* ACTIVITY TIMELINE VIEW */}
      {viewMode === 'activity' && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Recent Activities ({filteredLogs.length})
          </div>

          <div className="space-y-3">
            {filteredLogs.map((evt) => {
              const streamColors: Record<string, { bg: string }> = {
                Gaps: { bg: 'bg-rose-50 text-rose-700 border-rose-200' },
                Assessments: { bg: 'bg-amber-50 text-amber-700 border-amber-200' },
                Policies: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                Vendors: { bg: 'bg-purple-50 text-purple-700 border-purple-200' },
                Risks: { bg: 'bg-orange-50 text-orange-700 border-orange-200' },
              };
              const badgeStyle = streamColors[evt.stream] || { bg: 'bg-blue-50 text-blue-700 border-blue-200' };

              return (
                <div
                  key={evt.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50/70 transition"
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold border ${badgeStyle.bg}`}>
                    {evt.stream[0]}
                  </div>

                  <div className="flex-1 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${badgeStyle.bg}`}>
                          {evt.stream}
                        </span>
                        <span className="font-semibold text-slate-700">{evt.departmentName}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono">{evt.relativeTime}</span>
                    </div>

                    <p className="text-slate-900 text-sm leading-relaxed">{evt.narrative}</p>

                    <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-400">
                      <span>By <strong className="text-slate-600 font-medium">{evt.actorName}</strong> ({evt.actorRole})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        {evt.outcome}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AUDIT TRAIL FORENSIC VIEW */}
      {viewMode === 'audit' && (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-5">Event & Endpoint</th>
                <th className="py-3 px-5">Actor</th>
                <th className="py-3 px-5">IP Address</th>
                <th className="py-3 px-5">Payload Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">{evt.timestamp}</td>
                  <td className="py-3.5 px-5">
                    <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 font-bold mr-2 text-[10px] border border-blue-200">
                      {evt.httpMethod}
                    </span>
                    <span className="text-slate-800 font-medium">{evt.endpointUri}</span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-700 font-sans">
                    {evt.actorName} <span className="text-slate-400 text-[10px]">({evt.actorRole})</span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">{evt.clientIp}</td>
                  <td className="py-3.5 px-5 text-slate-400 truncate max-w-xs">{evt.payloadHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
