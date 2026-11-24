import React, { useState } from 'react';
import {
  INITIAL_COOKIES,
  INITIAL_TECHNICAL_FINDINGS,
  INITIAL_COOKIE_BANNER,
} from '../../../data/platformMockData';
import { CookieItem, TechnicalFindingItem, CookieBannerConfig } from '../../../types/platform';
import {
  ShieldCheck,
  Search,
  Filter,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  Save,
  Globe,
  Sliders,
  Smartphone,
  Laptop,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const CookieConsentView: React.FC = () => {
  const [activeSubModule, setActiveSubModule] = useState<
    'dashboard' | 'scans' | 'inventory' | 'findings' | 'validation' | 'banner'
  >('dashboard');

  // Cookies Inventory State
  const [cookies, setCookies] = useState<CookieItem[]>(INITIAL_COOKIES);
  const [cookieSearch, setCookieSearch] = useState('');

  // Technical Findings State
  const [findings, setFindings] = useState<TechnicalFindingItem[]>(INITIAL_TECHNICAL_FINDINGS);
  const [activeFindingType, setActiveFindingType] = useState<
    'Scripts & Tags' | 'Pixels' | 'Embedded Content & SDKs' | 'Browser Storage & Others'
  >('Scripts & Tags');

  // Banner Design State
  const [bannerConfig, setBannerConfig] = useState<CookieBannerConfig>(INITIAL_COOKIE_BANNER);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Consent Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Cookie Consent Management Platform (CMP)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Cookie Consent</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover website tracking scripts, enforce explicit prior consent, build DPDPA/GDPR banners, and record
            tamper-evident proof receipts.
          </p>
        </div>
      </div>

      {/* Sub-Module Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 overflow-x-auto select-none no-scrollbar">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'scans', label: 'Scans & Discovery' },
          { id: 'inventory', label: `Cookie Inventory (${cookies.length})` },
          { id: 'findings', label: 'Technical Findings' },
          { id: 'validation', label: 'Consent Validation' },
          { id: 'banner', label: 'Banner Design' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubModule(tab.id as any)}
            className={`pb-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeSubModule === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. DASHBOARD VIEW */}
      {activeSubModule === 'dashboard' && (
        <div className="space-y-6">
          {/* Top 5 KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Consent Receipts (30d)</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">124</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active Grants</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">57</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Denied or Withdrawn</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">67</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Avg Grant Rate</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">46%</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reject All Responses</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">52</p>
            </div>
          </div>

          {/* Readiness Progress Meter */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Publisher Configuration Readiness
                </span>
                <p className="text-xs text-slate-400">6 of 8 publisher checks verified across target domains</p>
              </div>
              <span className="text-lg font-bold text-blue-600">75%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>

          {/* Category Grant Rates */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Category Grant Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Advertising</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">36.8%</span>
                <span className="text-[10px] text-slate-400">Optional • Marketing</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Analytical</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">39.7%</span>
                <span className="text-[10px] text-slate-400">Optional • Telemetry</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Attribution</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">37.5%</span>
                <span className="text-[10px] text-slate-400">Optional • Conversion</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Functional</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">37.9%</span>
                <span className="text-[10px] text-slate-400">Optional • Chat & UX</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="text-emerald-700 block font-medium">Strictly Necessary</span>
                <span className="text-xl font-bold text-emerald-900 mt-1 block">100%</span>
                <span className="text-[10px] text-emerald-600">Essential • Session & Auth</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCANS & DISCOVERY */}
      {activeSubModule === 'scans' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Domain Scan History</h3>
              <p className="text-xs text-slate-500">Automated headless crawl discovering trackers and cookies</p>
            </div>
            <button
              onClick={() => alert('New domain scan initiated for companya.example.com.')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              <Play className="h-3.5 w-3.5" />
              Run New Scan
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Stored Runs</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">2</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pages Discovered</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">22</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pages Scanned</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">22</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Cookies to Review</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">1</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. COOKIE INVENTORY */}
      {activeSubModule === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search cookie name or provider..."
                value={cookieSearch}
                onChange={(e) => setCookieSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => alert('Cookie inventory draft committed.')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              Save Draft
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Cookie Identifier</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Review State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cookies.map((ck) => (
                  <tr key={ck.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ck.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{ck.provider}</td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-blue-50 text-blue-700 px-2 py-0.5 font-semibold text-[10px]">
                        {ck.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{ck.duration}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          ck.reviewState === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {ck.reviewState}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setCookies(cookies.filter((c) => c.id !== ck.id))}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TECHNICAL FINDINGS */}
      {activeSubModule === 'findings' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 select-none">
            {(['Scripts & Tags', 'Pixels', 'Embedded Content & SDKs', 'Browser Storage & Others'] as const).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setActiveFindingType(type)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    activeFindingType === type
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Findings for {activeFindingType}
            </h3>
            <div className="space-y-2">
              {findings
                .filter((f) => f.type === activeFindingType)
                .map((f) => (
                  <div key={f.id} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 block">{f.resourceName}</span>
                      <span className="text-slate-500 text-[11px]">
                        Provider: {f.provider} • Purpose: {f.reviewedPurpose}
                      </span>
                    </div>
                    <span className="rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                      {f.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. CONSENT VALIDATION */}
      {activeSubModule === 'validation' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Enforcement Rules Engine</h3>
                <p className="text-xs text-slate-500">
                  Simulate visitor choices and verify that zero non-essential cookies fire prior to explicit opt-in.
                </p>
              </div>
              <button
                onClick={() => alert('Consent validation test suite executed. All rules passed!')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                <Play className="h-3.5 w-3.5" />
                Run Validation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="rounded-lg border border-slate-200 p-3 space-y-1">
                <span className="font-bold text-slate-800 block">1. Before a Choice</span>
                <p className="text-slate-500">Optional collection remains strictly blocked. Zero tracking scripts fire.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 space-y-1">
                <span className="font-bold text-slate-800 block">2. Accept Optional</span>
                <p className="text-slate-500">Consent receipts recorded in proof ledger with SHA-256 hash.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 space-y-1">
                <span className="font-bold text-slate-800 block">3. Reject Optional</span>
                <p className="text-slate-500">All third-party marketing tags and analytical beacons are blocked.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 space-y-1">
                <span className="font-bold text-slate-800 block">4. Global Privacy Control (GPC)</span>
                <p className="text-slate-500">Browser Sec-GPC header automatically honored as universal opt-out.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. BANNER DESIGN & LIVE VISITOR PREVIEW */}
      {activeSubModule === 'banner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Banner Configuration Controls */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Banner Setup & Layout</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Starting Template</label>
              <div className="grid grid-cols-2 gap-2">
                {(['bottom-bar', 'center-modal', 'corner-panel', 'website-style'] as const).map((tmpl) => (
                  <button
                    key={tmpl}
                    onClick={() => setBannerConfig({ ...bannerConfig, template: tmpl })}
                    className={`p-2.5 rounded-lg border text-left font-semibold capitalize transition cursor-pointer ${
                      bannerConfig.template === tmpl
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tmpl.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Headline Text</label>
              <input
                type="text"
                value={bannerConfig.headlineText}
                onChange={(e) => setBannerConfig({ ...bannerConfig, headlineText: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Body Text</label>
              <textarea
                rows={3}
                value={bannerConfig.bodyText}
                onChange={(e) => setBannerConfig({ ...bannerConfig, bodyText: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Status</span>
              <span className="rounded bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5">Published</span>
            </div>
          </div>

          {/* Right Column: Live Visitor Preview (Figure 10 on page 70) */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-100 p-6 shadow-2xs space-y-4 flex flex-col justify-between min-h-[460px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Visitor Preview Canvas</span>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-slate-600 text-xs">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded cursor-pointer ${previewDevice === 'desktop' ? 'bg-slate-100 font-bold' : ''}`}
                >
                  <Laptop className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded cursor-pointer ${previewDevice === 'mobile' ? 'bg-slate-100 font-bold' : ''}`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Simulated Banner on Web Page */}
            <div className="flex-1 flex items-end justify-center p-4">
              <div
                className={`w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4 transition-all ${
                  bannerConfig.template === 'center-modal'
                    ? 'my-auto'
                    : bannerConfig.template === 'corner-panel'
                    ? 'max-w-md ml-0'
                    : 'w-full'
                }`}
              >
                <div>
                  <h4 className="text-base font-bold text-slate-900">{bannerConfig.headlineText}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{bannerConfig.bodyText}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 text-xs">
                  <button
                    onClick={() => alert('Preferences drawer opened')}
                    className="w-full sm:w-auto rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {bannerConfig.managePreferencesText}
                  </button>
                  <button
                    onClick={() => alert('Consent rejected')}
                    className="w-full sm:w-auto rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {bannerConfig.rejectAllText}
                  </button>
                  <button
                    onClick={() => alert('Consent accepted and recorded')}
                    className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    {bannerConfig.acceptAllText}
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100">
                  Powered by Dutro Consent
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
