import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface CustomGrantModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomGrantModal: React.FC<CustomGrantModalProps> = ({ user, isOpen, onClose }) => {
  const { companies, legalEntities, departments, addResourceAssignment, addNotification } = useApp();

  const [category, setCategory] = useState<'Company' | 'Legal Entity' | 'Department'>('Company');
  const [targetId, setTargetId] = useState('');
  const [accessLevel, setAccessLevel] = useState<'Admin' | 'Read/Write' | 'Read'>('Read/Write');
  const [reason, setReason] = useState('');

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;

    let targetName = '';
    if (category === 'Company') {
      const comp = companies.find((c) => c.id === targetId);
      targetName = comp?.name || 'Company';
    } else if (category === 'Legal Entity') {
      const ent = legalEntities.find((e) => e.id === targetId);
      targetName = ent?.name || 'Legal Entity';
    } else {
      const dept = departments.find((d) => d.id === targetId);
      targetName = dept?.name || 'Department';
    }

    addResourceAssignment(user.id, {
      resourceType: category === 'Legal Entity' ? 'Company' : (category as any),
      resourceId: targetId,
      resourceName: targetName,
      accessLevel,
    });

    addNotification('Scope Granted', `Granted ${accessLevel} scope on ${targetName} to ${user.name}.`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Grant Custom Scope: ${user.name}`}
      subtitle={`Extend access scope to a specific Company, Legal Entity, or Department without altering their base role.`}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!targetId} onClick={handleSubmit}>
            Grant Scope Access
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
            Target Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Company', 'Legal Entity', 'Department'] as const).map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setTargetId('');
                }}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                  category === cat
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
            Select {category}
          </label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          >
            <option value="">-- Choose {category} --</option>
            {category === 'Company' &&
              companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            {category === 'Legal Entity' &&
              legalEntities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} • {e.companyName}
                </option>
              ))}
            {category === 'Department' &&
              departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} • {d.companyName}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
            Access Level
          </label>
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value as any)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          >
            <option value="Admin">Full Administration (Admin)</option>
            <option value="Read/Write">Read & Write Access</option>
            <option value="Read">View Only / Auditor</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
            Business Justification
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Cross-company compliance review engagement"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>
      </form>
    </Modal>
  );
};
