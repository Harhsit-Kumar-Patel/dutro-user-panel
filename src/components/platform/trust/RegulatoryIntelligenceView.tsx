import React, { useState } from 'react';
import {
  INITIAL_LEGISLATIONS,
  INITIAL_CASE_LAWS,
  INITIAL_GLOBAL_CONTROLS,
} from '../../../data/platformMockData';
import { PrivacyLegislation, CaseLawRecord } from '../../../types/platform';
import {
  BookOpen,
  Scale,
  Shield,
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const RegulatoryIntelligenceView: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'overview' | 'kb' | 'cases' | 'controls' | 'penalty'>('overview');

  // KNOWLEDGE BASE (STATUTE READER) STATE
  const [selectedLegislation, setSelectedLegislation] = useState<PrivacyLegislation>(INITIAL_LEGISLATIONS[0]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-8');
  const [kbReaderTab, setKbReaderTab] = useState<'legal' | 'commentary' | 'decisions'>('legal');

  // Find active section
  let activeSection = selectedLegislation.chapters
    .flatMap((ch) => ch.sections)
    .find((sec) => sec.id === selectedSectionId) || selectedLegislation.chapters[0]?.sections[0];

  // CASE LAWS STATE
  const [caseLaws, setCaseLaws] = useState<CaseLawRecord[]>(INITIAL_CASE_LAWS);
  const [caseSearch, setCaseSearch] = useState('');
  const [selectedCaseModal, setSelectedCaseModal] = useState<CaseLawRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Trust Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Statutory Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Regulatory Intelligence</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized legal research workspace consolidating global privacy laws, authoritative judicial precedents,
            and enforcement trackers.
          </p>
        </div>

        {activeModule !== 'overview' && (
          <button
            onClick={() => setActiveModule('overview')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Intelligence Hub
          </button>
        )}
      </div>

      {/* OVERVIEW MODULE GRID (Figure 5 in PDF) */}
      {activeModule === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Knowledge Base */}
          <div
            onClick={() => setActiveModule('kb')}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition">
                <BookOpen className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Knowledge Base</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Built-in two-pane statute reader covering 18+ privacy acts including India DPDPA 2023, EU GDPR, UK GDPR,
                and California CCPA/CPRA.
              </p>
            </div>
            <span className="inline-block rounded bg-blue-50 text-blue-700 font-semibold text-[11px] px-2 py-0.5">
              Legal text, article by article
            </span>
          </div>

          {/* Card 2: Case Laws */}
          <div
            onClick={() => setActiveModule('cases')}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition">
                <Scale className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Case Laws</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Authoritative repository of CJEU, General Court, and international judicial precedents with legal
                principles and article citations.
              </p>
            </div>
            <span className="inline-block rounded bg-indigo-50 text-indigo-700 font-semibold text-[11px] px-2 py-0.5">
              Judgments with principles and articles cited
            </span>
          </div>

          {/* Card 3: Control Framework */}
          <div
            onClick={() => setActiveModule('controls')}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition">
                <Shield className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Control Framework</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Jurisdiction-specific mapping translating legal statutory requirements into day-to-day operational controls.
              </p>
            </div>
            <span className="inline-block rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] px-2 py-0.5">
              Mapped controls linked to regulatory obligations
            </span>
          </div>

          {/* Card 4: Penalty Tracker */}
          <div
            onClick={() => alert('Penalty Tracker coming soon with live enforcement telemetry.')}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition cursor-pointer space-y-3 opacity-80"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Lock className="h-6 w-6" />
              </div>
              <span className="rounded bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 uppercase">
                SOON
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Penalty Tracker</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Live monitoring of enforcement fines, supervisory authority administrative penalties, and settlement
                trends.
              </p>
            </div>
            <span className="inline-block rounded bg-slate-100 text-slate-600 font-semibold text-[11px] px-2 py-0.5">
              Regulatory penalty amounts and actions
            </span>
          </div>
        </div>
      )}

      {/* 1. KNOWLEDGE BASE STATUTE READER (Two-Pane Workspace) */}
      {activeModule === 'kb' && (
        <div className="space-y-4">
          {/* Legislation Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
            {INITIAL_LEGISLATIONS.map((leg) => (
              <button
                key={leg.id}
                onClick={() => {
                  setSelectedLegislation(leg);
                  setSelectedSectionId(leg.chapters[0]?.sections[0]?.id || 'sec-1');
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedLegislation.id === leg.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {leg.shortName}
              </button>
            ))}
          </div>

          {/* Two-Pane Workspace Canvas */}
          <div className="h-[650px] rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs flex">
            {/* Left Pane: Chapter and Section Navigation Tree */}
            <div className="w-72 border-r border-slate-200 bg-slate-50/70 p-4 overflow-y-auto space-y-4 select-none">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {selectedLegislation.fullName}
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {selectedLegislation.totalSections} Statutory Provisions
                </span>
              </div>

              <div className="space-y-3">
                {selectedLegislation.chapters.map((chap) => (
                  <div key={chap.id} className="space-y-1">
                    <span className="font-bold text-[11px] text-slate-700 uppercase tracking-wider block px-2">
                      {chap.number}: {chap.title}
                    </span>
                    <div className="space-y-0.5">
                      {chap.sections.map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => setSelectedSectionId(sec.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition cursor-pointer ${
                            selectedSectionId === sec.id
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200/50'
                          }`}
                        >
                          <span className="truncate">{sec.number}: {sec.title}</span>
                          <ChevronRight className="h-3 w-3 opacity-50 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Pane: Statute Canvas */}
            <div className="flex-1 flex flex-col justify-between overflow-y-auto p-8 bg-white">
              <div className="space-y-6 max-w-3xl">
                {/* Section Title Header */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                    <span>{selectedLegislation.shortName}</span>
                    <span>/</span>
                    <span>{activeSection?.number}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {activeSection?.number} — {activeSection?.title}
                  </h2>
                </div>

                {/* 3 Tabs: Legal Text vs Commentary vs Decisions */}
                <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold select-none">
                  <button
                    onClick={() => setKbReaderTab('legal')}
                    className={`pb-2.5 border-b-2 transition cursor-pointer ${
                      kbReaderTab === 'legal'
                        ? 'border-blue-600 text-blue-600 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Legal Text
                  </button>
                  <button
                    onClick={() => setKbReaderTab('commentary')}
                    className={`pb-2.5 border-b-2 transition cursor-pointer ${
                      kbReaderTab === 'commentary'
                        ? 'border-blue-600 text-blue-600 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Commentary
                  </button>
                  <button
                    onClick={() => setKbReaderTab('decisions')}
                    className={`pb-2.5 border-b-2 transition cursor-pointer ${
                      kbReaderTab === 'decisions'
                        ? 'border-blue-600 text-blue-600 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Decisions & Orders
                  </button>
                </div>

                {/* Tab 1: Verbatim Legal Text */}
                {kbReaderTab === 'legal' && (
                  <div className="rounded-xl bg-slate-50/70 border border-slate-200 p-6 text-xs text-slate-800 leading-relaxed font-serif whitespace-pre-line">
                    {activeSection?.verbatimLegalText}
                  </div>
                )}

                {/* Tab 2: Commentary */}
                {kbReaderTab === 'commentary' && (
                  <div className="rounded-xl bg-blue-50/40 border border-blue-200 p-6 text-xs text-slate-800 leading-relaxed space-y-3">
                    <span className="font-bold text-blue-900 block">Dutro Statutory Operational Guidance</span>
                    <p>{activeSection?.commentary}</p>
                  </div>
                )}

                {/* Tab 3: Decisions */}
                {kbReaderTab === 'decisions' && (
                  <div className="rounded-xl bg-purple-50/40 border border-purple-200 p-6 text-xs text-slate-800 leading-relaxed space-y-3">
                    <span className="font-bold text-purple-900 block">Appellate Orders & Regulatory Precedents</span>
                    <p>{activeSection?.decisions}</p>
                  </div>
                )}
              </div>

              {/* Bottom Canvas: Previous & Next Section Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs max-w-3xl">
                <span className="text-slate-400">Read through legal provisions consecutively</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Moved to previous statutory section.')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous Section
                  </button>
                  <button
                    onClick={() => alert('Moved to next statutory section.')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    <span>Next Section</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CASE LAWS REPOSITORY */}
      {activeModule === 'cases' && (
        <div className="space-y-5">
          {/* Summary Banner (Figure 11 in PDF) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Judgments in View</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">62</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Landmark Decisions</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">21</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Articles Interpreted</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">39</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Courts Represented</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">2</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search case number, ECLI, or principle..."
                value={caseSearch}
                onChange={(e) => setCaseSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 outline-none cursor-pointer text-slate-700">
                <option>All Courts</option>
                <option>Court of Justice (CJEU)</option>
                <option>General Court</option>
              </select>
              <select className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 outline-none cursor-pointer text-slate-700">
                <option>All Years</option>
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
          </div>

          {/* Case Law Table */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Case #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Judgment</th>
                  <th className="py-3 px-4">Court</th>
                  <th className="py-3 px-4">Articles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {caseLaws.map((cl) => (
                  <tr
                    key={cl.id}
                    onClick={() => setSelectedCaseModal(cl)}
                    className="hover:bg-blue-50/40 transition cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{cl.caseNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{cl.judgmentDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{cl.title}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{cl.theme}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{cl.court}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-indigo-700 font-semibold">
                      {cl.articlesCited.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. JURISDICTION SPECIFIC CONTROL MAPPING */}
      {activeModule === 'controls' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Cross-Jurisdictional Control Mapping</h3>
            <p className="text-xs text-slate-500">
              View how standardized baseline controls satisfy requirements across global privacy frameworks.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Law / Legislation</th>
                  <th className="py-3 px-4">Jurisdiction</th>
                  <th className="py-3 px-4 text-center">Controls Mapped</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { law: 'India DPDPA 2023', jur: 'India', mapped: 76, active: true },
                  { law: 'EU GDPR 2016', jur: 'European Union', mapped: 147, active: true },
                  { law: 'California CCPA 2018', jur: 'United States', mapped: 40, active: true },
                  { law: 'Brazil LGPD 2018', jur: 'Brazil', mapped: 129, active: true },
                  { law: 'Canada PIPEDA 2000', jur: 'Canada', mapped: 115, active: false },
                  { law: 'EU AI Act 2024', jur: 'European Union', mapped: 9, active: false },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.law}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.jur}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{item.mapped} mapped</td>
                    <td className="py-3.5 px-4 text-right">
                      {item.active ? (
                        <span className="rounded bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 text-[10px]">
                          In Your Framework
                        </span>
                      ) : (
                        <button
                          onClick={() => alert(`Submitted request to unlock ${item.law}.`)}
                          className="rounded border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          Request to unlock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CASE DETAIL & LEGAL ANALYSIS MODAL (Figure 13 in PDF) */}
      {selectedCaseModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {selectedCaseModal.caseNumber}
                </span>
                <span className="text-xs text-slate-500 font-medium">{selectedCaseModal.court}</span>
              </div>
              <button
                onClick={() => setSelectedCaseModal(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedCaseModal.title}</h3>
                <span className="text-slate-400 font-mono text-[11px]">Judgment Date: {selectedCaseModal.judgmentDate}</span>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-800 block">Executive Summary</span>
                <p className="text-slate-700 leading-relaxed">{selectedCaseModal.summary}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Articles Cited</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCaseModal.articlesCited.map((art, idx) => (
                    <span key={idx} className="rounded-md bg-blue-50 text-blue-700 font-semibold px-2.5 py-1">
                      {art}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-purple-50 p-4 border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900 block">Established Legal Principle</span>
                <p className="text-purple-950 font-medium leading-relaxed">{selectedCaseModal.legalPrinciple}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCaseModal(null)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
