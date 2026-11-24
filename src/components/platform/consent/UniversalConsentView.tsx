import React, { useState } from 'react';
import { INITIAL_UNIVERSAL_PURPOSES } from '../../../data/platformMockData';
import { UniversalConsentPurpose } from '../../../types/platform';
import {
  ShieldCheck,
  Smartphone,
  Mail,
  MessageSquare,
  Globe,
  Database,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
} from 'lucide-react';

export const UniversalConsentView: React.FC = () => {
  const [purposes, setPurposes] = useState<UniversalConsentPurpose[]>(INITIAL_UNIVERSAL_PURPOSES);

  const touchpoints = [
    { name: 'Web (inline form or modal)', status: 'Available', icon: <Globe className="h-4 w-4 text-blue-600" /> },
    { name: 'Mobile, API, iframe', status: 'Available', icon: <Smartphone className="h-4 w-4 text-purple-600" /> },
    { name: 'Email and SMS', status: 'Available', icon: <Mail className="h-4 w-4 text-emerald-600" /> },
    { name: 'WhatsApp and instant messengers', status: 'In development', icon: <MessageSquare className="h-4 w-4 text-slate-400" /> },
    { name: 'Offline collection (Paper / POS)', status: 'In development', icon: <Layers className="h-4 w-4 text-slate-400" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          <span>Consent Landscape</span>
          <span>/</span>
          <span className="text-slate-500">Omni-Channel Purpose Governance</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Universal Consent</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Purpose-based consent management across web forms, mobile apps, APIs, email, and SMS, tied directly to RoPA
          business processes.
        </p>
      </div>

      {/* Concept Architecture Card */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <span>How Universal Consent Connects to the Rest of Dutro</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
          <div>
            <strong>• Purposes come from the RoPA:</strong> Wherever a business process records{' '}
            <em>Consent</em> as its legal basis, its purposes appear in the purpose library, prefilled. Purposes can be
            configured per data element within one business process.
          </div>
          <div>
            <strong>• Notices follow builder pattern:</strong> You write the notice, preview it, and it undergoes mandatory
            legal-review confirmation before publishing.
          </div>
          <div>
            <strong>• Collection points define origin:</strong> Define where consent is gathered (web form or mobile
            modal) with validity periods and allowed origins.
          </div>
          <div>
            <strong>• Cryptographic Consent Ledger:</strong> Maintains user-level consent history with proof hashes and
            passes changes to downstream tools via real-time webhooks.
          </div>
        </div>
      </div>

      {/* Collection Touchpoints Status Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs space-y-3 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Collection Touchpoints</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {touchpoints.map((tp, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                {tp.icon}
                <span className="font-semibold text-slate-800">{tp.name}</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  tp.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tp.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RoPA Linked Purpose Library */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Active Purposes Derived from RoPA
          </span>
          <button
            onClick={() => alert('New purpose can be derived by creating a RoPA process with Consent legal basis.')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            + New Purpose
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Purpose Code</th>
                <th className="py-3 px-4">Purpose Name</th>
                <th className="py-3 px-4">Linked RoPA Process</th>
                <th className="py-3 px-4">Personal Data Elements</th>
                <th className="py-3 px-4">Touchpoints</th>
                <th className="py-3 px-4 text-center">Validity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purposes.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{p.code}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-blue-700 text-[11px] block">{p.linkedBusinessProcessCode}</span>
                    <span className="text-slate-600 text-[11px]">{p.linkedBusinessProcessName}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.personalDataElements.map((el, i) => (
                        <span key={i} className="rounded bg-slate-100 text-slate-700 px-1.5 py-0.5 text-[10px]">
                          {el}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{p.touchpoints.join(', ')}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                    {p.validityMonths} Months
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal and Deletion Lifecycle Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2 text-xs">
        <h3 className="font-bold text-slate-800 text-sm">Automated Withdrawal & Deletion Pipeline</h3>
        <p className="text-slate-600 leading-relaxed">
          When a data principal withdraws consent, Dutro inspects the retention schedule recorded in the RoPA. If consent
          was the sole legal basis, Dutro triggers automated deletion webhooks to client engineering pipelines with the
          exact data schema, storage location, and unique user identifier.
        </p>
      </div>
    </div>
  );
};
