import React, { useState } from 'react';
import { INITIAL_PDI_ITEMS } from '../../../data/platformMockData';
import { PersonalDataInventoryItem } from '../../../types/platform';
import { Search, Download, Copy, Check, Filter } from 'lucide-react';

export const PersonalDataInventoryView: React.FC<{ departmentName?: string }> = ({ departmentName }) => {
  const [items, setItems] = useState<PersonalDataInventoryItem[]>(INITIAL_PDI_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCellId(id);
    setTimeout(() => setCopiedCellId(null), 1500);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Department,Data Element,Business Process,Purpose,Legal Basis,Source,Collection Mode,Transfers,Retention'].join(',') +
      '\n' +
      items
        .map(
          (i) =>
            `"${i.departmentName}","${i.dataElement}","${i.businessProcessCode} - ${i.businessProcessName}","${i.purpose.replace(/"/g, '""')}","${i.legalBasis}","${i.source}","${i.collectionMode}","${i.transfers}","${i.retentionSchedule}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Dutro_Personal_Data_Inventory_PDI.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter((i) => {
    const matchDept = !departmentName || i.departmentName.toLowerCase() === departmentName.toLowerCase();
    const matchSearch =
      i.dataElement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.businessProcessCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.legalBasis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search and Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search data elements, process, or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => alert('PDI PDF report generated on corporate letterhead.')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Flat Registry Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Data Element</th>
                <th className="py-3 px-4">Business Process</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Legal Basis</th>
                <th className="py-3 px-4">Transfers</th>
                <th className="py-3 px-4">Retention Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition group">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{item.departmentName}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>{item.dataElement}</span>
                      <button
                        onClick={() => handleCopy(`el-${item.id}`, item.dataElement)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedCellId === `el-${item.id}` ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{item.dataCategory}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-blue-700 font-semibold">
                    {item.businessProcessCode}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={item.purpose}>
                    {item.purpose}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      {item.legalBasis}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-xs truncate">{item.transfers}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px] font-mono">{item.retentionSchedule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
