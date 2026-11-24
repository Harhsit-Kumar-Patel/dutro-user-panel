import React, { useState, useEffect } from 'react';
import { User, RoleType, Company, Department } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Check } from 'lucide-react';

interface EditAccessModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditAccessModal: React.FC<EditAccessModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const {
    companies,
    departments,
    projects,
    changeUserRole,
    updateUser,
    addNotification,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<RoleType>('Consultant');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<'Active' | 'Suspended'>('Active');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [landscapeAccess, setLandscapeAccess] = useState<Record<string, 'Full' | 'Read' | 'None'>>({
    Company: 'Full',
    Department: 'Full',
    Risk: 'Read',
    Trust: 'Read',
    Consent: 'Full',
  });

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setSelectedCompanyId(user.companyId || (companies[0]?.id ?? ''));
      setSelectedDeptId(user.departmentId || (departments[0]?.id ?? ''));
      setSelectedStatus(user.status === 'Active' ? 'Active' : 'Suspended');
      // Seed default project assignments
      setSelectedProjectIds(projects.slice(0, user.assignedProjectsCount || 1).map((p) => p.id));
    }
  }, [user, companies, departments, projects]);

  if (!isOpen || !user) return null;

  const toggleProject = (projId: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(projId) ? prev.filter((id) => id !== projId) : [...prev, projId]
    );
  };

  const handleSave = () => {
    // Apply role change
    changeUserRole(user.id, selectedRole);

    const comp = companies.find((c) => c.id === selectedCompanyId);
    const dept = departments.find((d) => d.id === selectedDeptId);

    // Apply company and status update
    updateUser(user.id, {
      companyId: selectedCompanyId,
      companyName: comp?.name || user.companyName,
      departmentId: selectedDeptId,
      departmentName: dept?.name || user.departmentName,
      status: selectedStatus,
      assignedProjectsCount: selectedProjectIds.length,
    });

    addNotification('Access Updated', `Updated access permissions for ${user.name}.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 select-none">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Edit Access</h3>
              <p className="text-xs text-slate-400">
                {user.name} · <span className="font-mono">{user.email}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
          {/* 1. Role & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Assigned Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as RoleType)}
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Enterprise Admin">Enterprise Admin</option>
                <option value="Consultant">Consultant</option>
                <option value="Data Protection Officer">Data Protection Officer (DPO)</option>
                <option value="Program Owner">Program Owner</option>
                <option value="Department Owner">Department Owner</option>
                <option value="Department POC">Department POC</option>
                <option value="Customer">Customer</option>
                <option value="User">Standard User</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Account Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'Active' | 'Suspended')}
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* 2. Company & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Primary Company
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 truncate"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 truncate"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Assigned Compliance Projects */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Assigned Compliance Projects ({selectedProjectIds.length})
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto border border-slate-200 rounded-md p-2 bg-slate-50/50">
              {projects.map((proj) => {
                const isSelected = selectedProjectIds.includes(proj.id);
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => toggleProject(proj.id)}
                    className={`flex items-center gap-2 p-1.5 rounded text-left transition cursor-pointer text-xs truncate ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5" />}
                    </div>
                    <span className="truncate">{proj.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Landscape Access Level (Concise 5 rows) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Landscape Permissions
            </label>
            <div className="border border-slate-200 rounded-md divide-y divide-slate-100 overflow-hidden bg-white">
              {[
                { key: 'Company', label: 'Company Landscape (Profile, Lineage, Legal)' },
                { key: 'Department', label: 'Department Landscape (Discovery, Vendors, RoPA)' },
                { key: 'Risk', label: 'Risk Landscape (Gap Analysis, Risk Register)' },
                { key: 'Trust', label: 'Trust Landscape (Compliance Log, Policies)' },
                { key: 'Consent', label: 'Consent Landscape (Cookie Consent, Universal)' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-50/50"
                >
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-1">
                    {(['Full', 'Read', 'None'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() =>
                          setLandscapeAccess((prev) => ({ ...prev, [item.key]: lvl }))
                        }
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                          landscapeAccess[item.key] === lvl
                            ? lvl === 'Full'
                              ? 'bg-blue-600 text-white'
                              : lvl === 'Read'
                              ? 'bg-slate-700 text-white'
                              : 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {lvl === 'Full' ? 'Full' : lvl === 'Read' ? 'View' : 'None'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

