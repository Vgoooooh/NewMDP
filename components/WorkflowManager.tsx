
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  UploadCloud, 
  Trash2, 
  Edit3, 
  FileDown, 
  X, 
  Check, 
  Search, 
  Settings, 
  GitBranch,
  User,
  ExternalLink
} from 'lucide-react';
import { Workflow } from '../types';

// Helper to generate random workflows with no Chinese names
const generateMockWorkflows = (): Workflow[] => {
  const names = [
    'HVAC Optimization Logic', 'Security Breach Protocol', 'Daily Energy Report Sync', 
    'Smart Lighting Scheduler', 'Leak Detection Alert', 'Fire Safety Routine', 
    'Elevator Load Balancing', 'Asset Tracking Filter', 'Parking Gate Trigger',
    'Humidity Control Loop', 'Solar Panel Tilt Sync', 'Visitor Access Log'
  ];
  const creators = ['John Smith', 'Alice Williams', 'Leo Zhang', 'System Admin', 'Robert Brown', 'Emma Davis'];
  
  return Array.from({ length: 48 }).map((_, i) => {
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000000000));
    const updateDate = new Date(date.getTime() + Math.floor(Math.random() * 100000000));
    return {
      id: Math.floor(2000000000000000000 + Math.random() * 1000000000000000000).toString(),
      name: names[i % names.length] + ` ${100 + i}`,
      remarks: i % 3 === 0 ? 'Production monitoring' : '-',
      createdAt: date.toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: updateDate.toISOString().replace('T', ' ').substring(0, 16),
      creator: creators[i % creators.length],
      enabled: Math.random() > 0.3
    };
  });
};

const INITIAL_WORKFLOWS = generateMockWorkflows();

// Reusable Creator Component: Avatar + Username
export const CreatorDisplay: React.FC<{ name: string }> = ({ name }) => {
  // Simple hash for background color
  const colors = ['bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600', 'bg-rose-100 text-rose-600'];
  const colorIndex = name.length % colors.length;
  
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-6 h-6 rounded-full ${colors[colorIndex]} flex items-center justify-center border border-white shadow-sm shrink-0`}>
        <User size={12} strokeWidth={3} />
      </div>
      <span className="text-xs font-bold text-slate-700 whitespace-nowrap tracking-tight">{name}</span>
    </div>
  );
};

export const WorkflowManager: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const filteredWorkflows = useMemo(() => workflows.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.id.toLowerCase().includes(searchQuery.toLowerCase())
  ), [workflows, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredWorkflows.length && filteredWorkflows.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredWorkflows.map(w => w.id)));
    }
  };

  const toggleItemSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleEnabled = (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  const handleBatchRemove = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to remove ${selectedIds.size} selected workflows from this project?`)) {
      setWorkflows(prev => prev.filter(w => !selectedIds.has(w.id)));
      setSelectedIds(new Set());
    }
  };

  const handleExport = (w: Workflow) => {
    alert(`Exporting workflow DSL structure for: ${w.name}`);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 shrink-0">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-black uppercase hover:bg-blue-700 transition-all shadow-md active:scale-95">
            <Plus size={14} strokeWidth={3} /> Create Workflow
          </button>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-black uppercase hover:bg-slate-50 transition-all shadow-sm"
          >
            <UploadCloud size={14} /> Import Workflow
          </button>
          
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          
          <button 
            disabled={selectedIds.size === 0}
            onClick={handleBatchRemove}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${
              selectedIds.size > 0 
                ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
            }`}
          >
            <Trash2 size={14} /> Batch Remove {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by ID or name..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none w-64 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Workflow Table */}
      <div className="flex-grow overflow-auto custom-scrollbar">
        <table className="w-full text-left table-fixed min-w-[1200px]">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={filteredWorkflows.length > 0 && selectedIds.size === filteredWorkflows.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 w-1/4">Workflow Name</th>
              <th className="px-6 py-4 w-44">Workflow ID</th>
              <th className="px-6 py-4 w-32 text-center">Status</th>
              <th className="px-6 py-4 w-40">Created At</th>
              <th className="px-6 py-4 w-40">Updated At</th>
              <th className="px-6 py-4 w-48">Creator</th>
              <th className="px-6 py-4 w-28 text-center pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredWorkflows.map(w => (
              <tr 
                key={w.id} 
                className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.has(w.id) ? 'bg-blue-50/30' : ''}`}
                onClick={() => toggleItemSelect(w.id)}
              >
                <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.has(w.id)}
                    onChange={() => toggleItemSelect(w.id)}
                    className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-black text-slate-900 truncate block">{w.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{w.id}</span>
                </td>
                <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => toggleEnabled(w.id)}
                    className={`relative w-10 h-5 rounded-full transition-all duration-300 shadow-inner ${w.enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${w.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </td>
                <td className="px-6 py-4 text-[10px] text-slate-500 font-medium">
                  {w.createdAt}
                </td>
                <td className="px-6 py-4 text-[10px] text-slate-500 font-medium">
                   {w.updatedAt}
                </td>
                <td className="px-6 py-4">
                  <CreatorDisplay name={w.creator} />
                </td>
                <td className="px-6 py-4 text-center pr-8" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1.5">
                    <button 
                      title="View Details"
                      className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      <Edit3 size={15} strokeWidth={2.5} />
                    </button>
                    <button 
                      title="Export DSL"
                      onClick={() => handleExport(w)} 
                      className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      <FileDown size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredWorkflows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-300">
            <GitBranch size={48} className="mb-4 opacity-10" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">No logic flows found</p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Objects: {filteredWorkflows.length}</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map(p => (
            <button key={p} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${p === 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-400 hover:bg-slate-200'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Local File Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                    <UploadCloud size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Import DSL</h3>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div 
                  className="p-10 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group bg-slate-50/50"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json,.dsl';
                    input.onchange = () => alert('File selected for upload simulation.');
                    input.click();
                  }}
                >
                  <UploadCloud size={36} className="text-slate-300 mb-4 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
                  <p className="text-sm font-black text-slate-700">Choose Local File</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Support .json, .dsl formats</p>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                  <Settings size={16} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Logic Validation</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">System will perform a schema check on the DSL before deploying to the project environment.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button onClick={() => setIsImportModalOpen(false)} className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
                <button 
                  disabled 
                  className="flex-1 py-4 bg-slate-100 text-slate-300 font-black rounded-2xl cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} strokeWidth={3} /> Start Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
