import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { BusinessProcessRecord } from '../../../types/platform';
import { checkRolePermission } from '../../../utils/permissionChecker';
import {
  Brain,
  Search,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Sparkles,
  FileText,
  Lock,
} from 'lucide-react';

interface AiAgentsModalProps {
  agentType: 'control-mapping' | 'gap-analysis' | 'pia';
  process: BusinessProcessRecord;
  onClose: () => void;
  onAccepted?: () => void;
}

export const AiAgentsModal: React.FC<AiAgentsModalProps> = ({ agentType, process, onClose, onAccepted }) => {
  const { currentRole } = useApp();

  // Permission check: DPO is prohibited from running AI agents
  const aiPerm = checkRolePermission(currentRole, 'Risk', 'Run AI agent');

  // Interactive AI Agent States
  const [isRunning, setIsRunning] = useState(false);
  const [acceptedControls, setAcceptedControls] = useState<Record<string, boolean>>({
    '1.1.1': true,
    '3.1.1': true,
    '3.4.1': false,
  });

  // PIA 2-Phase State
  const [piaPhase, setPiaPhase] = useState<'screening' | 'scoring'>('screening');
  const [screeningAnswers, setScreeningAnswers] = useState<Record<number, boolean>>({
    1: true, // Evaluates user behavior?
    2: true, // Automated decision-making?
    3: false, // Large-scale sensitive data?
    4: true, // Cross-border transfers?
    5: false, // Vulnerable subjects?
  });

  if (!aiPerm.allowed) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-red-600">
            <div className="rounded-full bg-red-100 p-2.5">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Governance Restriction Enforced</h3>
              <p className="text-xs text-red-600 font-semibold">Separation of Duties Policy</p>
            </div>
          </div>

          <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 text-xs text-red-800 leading-relaxed">
            <strong>Data Protection Officer (DPO)</strong> is strictly prohibited from running AI agents (
            <em>Control Mapping Agent</em>, <em>Gap Analysis Agent</em>, or <em>PIA Agent</em>). Under Dutro governance
            rules, the DPO serves as the independent supervisory reviewer and auditor, not the execution operator.
          </div>

          <p className="text-xs text-slate-500">
            To run this AI agent, simulate the persona as <strong>Consultant</strong>, <strong>Program Owner</strong>, or{' '}
            <strong>Enterprise Admin</strong>.
          </p>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900 cursor-pointer shadow-xs"
            >
              Acknowledge Boundary
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {agentType === 'control-mapping' && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Brain className="h-6 w-6" />
              </div>
            )}
            {agentType === 'gap-analysis' && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Search className="h-6 w-6" />
              </div>
            )}
            {agentType === 'pia' && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {agentType === 'control-mapping' && 'AI Control Mapping Agent'}
                  {agentType === 'gap-analysis' && 'AI Gap Analysis Agent'}
                  {agentType === 'pia' && 'Automated Privacy Impact Assessment (PIA Agent)'}
                </h3>
                <span className="rounded bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 uppercase">
                  Dutro AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Target Process: <span className="font-semibold text-slate-800">{process.code}</span> ({process.name})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. CONTROL MAPPING AGENT CONTENT */}
        {agentType === 'control-mapping' && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-purple-50/70 border border-purple-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-900">AI Confidence: 92% Correlation Score</span>
                <span className="rounded bg-purple-200/70 text-purple-800 px-2 py-0.5 font-bold text-[10px]">
                  30 of 30 Suggested Controls
                </span>
              </div>
              <p className="text-purple-950 leading-relaxed">
                Evaluated data categories ({process.dataCategories.join(', ')}), data subjects (
                {process.dataSubjectCategories.join(', ')}), and transfer destinations. Identified statutory
                compliance requirements across India DPDPA 2023, EU GDPR 2016, and California CCPA/CPRA.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800">Suggested Controls for {process.code}</h4>

              <div className="space-y-2">
                <div className="rounded-lg border border-slate-200 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Control 1.1.1
                      </span>
                      <span className="font-bold text-slate-900">Organizational structure for data protection</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600">92% confidence</span>
                  </div>
                  <p className="text-slate-600">
                    Company maintains a defined governance structure with clear leadership, reporting lines, and
                    accountability for personal data protection across the business.
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-slate-500">
                      Citations: India DPDPA s. 8(1) • EU GDPR Art. 24
                    </span>
                    <button
                      onClick={() =>
                        setAcceptedControls({ ...acceptedControls, '1.1.1': !acceptedControls['1.1.1'] })
                      }
                      className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                        acceptedControls['1.1.1']
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {acceptedControls['1.1.1'] ? 'Accepted' : 'Accept Control'}
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Control 3.1.1
                      </span>
                      <span className="font-bold text-slate-900">Appropriate technical and organizational measures</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600">89% confidence</span>
                  </div>
                  <p className="text-slate-600">
                    Mandatory volume encryption (AES-256) and TLS 1.3 encryption in transit across telemetry endpoints.
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-slate-500">
                      Citations: India DPDPA s. 8(5) • EU GDPR Art. 32
                    </span>
                    <button
                      onClick={() =>
                        setAcceptedControls({ ...acceptedControls, '3.1.1': !acceptedControls['3.1.1'] })
                      }
                      className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                        acceptedControls['3.1.1']
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {acceptedControls['3.1.1'] ? 'Accepted' : 'Accept Control'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. GAP ANALYSIS AGENT CONTENT */}
        {agentType === 'gap-analysis' && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Automated Evidence & Safeguard Cross-Check</span>
                <span className="rounded bg-amber-200/70 text-amber-900 px-2 py-0.5 font-bold text-[10px]">
                  2 High Gaps Detected
                </span>
              </div>
              <p className="text-amber-950 leading-relaxed">
                The agent inspected uploaded documents in the Evidence Bank against the business process model. Missing
                lawful bases and incomplete vendor DPAs were identified.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-red-200 bg-red-50/30 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900">
                    GAP-A-001: Absence of Documented Lawful Basis for Telemetry Processing
                  </span>
                  <span className="rounded bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-bold">HIGH RISK</span>
                </div>
                <p className="text-slate-700">
                  The processing activity record contains an empty legal basis structure across all scoped
                  jurisdictions.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Violation: EU GDPR Art. 6(1) • India DPDPA s. 4
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">
                    GAP-A-003: Unmanaged Vendor Security for Third-Party Transfers
                  </span>
                  <span className="rounded bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                    MEDIUM RISK
                  </span>
                </div>
                <p className="text-slate-700">
                  Transmitting personal data to Vendor A_1 without executed DPA verifying 24-hr breach notification.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Violation: EU GDPR Art. 28 • India DPDPA s. 8(2)</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PIA AGENT CONTENT */}
        {agentType === 'pia' && (
          <div className="space-y-4 text-xs">
            {/* Phase Switcher */}
            <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setPiaPhase('screening')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                  piaPhase === 'screening' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Phase 1: Legal Mandate Screening (10 Criteria)
              </button>
              <button
                onClick={() => setPiaPhase('scoring')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                  piaPhase === 'scoring' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Phase 2: Material Risk Scenario Scoring (5 Scenarios)
              </button>
            </div>

            {piaPhase === 'screening' && (
              <div className="space-y-3">
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-blue-900">
                  <span className="font-bold block">Phase 1 Screening Result: In-Depth PIA Legally Mandated</span>
                  <p className="text-slate-700 mt-1">
                    Activity involves automated behavioral evaluation and cross-border data transfer, meeting the statutory
                    threshold under GDPR Art. 35 and DPDPA Section 10(2)(c).
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 1, q: 'Does this processing evaluate behavior, location, or personal preferences?' },
                    { id: 2, q: 'Is automated decision-making or profiling utilized that produces legal effects?' },
                    { id: 3, q: 'Does the activity process biometric or special category personal data?' },
                    { id: 4, q: 'Are personal datasets transferred to third-party vendors across international borders?' },
                    { id: 5, q: 'Does the processing involve data belonging to vulnerable subjects or children?' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200"
                    >
                      <span className="text-slate-800 font-medium">{item.q}</span>
                      <span
                        className={`rounded px-2.5 py-0.5 font-bold text-[11px] ${
                          screeningAnswers[item.id]
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {screeningAnswers[item.id] ? 'YES (High Exposure)' : 'NO'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {piaPhase === 'scoring' && (
              <div className="space-y-3">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-900">
                  <span className="font-bold block">Phase 2: Risk Scoring across 5 Material Scenarios</span>
                  <p className="text-slate-700 mt-1">Overall Inherent Risk: 1.85 / 3.00 (Low-to-Medium Tier)</p>
                </div>

                <div className="space-y-2">
                  {[
                    { name: '1. Unauthorized Access', score: 'Low (1.10)', note: 'AES-256 and MFA enforced' },
                    { name: '2. Unauthorized Modification', score: 'Low (1.00)', note: 'Immutable write-once logs' },
                    { name: '3. Data Disappearance', score: 'Low (1.20)', note: 'Encrypted geo-redundant S3 replicas' },
                    { name: '4. Function Creep', score: 'Medium (2.10)', note: 'Strict purpose limitation verified' },
                    {
                      name: '5. Unregulated Cross-Border Transfers',
                      score: 'Medium (2.40)',
                      note: 'Vendor A_1 US processing with SCCs',
                    },
                  ].map((scen, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-800 block">{scen.name}</span>
                        <span className="text-slate-500 text-[11px]">{scen.note}</span>
                      </div>
                      <span className="rounded bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5">
                        {scen.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            {agentType === 'control-mapping' && 'Commit mapped controls to department framework'}
            {agentType === 'gap-analysis' && 'Commit open gaps directly to Risk Landscape Gap Register'}
            {agentType === 'pia' && 'Ready for DPO and Program Owner sign-off'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onAccepted) onAccepted();
                onClose();
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              Commit Findings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
