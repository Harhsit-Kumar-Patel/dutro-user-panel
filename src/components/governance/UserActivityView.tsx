import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import {
  Activity,
  Search,
  Filter,
  Monitor,
  Globe,
  Shield,
  Clock,
  ChevronRight,
  ChevronDown,
  X,
  ArrowUpDown,
  Laptop,
} from 'lucide-react';

export const UserActivityView: React.FC = () => {
  const { userActivities } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [drawerActivity, setDrawerActivity] = useState<any | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'ALL'>('ALL');

  const filteredActivities = useMemo(() => {
    return userActivities
      .filter((act) => {
        if (typeFilter !== 'ALL' && act.activityType !== typeFilter) return false;

        const q = searchTerm.toLowerCase().trim();
        if (!q) return true;

        return (
          act.userName.toLowerCase().includes(q) ||
          act.userEmail.toLowerCase().includes(q) ||
          act.description.toLowerCase().includes(q) ||
          act.ipAddress.toLowerCase().includes(q) ||
          act.device.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [userActivities, typeFilter, searchTerm, sortOrder]);

  const totalPages = pageSize === 'ALL' ? 1 : Math.ceil(filteredActivities.length / pageSize) || 1;
  const paginatedActivities = useMemo(() => {
    if (pageSize === 'ALL') return filteredActivities;
    const start = (currentPage - 1) * pageSize;
    return filteredActivities.slice(start, start + pageSize);
  }, [filteredActivities, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Compliance Log</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time compliance activity log tracking user logins, DPIA executions, consent changes, and regulatory register downloads.
          </p>
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
            placeholder="Search by user name, email, action description, IP address..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="w-full sm:w-56 relative group">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-all"
          >
            <option value="ALL">All Event Types</option>
            <option value="Login">Logins</option>
            <option value="Admin Action">Admin Actions</option>
            <option value="DPIA Execution">DPIA Executions</option>
            <option value="Consent Update">Consent Updates</option>
            <option value="Data Export">Data Exports</option>
            <option value="Document Review">Document Reviews</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>

      {/* 3. Streamlined Activity Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        {paginatedActivities.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No activity events matched your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Event Type</th>
                  <th className="py-3 px-6">Action Description</th>
                  <th className="py-3 px-6">IP & Device</th>
                  <th
                    className="py-3 px-6 cursor-pointer hover:text-slate-800 transition"
                    onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Timestamp</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedActivities.map((act) => (
                  <tr
                    key={act.id}
                    onClick={() => setDrawerActivity(act)}
                    className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                  >
                    {/* User Avatar + Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs shadow-2xs">
                          {act.userName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {act.userName}
                          </div>
                          <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                            {act.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Event Type */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200">
                        {act.activityType}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-800 line-clamp-1 max-w-sm">
                        {act.description}
                      </span>
                    </td>

                    {/* IP & Device */}
                    <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      <div>{act.ipAddress}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">{act.device}</div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="text-slate-400 ml-1.5">{new Date(act.timestamp).toLocaleDateString()}</span>
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

        {/* Clean Pagination & Event Count Footer */}
        {filteredActivities.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 px-6 py-3.5 text-xs text-slate-500 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <span>
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {paginatedActivities.length}
                </span>{' '}
                of <span className="font-semibold text-slate-700">{filteredActivities.length}</span> total events
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
                  <option value="ALL">All events ({filteredActivities.length})</option>
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

      {/* 4. ACTIVITY DETAILS SLIDE DRAWER (Opens on clicking event row) */}
      {drawerActivity && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
            onClick={() => setDrawerActivity(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl border-l border-slate-200 flex flex-col z-50 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/60">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-md shadow-blue-500/20">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{drawerActivity.activityType}</h2>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {new Date(drawerActivity.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerActivity(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                  title="Close Drawer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Event Description */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Event Description
                </h3>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs font-medium text-slate-900 leading-relaxed">
                  {drawerActivity.description}
                </div>
              </div>

              {/* User Identity */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  User Attribution
                </h3>
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">User Name</span>
                    <span className="font-semibold text-slate-900">{drawerActivity.userName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Email Address</span>
                    <span className="font-mono text-slate-800">{drawerActivity.userEmail}</span>
                  </div>
                </div>
              </div>

              {/* Network & Device Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Network & Session Security
                </h3>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      Client IP Address
                    </span>
                    <span className="font-mono font-medium text-slate-900">{drawerActivity.ipAddress}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Laptop className="h-3.5 w-3.5 text-slate-400" />
                      Device & User Agent
                    </span>
                    <span className="text-slate-800 font-medium">{drawerActivity.device}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDrawerActivity(null)}
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
