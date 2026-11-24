import React from 'react';
import { FileText, Shield, Clock, Plus, Download, CheckCircle2, Lock } from 'lucide-react';

export const PolicyCentreView: React.FC = () => {
  const policies = [
    {
      code: 'POL-01',
      title: 'Global Data Protection & Privacy Governance Policy',
      owner: 'DPO User',
      version: 'v3.2',
      status: 'Active',
      effectiveDate: '2026-01-15',
      reviewCadence: 'Annual',
      mappedActs: 'India DPDPA 2023, EU GDPR 2016',
    },
    {
      code: 'POL-02',
      title: 'Data Retention Schedules & Secure Erasure Standard',
      owner: 'Legal Officer User',
      version: 'v2.0',
      status: 'Active',
      effectiveDate: '2026-03-01',
      reviewCadence: 'Annual',
      mappedActs: 'EU GDPR Art. 5(1)(e), DPDPA s. 8(7)',
    },
    {
      code: 'POL-03',
      title: 'Third-Party Vendor Risk & DPA Standard',
      owner: 'Consultant User',
      version: 'v1.4',
      status: 'Under Review',
      effectiveDate: '2026-06-10',
      reviewCadence: 'Bi-Annual',
      mappedActs: 'EU GDPR Art. 28, DPDPA s. 8(2)',
    },
    {
      code: 'POL-04',
      title: 'Information Security Safeguards & Encryption Standard',
      owner: 'Infosec Lead User',
      version: 'v4.1',
      status: 'Active',
      effectiveDate: '2026-02-18',
      reviewCadence: 'Annual',
      mappedActs: 'ISO/IEC 27001, DPDPA s. 8(5)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Trust Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Corporate Governance Policies</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Policy Centre</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured policy lifecycle management, statutory versioning, and internal handling guidelines.
          </p>
        </div>

        <button
          onClick={() => alert('New policy drafting workflow initiated.')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Draft New Policy
        </button>
      </div>

      {/* Policy Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Policy Code & Title</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Version</th>
              <th className="py-3 px-4">Effective Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {policies.map((p) => (
              <tr key={p.code} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-mono text-blue-700 font-bold">{p.code}</span>
                    <span className="font-bold text-slate-900">{p.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block ml-6 mt-0.5">{p.mappedActs}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-700 font-medium">{p.owner}</td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{p.version}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{p.effectiveDate}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      p.status === 'Active' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => alert(`Downloading ${p.title} (${p.version})`)}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

