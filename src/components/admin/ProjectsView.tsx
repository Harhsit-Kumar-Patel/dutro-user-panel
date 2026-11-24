import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplianceProject } from '../../types';
import { Search, Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, setProjects, addNotification } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.createdBy.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleDelete = (proj: ComplianceProject) => {
    if (confirm(`Delete project "${proj.name}"?`)) {
      setProjects((prev) => prev.filter((p) => p.id !== proj.id));
      addNotification('Project Deleted', `Removed ${proj.name}.`, 'info');
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden select-none">
      {/* Controls & Table matching Image 6 */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
        {/* Search & Actions Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-80">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or creators"
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-medium">
              {filteredProjects.length} of {projects.length} projects
            </span>
            <button
              type="button"
              onClick={() => addNotification('Project Created', 'New project draft initialized.', 'success')}
              className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Create project
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-50/40">
                <th className="py-2.5 px-4">PROJECT</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 px-4">ASSIGNED COMPANIES</th>
                <th className="py-2.5 px-4">CREATED BY</th>
                <th className="py-2.5 px-4">LAST UPDATED</th>
                <th className="py-2.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Project with Square Initials */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0 uppercase border border-slate-200">
                        {getInitials(proj.name)}
                      </div>
                      <span className="font-semibold text-slate-900">{proj.name}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className="text-emerald-600 font-semibold">
                      {proj.status}
                    </span>
                  </td>

                  {/* Assigned Companies */}
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {proj.assignedCompanies}
                  </td>

                  {/* Created By */}
                  <td className="py-3 px-4 text-slate-600">
                    {proj.createdBy}
                  </td>

                  {/* Last Updated */}
                  <td className="py-3 px-4 text-slate-600">
                    {proj.lastUpdated}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => addNotification('Project Opened', `Navigating to ${proj.name}.`, 'info')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-blue-600 font-medium text-xs transition cursor-pointer"
                      >
                        <span>Open project</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(proj)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
