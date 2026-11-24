import React, { useState } from 'react';

export const PromptsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'control' | 'gap' | 'org' | 'mom'>('control');

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden select-none">
      {/* Header Info & Tabs matching Image 8 */}
      <div className="px-8 pt-5 pb-0 border-b border-slate-200">
        <p className="text-xs text-slate-500 mb-3">
          Saved wording is used the next time a job is queued. Placeholders are filled for that run.
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-8 text-xs font-semibold">
          {[
            { id: 'control', label: 'Control Mapping' },
            { id: 'gap', label: 'Gap Analysis' },
            { id: 'org', label: 'Org-Wide Gap Assessment' },
            { id: 'mom', label: 'Minutes of Meeting' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 transition cursor-pointer ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4 text-xs text-slate-700">
        <div className="border border-slate-200 rounded-lg p-5 bg-white space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Call structure</h3>
            <p className="text-slate-500 text-xs">
              These are the instructions and business information sent to the AI. The linked fields below are editable.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex gap-4">
              <span className="font-bold text-slate-900 shrink-0 w-24">1. Jev</span>
              <p className="text-slate-600">
                First, Jev decides whether each privacy control applies to this business process. It reads the business-process State and one Question for each control. State contains the process name, department, ROPA details, and supporting evidence. Each question contains the control number, category, requirement, and linked law mappings. Jev returns a probability from 0% to 100%; by default, controls at or above 50% continue.
              </p>
            </div>

            <div className="flex gap-4">
              <span className="font-bold text-slate-900 shrink-0 w-24">2. Gemini</span>
              <p className="text-slate-600">
                Next, Gemini receives only the controls Jev kept. It uses the System instructions and User business context to write one short "Why mapped" explanation for each control. This is one separate Gemini call. Gemini does not decide applicability, change the confidence, or review controls that Jev rejected.
              </p>
            </div>

            <div className="flex gap-4">
              <span className="font-bold text-slate-900 shrink-0 w-24">Result</span>
              <p className="text-slate-600">
                The final control list contains the applicable controls, their confidence, and Gemini's explanation. Regulation names and legal references are added from the company's framework data.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2">Requests sent to the models</h4>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 font-mono text-[11px] text-slate-800 overflow-x-auto space-y-2">
              <div className="text-slate-400 font-bold">// Jev Decisions API request schema</div>
              <div>{`{ "model": "typesafe/jev-1.13", "state": "<filled State text from the Jev prompt>", "questions": { "control-uuid-123": { "type": "moul", "instructions": "<filled Question text for this control>" } } }`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
