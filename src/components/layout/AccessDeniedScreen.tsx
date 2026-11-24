import React from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_SPECS } from '../../data/permissionMatrix';
import { ShieldAlert, ArrowLeft, Lock, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Button } from '../common/Button';
import { RoleBadge } from '../common/Badge';

export const AccessDeniedScreen: React.FC = () => {
  const { currentRole, setCurrentRole } = useApp();
  const spec = ROLE_SPECS[currentRole];

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/50 mb-6">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-rose-600">
            Access Boundary Enforced
          </span>
          <span className="text-slate-300">•</span>
          <RoleBadge role={currentRole} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Restricted Administration Boundary
        </h2>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
          Under Dutro's enterprise security architecture, only the <strong className="text-slate-900">Enterprise Admin</strong> possesses authorization to administer the User Management Panel, configure organizational structures, and grant permissions.
        </p>

        <div className="mt-6 text-left rounded-xl bg-slate-50 border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500 tracking-wide mb-3">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            Permitted Scope for {currentRole}:
          </div>

          <p className="text-sm text-slate-700 font-medium mb-3">
            {spec?.description}
          </p>

          <ul className="space-y-2 text-xs text-slate-600">
            {spec?.notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="primary"
            size="md"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => setCurrentRole('Enterprise Admin')}
          >
            Switch to Enterprise Admin (Simulator)
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <AlertOctagon className="h-3.5 w-3.5" />
          <span>Security Boundary: Role-based Authorization Guard v2.4</span>
        </div>
      </div>
    </div>
  );
};

