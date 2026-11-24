import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RoleBadge } from '../common/Badge';

interface AssignRoleModalProps {
  role: RoleType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({ role, isOpen, onClose }) => {
  const { users, changeUserRole } = useApp();
  const [selectedUserId, setSelectedUserId] = useState('');

  if (!role) return null;

  // Filter users who do not currently have this role
  const eligibleUsers = users.filter((u) => u.role !== role);

  const handleAssign = () => {
    if (!selectedUserId) return;
    changeUserRole(selectedUserId, role);
    setSelectedUserId('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Assign Users to</span>
          <RoleBadge role={role} size="sm" />
        </div>
      }
      subtitle="Reassign employee business role and recalculate baseline permissions"
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!selectedUserId} onClick={handleAssign}>
            Reassign Role
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <p className="text-slate-600 leading-relaxed">
          Selecting an employee will transition their business role to <strong>{role}</strong>. Their access boundaries, landscape reach, and default permissions will update immediately across Dutro.
        </p>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Select Employee</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
          >
            <option value="">-- Choose an employee --</option>
            {eligibleUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email}) — Current Role: {u.role} [{u.companyName}]
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};

