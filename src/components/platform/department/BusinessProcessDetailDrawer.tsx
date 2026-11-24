import React, { useState } from 'react';
import { BusinessProcessRecord, StorageEndpoint } from '../../../types/platform';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  ShieldCheck,
  Server,
  ArrowRight,
  Database,
  Lock,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface BusinessProcessDetailDrawerProps {
  process: BusinessProcessRecord;
  onClose: () => void;
  onSave?: (updated: BusinessProcessRecord) => void;
}

export const BusinessProcessDetailDrawer: React.FC<BusinessProcessDetailDrawerProps> = ({
  process,
  onClose,
  onSave,
}) => {
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const [formData, setFormData] = useState<BusinessProcessRecord>(process);

  // New storage location form state
  const [isAddingStorage, setIsAddingStorage] = useState(false);
  const [newStorage, setNewStorage] = useState<StorageEndpoint>({
    id: `store-${Date.now()}`,
    name: '',
    endpointType: 'Dedicated Cloud Database',
    dataElementsStored: ['Full Name', 'Account Email'],
    retentionPeriod: '24 Months',
    deletesAfterRetention: true,
    deletionMechanism: 'Automated cryptographic tombstoning',
  });

  const categories = [
    { id: 1, name: '1. Details' },
    { id: 2, name: '2. Controllers & Processors' },
    { id: 3, name: '3. Data Subjects & Elements' },
    { id: 4, name: '4. Data Retention & Deletion' },
    { id: 5, name: '5. Inter-Department Transfer' },
    { id: 6, name: '6. Third-Party / Vendor Transfer' },
    { id: 7, name: '7. Data Security Measures' },
    { id: 8, name: '8. Personal Data Inventory' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {formData.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">Department: {formData.departmentName}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{formData.name}</h2>
              <p className="text-xs text-slate-500">Record of Processing Activities (RoPA) Comprehensive Catalog</p>
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Horizontally Scrollable Category Tab Bar */}
          <div className="border-b border-slate-200 bg-white px-6 overflow-x-auto select-none no-scrollbar">
            <div className="flex items-center gap-6 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content Body */}
          <div className="p-6 space-y-6 text-xs">
            {/* CATEGORY 1: DETAILS */}
            {activeCategory === 1 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3 text-blue-900">
                  <span className="font-bold block">Category 1: Baseline Operational Scope</span>
                  <p className="text-slate-600 mt-0.5">
                    Define the formal title, ownership, operational description, and data subject volume.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business Process Code</label>
                    <input
                      type="text"
                      disabled
                      value={formData.code}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business Process Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Process Owner</label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Data Subjects Volume Band</label>
                    <select
                      value={formData.dataSubjectsVolumeBand}
                      onChange={(e) => setFormData({ ...formData, dataSubjectsVolumeBand: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white outline-none cursor-pointer"
                    >
                      <option value="1,000 - 9,999">1,000 - 9,999</option>
                      <option value="10,000 - 50,000">10,000 - 50,000</option>
                      <option value="50,000 - 100,000">50,000 - 100,000</option>
                      <option value="100,000+">100,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Operational Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="rounded-lg border border-slate-200 p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">AI Usage or Automated Decision-Making</span>
                    <span className="text-slate-500 text-[11px]">
                      Indicate whether machine learning models or automated logic process personal data in this workflow.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.aiUsage}
                    onChange={(e) => setFormData({ ...formData, aiUsage: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* CATEGORY 2: CONTROLLERS & PROCESSORS */}
            {activeCategory === 2 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3 text-blue-900">
                  <span className="font-bold block">Category 2: Controllers & Processors Statutory Roles</span>
                  <p className="text-slate-600 mt-0.5">
                    Associate statutory legal entities and applicable privacy acts governing this processing.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicable Privacy Laws</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.applicableLaws.map((law, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-indigo-50 text-indigo-700 px-3 py-1 font-semibold text-xs border border-indigo-200"
                      >
                        {law}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">Participating Legal Entities</label>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-slate-50/40">
                    {formData.entityRoles.map((ent, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900 block">{ent.entityName}</span>
                          <span className="text-[11px] text-slate-400">
                            {ent.isInternal ? 'Internal Operating Unit' : 'External Processor'}
                          </span>
                        </div>
                        <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 font-bold text-[10px]">
                          {ent.statutoryRole}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 3: DATA SUBJECTS & ELEMENTS */}
            {activeCategory === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3 text-blue-900">
                  <span className="font-bold block">Category 3: Personal Data Inventory & Legal Basis</span>
                  <p className="text-slate-600 mt-0.5">
                    Granular inventory of personal data categories, subject groups, and lawful bases.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data Subject Categories</label>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.dataSubjectCategories.map((cat, idx) => (
                      <span key={idx} className="rounded bg-slate-100 text-slate-800 px-2 py-1 font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Personal Data Elements Handled</label>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.personalDataElements.map((el, idx) => (
                      <span key={idx} className="rounded bg-blue-50 text-blue-700 px-2 py-1 font-medium border border-blue-100">
                        {el}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statutory Legal Basis</label>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.legalBasis.map((lb, idx) => (
                      <span key={idx} className="rounded bg-emerald-50 text-emerald-800 px-2.5 py-1 font-semibold border border-emerald-200">
                        {lb}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 4: DATA RETENTION & DELETION */}
            {activeCategory === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Storage Endpoints & Retention Schedules</span>
                    <span className="text-slate-500 text-[11px]">
                      Storage repositories, retention lifetimes, and automated deletion mechanisms.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAddingStorage(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    + Add Storage Location
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.storageLocations.map((store) => (
                    <div key={store.id} className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-blue-600" />
                          <span className="font-bold text-slate-900">{store.name}</span>
                        </div>
                        <span className="rounded bg-slate-200/70 text-slate-700 px-2 py-0.5 font-mono text-[11px]">
                          {store.retentionPeriod}
                        </span>
                      </div>
                      <p className="text-slate-600">{store.endpointType}</p>
                      <div className="text-[11px] text-slate-500">
                        Deletion: <span className="font-semibold text-slate-700">{store.deletionMechanism}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Storage Drawer Form */}
                {isAddingStorage && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
                    <span className="font-bold text-blue-900 block">New Storage Location</span>
                    <input
                      type="text"
                      placeholder="Storage name e.g. Customer Data Lake (S3)"
                      value={newStorage.name}
                      onChange={(e) => setNewStorage({ ...newStorage, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white outline-none"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setIsAddingStorage(false)}
                        className="rounded px-3 py-1 text-slate-600 hover:bg-slate-200/50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!newStorage.name.trim()) return;
                          setFormData({
                            ...formData,
                            storageLocations: [...formData.storageLocations, newStorage],
                          });
                          setIsAddingStorage(false);
                          setNewStorage({
                            id: `store-${Date.now()}`,
                            name: '',
                            endpointType: 'Cloud Warehouse',
                            dataElementsStored: ['User ID'],
                            retentionPeriod: '24 Months',
                            deletesAfterRetention: true,
                            deletionMechanism: 'Automated partition drop',
                          });
                        }}
                        className="rounded bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                      >
                        Save Endpoint
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CATEGORY 5: INTER-DEPARTMENT TRANSFER */}
            {activeCategory === 5 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3 text-blue-900">
                  <span className="font-bold block">Category 5: Inter-Departmental Data Routing</span>
                  <p className="text-slate-600 mt-0.5">
                    Track data moving between internal functional units to prevent unmonitored function creep.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Transfers Personal Data Internally</span>
                    <input
                      type="checkbox"
                      checked={formData.interDeptTransfers.enabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          interDeptTransfers: { ...formData.interDeptTransfers, enabled: e.target.checked },
                        })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                  </div>

                  {formData.interDeptTransfers.enabled && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 font-medium block mb-1">Receiving Departments</span>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.interDeptTransfers.receivingDepartments.map((d, i) => (
                            <span key={i} className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 font-medium">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block mb-1">Transfer Purpose</span>
                        <p className="text-slate-800 font-medium">{formData.interDeptTransfers.purpose}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block mb-1">Technical Mechanism</span>
                        <p className="text-slate-800 font-mono text-[11px]">{formData.interDeptTransfers.mechanism}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CATEGORY 6: THIRD-PARTY / VENDOR TRANSFER */}
            {activeCategory === 6 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3 text-blue-900">
                  <span className="font-bold block">Category 6: Third-Party & Cross-Border Transfers</span>
                  <p className="text-slate-600 mt-0.5">
                    Track processors and international jurisdictions with executed Standard Contractual Clauses (SCCs).
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Transfers Data to Third-Party Processors</span>
                    <input
                      type="checkbox"
                      checked={formData.vendorTransfers.enabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vendorTransfers: { ...formData.vendorTransfers, enabled: e.target.checked },
                        })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                  </div>

                  {formData.vendorTransfers.enabled && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 font-medium block mb-1">Selected Vendors</span>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.vendorTransfers.vendorNames.map((v, i) => (
                            <span key={i} className="rounded bg-indigo-50 text-indigo-700 px-2.5 py-1 font-semibold border border-indigo-200">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                      {formData.vendorTransfers.isCrossBorder && (
                        <div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
                          <span className="font-bold text-amber-900 block">Cross-Border Transfer Active</span>
                          <span className="text-amber-800 text-[11px]">
                            Destination: {formData.vendorTransfers.destinationCountry} • Safeguards:{' '}
                            {formData.vendorTransfers.safeguards}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CATEGORY 7: DATA SECURITY MEASURES */}
            {activeCategory === 7 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3 text-blue-900">
                  <span className="font-bold block">Category 7: Technical & Organizational Safeguards</span>
                  <p className="text-slate-600 mt-0.5">
                    Documentation of encryption standards, access governance, and vendor security verification.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-slate-200 p-3">
                    <span className="text-slate-400 font-medium block">Encryption at Rest</span>
                    <span className="font-bold text-slate-800 text-sm">{formData.securityMeasures.encryptionAtRest}</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3">
                    <span className="text-slate-400 font-medium block">Encryption in Transit</span>
                    <span className="font-bold text-slate-800 text-sm">{formData.securityMeasures.encryptionInTransit}</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3 md:col-span-2">
                    <span className="text-slate-400 font-medium block">Access Governance Standard</span>
                    <span className="font-semibold text-slate-800">{formData.securityMeasures.accessGovernance}</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3 md:col-span-2">
                    <span className="text-slate-400 font-medium block">Vendor Security Management</span>
                    <span className="font-semibold text-slate-800">{formData.securityMeasures.vendorSecurityManagement}</span>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 8: PERSONAL DATA INVENTORY */}
            {activeCategory === 8 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3 text-blue-900">
                  <span className="font-bold block">Category 8: Element-Level Registry for this Process</span>
                  <p className="text-slate-600 mt-0.5">
                    Specific personal data elements, storage location mapping, and DSAR readiness.
                  </p>
                </div>

                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                  {formData.personalDataElements.map((el, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{el}</span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        Storage: {formData.storageLocations[0]?.name || 'Encrypted Warehouse'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            disabled={activeCategory === 1}
            onClick={() => setActiveCategory((prev) => Math.max(prev - 1, 1))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Category
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            {activeCategory < 8 ? (
              <button
                onClick={() => setActiveCategory((prev) => Math.min(prev + 1, 8))}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                <span>Next: {categories[activeCategory]?.name}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onSave) onSave(formData);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
              >
                Save Process Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
