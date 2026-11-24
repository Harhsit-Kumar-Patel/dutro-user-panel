import React, { useState } from 'react';
import { INITIAL_EVIDENCE_ITEMS } from '../../../data/platformMockData';
import { EvidenceBankItem } from '../../../types/platform';
import {
  Folder,
  FileCheck2,
  Upload,
  Search,
  Filter,
  Download,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const EvidenceBankView: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<EvidenceBankItem[]>(INITIAL_EVIDENCE_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Drawer State
  const [uploadForm, setUploadForm] = useState({
    title: '',
    departmentName: 'Analytics',
    sourceType: 'file' as 'file' | 'link',
    externalLink: '',
    expiryDate: '',
    autoDetectClassification: true,
  });

  const departmentFolders = [
    { name: 'Infosec', count: 16 },
    { name: 'Legal', count: 8 },
    { name: 'Analytics', count: 4 },
    { name: 'HR', count: 31 },
    { name: 'Finance', count: 2 },
    { name: 'IT', count: 1 },
    { name: 'Operations', count: 0 },
    { name: 'Marketing', count: 0 },
    { name: 'Data Engineering', count: 4 },
    { name: 'Product', count: 0 },
    { name: 'Platform', count: 0 },
    { name: 'SRE/DevOps', count: 0 },
  ];

  const filteredEvidence = evidenceList.filter((ev) => {
    const matchSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDepartment === 'ALL' || ev.departmentName === selectedDepartment;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <span>Department Landscape</span>
            <span>/</span>
            <span className="text-slate-500">Evidence Repository</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Evidence Bank</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of audit proof, DPA contracts, penetration tests, and policy sign-offs mapped to statutory
            controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Downloading all verified evidence archives as ZIP.')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Download All
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Upload Evidence
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Items</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">42</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Verified</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">1</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Pending Verification</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">40</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Expiring Soon</p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1">0</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-500">Expired</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">1</p>
        </div>
      </div>

      {/* Department Folder Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
        <button
          onClick={() => setSelectedDepartment('ALL')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            selectedDepartment === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Folder className="h-3.5 w-3.5" />
          All Folders
        </button>

        {departmentFolders.map((f, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDepartment(f.name)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedDepartment === f.name
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Folder className="h-3.5 w-3.5 text-slate-400" />
            <span>{f.name}</span>
            <span className="text-[10px] opacity-75 font-mono">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Evidence Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Artifact Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvidence.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">{ev.title}</span>
                        <span className="text-[11px] text-slate-400">
                          {ev.fileSize} • Uploaded by {ev.ownerName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{ev.departmentName}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{ev.version}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        ev.verificationStatus === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800'
                          : ev.verificationStatus === 'Pending Verification'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {ev.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{ev.uploadedAt}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{ev.expiryDate || '—'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Inspecting ${ev.title} document preview.`)}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      View Artifact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD EVIDENCE SLIDE-OUT DRAWER */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Evidence</h3>
                  <p className="text-xs text-slate-500">
                    Add supporting compliance documentation to repository (up to 500 MB)
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Source Type Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setUploadForm({ ...uploadForm, sourceType: 'file' })}
                  className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                    uploadForm.sourceType === 'file' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setUploadForm({ ...uploadForm, sourceType: 'link' })}
                  className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                    uploadForm.sourceType === 'link' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Paste Link
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Owning Department</label>
                  <select
                    value={uploadForm.departmentName}
                    onChange={(e) => setUploadForm({ ...uploadForm, departmentName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white outline-none cursor-pointer"
                  >
                    {departmentFolders.map((f, i) => (
                      <option key={i} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Artifact Title</label>
                  <input
                    type="text"
                    placeholder="e.g. ISO 27001 Certificate 2026"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                {uploadForm.sourceType === 'file' ? (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center space-y-2 hover:border-blue-400 transition cursor-pointer bg-slate-50/50">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">Choose file or drag & drop</p>
                    <p className="text-[10px] text-slate-400">PDF, DOCX, XLSX, PNG, JPEG up to 500 MB</p>
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cloud Document URL</label>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/..."
                      value={uploadForm.externalLink}
                      onChange={(e) => setUploadForm({ ...uploadForm, externalLink: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={uploadForm.expiryDate}
                    onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none bg-white cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-800">Auto-detect evidence classification</span>
                  <input
                    type="checkbox"
                    checked={uploadForm.autoDetectClassification}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, autoDetectClassification: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={() => setIsUploadOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!uploadForm.title.trim()) return;
                  const created: EvidenceBankItem = {
                    id: `ev-${Date.now()}`,
                    title: uploadForm.title.endsWith('.pdf') ? uploadForm.title : `${uploadForm.title}.pdf`,
                    departmentName: uploadForm.departmentName,
                    ownerName: 'Compliance Officer',
                    fileType: 'PDF Document',
                    fileSize: '1.4 MB',
                    uploadedAt: new Date().toISOString().split('T')[0],
                    expiryDate: uploadForm.expiryDate || undefined,
                    verificationStatus: 'Pending Verification',
                    linkedControls: ['1.1.1'],
                    version: 'v1.0',
                  };
                  setEvidenceList([created, ...evidenceList]);
                  setIsUploadOpen(false);
                  setUploadForm({
                    title: '',
                    departmentName: 'Analytics',
                    sourceType: 'file',
                    externalLink: '',
                    expiryDate: '',
                    autoDetectClassification: true,
                  });
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
