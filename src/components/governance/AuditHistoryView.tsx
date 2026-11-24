import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry } from '../../types';
import { Button } from '../common/Button';
import {
  ShieldAlert,
  FileSpreadsheet,
  FileCode,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Layers,
  ChevronRight,
  ChevronDown,
  X,
  ArrowUpDown,
  History,
} from 'lucide-react';

export const AuditHistoryView: React.FC = () => {
  const { auditLogs, exportAuditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [drawerLog, setDrawerLog] = useState<AuditLogEntry | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'ALL'>('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs
      .filter((log) => {
        if (categoryFilter !== 'ALL' && log.actionCategory !== categoryFilter) return false;

        const q = searchTerm.toLowerCase().trim();
        if (!q) return true;

        return (
          log.action.toLowerCase().includes(q) ||
          log.affectedUserOrResource.toLowerCase().includes(q) ||
          log.actorName.toLowerCase().includes(q) ||
          log.actorEmail.toLowerCase().includes(q) ||
          log.actionCategory.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [auditLogs, categoryFilter, searchTerm, sortOrder]);

  const totalPages = pageSize === 'ALL' ? 1 : Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    if (pageSize === 'ALL') return filteredLogs;
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Export buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Panel Audit History</h1>
          <p className="mt-1 text-sm text-slate-500">
            Records access changes, custom grants, approvals, activations, suspensions, and organizational configuration changes across Dutro.
          </p>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet className="h-4 w-4 text-emerald-600" />}
            onClick={() => exportAuditLogs('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<FileCode className="h-4 w-4 text-blue-600" />}
            onClick={() => exportAuditLogs('json')}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* 2. Streamlined Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search audit trail by actor, affected user/resource, or action name..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="w-full sm:w-60 relative group">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-all"
          >
            <option value="ALL">All Action Categories</option>
            <option value="User Management">User Management</option>
            <option value="Invitation">Invitation Lifecycle</option>
            <option value="Registration">Registration Approvals</option>
            <option value="Role & Permission">Role & Permission Changes</option>
            <option value="Organisation">Organisation Structure</option>
            <option value="Access Review">Access Review Certifications</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>

      {/* 3. Streamlined Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        {paginatedLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No audit records match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th
                    className="py-3 px-6 cursor-pointer hover:text-slate-800 transition"
                    onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Timestamp</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-6">Action & Category</th>
                  <th className="py-3 px-6">Affected Subject / Resource</th>
                  <th className="py-3 px-6">Change Delta</th>
                  <th className="py-3 px-6">Responsible Actor</th>
                  <th className="py-3 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setDrawerLog(log)}
                    className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                  >
                    {/* Timestamp */}
                    <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>

                    {/* Action & Category */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {log.action}
                      </div>
                      <span className="rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 border border-slate-200 mt-1 inline-block">
                        {log.actionCategory}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {log.affectedUserOrResource}
                    </td>

                    {/* Delta snippet */}
                    <td className="py-4 px-6 text-[11px] max-w-xs font-mono">
                      {log.newValue ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate inline-block max-w-[200px]">
                          {log.newValue}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>

                    {/* Actor */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{log.actorName}</div>
                      <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                    </td>

                    {/* Action Chevron */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Clean Pagination & Records Count Footer */}
        {filteredLogs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 px-6 py-3.5 text-xs text-slate-500 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <span>
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {paginatedLogs.length}
                </span>{' '}
                of <span className="font-semibold text-slate-700">{filteredLogs.length}</span> total records
              </span>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Display:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                    setPageSize(val);
                    setCurrentPage(1);
                  }}
                  className="rounded border border-slate-200 bg-white py-0.5 px-2 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All records ({filteredLogs.length})</option>
                  <option value="25">25 per page</option>
                  <option value="10">10 per page</option>
                </select>
              </div>
            </div>
            {pageSize !== 'ALL' && totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition"
                >
                  Previous
                </button>
                <span className="text-slate-400 text-xs px-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. AUDIT LOG DETAILS SLIDE DRAWER (Opens on clicking log row) */}
      {drawerLog && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
            onClick={() => setDrawerLog(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl border-l border-slate-200 flex flex-col z-50 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/60">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-[10px] font-bold border border-blue-200">
                      {drawerLog.actionCategory}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(drawerLog.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{drawerLog.action}</h2>
                </div>

                <button
                  onClick={() => setDrawerLog(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                  title="Close Drawer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Target & Subject */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Affected Subject / Resource
                </h3>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs font-semibold text-slate-900">
                  {drawerLog.affectedUserOrResource}
                </div>
              </div>

              {/* Delta Comparison */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Change Delta (Before / After)
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-rose-50/50 p-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-700">Previous Value</span>
                    <div className="font-mono text-slate-700 break-words">
                      {drawerLog.previousValue || <span className="text-slate-400 italic">None</span>}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-emerald-50/50 p-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-700">New Value</span>
                    <div className="font-mono text-slate-900 font-semibold break-words">
                      {drawerLog.newValue || <span className="text-slate-400 italic">None</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsible Actor */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Responsible Actor
                </h3>
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Actor Name</span>
                    <span className="font-semibold text-slate-900">{drawerLog.actorName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Actor Email</span>
                    <span className="font-mono text-slate-800">{drawerLog.actorEmail}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Role at Execution</span>
                    <span className="font-medium text-slate-800">{drawerLog.actorRole}</span>
                  </div>
                </div>
              </div>

              {/* Immutable Hash Notice */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-blue-600" />
                  <span>Cryptographic Seal</span>
                </div>
                <p>
                  This record is permanently sealed and replicated to the tamper-evident audit ledger. Record ID: {drawerLog.id}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDrawerLog(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
