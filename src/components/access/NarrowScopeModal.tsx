import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, PermissionReach } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PERMISSION_DEFINITIONS } from '../../data/permissionMatrix';

interface NarrowScopeModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NarrowScopeModal: React.FC<NarrowScopeModalProps> = ({ user, isOpen, onClose }) => {
  const { addCustomGrant } = useApp();

  const [selectedPermissionId, setSelectedPermissionId] = useState(PERMISSION_DEFINITIONS[0].id);
  const [reach, setReach] = useState<PermissionReach>('Can open only');
  const [reason, setReason] = useState('');

  if (!user) return null;

  const selectedDef = PERMISSION_DEFINITIONS.find((p) => p.id === selectedPermissionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDef || !reason.trim()) return;

    addCustomGrant(user.id, {
      permissionId: selectedDef.id,
      landscape: selectedDef.landscape,
      module: selectedDef.module,
      feature: selectedDef.feature,
      action: selectedDef.action,
      reach,
      grantType: 'NARROW',
      reason: reason.trim(),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Narrow Permission Scope: ${user.name}`}
      subtitle={`Restrict or revoke an individual permission without altering the ${user.role} role.`}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" disabled={!reason.trim()} onClick={handleSubmit}>
            Apply Scope Restriction
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Feature to Restrict</label>
          <select
            value={selectedPermissionId}
            onChange={(e) => setSelectedPermissionId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
          >
            {PERMISSION_DEFINITIONS.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.landscape}] {p.module} → {p.feature} ({p.action})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Restricted To</label>
          <select
            value={reach}
            onChange={(e) => setReach(e.target.value as PermissionReach)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
          >
            <option value="Can open only">Can Open Only (Complete Block of Action)</option>
            <option value="Own department">Downgrade to Own Department</option>
            <option value="Own company">Downgrade to Own Company</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Governance Reason for Restriction *
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Segregation of duties conflict identified during quarterly access review."
            className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
          />
        </div>
      </form>
    </Modal>
  );
};

