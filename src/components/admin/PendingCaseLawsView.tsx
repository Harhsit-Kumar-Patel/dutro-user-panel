import React, { useState } from 'react';

export const PendingCaseLawsView: React.FC = () => {
  const [activeJurisdiction, setActiveJurisdiction] = useState<'EU' | 'UK' | 'NL'>('EU');

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden select-none">
      {/* Tabs matching Image 9 */}
      <div className="px-8 pt-5 pb-0 border-b border-slate-200">
        <div className="flex items-center gap-8 text-xs font-semibold">
          {[
            { id: 'EU', label: 'EU (CJEU)' },
            { id: 'UK', label: 'UK' },
            { id: 'NL', label: 'NL' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveJurisdiction(tab.id as any)}
              className={`pb-3 transition cursor-pointer ${
                activeJurisdiction === tab.id
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
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4 text-xs">
        <p className="text-slate-500">
          Fetch from CELLAR into the inbox table. Accept copies a case into Case Laws. Nothing reaches the main table until you accept.
        </p>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
          CELLAR rows are uncurated stubs (title, date, CELEX, EUR-Lex/Curia). Legal principle and summary are not the operative text.
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-md border border-blue-300 text-blue-600 bg-blue-50/50 hover:bg-blue-100 font-semibold transition cursor-pointer shadow-2xs"
          >
            Fetch from CELLAR
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium transition cursor-pointer"
          >
            Accept selected
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium transition cursor-pointer"
          >
            Discard selected
          </button>
        </div>

        <div className="border border-slate-200 rounded-lg p-16 text-center text-slate-400 italic bg-white mt-4">
          Inbox is empty. Click Fetch from CELLAR to look for new judgments (last 14 days).
        </div>
      </div>
    </div>
  );
};
