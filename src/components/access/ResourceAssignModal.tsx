import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ResourceAssignment } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ResourceAssignModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResourceAssignModal: React.FC<ResourceAssignModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const { addResourceAssignment, companies, departments } = useApp();

  const [resourceType, setResourceType] = useState<ResourceAssignment['resourceType']>('Project');
  const [resourceId, setResourceId] = useState('');
  const [resourceName, setResourceName] = useState('');
  const [accessLevel, setAccessLevel] = useState<ResourceAssignment['accessLevel']>('Read/Write');

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceName.trim()) return;

    addResourceAssignment(user.id, {
      resourceType,
      resourceId: resourceId || `res-${Date.now()}`,
      resourceName: resourceName.trim(),
      accessLevel,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Resource: ${user.name}`}
      subtitle={`Grant targeted entitlement to a specific compliance artifact, system, or project.`}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!resourceName.trim()} onClick={handleSubmit}>
            Assign Resource
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Resource Category</label>
          <select
            value={resourceType}
            onChange={(e) => {
              setResourceType(e.target.value as any);
              setResourceName('');
              setResourceId('');
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
          >
            <option value="Project">Compliance Project / Assessment</option>
            <option value="Company">Specific Company Entity</option>
            <option value="Department">Specific Department</option>
            <option value="System">Data Warehouse / Cloud System</option>
          </select>
        </div>

        {resourceType === 'Company' ? (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Company</label>
            <select
              value={resourceId}
              onChange={(e) => {
                const comp = companies.find((c) => c.id === e.target.value);
                setResourceId(e.target.value);
                setResourceName(comp?.name || '');
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
            >
              <option value="">-- Choose Company --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : resourceType === 'Department' ? (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Department</label>
            <select
              value={resourceId}
              onChange={(e) => {
                const dept = departments.find((d) => d.id === e.target.value);
                setResourceId(e.target.value);
                setResourceName(dept ? `${dept.name} (${dept.companyName})` : '');
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
            >
              <option value="">-- Choose Department --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.companyName})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resource Name / Identifier *</label>
            <input
              type="text"
              required
              value={resourceName}
              onChange={(e) => {
                setResourceName(e.target.value);
                setResourceId(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
              placeholder="e.g. Project Aegis (AI Privacy Architecture)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Granted Access Level</label>
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value as any)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
          >
            <option value="Read">Read (View & Inspect only)</option>
            <option value="Read/Write">Read/Write (Manage & Edit artifacts)</option>
            <option value="Admin">Admin (Full administrative control)</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

