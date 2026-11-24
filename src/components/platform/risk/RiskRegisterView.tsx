import React from 'react';
import { ShieldAlert, AlertTriangle, TrendingDown, CheckCircle2, Download } from 'lucide-react';

export const RiskRegisterView: React.FC = () => {
  const risks = [
    {
      id: 'RSK-01',
      title: 'Unregulated Cross-Border Telemetry Transfer to Vendor A_1',
      department: 'Analytics',
      category: 'Third-Party Processing',
      likelihood: 2,
      impact: 3,
      inherentScore: 6,
      mitigation: 'Standard Contractual Clauses (SCCs) and volume layer AES-256 encryption executed.',
      residualScore: 2,
      status: 'Mitigated',
    },
    {
      id: 'RSK-02',
      title: 'Absence of Automated DSAR Tombstoning in Cold Object Store',
      department: 'Data Engineering',
      category: 'Data Subject Rights',
      likelihood: 2,
      impact: 2,
      inherentScore: 4,
      mitigation: 'Nightly partition deletion webhook listener implemented.',
      residualScore: 1,
      status: 'Mitigated',
    },
    {
      id: 'RSK-03',
      title: 'HR Candidate Resume Retention Exceeding 12-Month Limit',
      department: 'HR',
      category: 'Storage Limitation',
      likelihood: 3,
      impact: 2,
      inherentScore: 6,
      mitigation: 'Automated talent pool re-consent workflow deployed.',
      residualScore: 2,
      status: 'Active Monitoring',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Risk Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Enterprise Risk Registry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Risk Register</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational risk scoring (Likelihood × Impact) across business processes, vendors, and cross-border data
            flows.
          </p>
        </div>

        <button
          onClick={() => alert('Exported enterprise risk register to CSV.')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export Risk Register
        </button>
      </div>

      {/* Risk Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Risk ID & Title</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-center">Inherent Risk</th>
              <th className="py-3 px-4">Mitigating Safeguards</th>
              <th className="py-3 px-4 text-center">Residual Risk</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {risks.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-700 font-bold">{r.id}</span>
                    <span className="font-bold text-slate-900">{r.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block ml-6 mt-0.5">{r.category}</span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{r.department}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 font-bold font-mono">
                    {r.inherentScore} / 9
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 max-w-xs">{r.mitigation}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold font-mono">
                    {r.residualScore} / 9
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="rounded-full bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 text-[10px]">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

