import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Download,
  CheckCircle2,
  Share2,
  Database,
  ArrowRight,
  Server,
  Layers,
} from 'lucide-react';

export const DataFlowDiagramView: React.FC<{ processCode?: string; departmentName?: string }> = ({
  processCode = 'business_process_A_2',
  departmentName = 'Analytics',
}) => {
  const [viewMode, setViewMode] = useState<'process' | 'department'>('process');
  const [zoomLevel, setZoomLevel] = useState<'Small' | 'Focus' | 'Full'>('Focus');
  const [selectedNode, setSelectedNode] = useState<string | null>('node-proc-1');

  return (
    <div className="space-y-4">
      {/* Top DFD Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('process')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                viewMode === 'process' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Process View ({processCode})
            </button>
            <button
              onClick={() => setViewMode('department')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                viewMode === 'department' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Department View ({departmentName})
            </button>
          </div>
        </div>

        {/* Zoom and Export Actions */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-600">
            {(['Small', 'Focus', 'Full'] as const).map((z) => (
              <button
                key={z}
                onClick={() => setZoomLevel(z)}
                className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                  zoomLevel === z ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('DFD exported as high-resolution PNG.')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export DFD
          </button>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="relative rounded-2xl border border-slate-200 bg-slate-900/5 p-8 min-h-[520px] overflow-x-auto flex items-center justify-center select-none">
        {/* Canvas Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />

        {/* Diagram Flow Container */}
        <div
          className={`flex items-center justify-between gap-12 w-full max-w-5xl transition-transform duration-300 ${
            zoomLevel === 'Small' ? 'scale-75' : zoomLevel === 'Full' ? 'scale-105' : 'scale-95'
          }`}
        >
          {/* COLUMN 1: INGESTION SOURCES */}
          <div className="space-y-4 w-56 flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
              1. Ingestion Sources
            </span>

            <div
              onClick={() => setSelectedNode('src-1')}
              className={`rounded-xl border p-3.5 bg-white shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 ${
                selectedNode === 'src-1' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Website & Web App</span>
                <span className="rounded bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5">Telemetry</span>
              </div>
              <p className="text-[11px] text-slate-500">User interactions, page views, clicks</p>
            </div>

            <div
              onClick={() => setSelectedNode('src-2')}
              className={`rounded-xl border p-3.5 bg-white shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 ${
                selectedNode === 'src-2' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Mobile App Events</span>
                <span className="rounded bg-purple-50 text-purple-700 text-[10px] font-bold px-1.5 py-0.5">iOS/Android</span>
              </div>
              <p className="text-[11px] text-slate-500">Device model, session ID, crash traces</p>
            </div>

            <div
              onClick={() => setSelectedNode('src-3')}
              className={`rounded-xl border p-3.5 bg-white shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 ${
                selectedNode === 'src-3' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Analytics Client SDK</span>
                <span className="rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5">TLS 1.3</span>
              </div>
              <p className="text-[11px] text-slate-500">Direct encrypted event bus dispatch</p>
            </div>
          </div>

          {/* CONNECTOR ARROW 1 */}
          <div className="flex flex-col items-center justify-center text-blue-500">
            <ArrowRight className="h-6 w-6 stroke-[2.5] animate-pulse" />
            <span className="text-[9px] font-mono text-slate-400 mt-1">mTLS / TLS 1.3</span>
          </div>

          {/* COLUMN 2: CORE PROCESSING ACTIVITY */}
          <div className="w-72 flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-4">
              2. Processing Activity
            </span>

            <div
              onClick={() => setSelectedNode('proc-1')}
              className={`rounded-2xl border-2 p-5 bg-white shadow-lg transition cursor-pointer space-y-3 ${
                selectedNode === 'proc-1' ? 'border-blue-600 ring-4 ring-blue-500/20' : 'border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {processCode}
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                  Active RoPA
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900">Product Usage Analytics</h4>
                <p className="text-xs text-slate-500 mt-0.5">Company A • Analytics Department</p>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="bg-slate-50 rounded-lg p-1.5">
                  <p className="text-base font-bold text-slate-800">10</p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Elements</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-1.5">
                  <p className="text-base font-bold text-slate-800">5</p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Categories</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-1.5">
                  <p className="text-base font-bold text-slate-800">4</p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Stores</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-1.5">
                  <p className="text-base font-bold text-slate-800">3</p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Vendors</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                <strong>Statutory Basis:</strong> Legitimate Interests (Art. 6(1)(f)) + Explicit Cookie Consent
              </div>
            </div>
          </div>

          {/* CONNECTOR ARROW 2 */}
          <div className="flex flex-col items-center justify-center text-blue-500">
            <ArrowRight className="h-6 w-6 stroke-[2.5] animate-pulse" />
            <span className="text-[9px] font-mono text-slate-400 mt-1">Egress Pipelines</span>
          </div>

          {/* COLUMN 3: STORAGE & RECIPIENTS */}
          <div className="space-y-4 w-64 flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
              3. Repositories & Processors
            </span>

            <div
              onClick={() => setSelectedNode('store-1')}
              className={`rounded-xl border p-3.5 bg-white shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 ${
                selectedNode === 'store-1' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Analytics Data Warehouse</span>
                <Database className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-500">AES-256 encrypted • 24 Months retention schedule</p>
            </div>

            <div
              onClick={() => setSelectedNode('ven-1')}
              className={`rounded-xl border p-3.5 bg-white shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 ${
                selectedNode === 'ven-1' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Vendor A_1 (Analytics Provider)</span>
                <Server className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-[11px] text-slate-500">Cross-Border (US) • Executed DPA & Standard SCCs</p>
            </div>

            <div
              onClick={() => setSelectedNode('recip-1')}
              className={`rounded-xl border p-3.5 bg-white shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 ${
                selectedNode === 'recip-1' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Product Team Dashboard</span>
                <Layers className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500">Anonymized aggregated metrics without raw PII</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
