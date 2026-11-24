import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  INITIAL_DISCOVERY_QUESTIONS,
  INITIAL_BUSINESS_PROCESSES,
  INITIAL_GLOBAL_CONTROLS,
} from '../../../data/platformMockData';
import { BusinessProcessRecord, DiscoveryQuestion } from '../../../types/platform';
import { BusinessProcessDetailDrawer } from './BusinessProcessDetailDrawer';
import { AiAgentsModal } from './AiAgentsModal';
import { PersonalDataInventoryView } from './PersonalDataInventoryView';
import { DataFlowDiagramView } from './DataFlowDiagramView';
import {
  Building2,
  FileText,
  ShieldCheck,
  Brain,
  Search,
  Shield,
  Download,
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';
import { checkRolePermission } from '../../../utils/permissionChecker';

export const DepartmentWorkspaceView: React.FC<{ initialDeptName?: string }> = ({
  initialDeptName = 'Analytics',
}) => {
  const { currentRole, departments } = useApp();

  const [selectedDeptName, setSelectedDeptName] = useState<string>(initialDeptName);
  const [activeTab, setActiveTab] = useState<'overview' | 'controls' | 'processes' | 'pdi' | 'dfd'>('processes');

  // Business Processes State
  const [processes, setProcesses] = useState<BusinessProcessRecord[]>(INITIAL_BUSINESS_PROCESSES);
  const [selectedProcessForDrawer, setSelectedProcessForDrawer] = useState<BusinessProcessRecord | null>(null);

  // AI Agent Modal Trigger
  const [aiModalState, setAiModalState] = useState<{
    type: 'control-mapping' | 'gap-analysis' | 'pia';
    process: BusinessProcessRecord;
  } | null>(null);

  // Discovery Questionnaire State
  const [questions, setQuestions] = useState<DiscoveryQuestion[]>(INITIAL_DISCOVERY_QUESTIONS);

  // Filter processes for selected department (or show all if empty)
  const deptProcesses = processes.filter((p) => p.departmentName.toLowerCase() === selectedDeptName.toLowerCase());
  const scopedProcesses = deptProcesses.length > 0 ? deptProcesses : processes;

  const departmentList = [
    'Analytics',
    'HR',
    'Finance',
    'Data Engineering',
    'IT',
    'Infosec',
    'Legal',
    'Marketing',
    'Operations',
    'Platform',
    'Product',
    'SRE/DevOps',
    'Other dept',
  ];

  // Scoped controls for this department
  const scopedControls = INITIAL_GLOBAL_CONTROLS.filter((c) =>
    c.mappedDepartments.some((d) => d.toLowerCase() === selectedDeptName.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Department Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Department Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Discovery & RoPA Registry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Discovery — <span className="text-blue-600">{selectedDeptName}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Department data inventory, RoPA business processes, automated AI agents, and personal data registers.
          </p>
        </div>

        {/* Department Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Department:</span>
          <select
            value={selectedDeptName}
            onChange={(e) => setSelectedDeptName(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none cursor-pointer shadow-2xs"
          >
            {departmentList.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5 Primary Workspace Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-8 overflow-x-auto select-none no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Department Overview
        </button>
        <button
          onClick={() => setActiveTab('controls')}
          className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'controls'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Control Framework ({scopedControls.length > 0 ? scopedControls.length : 30})
        </button>
        <button
          onClick={() => setActiveTab('processes')}
          className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'processes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Business Process (RoPA) ({scopedProcesses.length})
        </button>
        <button
          onClick={() => setActiveTab('pdi')}
          className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'pdi'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Personal Data Inventory (PDI)
        </button>
        <button
          onClick={() => setActiveTab('dfd')}
          className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'dfd'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          DFD (Data Flow Diagrams)
        </button>
      </div>

      {/* TAB 1: DEPARTMENT OVERVIEW (Questionnaire) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Privacy Questionnaire — {selectedDeptName}</h3>
                <p className="text-xs text-slate-500">
                  Curated question bank to assess data flows, intake notices, and retention practices.
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                75% Completed (3 of 4 Answered)
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs mt-0.5">
                      {q.questionNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{q.prompt}</h4>
                      {q.guidanceText && <p className="text-[11px] text-slate-400 mt-0.5">{q.guidanceText}</p>}
                    </div>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      q.status === 'Answered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 text-xs text-slate-800">
                  {q.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SCOPED CONTROL FRAMEWORK */}
      {activeTab === 'controls' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Scoped Controls Tagged to {selectedDeptName}
            </h3>
            <p className="text-xs text-slate-500">
              Filtered subset of Global Framework controls where {selectedDeptName} serves as the primary data
              custodian.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Control Code</th>
                  <th className="py-3 px-4">Title & Requirement</th>
                  <th className="py-3 px-4">Regulations</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(scopedControls.length > 0 ? scopedControls : INITIAL_GLOBAL_CONTROLS.slice(0, 5)).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{c.id}</td>
                    <td className="py-3.5 px-4 max-w-md">
                      <span className="font-bold text-slate-900 block">{c.title}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{c.businessRequirement}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-600 font-mono text-[11px]">
                        {c.mappedRegulations.map((r) => r.law).join(', ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          c.status === 'Compliant' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS PROCESS (ROPA) */}
      {activeTab === 'processes' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {scopedProcesses.length} Records in {selectedDeptName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Downloaded formal RoPA document on corporate letterhead as PDF.')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF (RoPA)
              </button>
              <button
                onClick={() => alert('Exported RoPA table as Excel spreadsheet.')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                <Download className="h-3.5 w-3.5" />
                Download Excel
              </button>
            </div>
          </div>

          {/* RoPA Records Table */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Business Process</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Risk Level</th>
                    <th className="py-3 px-4">Revalidation</th>
                    <th className="py-3 px-4 text-right">3 AI Agents & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scopedProcesses.map((proc) => (
                    <tr
                      key={proc.id}
                      onClick={() => setSelectedProcessForDrawer(proc)}
                      className="hover:bg-blue-50/30 transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {proc.code}
                          </span>
                          <span className="font-bold text-slate-900">{proc.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{proc.description}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{proc.ownerName}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="rounded-full bg-emerald-50 text-emerald-800 px-2 py-0.5 font-bold text-[10px]">
                          {proc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 font-bold text-[10px] ${
                            proc.riskLevel === 'Low'
                              ? 'bg-emerald-100 text-emerald-800'
                              : proc.riskLevel === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {proc.riskLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{proc.revalidationDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        {/* 3 Specialized AI Agent Action Buttons */}
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* 1. Control Mapping Agent (Brain Icon) */}
                          <button
                            title="Control Mapping Agent (Brain): Evaluate context and map controls across 24 domains"
                            onClick={() => setAiModalState({ type: 'control-mapping', process: proc })}
                            className="p-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition cursor-pointer shadow-2xs"
                          >
                            <Brain className="h-4 w-4" />
                          </button>

                          {/* 2. Gap Analysis Agent (Magnifying Glass Icon) */}
                          <button
                            title="Gap Analysis Agent (Magnifying Glass): Cross-reference evidence and identify missing safeguards"
                            onClick={() => setAiModalState({ type: 'gap-analysis', process: proc })}
                            className="p-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition cursor-pointer shadow-2xs"
                          >
                            <Search className="h-4 w-4" />
                          </button>

                          {/* 3. PIA Agent (Shield Icon) */}
                          <button
                            title="PIA Agent (Shield): Trigger 2-phase automated Privacy Impact Assessment"
                            onClick={() => setAiModalState({ type: 'pia', process: proc })}
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
                          >
                            <Shield className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PERSONAL DATA INVENTORY (PDI) */}
      {activeTab === 'pdi' && <PersonalDataInventoryView departmentName={selectedDeptName} />}

      {/* TAB 5: DFD */}
      {activeTab === 'dfd' && (
        <DataFlowDiagramView
          processCode={scopedProcesses[0]?.code || 'business_process_A_2'}
          departmentName={selectedDeptName}
        />
      )}

      {/* 8-TAB BUSINESS PROCESS DETAIL DRAWER */}
      {selectedProcessForDrawer && (
        <BusinessProcessDetailDrawer
          process={selectedProcessForDrawer}
          onClose={() => setSelectedProcessForDrawer(null)}
          onSave={(updated) => {
            setProcesses((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          }}
        />
      )}

      {/* AI AGENTS MODAL */}
      {aiModalState && (
        <AiAgentsModal
          agentType={aiModalState.type}
          process={aiModalState.process}
          onClose={() => setAiModalState(null)}
          onAccepted={() => {
            alert(`Findings from ${aiModalState.type} successfully saved!`);
          }}
        />
      )}
    </div>
  );
};
