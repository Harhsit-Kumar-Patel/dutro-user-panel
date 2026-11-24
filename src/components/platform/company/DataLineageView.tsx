import React, { useState } from 'react';
import {
  GitFork,
  HelpCircle,
  RotateCw,
  Bookmark,
  LayoutGrid,
  Layers,
  ShieldAlert,
  Building2,
  Database,
  ArrowRight,
  Server,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  X,
} from 'lucide-react';

interface LineageNode {
  id: string;
  label: string;
  type: 'collection' | 'processing' | 'storage' | 'internal' | 'external';
  department: string;
  category: string;
  dataElements: string[];
  security: string;
  crossBorder?: boolean;
  country?: string;
  riskScore: 'Low' | 'Medium' | 'High';
  x: number;
  y: number;
}

interface LineageEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  dataType: string;
  protocol: string;
  isCrossBorder?: boolean;
}

const INITIAL_NODES: LineageNode[] = [
  // Collection (Left)
  {
    id: 'src-1',
    label: 'Customer Web Portal',
    type: 'collection',
    department: 'Marketing & Digital',
    category: 'Public Ingress',
    dataElements: ['Name', 'Email Address', 'IP Address', 'Cookie ID'],
    security: 'TLS 1.3, Cloudflare WAF, Captcha v3',
    riskScore: 'Low',
    x: 40,
    y: 80,
  },
  {
    id: 'src-2',
    label: 'Careers & Hiring Portal',
    type: 'collection',
    department: 'Human Resources',
    category: 'HR Ingress',
    dataElements: ['Full Name', 'Resume/CV', 'National ID (PAN/SSN)', 'Phone Number'],
    security: 'AES-256 at rest, TLS 1.3 transit, RBAC',
    riskScore: 'Medium',
    x: 40,
    y: 260,
  },
  {
    id: 'src-3',
    label: 'Checkout Payment Gateway',
    type: 'collection',
    department: 'Finance & Accounts',
    category: 'Payment Ingress',
    dataElements: ['Cardholder Name', 'Tokenized PAN', 'Billing Address', 'Transaction Amount'],
    security: 'PCI-DSS Tier 1, Tokenization, Point-to-Point Encryption',
    riskScore: 'Low',
    x: 40,
    y: 440,
  },

  // Processing Departments (Center-Left)
  {
    id: 'proc-1',
    label: 'Human Resources (HR)',
    type: 'processing',
    department: 'Human Resources (HR)',
    category: 'Department Processing',
    dataElements: ['Employee Records', 'Payroll Details', 'Performance Reviews', 'Medical Declarations'],
    security: 'Strict RBAC, Audit Logging, Row-Level Encryption',
    riskScore: 'Low',
    x: 340,
    y: 160,
  },
  {
    id: 'proc-2',
    label: 'Finance & Tax Operations',
    type: 'processing',
    department: 'Finance & Operations',
    category: 'Department Processing',
    dataElements: ['Invoices', 'Bank Account Info', 'Vendor Contracts', 'GSTIN / VAT IDs'],
    security: 'Maker-Checker approval, HSM Key Management, Encrypted audit logs',
    riskScore: 'Low',
    x: 340,
    y: 350,
  },

  // Storage (Center-Right)
  {
    id: 'store-1',
    label: 'Core Cloud PostgreSQL DB',
    type: 'storage',
    department: 'Engineering / IT',
    category: 'Primary Relational Database',
    dataElements: ['All Normalized Customer & Employee Tables'],
    security: 'Customer-Managed KMS Keys (AES-256), Daily Immutable Snapshots',
    riskScore: 'Low',
    x: 640,
    y: 110,
  },
  {
    id: 'store-2',
    label: 'Analytics Data Warehouse',
    type: 'storage',
    department: 'Business Intelligence',
    category: 'Analytical Storage',
    dataElements: ['De-identified Clickstreams', 'Purchase Aggregates', 'Cohort Metrics'],
    security: 'Pseudonymization pipeline, Differential Privacy masking',
    riskScore: 'Medium',
    x: 640,
    y: 300,
  },
  {
    id: 'store-3',
    label: 'Encrypted S3 Document Vault',
    type: 'storage',
    department: 'Legal Compliance',
    category: 'Object Storage',
    dataElements: ['Signed Employment Contracts', 'Non-Disclosure Agreements', 'Evidence PDFs'],
    security: 'S3 Object Lock (WORM compliance), SSE-KMS with automated rotation',
    riskScore: 'Low',
    x: 640,
    y: 480,
  },

  // External Vendors & Sub-processors (Right)
  {
    id: 'ext-1',
    label: 'Vendor A_1 (Analytics)',
    type: 'external',
    department: 'Marketing / Third-Party',
    category: 'External SaaS Provider',
    dataElements: ['Hashed User IDs', 'Session Telemetry', 'Referral URL'],
    security: 'SCCs Executed, DPA with zero-retention pledge',
    crossBorder: true,
    country: 'United States',
    riskScore: 'Medium',
    x: 940,
    y: 100,
  },
  {
    id: 'ext-2',
    label: 'Vendor A_2 (Cloud Infra)',
    type: 'external',
    department: 'DevOps / Hosting',
    category: 'Cloud Infrastructure Provider',
    dataElements: ['Virtual Machine Volumes', 'Database Backups', 'Audit Logs'],
    security: 'ISO 27001, SOC 2 Type II, FedRAMP High',
    crossBorder: false,
    country: 'Local Sovereign Region',
    riskScore: 'Low',
    x: 940,
    y: 280,
  },
  {
    id: 'ext-3',
    label: 'Vendor A_3 (Payment Gateway)',
    type: 'external',
    department: 'Finance / Payment',
    category: 'Payment Processor',
    dataElements: ['Card Token', 'Auth Code', 'Chargeback Status'],
    security: 'PCI-DSS Level 1 certified vault',
    crossBorder: true,
    country: 'Singapore / APAC Hub',
    riskScore: 'High',
    x: 940,
    y: 460,
  },
];

const INITIAL_EDGES: LineageEdge[] = [
  { id: 'e1', from: 'src-1', to: 'store-1', label: 'User Registration Flow', dataType: 'PII Elements', protocol: 'mTLS 1.3' },
  { id: 'e2', from: 'src-1', to: 'store-2', label: 'Telemetry Stream', dataType: 'Pseudonymized Events', protocol: 'Kafka / TLS' },
  { id: 'e3', from: 'src-2', to: 'proc-1', label: 'Applicant Submissions', dataType: 'Candidate CV & IDs', protocol: 'HTTPS REST API' },
  { id: 'e4', from: 'proc-1', to: 'store-3', label: 'Archival Storage', dataType: 'Signed Employment Contracts', protocol: 'IAM S3 PutObject' },
  { id: 'e5', from: 'src-3', to: 'proc-2', label: 'Settlement Webhook', dataType: 'Tokenized Charges', protocol: 'Webhook HMAC-SHA256' },
  { id: 'e6', from: 'store-2', to: 'ext-1', label: 'Cross-Border Analytics Sync', dataType: 'Aggregated Metrics', protocol: 'SFTP (SSHv2)', isCrossBorder: true },
  { id: 'e7', from: 'store-1', to: 'ext-2', label: 'Encrypted Cloud Replicas', dataType: 'Block-level Snapshots', protocol: 'DirectConnect / IPsec' },
  { id: 'e8', from: 'proc-2', to: 'ext-3', label: 'Payout Reconciliation', dataType: 'Bank Tokens & Amounts', protocol: 'Mutual TLS API', isCrossBorder: true },
];

export const DataLineageView: React.FC = () => {
  const [activePreset, setActivePreset] = useState<
    'department' | 'vendor' | 'crossborder' | 'journey' | 'risk'
  >('department');
  const [viewMode, setViewMode] = useState<'flow' | 'baskets'>('flow');
  const [selectedNode, setSelectedNode] = useState<LineageNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isLocked, setIsLocked] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  // Category counts
  const collectionCount = INITIAL_NODES.filter((n) => n.type === 'collection').length;
  const processingCount = INITIAL_NODES.filter((n) => n.type === 'processing').length;
  const storageCount = INITIAL_NODES.filter((n) => n.type === 'storage').length;
  const internalCount = INITIAL_NODES.filter((n) => n.type === 'internal' || n.type === 'processing').length;
  const externalCount = INITIAL_NODES.filter((n) => n.type === 'external').length;

  const handleRebuild = () => {
    setIsRebuilding(true);
    setTimeout(() => {
      setIsRebuilding(false);
    }, 800);
  };

  const handleSaveView = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  // Filter nodes based on selected preset and category chips
  const displayedNodes = INITIAL_NODES.filter((node) => {
    if (filterType && node.type !== filterType) return false;
    if (filterDepartment !== 'ALL' && !node.department.includes(filterDepartment)) return false;
    if (activePreset === 'crossborder' && !node.crossBorder) {
      if (node.type === 'external') return false;
    }
    if (activePreset === 'vendor' && node.type !== 'external' && node.type !== 'storage') return false;
    if (activePreset === 'risk' && node.riskScore === 'Low') return true;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Save Success Banner */}
      {saveBanner && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">View configuration saved successfully as custom default.</span>
          </div>
          <button onClick={() => setSaveBanner(false)} className="text-emerald-600 hover:text-emerald-800">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Company Data Lineage</h1>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            APPROVED DATA JOURNEYS ACROSS THE COMPANY
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Live Lineage Graph Synced
          </span>
        </div>
      </div>

      {/* Main Grid: Left Controls Panel (w-80) + Right Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT SUB-PANEL: Company Lineage Settings */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
              <GitFork className="h-4 w-4 text-blue-600" />
              <span>Company lineage</span>
            </div>

            {/* Presets 2-column grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActivePreset('department')}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition cursor-pointer ${
                  activePreset === 'department'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-700 font-bold shadow-2xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Department network</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActivePreset('vendor')}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition cursor-pointer ${
                  activePreset === 'vendor'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-700 font-bold shadow-2xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Vendor map</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActivePreset('crossborder')}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition cursor-pointer ${
                  activePreset === 'crossborder'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-700 font-bold shadow-2xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Cross-border</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActivePreset('journey')}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition cursor-pointer ${
                  activePreset === 'journey'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-700 font-bold shadow-2xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Data journey</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActivePreset('risk')}
                className={`col-span-2 flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition cursor-pointer ${
                  activePreset === 'risk'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-700 font-bold shadow-2xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Risk heatmap</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleRebuild}
                disabled={isRebuilding}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                <RotateCw className={`h-3.5 w-3.5 text-slate-500 ${isRebuilding ? 'animate-spin' : ''}`} />
                <span>{isRebuilding ? 'Rebuilding...' : 'Rebuild lineage'}</span>
              </button>

              <button
                onClick={handleSaveView}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                <Bookmark className="h-3.5 w-3.5 text-slate-500" />
                <span>Save my view</span>
              </button>
            </div>

            {/* Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                <div className="text-lg font-bold text-slate-900">{displayedNodes.length * 2}</div>
                <div className="text-[11px] text-slate-500">Flows</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                <div className="text-lg font-bold text-slate-900">8</div>
                <div className="text-[11px] text-slate-500">Processes</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                <div className="text-lg font-bold text-slate-900">3</div>
                <div className="text-[11px] text-slate-500">Vendors</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                <div className="text-lg font-bold text-amber-600">1</div>
                <div className="text-[11px] text-slate-500">Review/Risk</div>
              </div>
            </div>

            {/* Approved Coverage Card */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>Approved coverage</span>
                <span className="text-blue-700 font-bold">4/5 • 80%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full w-4/5" />
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between pt-0.5">
                <span>0 review</span>
                <span>4 draft</span>
                <span>0 stale</span>
                <span>1 missing</span>
              </div>
            </div>

            {/* Collapsible Filters Accordion */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex w-full items-center justify-between px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                  <span>Filters</span>
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </button>

              {filtersOpen && (
                <div className="p-3 bg-white space-y-2.5 text-xs border-t border-slate-200">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Department
                    </label>
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full rounded border border-slate-300 p-1.5 text-xs text-slate-800"
                    >
                      <option value="ALL">All Departments</option>
                      <option value="Human Resources">Human Resources (HR)</option>
                      <option value="Finance">Finance & Accounts</option>
                      <option value="Marketing">Marketing & Digital</option>
                      <option value="Engineering">Engineering / IT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Sensitivity
                    </label>
                    <select className="w-full rounded border border-slate-300 p-1.5 text-xs text-slate-800">
                      <option>All Classifications</option>
                      <option>Confidential / PII</option>
                      <option>Highly Restricted (Financial)</option>
                      <option>Public Ingress</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Status Information Box */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                <span>Lineage Synthesis Active</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Lineage facts dynamically synthesized from 8 approved RoPA process DFDs. Cross-border flows checked against EU Standard Contractual Clauses (SCCs).
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CANVAS AREA: Interactive Visual Lineage Graph */}
        <div className="lg:col-span-8 xl:col-span-9 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col h-[750px] relative overflow-hidden">
          {/* Canvas Top Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <button
                title="Auto layout nodes"
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
                <span>Auto layout</span>
              </button>

              {/* Segmented Flow / Baskets Toggle */}
              <div className="flex rounded-lg border border-slate-300 bg-slate-200/70 p-0.5">
                <button
                  onClick={() => setViewMode('flow')}
                  className={`flex items-center gap-1 rounded-md px-3 py-0.5 text-xs font-bold transition cursor-pointer ${
                    viewMode === 'flow'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GitFork className="h-3 w-3" />
                  <span>Flow</span>
                </button>
                <button
                  onClick={() => setViewMode('baskets')}
                  className={`flex items-center gap-1 rounded-md px-3 py-0.5 text-xs font-bold transition cursor-pointer ${
                    viewMode === 'baskets'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  <span>Baskets</span>
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterType(filterType === 'collection' ? null : 'collection')}
                className={`rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer border ${
                  filterType === 'collection'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                }`}
              >
                Collection <span className="font-bold">({collectionCount})</span>
              </button>

              <button
                onClick={() => setFilterType(filterType === 'processing' ? null : 'processing')}
                className={`rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer border ${
                  filterType === 'processing'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                }`}
              >
                Processing <span className="font-bold">({processingCount})</span>
              </button>

              <button
                onClick={() => setFilterType(filterType === 'storage' ? null : 'storage')}
                className={`rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer border ${
                  filterType === 'storage'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                Storage <span className="font-bold">({storageCount})</span>
              </button>

              <button
                onClick={() => setFilterType(filterType === 'internal' ? null : 'internal')}
                className={`rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer border ${
                  filterType === 'internal'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                Internal <span className="font-bold">({internalCount})</span>
              </button>

              <button
                onClick={() => setFilterType(filterType === 'external' ? null : 'external')}
                className={`rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer border ${
                  filterType === 'external'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
                }`}
              >
                External <span className="font-bold">({externalCount})</span>
              </button>

              <button
                title="Configure lineage schema"
                className="p-1 rounded-md text-slate-500 hover:bg-slate-200 transition"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interactive Graph Canvas Area */}
          <div className="flex-1 bg-slate-50/50 relative overflow-auto p-6 select-none">
            {/* Background Dot Grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker
                  id="arrow-blue"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
                </marker>
                <marker
                  id="arrow-amber"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                </marker>
              </defs>

              {/* Edge Connections */}
              {INITIAL_EDGES.map((edge) => {
                const fromNode = INITIAL_NODES.find((n) => n.id === edge.from);
                const toNode = INITIAL_NODES.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const startX = fromNode.x + 220;
                const startY = fromNode.y + 40;
                const endX = toNode.x;
                const endY = toNode.y + 40;

                const midX = (startX + endX) / 2;

                return (
                  <g key={edge.id}>
                    <path
                      d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                      fill="none"
                      stroke={edge.isCrossBorder ? '#f59e0b' : '#3b82f6'}
                      strokeWidth="2"
                      strokeDasharray={edge.isCrossBorder ? '6,4' : 'none'}
                      markerEnd={edge.isCrossBorder ? 'url(#arrow-amber)' : 'url(#arrow-blue)'}
                      className="opacity-75 transition-all"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Nodes */}
            <div className="relative z-10 min-w-[1200px] h-[650px]">
              {displayedNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;

                const typeColorMap = {
                  collection: 'border-blue-300 bg-white text-blue-700',
                  processing: 'border-blue-400 bg-white text-blue-900',
                  storage: 'border-emerald-400 bg-white text-emerald-800',
                  internal: 'border-indigo-400 bg-white text-indigo-800',
                  external: 'border-amber-400 bg-white text-amber-800',
                };

                const typeBadgeMap = {
                  collection: 'bg-blue-50 text-blue-700 border-blue-200',
                  processing: 'bg-blue-100 text-blue-800 border-blue-200',
                  storage: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  internal: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  external: 'bg-amber-50 text-amber-800 border-amber-200',
                };

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      position: 'absolute',
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      width: '220px',
                    }}
                    className={`rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
                      typeColorMap[node.type]
                    } ${
                      isSelected
                        ? 'ring-2 ring-blue-600 shadow-md scale-102'
                        : 'hover:shadow hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                          typeBadgeMap[node.type]
                        }`}
                      >
                        {node.type}
                      </span>
                      {node.crossBorder && (
                        <span className="rounded bg-rose-50 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 border border-rose-200">
                          Cross-Border
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-slate-900 text-xs leading-snug">
                      {node.label}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {node.department}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{node.dataElements.length} elements</span>
                      <span
                        className={`font-semibold ${
                          node.riskScore === 'High'
                            ? 'text-rose-600'
                            : node.riskScore === 'Medium'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {node.riskScore} Risk
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom-Left Canvas Controls */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col rounded-lg border border-slate-200 bg-white shadow-md overflow-hidden">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                className="p-1.5 hover:bg-slate-100 text-slate-600 transition"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 50))}
                className="p-1.5 hover:bg-slate-100 text-slate-600 border-t border-slate-200 transition"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1.5 hover:bg-slate-100 text-slate-600 border-t border-slate-200 transition"
                title="Fit View"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsLocked(!isLocked)}
                className="p-1.5 hover:bg-slate-100 text-slate-600 border-t border-slate-200 transition"
                title={isLocked ? 'Unlock canvas' : 'Lock canvas'}
              >
                {isLocked ? <Lock className="h-4 w-4 text-blue-600" /> : <Unlock className="h-4 w-4" />}
              </button>
            </div>

            {/* Bottom-Right Mini-Map / React Flow Watermark */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-1">
              <div className="w-32 h-20 rounded-lg border border-slate-200 bg-white/90 p-1.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full border border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400 font-mono">
                  Minimap
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-medium">React Flow</span>
            </div>
          </div>

          {/* Slide-out Inspect Drawer for Selected Node */}
          {selectedNode && (
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 shadow-xl z-30 p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Node Details
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{selectedNode.label}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Department</span>
                    <div className="font-semibold text-slate-800">{selectedNode.department}</div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Node Category</span>
                    <div className="font-semibold text-slate-800">{selectedNode.category}</div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Data Elements</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedNode.dataElements.map((el, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200"
                        >
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Security Measures</span>
                    <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                      {selectedNode.security}
                    </div>
                  </div>

                  {selectedNode.crossBorder && (
                    <div className="rounded-lg bg-rose-50 p-2.5 border border-rose-200 text-rose-900">
                      <div className="font-bold text-[11px]">Cross-Border Transfer Route</div>
                      <div className="text-[10px] text-rose-700 mt-0.5">
                        Country: {selectedNode.country || 'International Hub'} • Governed under Standard Contractual Clauses (EU SCCs 2021).
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="flex-1 py-1.5 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

